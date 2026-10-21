import apiClient from "../../../services/apiClient";

/**
 * Fallback static permissions matching MongoDB Atlas schema
 * Ensures the UI remains responsive and robust even if server is offline or loading.
 */
const FALLBACK_GROUPED_PERMISSIONS = {
  "User Management Menu": {
    parent: { key: "User Management Menu", _id: "cat_user_mgmt", description: "User Management Menu" },
    children: [
      { _id: "695ca094ef3a8327a43a4103", key: "Action Request", parentKey: "User Management Menu", description: "Permission for Action Request" },
      { _id: "693126f38b68b36616a6ea72", key: "Onboard Request", parentKey: "User Management Menu", description: "Permission for Onboard Request" },
      { _id: "693126e38b68b36616a6ea6e", key: "Active Admin", parentKey: "User Management Menu", description: "Permission for Active Admin" },
      { _id: "693127018b68b36616a6ea76", key: "Active Distributor", parentKey: "User Management Menu", description: "Permission for Active Distributor" },
      { _id: "6931303a8b68b36616a6f16a", key: "Active Retailer", parentKey: "User Management Menu", description: "Permission for Active Retailer" },
      { _id: "69310e9d74b9126ab0674684", key: "Active All Users", parentKey: "User Management Menu", description: "Permission for Active All Users" },
    ],
  },
  "Permission Management Menu": {
    parent: { key: "Permission Management Menu", _id: "cat_perm_mgmt", description: "Permission Management Menu" },
    children: [
      { _id: "69311f6be9b855f6e8c86ff8", key: "Assign Permission", parentKey: "Permission Management Menu", description: "Permission for Assign Permission" },
      { _id: "69311f73e9b855f6e8c86ffc", key: "Role Permission", parentKey: "Permission Management Menu", description: "Permission for Role Permission" },
    ],
  },
  "API Management Menu": {
    parent: { key: "API Management Menu", _id: "cat_api_mgmt", description: "API Management Menu" },
    children: [
      { _id: "693129d08b68b36616a6ee21", key: "Services Switch", parentKey: "API Management Menu", description: "Permission for Services Switch" },
      { _id: "693129c58b68b36616a6ee1d", key: "Assign API Services", parentKey: "API Management Menu", description: "Permission for Assign API Services" },
    ],
  },
  "Mobile Recharge Menu": {
    parent: { key: "Mobile Recharge Menu", _id: "cat_mobile_recharge", description: "Mobile Recharge Menu" },
    children: [
      { _id: "69311eb4e9b855f6e8c86f9f", key: "Mobile Recharge", parentKey: "Mobile Recharge Menu", description: "Permission for Mobile Recharge" },
      { _id: "69311f1be9b855f6e8c86fb0", key: "Mobile Commission", parentKey: "Mobile Recharge Menu", description: "Permission for Mobile Commission" },
      { _id: "69311efbe9b855f6e8c86fa8", key: "Mobile Commercial", parentKey: "Mobile Recharge Menu", description: "Permission for Mobile Commercial" },
      { _id: "69311f0ee9b855f6e8c86fac", key: "API Management", parentKey: "Mobile Recharge Menu", description: "Permission for API Management" },
      { _id: "69311ebfe9b855f6e8c86fa3", key: "Mobile Recharge Report", parentKey: "Mobile Recharge Menu", description: "Permission for Mobile Recharge Report" },
    ],
  },
  "DTH Recharge Menu": {
    parent: { key: "DTH Recharge Menu", _id: "cat_dth_recharge", description: "DTH Recharge Menu" },
    children: [
      { _id: "69312c928b68b36616a6ef04", key: "Do DTH Recharge", parentKey: "DTH Recharge Menu", description: "Permission for Do DTH Recharge" },
      { _id: "69312ca18b68b36616a6ef0c", key: "DTH Commercial", parentKey: "DTH Recharge Menu", description: "Permission for DTH Commercial" },
      { _id: "69312c9a8b68b36616a6ef08", key: "DTH Recharge Report", parentKey: "DTH Recharge Menu", description: "Permission for DTH Recharge Report" },
      { _id: "69312cff8b68b36616a6efaa", key: "DTH API Management", parentKey: "DTH Recharge Menu", description: "Permission for DTH API Management" },
      { _id: "69312d1c8b68b36616a6efae", key: "DTH Commission", parentKey: "DTH Recharge Menu", description: "Permission for DTH Commission" },
    ],
  },
  "BBPS service Menu": {
    parent: { key: "BBPS service Menu", _id: "cat_bbps", description: "BBPS service Menu" },
    children: [
      { _id: "69312d328b68b36616a6efb2", key: "All servies's", parentKey: "BBPS service Menu", description: "Permission for All Services" },
      { _id: "69312d388b68b36616a6efb9", key: "Reports", parentKey: "BBPS service Menu", description: "Permission for Reports" },
      { _id: "69312f978b68b36616a6f0bf", key: "Bill Payment Services", parentKey: "BBPS service Menu", description: "Permission for Bill Payment Services" },
    ],
  },
  "AEPS Menu": {
    parent: { key: "AEPS Menu", _id: "cat_aeps", description: "AEPS Menu" },
    children: [
      { _id: "69312ba18b68b36616a6eed7", key: "AEPS service", parentKey: "AEPS Menu", description: "Permission for AEPS service" },
      { _id: "69312bd58b68b36616a6eee7", key: "AEPS Commercial", parentKey: "AEPS Menu", description: "Permission for AEPS Commercial" },
      { _id: "69312bef8b68b36616a6eeef", key: "AEPS Commission", parentKey: "AEPS Menu", description: "Permission for AEPS Commission" },
      { _id: "69312bc48b68b36616a6eede", key: "AEPS Onboarding", parentKey: "AEPS Menu", description: "Permission for AEPS Onboarding" },
      { _id: "69312bcc8b68b36616a6eee2", key: "AEPS Merchants", parentKey: "AEPS Menu", description: "Permission for AEPS Merchants" },
      { _id: "69312bae8b68b36616a6eedb", key: "AEPS Reports", parentKey: "AEPS Menu", description: "Permission for AEPS Reports" },
      { _id: "69312be58b68b36616a6eeeb", key: "AEPS Withdrawal Commission", parentKey: "AEPS Menu", description: "Permission for AEPS Withdrawal Commission" },
    ],
  },
  "DMT Menu": {
    parent: { key: "DMT Menu", _id: "cat_dmt", description: "DMT Menu" },
    children: [
      { _id: "69311e5ce9b855f6e8c86f89", key: "Do Transaction", parentKey: "DMT Menu", description: "Permission for Do Transaction" },
      { _id: "69311e6be9b855f6e8c86f8d", key: "DMT Report", parentKey: "DMT Menu", description: "Permission for DMT Report" },
      { _id: "69311e80e9b855f6e8c86f92", key: "DMT Commercial", parentKey: "DMT Menu", description: "Permission for DMT Commercial" },
      { _id: "69311e92e9b855f6e8c86f96", key: "DMT EX Commercial", parentKey: "DMT Menu", description: "Permission for DMT EX Commercial" },
      { _id: "69311ea0e9b855f6e8c86f9a", key: "DMT EX Commission List", parentKey: "DMT Menu", description: "Permission for DMT EX Commission List" },
    ],
  },
  "Fund Management Menu": {
    parent: { key: "Fund Management Menu", _id: "cat_fund", description: "Fund Management Menu" },
    children: [
      { _id: "69310efa74b9126ab0674731", key: "Fund Request", parentKey: "Fund Management Menu", description: "Permission for Fund Request" },
      { _id: "69310f0b74b9126ab0674736", key: "Fund Transfer", parentKey: "Fund Management Menu", description: "Permission for Fund Transfer" },
      { _id: "69312b6f8b68b36616a6ee3c", key: "Fund Report Track", parentKey: "Fund Management Menu", description: "Permission for Fund Report Track" },
      { _id: "69312b638b68b36616a6ee38", key: "Wallet Transfer Report", parentKey: "Fund Management Menu", description: "Permission for Wallet Transfer Report" },
    ],
  },
  "Wallet Management Menu": {
    parent: { key: "Wallet Management Menu", _id: "cat_wallet", description: "Wallet Management Menu" },
    children: [
      { _id: "693129ec8b68b36616a6ee25", key: "E-Wallet Report", parentKey: "Wallet Management Menu", description: "Permission for E-Wallet Report" },
      { _id: "6932a9f930326d8376bc3b5c", key: "Latest Transactions", parentKey: "Wallet Management Menu", description: "Permission for Latest Transactions" },
      { _id: "6a8c0f1747cde9f48e8f5b00", key: "Pay-Out", parentKey: "Wallet Management Menu", description: "Permission for Pay-Out" },
      { _id: "6a8c0f1747cde9f48e8f5aff", key: "Pay-In", parentKey: "Wallet Management Menu", description: "Permission for Pay-In" },
    ],
  },
  "Credit Card & Loans": {
    parent: { key: "Credit Card & Loans", _id: "cat_credit_loans", description: "Credit Card & Loans" },
    children: [
      { _id: "69312d678b68b36616a6efc4", key: "Apply For Card", parentKey: "Credit Card & Loans", description: "Permission for Apply For Card" },
      { _id: "69311e20e9b855f6e8c86f7c", key: "Apply Loan", parentKey: "Credit Card & Loans", description: "Permission for Apply Loan" },
      { _id: "69311e2be9b855f6e8c86f80", key: "Loan Report", parentKey: "Credit Card & Loans", description: "Permission for Loan Report" },
      { _id: "69311e15e9b855f6e8c86f78", key: "Create Loan", parentKey: "Credit Card & Loans", description: "Permission for Create Loan" },
    ],
  },
  "Settings & Platform Controls": {
    parent: { key: "Settings & Platform Controls", _id: "cat_settings", description: "Settings & Platform Controls" },
    children: [
      { _id: "69312ef48b68b36616a6f017", key: "IP Master", parentKey: "Settings & Platform Controls", description: "Permission for IP Master" },
      { _id: "69312efc8b68b36616a6f01b", key: "Service Master", parentKey: "Settings & Platform Controls", description: "Permission for Service Master" },
      { _id: "69312f038b68b36616a6f01f", key: "Partner Master", parentKey: "Settings & Platform Controls", description: "Permission for Partner Master" },
      { _id: "69312f0b8b68b36616a6f023", key: "Partner Mapping", parentKey: "Settings & Platform Controls", description: "Permission for Partner Mapping" },
      { _id: "69312e8c8b68b36616a6eff9", key: "Add News", parentKey: "Settings & Platform Controls", description: "Permission for Add News" },
      { _id: "69312e9b8b68b36616a6effd", key: "Add Banner", parentKey: "Settings & Platform Controls", description: "Permission for Add Banner" },
    ],
  },
};

