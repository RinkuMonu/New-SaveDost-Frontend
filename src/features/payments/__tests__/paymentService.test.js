import paymentService from "../services/paymentService";
import apiClient from "../../../services/apiClient";

jest.mock("../../../services/apiClient");

describe("Prompt 6 - Direct Payment Gateway Service Integration", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getPaymentStatus dispatches GET /payments/:id", async () => {
    const mockData = {
      statusCode: 200,
      data: { orderId: "pay_123", status: "Success", amount: 500 },
    };

    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const result = await paymentService.getPaymentStatus("pay_123");

    expect(apiClient.get).toHaveBeenCalledWith("/payments/pay_123");
    expect(result).toEqual(mockData);
  });

  test("createServiceOrder dispatches POST /orders with service payload", async () => {
    const mockOrderResponse = {
      statusCode: 201,
      data: {
        serviceOrder: { order_id: "ORD_789", amount: 1450, status: "PENDING" },
        paymentOrder: { payment_order_id: "PAY_789", amount: 1450, status: "PENDING" },
      },
    };

    apiClient.post.mockResolvedValueOnce({ data: mockOrderResponse });

    const payload = {
      service_code: "BBPS_BILLPAY",
      amount: 1450,
      payload: { billerId: "BSES", consumerNumber: "123456" },
    };

    const result = await paymentService.createServiceOrder(payload);

    expect(apiClient.post).toHaveBeenCalledWith("/orders", payload);
    expect(result).toEqual(mockOrderResponse);
  });

  test("verifies end-to-end customer payment sequence: order -> query status -> verify return", async () => {
    // 1. Order Creation
    apiClient.post.mockResolvedValueOnce({
      data: {
        order_id: "ORD_E2E_1",
        serviceOrder: { order_id: "ORD_E2E_1", status: "PENDING" },
        paymentOrder: { payment_order_id: "PAY_E2E_1", amount: 500, status: "PENDING" },
      },
    });

    const orderRes = await paymentService.createServiceOrder({
      service_code: "MOBILE_RECHARGE",
      amount: 500,
      payload: { mobile: "9876543210", operator: "Airtel" },
    });
    expect(orderRes.order_id).toBe("ORD_E2E_1");

    // 2. Query Authoritative Gateway Status
    apiClient.get.mockResolvedValueOnce({
      data: {
        orderId: "PAY_E2E_1",
        status: "Pending",
        amount: 500,
      },
    });

    const statusRes = await paymentService.getPaymentStatus("PAY_E2E_1");
    expect(statusRes.status).toBe("Pending");

    // 3. Sync Gateway Return Verification
    apiClient.post.mockResolvedValueOnce({
      data: {
        success: true,
        orderId: "PAY_E2E_1",
        status: "Success",
        payment: { status: "Success", orderId: "PAY_E2E_1" },
      },
    });

    const verifyRes = await paymentService.verifyPayment({
      orderId: "PAY_E2E_1",
      responseCode: "0",
      responseDescription: "Transaction Successful",
      checksum: "hash12345",
    });

    expect(verifyRes.status).toBe("Success");
  });

  test("correctly parses Pending and Failed payment statuses from authoritative responses", async () => {
    // Test Pending State
    apiClient.get.mockResolvedValueOnce({
      data: {
        orderId: "PAY_PENDING_1",
        status: "Pending",
        amount: 250,
      },
    });

    const pendingResult = await paymentService.getPaymentStatus("PAY_PENDING_1");
    expect(pendingResult.status).toBe("Pending");

    // Test Failed State
    apiClient.get.mockResolvedValueOnce({
      data: {
        orderId: "PAY_FAILED_1",
        status: "Failed",
        reason: "Insufficient funds / Bank timeout",
      },
    });

    const failedResult = await paymentService.getPaymentStatus("PAY_FAILED_1");
    expect(failedResult.status).toBe("Failed");
  });

  test("handles API errors properly during payment verification rejection", async () => {
    apiClient.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { message: "Invalid payment checksum signature" },
      },
    });

    await expect(
      paymentService.verifyPayment({
        orderId: "PAY_INVALID",
        responseCode: "99",
        checksum: "invalid_hash",
      })
    ).rejects.toMatchObject({
      response: { status: 400 },
    });
  });
});
