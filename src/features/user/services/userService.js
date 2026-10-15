import apiClient from "../../../services/apiClient";

/**
 * User Service
 * Connects to backend endpoints for consumer dashboard, profile, rewards, and security.
 */
export const userService = {
  /**
   * Fetches aggregated User Panel Dashboard data.
   * Backend returns: userSummary, kycStatus, balances, rewards, availableServices, banners, recentTransactions, notifications.
   *
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async getDashboardData() {
    const response = await apiClient.get("/dashboard/user");
    return response.data;
  },

  /**
   * Fetches current authenticated user profile.
   *
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async getProfile() {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  /**
   * Fetches user reward and settlement balances.
   * Note: This represents scratch card reward cash, not a customer prefunded wallet.
   *
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async getBalances() {
    const response = await apiClient.get("/auth/balance");
    return response.data;
  },

  /**
   * Fetches recent login audit history for the current user.
   *
   * @returns {Promise<{statusCode: number, data: Array, message: string}>}
   */
  async getLoginHistory() {
    const response = await apiClient.get("/auth/login-history");
    return response.data;
  },

  /**
   * Updates user password or MPIN.
   * Aligned with backend contract: POST /auth/change-password
   * Backend requires: { type: "password" | "mpin", newValue: string, oldPassword?: string }
   *
   * @param {Object} payload
   * @param {string} [payload.oldPassword]
   * @param {string} [payload.newPassword]
   * @param {string} [payload.oldMpin]
   * @param {string} [payload.newMpin]
   * @param {string} [payload.type]
   * @param {string} [payload.newValue]
   * @returns {Promise<{statusCode: number, message: string}>}
   */
  async changePassword(payload) {
    const formattedPayload = {
      type: payload.type || (payload.newMpin ? "mpin" : "password"),
      newValue: payload.newValue || payload.newPassword || payload.newMpin,
      ...(payload.oldPassword ? { oldPassword: payload.oldPassword } : {}),
    };
    const response = await apiClient.post("/auth/change-password", formattedPayload);
    return response.data;
  },
};

export default userService;
