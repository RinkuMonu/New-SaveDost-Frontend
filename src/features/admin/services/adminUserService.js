import apiClient from "../../../services/apiClient";

/**
 * Admin User Management API Service
 * Communicates with backend endpoints under /api/v1/admin/users
 */
export const adminUserService = {
  /**
   * Retrieves paginated list of platform users with search and filter capabilities.
   *
   * @param {Object} [params]
   * @param {number} [params.page=1] - Current page number
   * @param {number} [params.limit=10] - Number of items per page
   * @param {string} [params.search] - Search query (name, mobile, email)
   * @param {string} [params.role] - Filter by role (USER, API_PARTNER, ADMIN)
   * @param {string} [params.status] - Filter by account status (Active, Inactive, Blocked)
   * @param {string} [params.isKYC] - Filter by KYC state
   * @returns {Promise<{statusCode: number, data: {users: Array, totalUsers: number, totalPages: number, currentPage: number}, message: string}>}
   */
  async getUsers(params = {}) {
    const query = {
      page: params.page || 1,
      limit: params.limit || 10,
    };

    if (params.search && params.search.trim()) {
      query.search = params.search.trim();
    }
    if (params.role && params.role !== "ALL") {
      query.role = params.role;
    }
    if (params.status && params.status !== "ALL") {
      query.status = params.status;
    }
    if (params.isKYC && params.isKYC !== "ALL") {
      query.isKYC = params.isKYC;
    }

    const response = await apiClient.get("/admin/users", { params: query });
    return response.data;
  },

  /**
   * Fetches single user detailed profile by user ID.
   *
   * @param {string} id - User ObjectId
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async getUserById(id) {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Updates permitted user profile information.
   *
   * @param {string} id - User ObjectId
   * @param {Object} payload - Fields to update (name, email, etc.)
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async updateUser(id, payload) {
    const response = await apiClient.put(`/admin/users/${id}`, payload);
    return response.data;
  },

  /**
   * Updates user account status (Active, Inactive, Blocked).
   *
   * @param {string} id - User ObjectId
   * @param {Object} data
   * @param {string} data.status - "Active" | "Inactive" | "Blocked"
   * @param {string} [data.remarks] - Administrative reason/remarks
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async updateUserStatus(id, { status, remarks = "" }) {
    const response = await apiClient.patch(`/admin/users/${id}/status`, {
      status,
      remarks,
    });
    return response.data;
  },

  /**
   * Resets a user's password administratively.
   *
   * @param {string} id - User ObjectId
   * @param {string} newPassword - New password to set
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async resetUserPassword(id, newPassword) {
    const response = await apiClient.post(`/admin/users/${id}/reset-password`, {
      newPassword,
    });
    return response.data;
  },

  /**
   * Retrieves audit login history for a specific user.
   *
   * @param {string} id - User ObjectId
   * @returns {Promise<{statusCode: number, data: Array, message: string}>}
   */
  async getUserLoginHistory(id) {
    const response = await apiClient.get(`/admin/users/${id}/login-history`);
    return response.data;
  },

  /**
   * Onboards an API partner administratively.
   *
   * @param {Object} partnerData - Partner details
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async createApiPartner(partnerData) {
    const response = await apiClient.post("/admin/api-partners", partnerData);
    return response.data;
  },
};

export default adminUserService;
