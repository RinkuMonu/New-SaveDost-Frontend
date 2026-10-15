import rechargeService from "../services/rechargeService";
import apiClient from "../../../services/apiClient";

jest.mock("../../../services/apiClient");

describe("Prompt 6 - Recharge Service Integration", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createRechargeOrder dispatches POST /orders with MOBILE_RECHARGE service code", async () => {
    const mockData = {
      statusCode: 201,
      data: {
        serviceOrder: { _id: "ord_123", service_code: "MOBILE_RECHARGE", amount: 299 },
        paymentOrder: { _id: "pay_123", amount: 299 },
      },
    };

    apiClient.post.mockResolvedValueOnce({ data: mockData });

    const result = await rechargeService.createRechargeOrder({
      mobile: "9876543210",
      operator: "Jio",
      circle: "Delhi NCR",
      amount: 299,
      planDescription: "Unlimited 28 Days",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/orders", {
      service_code: "MOBILE_RECHARGE",
      amount: 299,
      payload: {
        mobile: "9876543210",
        operator: "Jio",
        circle: "Delhi NCR",
        planDescription: "Unlimited 28 Days",
      },
    });
    expect(result).toEqual(mockData);
  });
});
