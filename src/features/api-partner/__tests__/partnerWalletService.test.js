import partnerWalletService from "../services/partnerWalletService";
import apiClient from "../../../services/apiClient";

jest.mock("../../../services/apiClient");

describe("Phase 5 - API Partner Wallet Service API Integration", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getWalletBalance calls GET /wallet/balance", async () => {
    const mockResponse = {
      data: {
        statusCode: 200,
        data: {
          balance: 25000.5,
          currency: "INR",
          status: "Active",
        },
      },
    };

    apiClient.get.mockResolvedValueOnce(mockResponse);

    const result = await partnerWalletService.getWalletBalance();

    expect(apiClient.get).toHaveBeenCalledWith("/wallet/balance");
    expect(result).toEqual(mockResponse.data);
  });

  test("getWalletTransactions calls GET /wallet/transactions with query parameters", async () => {
    const mockResponse = {
      data: {
        statusCode: 200,
        data: {
          transactions: [
            { _id: "tx1", type: "credit", amount: 5000, status: "Success" },
          ],
          totalTransactions: 1,
          totalPages: 1,
          currentPage: 1,
        },
      },
    };

    apiClient.get.mockResolvedValueOnce(mockResponse);

    const result = await partnerWalletService.getWalletTransactions({
      page: 1,
      limit: 10,
      type: "credit",
      status: "Success",
    });

    expect(apiClient.get).toHaveBeenCalledWith("/wallet/transactions", {
      params: {
        page: 1,
        limit: 10,
        type: "credit",
        status: "Success",
      },
    });
    expect(result).toEqual(mockResponse.data);
  });

  test("requestWalletCredit dispatches POST to /wallet/credit with authoritative payload", async () => {
    const mockResponse = {
      data: {
        statusCode: 200,
        message: "Wallet credited successfully",
      },
    };

    apiClient.post.mockResolvedValueOnce(mockResponse);

    const result = await partnerWalletService.requestWalletCredit({
      amount: 10000,
      description: "API Quota Prefunding",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/wallet/credit", {
      amount: 10000,
      description: "API Quota Prefunding",
    });
    expect(result).toEqual(mockResponse.data);
  });
});
