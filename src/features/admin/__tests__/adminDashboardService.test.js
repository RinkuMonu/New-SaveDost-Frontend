import adminDashboardService from "../services/adminDashboardService";
import adminTransactionService from "../services/adminTransactionService";
import adminPartnerService from "../services/adminPartnerService";
import apiClient from "../../../services/apiClient";

jest.mock("../../../services/apiClient");

describe("Admin Rebuild - Services & Dashboard Telemetry", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("adminDashboardService.getOverview calls /admin/dashboard/overview with filters", async () => {
    const mockOverview = {
      data: {
        statusCode: 200,
        data: {
          balances: { availableBalance: 931139.83, lienHold: 0 },
          streams: { payinToday: 138711.0, payoutToday: 938016.0 },
        },
      },
    };

    apiClient.get.mockResolvedValueOnce(mockOverview);

    const res = await adminDashboardService.getOverview({ range: "today" });
    expect(apiClient.get).toHaveBeenCalledWith("/admin/dashboard/overview", {
      params: { range: "today" },
    });
    expect(res.balances.availableBalance).toBe(931139.83);
  });

  test("adminTransactionService.getTransactions calls /admin/transactions with pagination", async () => {
    const mockTxns = {
      data: {
        statusCode: 200,
        data: {
          transactions: [{ transactionId: "TXN-101", amount: 299, status: "SUCCESS" }],
          total: 1,
        },
      },
    };

    apiClient.get.mockResolvedValueOnce(mockTxns);

    const res = await adminTransactionService.getTransactions({ page: 1, limit: 10 });
    expect(apiClient.get).toHaveBeenCalledWith("/admin/transactions", {
      params: { page: 1, limit: 10 },
    });
    expect(res.transactions[0].transactionId).toBe("TXN-101");
  });

  test("adminPartnerService.approvePartner posts to /admin/api-partners/:id/approve", async () => {
    const mockRes = {
      data: {
        statusCode: 200,
        message: "API Partner approved successfully",
      },
    };

    apiClient.post.mockResolvedValueOnce(mockRes);

    const res = await adminPartnerService.approvePartner("partner_88");
    expect(apiClient.post).toHaveBeenCalledWith("/admin/api-partners/partner_88/approve");
    expect(res.statusCode).toBe(200);
  });
});
