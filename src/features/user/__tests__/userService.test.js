import userService from "../services/userService";
import apiClient from "../../../services/apiClient";

jest.mock("../../../services/apiClient");

describe("Prompt 6 - User Dashboard and Profile Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getDashboardData calls GET /dashboard/user", async () => {
    const mockData = {
      statusCode: 200,
      data: {
        userSummary: { name: "Test User", role: "USER" },
        recentTransactions: [{ order_id: "ORD-1", amount: 199, status: "Success" }],
      },
    };

    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const result = await userService.getDashboardData();

    expect(apiClient.get).toHaveBeenCalledWith("/dashboard/user");
    expect(result).toEqual(mockData);
  });

  test("getProfile calls GET /auth/me", async () => {
    const mockData = {
      statusCode: 200,
      data: { _id: "u1", name: "Test User", role: "USER" },
    };

    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const result = await userService.getProfile();

    expect(apiClient.get).toHaveBeenCalledWith("/auth/me");
    expect(result).toEqual(mockData);
  });

  test("changePassword dispatches POST to /auth/change-password", async () => {
    const mockData = { statusCode: 200, message: "Password updated" };
    apiClient.post.mockResolvedValueOnce({ data: mockData });

    const result = await userService.changePassword({
      oldPassword: "OldPass@123",
      newPassword: "NewPass@123",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/auth/change-password", {
      oldPassword: "OldPass@123",
      newPassword: "NewPass@123",
    });
    expect(result).toEqual(mockData);
  });
});
