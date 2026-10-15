import apiClient from "../../../services/apiClient";

/**
 * Payment Service
 * Connects with backend ServiceOrder, PaymentOrder, and verification endpoints.
 * Enforces Direct Payment Gateway flow (Zaakpay/UPI/Cards) without customer wallet.
 */
export const paymentService = {
  /**
   * Creates a generic Service Order and initializes a Payment Order.
   *
   * @param {Object} payload
   * @param {string} payload.service_code - e.g. "MOBILE_RECHARGE", "BBPS_BILLPAY"
   * @param {number} payload.amount - Amount in INR
   * @param {Object} payload.payload - Dynamic service fields
   * @returns {Promise<{statusCode: number, data: {serviceOrder: Object, paymentOrder: Object, paymentUrl?: string}, message: string}>}
   */
  async createServiceOrder(payload) {
    const response = await apiClient.post("/orders", payload);
    return response.data;
  },

  /**
   * Retrieves payment status by payment_order_id.
   *
   * @param {string} paymentOrderId
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async getPaymentStatus(paymentOrderId) {
    const response = await apiClient.get(`/payments/${paymentOrderId}`);
    return response.data;
  },

  /**
   * Verifies gateway payment return payload synchronously.
   *
   * @param {Object} verificationData
   * @param {string} verificationData.orderId - Internal payment_order_id
   * @param {string} verificationData.responseCode - Gateway response code
   * @param {string} [verificationData.responseDescription]
   * @param {string} [verificationData.checksum] - Signature hash
   * @returns {Promise<{statusCode: number, data: Object, message: string}>}
   */
  async verifyPayment(verificationData) {
    const response = await apiClient.post("/payments/verify", verificationData);
    return response.data;
  },
};

export default paymentService;
