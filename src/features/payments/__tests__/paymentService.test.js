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

  test("verifyPayment dispatches POST /payments/verify with payload", async () => {
    const mockData = { statusCode: 200, message: "Payment verified" };
    apiClient.post.mockResolvedValueOnce({ data: mockData });

    const result = await paymentService.verifyPayment({
      orderId: "pay_123",
      responseCode: "0",
      checksum: "sig_abc",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/payments/verify", {
      orderId: "pay_123",
      responseCode: "0",
      checksum: "sig_abc",
    });
    expect(result).toEqual(mockData);
  });
});
