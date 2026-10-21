import adminPermissionService from "../services/adminPermissionService";
import apiClient from "../../../services/apiClient";

jest.mock("../../../services/apiClient");

describe("Admin Permission Service API Integration", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getAllRoles calls /permission/allrole and returns data", async () => {
    const mockRoles = [
      { _id: "r1", role: "ADMIN", permissions: ["p1", "p2"] },
      { _id: "r2", role: "API_PARTNER", permissions: ["p1"] },
    ];
    apiClient.get.mockResolvedValueOnce({
      data: { success: true, data: mockRoles },
    });

    const result = await adminPermissionService.getAllRoles();
    expect(apiClient.get).toHaveBeenCalledWith("/permission/allrole");
    expect(result).toEqual(mockRoles);
  });

  test("getGroupedPermissions calls /permission/getAllpermissionByGroup", async () => {
    const mockGrouped = {
      "User Management Menu": {
        parent: { key: "User Management Menu" },
        children: [{ _id: "p1", key: "Action Request" }],
      },
    };
    apiClient.get.mockResolvedValueOnce({
      data: { success: true, data: mockGrouped },
    });

    const result = await adminPermissionService.getGroupedPermissions();
    expect(apiClient.get).toHaveBeenCalledWith("/permission/getAllpermissionByGroup");
    expect(result).toEqual(mockGrouped);
  });

  test("updateRolePermissions dispatches PUT to /permission/:role", async () => {
    const mockUpdated = {
      _id: "r1",
      role: "ADMIN",
      permissions: ["p1", "p2", "p3"],
    };
    apiClient.put.mockResolvedValueOnce({
      data: { success: true, data: mockUpdated },
    });

    const result = await adminPermissionService.updateRolePermissions("ADMIN", ["p1", "p2", "p3"]);
    expect(apiClient.put).toHaveBeenCalledWith("/permission/ADMIN", {
      permissions: ["p1", "p2", "p3"],
    });
    expect(result).toEqual(mockUpdated);
  });

  test("updateUserPermissions dispatches PUT to /auth/users/:userId/permissions", async () => {
    const mockRes = {
      success: true,
      message: "Permissions updated successfully",
    };
    apiClient.put.mockResolvedValueOnce({
      data: mockRes,
    });

    const result = await adminPermissionService.updateUserPermissions("u123", {
      extraPermissions: ["p1"],
      restrictedPermissions: ["p2"],
    });

    expect(apiClient.put).toHaveBeenCalledWith("/auth/users/u123/permissions", {
      extraPermissions: ["p1"],
      restrictedPermissions: ["p2"],
    });
    expect(result).toEqual(mockRes);
  });

  test("getUserPermissions fetches single user permissions", async () => {
    const mockData = {
      role: "USER",
      rolePermissions: [],
      extraPermissions: [{ _id: "p1", key: "Action Request" }],
      restrictedPermissions: [],
    };
    apiClient.get.mockResolvedValueOnce({
      data: { success: true, data: mockData },
    });

    const result = await adminPermissionService.getUserPermissions("u123");
    expect(apiClient.get).toHaveBeenCalledWith("/permission/singleuser/u123");
    expect(result).toEqual(mockData);
  });
});
