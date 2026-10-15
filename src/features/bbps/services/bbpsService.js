import apiClient from "../../../services/apiClient";

/**
 * BBPS (Bharat BillPay) Service
 * Connects with backend categories, biller lookup, bill fetch, and order creation.
 */
export const bbpsService = {
  /**
   * Fetches all registered BBPS utility categories.
   *
   * @returns {Promise<{statusCode: number, data: Array, message: string}>}
   */
  async getCategories() {
    try {
      const response = await apiClient.get("/bbps/categories");
      return response.data;
    } catch {
      // Fallback categories list aligned with standard BBPS specification
      return {
        data: [
          { id: "electricity", name: "Electricity", icon: "zap" },
          { id: "water", name: "Water", icon: "droplet" },
          { id: "gas", name: "Piped Gas", icon: "flame" },
          { id: "broadband", name: "Broadband", icon: "wifi" },
          { id: "landline", name: "Landline Postpaid", icon: "phone" },
          { id: "lpg", name: "LPG Cylinder", icon: "cylinder" },
          { id: "fastag", name: "FASTag Recharge", icon: "tag" },
          { id: "insurance", name: "Insurance Premium", icon: "shield" },
        ],
      };
    }
  },

  /**
   * Lists billers for a specific category.
   *
   * @param {string} category
   * @returns {Promise<{statusCode: number, data: Array, message: string}>}
   */
  async getBillers(category) {
    try {
      const response = await apiClient.post("/bbps/billers", { category });
      return response.data;
    } catch {
      return { data: [] };
    }
  },

  /**
   * Fetches biller parameter details and input schema.
   *
   * @param {string} billerId
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async getBillerDetails(billerId) {
    const response = await apiClient.post("/bbps/biller-details", { billerId });
    return response.data;
  },

  /**
   * Fetches live bill details from the BBPS network prior to payment.
   * Backend contract requires: POST /bbps/fetch-bill with billerId and inputParameters.param1
   *
   * @param {Object} payload
   * @param {string} payload.billerId
   * @param {Object} [payload.inputParameters]
   * @param {string} [payload.consumerNumber]
   * @param {string} [payload.mobile]
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async fetchBill(payload) {
    const consumerId =
      payload.inputParameters?.param1 ||
      payload.inputParameters?.consumerNumber ||
      payload.consumerNumber ||
      payload.biller_number ||
      payload.number ||
      "";

    const formattedPayload = {
      billerId: payload.billerId || payload.operatorCode || "BILLER_GENERIC",
      biller_number: consumerId,
      inputParameters: {
        param1: consumerId,
        ...(typeof payload.inputParameters === "object" ? payload.inputParameters : {}),
      },
      mobile: payload.mobile,
    };

    const response = await apiClient.post("/bbps/fetch-bill", formattedPayload);
    return response.data;
  },

  /**
   * Initiates a bill payment order for Direct Payment Gateway checkout.
   *
   * @param {Object} data
   * @param {string} data.billerId
   * @param {string} data.billerName
   * @param {number} data.amount
   * @param {string} data.consumerNumber
   * @param {string} [data.dueDate]
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async createBillPayOrder(data) {
    const payload = {
      service_code: "BBPS_BILLPAY",
      amount: Number(data.amount),
      payload: {
        billerId: data.billerId,
        billerName: data.billerName,
        consumerNumber: data.consumerNumber,
        dueDate: data.dueDate,
        category: data.category,
      },
    };

    const response = await apiClient.post("/orders", payload);
    return response.data;
  },
};

export default bbpsService;
