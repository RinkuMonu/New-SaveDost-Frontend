import apiClient from "../../../services/apiClient";

/**
 * Recharge Service
 * Connects with backend provider lookup and generic service order creation.
 */
export const rechargeService = {
  /**
   * Fetches supported mobile & DTH recharge operators.
   *
   * @returns {Promise<{statusCode: number, data: Array, message: string}>}
   */
  async getOperators() {
    try {
      const response = await apiClient.get("/sprintverify/recharge/opertor");
      return response.data;
    } catch {
      // Return structured default operators if provider endpoint unavailable
      return {
        data: [
          { code: "1", name: "Airtel", category: "Mobile" },
          { code: "2", name: "Jio", category: "Mobile" },
          { code: "3", name: "Vodafone Idea (Vi)", category: "Mobile" },
          { code: "4", name: "BSNL", category: "Mobile" },
          { code: "10", name: "Tata Play", category: "DTH" },
          { code: "11", name: "Airtel Digital TV", category: "DTH" },
          { code: "12", name: "Dish TV", category: "DTH" },
          { code: "13", name: "Sun Direct", category: "DTH" },
        ],
      };
    }
  },

  /**
   * Performs HLR check to identify operator and circle for a mobile number.
   *
   * @param {string} mobile - 10-digit mobile number
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async lookupMobile(mobile) {
    try {
      const response = await apiClient.post("/sprintverify/recharge/hlrcheck", {
        mobile: String(mobile).trim(),
      });
      return response.data;
    } catch (err) {
      return { success: false, message: err?.response?.data?.message || "Lookup unavailable" };
    }
  },

  /**
   * Fetches recharge plans for given operator and circle.
   *
   * @param {string|number} operatorCode
   * @param {string|number} circleId
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async getPlans(operatorCode, circleId) {
    try {
      const response = await apiClient.get("/sprintverify/recharge/browseplan", {
        params: { operator: operatorCode, circle: circleId },
      });
      return response.data;
    } catch {
      return { data: [] };
    }
  },

  /**
   * Initiates a recharge order via generic ServiceOrder creation.
   * Enforces Direct Payment Gateway flow (no customer wallet balance).
   *
   * @param {Object} data
   * @param {string} data.mobile
   * @param {string} data.operator
   * @param {number} data.amount
   * @param {string} [data.planDescription]
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async createRechargeOrder(data) {
    const payload = {
      service_code: "MOBILE_RECHARGE",
      amount: Number(data.amount),
      payload: {
        mobile: String(data.mobile).trim(),
        operator: data.operator,
        circle: data.circle || "Default",
        planDescription: data.planDescription || `Recharge ₹${data.amount}`,
      },
    };

    const response = await apiClient.post("/orders", payload);
    return response.data;
  },
};

export default rechargeService;