export const adminPermissionService = {
  /**
   * Retrieves all roles with their assigned permissions
   */
  async getAllRoles() {
    try {
      const res = await apiClient.get("/permission/allrole");
      const list = res.data?.data || res.data;
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
      return this.getFallbackRoles();
    } catch (err) {
      console.warn("Using fallback roles due to network/api response:", err);
      return this.getFallbackRoles();
    }
  },

  /**
   * Retrieves a single role and its populated permissions
   */
  async getRolePermissions(roleName) {
    try {
      const res = await apiClient.get(`/permission/${roleName}`);
      return res.data?.data || res.data;
    } catch (err) {
      console.warn(`Failed to fetch role ${roleName}:`, err);
      const all = this.getFallbackRoles();
      return all.find((r) => r.role === roleName) || { role: roleName, permissions: [] };
    }
  },

  /**
   * Updates permission set for a specific role
   * @param {string} roleName - E.g. "ADMIN", "API_PARTNER", "USER"
   * @param {string[]} permissionIds - Array of MongoDB permission ObjectIds
   */
  async updateRolePermissions(roleName, permissionIds) {
    const res = await apiClient.put(`/permission/${roleName}`, {
      permissions: permissionIds,
    });
    return res.data?.data || res.data;
  },

  /**
   * Creates a new administrative role
   */
  async createRole(roleName, permissionIds = []) {
    const res = await apiClient.post("/permission/add/role", {
      role: roleName,
      permissions: permissionIds,
    });
    return res.data?.data || res.data;
  },

  /**
   * Deletes a role definition
   */
  async deleteRole(roleName) {
    const res = await apiClient.delete(`/permission/${roleName}`);
    return res.data;
  },

  /**
   * Retrieves all permissions grouped hierarchically by module
   */
  async getGroupedPermissions() {
    try {
      const res = await apiClient.get("/permission/getAllpermissionByGroup");
      const grouped = res.data?.data || res.data;
      if (grouped && Object.keys(grouped).length > 0) {
        return grouped;
      }
      return FALLBACK_GROUPED_PERMISSIONS;
    } catch (err) {
      console.warn("Using fallback grouped permissions:", err);
      return FALLBACK_GROUPED_PERMISSIONS;
    }
  },

  /**
   * Retrieves effective, role-based, extra, and restricted permissions for a specific user
   */
  async getUserPermissions(userId) {
    try {
      const res = await apiClient.get(`/permission/singleuser/${userId}`);
      return res.data?.data || res.data;
    } catch (err) {
      console.warn(`Failed to fetch user permissions for ${userId}:`, err);
      return {
        role: "USER",
        rolePermissions: [],
        extraPermissions: [],
        restrictedPermissions: [],
        effectivePermissionIds: [],
        groupedPermissions: FALLBACK_GROUPED_PERMISSIONS,
      };
    }
  },

  /**
   * Updates a user's extra (granted) and restricted (revoked) permissions
   */
  async updateUserPermissions(userId, { extraPermissions = [], restrictedPermissions = [] }) {
    // Tries modern endpoint first, falls back if needed
    try {
      const res = await apiClient.put(`/auth/users/${userId}/permissions`, {
        extraPermissions,
        restrictedPermissions,
      });
      return res.data;
    } catch (err) {
      const altRes = await apiClient.put(`/users/${userId}/permissions`, {
        extraPermissions,
        restrictedPermissions,
      });
      return altRes.data;
    }
  },

  /**
   * Fallback role configurations
   */
  getFallbackRoles() {
    const allIds = [];
    Object.values(FALLBACK_GROUPED_PERMISSIONS).forEach((grp) => {
      grp.children?.forEach((c) => allIds.push(c));
    });

    return [
      {
        _id: "6ad0a8de1fc475cdc8edfe8d",
        role: "ADMIN",
        permissions: allIds,
      },
      {
        _id: "6ad0a8de1fc475cdc8edfe8e",
        role: "API_PARTNER",
        permissions: allIds.slice(0, 45),
      },
      {
        _id: "6ad0a8de1fc475cdc8edfe8f",
        role: "USER",
        permissions: allIds.slice(0, 15),
      },
    ];
  },
};

export default adminPermissionService;
