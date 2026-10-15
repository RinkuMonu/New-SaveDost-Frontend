import bbpsService from "../services/bbpsService";
import apiClient from "../../../services/apiClient";

jest.mock("../../../services/apiClient");

describe("Prompt 6 - BBPS Utility Bill Service Integration", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getCategories dispatches GET /bbps/categories", async () => {
    const mockData = {
      statusCode: 200,
      data: [{ id: "electricity", name: "Electricity" }],
    };

    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const result = await bbpsService.getCategories();

    expect(apiClient.get).toHaveBeenCalledWith("/bbps/categories");
    expect(result).toEqual(mockData);
  });

  test("fetchBill dispatches POST /bbps/fetch-bill", async () => {
    const mockData = {
      statusCode: 200,
      data: {
        customerName: "Jane Doe",
        billAmount: 1450,
        dueDate: "2026-10-25",
      },
    };

    apiClient.post.mockResolvedValueOnce({ data: mockData });

    const result = await bbpsService.fetchBill({
      billerId: "BSES_DELHI",
      inputParameters: { consumerNumber: "12345678" },
      mobile: "9876543210",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/bbps/fetch-bill", {
      billerId: "BSES_DELHI",
      biller_number: "12345678",
      inputParameters: {
        param1: "12345678",
        consumerNumber: "12345678",
      },
      mobile: "9876543210",
    });
    expect(result).toEqual(mockData);
  });

  test("createBillPayOrder dispatches POST /orders with BBPS_BILLPAY service code", async () => {
    const mockData = {
      statusCode: 201,
      data: { serviceOrder: { _id: "ord_bbps_1" } },
    };

    apiClient.post.mockResolvedValueOnce({ data: mockData });

    const result = await bbpsService.createBillPayOrder({
      billerId: "BSES_DELHI",
      billerName: "BSES Rajdhani",
      category: "electricity",
      consumerNumber: "12345678",
      amount: 1450,
      dueDate: "2026-10-25",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/orders", {
      service_code: "BBPS_BILLPAY",
      amount: 1450,
      payload: {
        billerId: "BSES_DELHI",
        billerName: "BSES Rajdhani",
        category: "electricity",
        consumerNumber: "12345678",
        dueDate: "2026-10-25",
      },
    });
    expect(result).toEqual(mockData);
  });
});
