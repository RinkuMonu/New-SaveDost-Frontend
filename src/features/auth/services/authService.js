import apiClient from "../../../services/apiClient";

/**
 * Authentication Service
 * Communicates with backend endpoints under /api/v1/auth
 */
export const authService = {
  /**
   * Logs in a user using either password or OTP.
   *
   * @param {Object} credentials
   * @param {string} credentials.mobile - 10-digit mobile number (or email)
   * @param {string} [credentials.password] - Account password
   * @param {string} [credentials.otp] - 6-digit OTP
   * @param {string} [credentials.lat] - Latitude (optional telemetry)
   * @param {string} [credentials.long] - Longitude (optional telemetry)
   * @returns {Promise<{statusCode: number, data: {user: Object, accessToken: string}, message: string}>}
   */
  async login(credentials) {
    const payload = {
      mobile: credentials.mobile?.trim(),
      mobileNumber: credentials.mobile?.trim(), // Compatibility for both field names
    };

    if (credentials.email) {
      payload.email = credentials.email.trim();
    }
    if (credentials.password) {
      payload.password = credentials.password;
    }
    if (credentials.otp) {
      payload.otp = credentials.otp.trim();
    }
    if (credentials.lat) {
      payload.lat = String(credentials.lat);
    }
    if (credentials.long) {
      payload.long = String(credentials.long);
    }

    const response = await apiClient.post("/auth/login", payload);
    return response.data;
  },

  /**
   * Registers a new user. Role is forced to USER by backend.
   *
   * @param {Object} userData
   * @param {string} userData.name - User's full name
   * @param {string} userData.mobile - 10-digit mobile number
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Account password
   * @param {string} [userData.referralCode] - Optional referrer code
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async register(userData) {
    const rawName = (userData.name || "").trim();
    const nameParts = rawName.split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || rawName;
    const lastName = nameParts.slice(1).join(" ") || firstName;
    const companyName = userData.companyName?.trim() || `${rawName} Services`;

    const payload = {
      name: rawName,
      firstName,
      lastName,
      companyName,
      businessName: companyName,
      mobile: userData.mobile?.trim(),
      mobileNumber: userData.mobile?.trim(),
      email: userData.email?.trim().toLowerCase(),
      password: userData.password,
      confirmPassword: userData.confirmPassword || userData.password,
      termsAccepted: true,
      isTermsAccepted: true,
    };

    if (userData.referralCode && userData.referralCode.trim()) {
      payload.referralCode = userData.referralCode.trim();
    }

    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  },

  /**
   * Requests an OTP sent to the registered mobile number.
   *
   * @param {string} mobile - 10-digit mobile number
   * @returns {Promise<{statusCode: number, data: {mobile: string}, message: string}>}
   */
  async sendOtp(mobile) {
    const mobileNum = String(mobile).trim();
    const response = await apiClient.post("/auth/send-otp", {
      mobile: mobileNum,
      mobileNumber: mobileNum,
    });
    return response.data;
  },

  /**
   * Verifies an OTP for the given mobile number.
   *
   * @param {string} mobile - 10-digit mobile number
   * @param {string} otp - 6-digit OTP code
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async verifyOtp(mobile, otp) {
    const response = await apiClient.post("/auth/verify-otp", {
      mobile: String(mobile).trim(),
      mobileNumber: String(mobile).trim(),
      otp: String(otp).trim(),
    });
    return response.data;
  },

  /**
   * Fetches the current logged-in user profile.
   *
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async getCurrentUser() {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  /**
   * Logs out the current user and clears session cookies on the backend.
   *
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async logout() {
    try {
      const response = await apiClient.post("/auth/logout");
      return response.data;
    } catch {
      // Return synthetic success even if network fails, allowing local cleanup
      return { success: true, message: "Logged out locally" };
    }
  },
};

export default authService;
