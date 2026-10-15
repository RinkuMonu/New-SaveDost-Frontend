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
        canumber: "9876543210",
        operator: "Jio",
        circle: "Delhi NCR",
        category: "MOBILE",
        planDescription: "Unlimited 28 Days",
      },
    });
    expect(result).toEqual(mockData);
  });

  test("lookupMobile dispatches POST /sprintverify/recharge/hlrcheck with number and type", async () => {
    const mockData = { statusCode: 200, data: { operator: "Jio", circle: "Delhi" } };
    apiClient.post.mockResolvedValueOnce({ data: mockData });

    const result = await rechargeService.lookupMobile("9876543210");

    expect(apiClient.post).toHaveBeenCalledWith("/sprintverify/recharge/hlrcheck", {
      number: "9876543210",
      type: "mobile",
    });
    expect(result).toEqual(mockData);
  });

  test("getPlans dispatches GET /sprintverify/recharge/browseplan with op and circle params", async () => {
    const mockData = { statusCode: 200, data: [{ amount: 299, desc: "28 Days" }] };
    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const result = await rechargeService.getPlans("Jio", "Delhi");

    expect(apiClient.get).toHaveBeenCalledWith("/sprintverify/recharge/browseplan", {
      params: { op: "Jio", circle: "Delhi" },
    });
    expect(result).toEqual(mockData);
  });

  test("getDthPlans dispatches POST /sprintverify/recharge/dthPlan with canumber and op", async () => {
    const mockData = { statusCode: 200, data: [{ amount: 450, desc: "Monthly pack" }] };
    apiClient.post.mockResolvedValueOnce({ data: mockData });

    const result = await rechargeService.getDthPlans("1002345678", "Tata Play");

    expect(apiClient.post).toHaveBeenCalledWith("/sprintverify/recharge/dthPlan", {
      canumber: "1002345678",
      op: "Tata Play",
    });
    expect(result).toEqual(mockData);
  });
});
