import apiClient from "../../../services/apiClient";

/**
 * API Partner Dedicated B2B Wallet Service
 * Connects with backend endpoints under /api/v1/wallet and /api/v1/api-partner
 */
export const partnerWalletService = {
  /**
   * Fetches the authenticated API Partner's current wallet balance and status.
   *
   * @returns {Promise<{statusCode: number, data: {balance: number, currency?: string, status?: string}, message: string}>}
   */
  async getWalletBalance() {
    const response = await apiClient.get("/wallet/balance");
    return response.data;
  },

  /**
   * Fetches paginated wallet ledger and transaction history.
   *
   * @param {Object} [params]
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Items per page
   * @param {string} [params.type] - "credit" | "debit"
   * @param {string} [params.status] - "Success" | "Pending" | "Failed" | "Refunded"
   * @returns {Promise<{statusCode: number, data: {transactions: Array, totalPages: number, currentPage: number, totalTransactions: number}, message: string}>}
   */
  async getWalletTransactions(params = {}) {
    const query = {
      page: params.page || 1,
      limit: params.limit || 10,
    };

    if (params.type && params.type !== "ALL") {
      query.type = params.type;
    }
    if (params.status && params.status !== "ALL") {
      query.status = params.status;
    }

    const response = await apiClient.get("/wallet/transactions", { params: query });
    return response.data;
  },

  /**
   * Fetches partner-specific service transaction history.
   *
   * @param {Object} [params]
   * @param {number} [params.page=1]
   * @param {number} [params.limit=20]
   * @param {string} [params.status]
   * @returns {Promise<{statusCode: number, data: {transactions: Array, totalPages: number, currentPage: number}, message: string}>}
   */
  async getPartnerTransactions(params = {}) {
    const query = {
      page: params.page || 1,
      limit: params.limit || 10,
    };

    if (params.status && params.status !== "ALL") {
      query.status = params.status;
    }

    const response = await apiClient.get("/api-partner/transactions", { params: query });
    return response.data;
  },

  /**
   * Requests wallet credit / top-up.
   * Enforces backend authorization and handles duplicate submission prevention.
   *
   * @param {Object} payload
   * @param {number} payload.amount - Amount in INR
   * @param {string} payload.description - Remarks or reference note
   * @param {string} [payload.userId] - Optional target user
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async requestWalletCredit(payload) {
    const response = await apiClient.post("/wallet/credit", payload);
    return response.data;
  },

  /**
   * Fetches authenticated API Partner profile.
   *
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async getPartnerProfile() {
    const response = await apiClient.get("/api-partner/profile");
    return response.data;
  },
};

export default partnerWalletService;
