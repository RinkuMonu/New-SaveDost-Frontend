import { ROLES } from "./constants";

/**
 * Role-Aware Navigation Configuration for SaveDost Frontend.
 * Strictly adheres to the 3 confirmed roles: ADMIN, API_PARTNER, USER.
 *
 * Requirements:
 * - ADMIN routes are never exposed to API_PARTNER or USER.
 * - API Partner B2B Wallet routes are never exposed to USER.
 * - USER operates exclusively via direct payment gateway (no customer wallet routes).
 * - All legacy Retailer, Distributor, Sub-admin, and SuperAdmin routes are permanently removed.
 */
export const NAVIGATION_CONFIG = Object.freeze({
  [ROLES.ADMIN]: [
    {
      group: "Operations",
      items: [
        {
          id: "admin-dashboard",
          label: "Dashboard",
          path: "/admin/dashboard",
          icon: "LayoutDashboard",
        },
        {
          id: "admin-users",
          label: "User Management",
          path: "/admin/users",
          icon: "Users",
        },
        {
          id: "admin-services",
          label: "Service Providers",
          path: "/admin/services",
          icon: "Server",
        },
      ],
    },
    {
      group: "Finance & Reports",
      items: [
        {
          id: "admin-reports",
          label: "Reports & Audits",
          path: "/admin/reports",
          icon: "FileText",
          subItems: [
            {
              id: "admin-reports-transactions",
              label: "All Transactions",
              path: "/admin/reports/transactions",
            },
            {
              id: "admin-reports-settlement",
              label: "Settlement Audits",
              path: "/admin/reports/settlement",
            },
          ],
        },
        {
          id: "admin-settings",
          label: "System Settings",
          path: "/admin/settings",
          icon: "Settings",
        },
      ],
    },
  ],

  [ROLES.API_PARTNER]: [
    {
      group: "B2B Partner Portal",
      items: [
        {
          id: "partner-dashboard",
          label: "Partner Overview",
          path: "/api-partner/dashboard",
          icon: "LayoutDashboard",
        },
        {
          id: "partner-wallet",
          label: "B2B Partner Wallet",
          path: "/api-partner/wallet",
          icon: "Wallet",
          badge: "B2B",
        },
      ],
    },
    {
      group: "Developer & API Tools",
      items: [
        {
          id: "partner-docs",
          label: "API Documentation",
          path: "/api-partner/docs",
          icon: "Code",
        },
        {
          id: "partner-webhooks",
          label: "Webhooks & Callbacks",
          path: "/api-partner/webhooks",
          icon: "Activity",
        },
        {
          id: "partner-reports",
          label: "API Transaction Reports",
          path: "/api-partner/reports",
          icon: "FileText",
        },
      ],
    },
  ],

  [ROLES.USER]: [
    {
      group: "Consumer Services",
      items: [
        {
          id: "user-dashboard",
          label: "Dashboard",
          path: "/user/dashboard",
          icon: "LayoutDashboard",
        },
        {
          id: "user-recharge",
          label: "Mobile & DTH Recharge",
          path: "/user/recharge",
          icon: "Smartphone",
          badge: "Direct Pay",
        },
        {
          id: "user-bbps",
          label: "Utility Bill Payments",
          path: "/user/bbps",
          icon: "Zap",
          badge: "BBPS",
        },
        {
          id: "user-payments",
          label: "Direct Gateway Checkout",
          path: "/user/payments",
          icon: "CreditCard",
        },
      ],
    },
    {
      group: "Account & Activity",
      items: [
        {
          id: "user-transactions",
          label: "Transaction Receipts",
          path: "/user/transactions",
          icon: "Receipt",
        },
        {
          id: "user-profile",
          label: "My Profile",
          path: "/user/profile",
          icon: "User",
        },
      ],
    },
  ],
});

/**
 * Retrieves the permitted navigation menu groups for a specified role.
 *
 * @param {string} role - The confirmed user role
 * @returns {Array} List of navigation groups with items
 */
export const getNavigationForRole = (role) => {
  if (!role) return [];
  const normalized = role.toUpperCase();
  return NAVIGATION_CONFIG[normalized] || [];
};

/**
 * Finds the active navigation item and parent for breadcrumbs.
 *
 * @param {string} pathname - Current route path
 * @param {string} role - Current user role
 * @returns {{item: Object|null, parent: Object|null, groupName: string|null}}
 */
export const findActiveNavItem = (pathname, role) => {
  const groups = getNavigationForRole(role);

  for (const group of groups) {
    for (const item of group.items) {
      if (item.path === pathname) {
        return { item, parent: null, groupName: group.group };
      }
      if (item.subItems) {
        for (const sub of item.subItems) {
          if (sub.path === pathname) {
            return { item: sub, parent: item, groupName: group.group };
          }
        }
      }
    }
  }

  return { item: null, parent: null, groupName: null };
};
