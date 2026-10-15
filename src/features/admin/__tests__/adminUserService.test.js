import adminUserService from "../services/adminUserService";
import apiClient from "../../../services/apiClient";

jest.mock("../../../services/apiClient");

describe("Phase 5 - Admin User Service API Integration", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getUsers formats search, status, and role filter parameters correctly", async () => {
    const mockResponse = {
      data: {
        statusCode: 200,
        data: {
          users: [
            { _id: "u1", name: "User One", email: "one@test.com", role: "USER", status: "Active" },
          ],
          totalUsers: 1,
          totalPages: 1,
          currentPage: 1,
        },
      },
    };

    apiClient.get.mockResolvedValueOnce(mockResponse);

    const result = await adminUserService.getUsers({
      page: 2,
      limit: 20,
      search: "User One",
      role: "USER",
      status: "Active",
      isKYC: "Approved",
    });

    expect(apiClient.get).toHaveBeenCalledWith("/admin/users", {
      params: {
        page: 2,
        limit: 20,
        search: "User One",
        role: "USER",
        status: "Active",
        isKYC: "Approved",
      },
    });
    expect(result).toEqual(mockResponse.data);
  });

  test("updateUserStatus dispatches PATCH to /admin/users/:id/status", async () => {
    const mockResponse = {
      data: {
        statusCode: 200,
        message: "Status updated successfully",
      },
    };

    apiClient.patch.mockResolvedValueOnce(mockResponse);

    const result = await adminUserService.updateUserStatus("u123", {
      status: "Inactive",
      remarks: "Account suspended due to policy violation",
    });

    expect(apiClient.patch).toHaveBeenCalledWith("/admin/users/u123/status", {
      status: "Inactive",
      remarks: "Account suspended due to policy violation",
    });
    expect(result).toEqual(mockResponse.data);
  });

  test("resetUserPassword dispatches POST to /admin/users/:id/reset-password", async () => {
    const mockResponse = {
      data: {
        statusCode: 200,
        message: "Password reset successfully",
      },
    };

    apiClient.post.mockResolvedValueOnce(mockResponse);

    const result = await adminUserService.resetUserPassword("u123", "NewSecretPass@123");

    expect(apiClient.post).toHaveBeenCalledWith("/admin/users/u123/reset-password", {
      newPassword: "NewSecretPass@123",
    });
    expect(result).toEqual(mockResponse.data);
  });
});
