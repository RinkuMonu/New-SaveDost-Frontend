import { ROLES } from "./constants";

/**
 * Role-Aware Navigation Configuration for SaveDost Frontend.
 * Strictly adheres to the 3 confirmed roles: ADMIN, API_PARTNER, USER.
 *
 * Requirements:
 * - Full parity with Finunique/SaveDost reference admin sidebar services
 * - 3-Role RBAC (ADMIN, API_PARTNER, USER)
 * - Customer wallet eliminated; direct gateway payment architecture
 */
export const NAVIGATION_CONFIG = Object.freeze({
  [ROLES.ADMIN]: [
    {
      group: "Operations & Governance",
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
          subItems: [
            {
              id: "admin-users-all",
              label: "Active Users",
              path: "/admin/users",
            },
            {
              id: "admin-users-partners",
              label: "Active API Partners",
              path: "/admin/api-partners",
            },
            {
              id: "admin-users-admins",
              label: "Active Admin",
              path: "/admin/users?role=ADMIN",
            },
            {
              id: "admin-users-actions",
              label: "Action Request",
              path: "/admin/users/action-requests",
            },
          ],
        },
        {
          id: "admin-leads",
          label: "Lead Management",
          path: "/admin/leads",
          icon: "UserPlus",
          subItems: [
            {
              id: "admin-leads-list",
              label: "Lead Management",
              path: "/admin/leads",
            },
          ],
        },
        {
          id: "admin-api-mgmt",
          label: "API Management",
          path: "/admin/api-partners",
          icon: "Server",
          subItems: [
            {
              id: "admin-api-partners",
              label: "API Partner Directory",
              path: "/admin/api-partners",
            },
            {
              id: "admin-api-assign",
              label: "Assign API Services",
              path: "/admin/api-partners/assign",
            },
            {
              id: "admin-api-switch",
              label: "Services Switch",
              path: "/admin/services",
            },
          ],
        },
        {
          id: "admin-permissions",
          label: "Permission Management",
          path: "/admin/permissions",
          icon: "KeyRound",
          subItems: [
            {
              id: "admin-permissions-assign",
              label: "Assign Permission",
              path: "/admin/permissions/assign",
            },
            {
              id: "admin-permissions-role",
              label: "Role Permission",
              path: "/admin/permissions/roles",
            },
          ],
        },
      ],
    },
    {
      group: "Utility & Banking Services",
      items: [
        {
          id: "admin-mobile-recharge",
          label: "Mobile Recharge",
          path: "/admin/services/mobile-recharge",
          icon: "Smartphone",
          subItems: [
            {
              id: "admin-recharge-prepaid",
              label: "Mobile Recharge",
              path: "/admin/services/mobile-recharge",
            },
            {
              id: "admin-recharge-report",
              label: "Mobile Recharge Report",
              path: "/admin/reports/transactions?type=MOBILE_RECHARGE",
            },
            {
              id: "admin-recharge-commercial",
              label: "Mobile Commercial",
              path: "/admin/services/commercials?service=mobile",
            },
            {
              id: "admin-recharge-commission",
              label: "Mobile Commission",
              path: "/admin/services/commissions?service=mobile",
            },
          ],
        },
        {
          id: "admin-dth-recharge",
          label: "DTH Recharge",
          path: "/admin/services/dth-recharge",
          icon: "Tv",
          subItems: [
            {
              id: "admin-dth-do",
              label: "Do DTH Recharge",
              path: "/admin/services/dth-recharge",
            },
            {
              id: "admin-dth-report",
              label: "DTH Recharge Report",
              path: "/admin/reports/transactions?type=DTH_RECHARGE",
            },
            {
              id: "admin-dth-commercial",
              label: "DTH Commercial",
              path: "/admin/services/commercials?service=dth",
            },
            {
              id: "admin-dth-commission",
              label: "DTH Commission",
              path: "/admin/services/commissions?service=dth",
            },
          ],
        },
        {
          id: "admin-bus-booking",
          label: "Bus Booking",
          path: "/admin/services/bus-booking",
          icon: "Bus",
          subItems: [
            {
              id: "admin-bus-book",
              label: "Bus Booking",
              path: "/admin/services/bus-booking",
            },
            {
              id: "admin-bus-report",
              label: "Bus Booking Report",
              path: "/admin/reports/transactions?type=BUS_BOOKING",
            },
            {
              id: "admin-bus-commercial",
              label: "Bus Booking Commercial",
              path: "/admin/services/commercials?service=bus",
            },
            {
              id: "admin-bus-commission",
              label: "Bus Booking Commission",
              path: "/admin/services/commissions?service=bus",
            },
          ],
        },
        {
          id: "admin-insurance",
          label: "Insurance",
          path: "/admin/services/insurance",
          icon: "Shield",
          subItems: [
            {
              id: "admin-insurance-pay",
              label: "Insurance Premium Payment",
              path: "/admin/services/insurance",
            },
            {
              id: "admin-insurance-commercial",
              label: "Insurance Commercial",
              path: "/admin/services/commercials?service=insurance",
            },
            {
              id: "admin-insurance-commission",
              label: "Insurance Commission",
              path: "/admin/services/commissions?service=insurance",
            },
            {
              id: "admin-insurance-report",
              label: "Insurance Report",
              path: "/admin/reports/transactions?type=INSURANCE",
            },
          ],
        },
        {
          id: "admin-bbps",
          label: "Bill Payment Services",
          path: "/admin/services/bbps",
          icon: "Receipt",
          subItems: [
            {
              id: "admin-bbps-all",
              label: "All BBPS Services",
              path: "/admin/services/bbps",
            },
            {
              id: "admin-bbps-reports",
              label: "Usage Reports",
              path: "/admin/reports/transactions?type=BBPS",
            },
            {
              id: "admin-bbps-commission",
              label: "BBPS Commission",
              path: "/admin/services/commissions?service=bbps",
            },
          ],
        },
        {
          id: "admin-loan",
          label: "Loan",
          path: "/admin/services/loan",
          icon: "Landmark",
          subItems: [
            {
              id: "admin-loan-apply",
              label: "Apply Loan",
              path: "/admin/services/loan",
            },
            {
              id: "admin-loan-report",
              label: "Loan Report",
              path: "/admin/reports/transactions?type=LOAN",
            },
            {
              id: "admin-loan-categories",
              label: "Loan Categories",
              path: "/admin/services/loan/categories",
            },
          ],
        },
        {
          id: "admin-credit-card",
          label: "Credit Card",
          path: "/admin/services/credit-card",
          icon: "CreditCard",
          subItems: [
            {
              id: "admin-card-apply",
              label: "Apply Credit Card",
              path: "/admin/services/credit-card",
            },
            {
              id: "admin-card-report",
              label: "Credit Card Report",
              path: "/admin/reports/transactions?type=CREDIT_CARD",
            },
            {
              id: "admin-card-commercial",
              label: "Credit Card Commercial",
              path: "/admin/services/commercials?service=credit_card",
            },
          ],
        },
        {
          id: "admin-plans",
          label: "Plans Management",
          path: "/admin/services/plans",
          icon: "Layers",
          subItems: [
            {
              id: "admin-plans-all",
              label: "Plans Management",
              path: "/admin/services/plans",
            },
            {
              id: "admin-plans-commission",
              label: "Plan Commission",
              path: "/admin/services/commissions?service=plans",
            },
          ],
        },
        {
          id: "admin-assets",
          label: "Assest Track",
          path: "/admin/services/assets",
          icon: "Package",
          subItems: [
            {
              id: "admin-assets-inventory",
              label: "Asset Inventory",
              path: "/admin/services/assets",
            },
            {
              id: "admin-assets-track",
              label: "Asset Track",
              path: "/admin/services/assets/track",
            },
          ],
        },
        {
          id: "admin-commercials",
          label: "Commercial List",
          path: "/admin/services/commercials",
          icon: "BadgePercent",
          subItems: [
            {
              id: "admin-commercials-list",
              label: "Commercial List",
              path: "/admin/services/commercials",
            },
            {
              id: "admin-commissions-packages",
              label: "Commission Packages",
              path: "/admin/services/commissions",
            },
          ],
        },
        {
          id: "admin-aeps",
          label: "AEPS",
          path: "/admin/services/aeps",
          icon: "Scan",
          subItems: [
            {
              id: "admin-aeps-onboard",
              label: "AEPS Onboarding",
              path: "/admin/services/aeps/onboarding",
            },
            {
              id: "admin-aeps-service",
              label: "AEPS Service",
              path: "/admin/services/aeps",
            },
            {
              id: "admin-aeps-reports",
              label: "AEPS Reports",
              path: "/admin/reports/transactions?type=AEPS",
            },
            {
              id: "admin-aeps-merchants",
              label: "AEPS Merchants",
              path: "/admin/services/aeps/merchants",
            },
            {
              id: "admin-aeps-commission",
              label: "AEPS Commission",
              path: "/admin/services/commissions?service=aeps",
            },
          ],
        },
        {
          id: "admin-matm",
          label: "M-ATM",
          path: "/admin/services/matm",
          icon: "Radio",
          subItems: [
            {
              id: "admin-matm-service",
              label: "M-ATM",
              path: "/admin/services/matm",
            },
            {
              id: "admin-matm-report",
              label: "M-ATM Report",
              path: "/admin/reports/transactions?type=MATM",
            },
            {
              id: "admin-matm-commission",
              label: "M-ATM Commission",
              path: "/admin/services/commissions?service=matm",
            },
          ],
        },
        {
          id: "admin-dmt",
          label: "DMT",
          path: "/admin/services/dmt",
          icon: "ArrowRightLeft",
          subItems: [
            {
              id: "admin-dmt-transfer",
              label: "Do Transaction",
              path: "/admin/services/dmt",
            },
            {
              id: "admin-dmt-report",
              label: "DMT Report",
              path: "/admin/reports/transactions?type=DMT",
            },
            {
              id: "admin-dmt-commercial",
              label: "DMT Commercial",
              path: "/admin/services/commercials?service=dmt",
            },
            {
              id: "admin-dmt-commission",
              label: "DMT Commission",
              path: "/admin/services/commissions?service=dmt",
            },
          ],
        },
      ],
    },
    {
      group: "Payments & Marketing",
      items: [
        {
          id: "admin-payin",
          label: "Pay-In",
          path: "/admin/transactions/payin",
          icon: "ArrowDownLeft",
          subItems: [
            {
              id: "admin-payin-orders",
              label: "Pay-In Inward Orders",
              path: "/admin/transactions?type=PAYIN",
            },
            {
              id: "admin-payin-reports",
              label: "Pay-In Reports",
              path: "/admin/reports/transactions?type=PAYIN",
            },
          ],
        },
        {
          id: "admin-payout",
          label: "Pay-Out",
          path: "/admin/transactions/payout",
          icon: "ArrowUpRight",
          subItems: [
            {
              id: "admin-payout-orders",
              label: "Pay-Out Disbursals",
              path: "/admin/transactions?type=PAYOUT",
            },
            {
              id: "admin-payout-reports",
              label: "Pay-Out Reports",
              path: "/admin/reports/transactions?type=PAYOUT",
            },
          ],
        },
        {
          id: "admin-support",
          label: "Support & Team",
          path: "/admin/support",
          icon: "Headphones",
          subItems: [
            {
              id: "admin-support-tickets",
              label: "Support Tickets",
              path: "/admin/support",
            },
            {
              id: "admin-support-team",
              label: "Support Team",
              path: "/admin/support/team",
            },
          ],
        },
        {
          id: "admin-callback",
          label: "Call Back",
          path: "/admin/callbacks",
          icon: "PhoneCall",
          subItems: [
            {
              id: "admin-callback-list",
              label: "Call Back Requests",
              path: "/admin/callbacks",
            },
          ],
        },
        {
          id: "admin-news",
          label: "News",
          path: "/admin/news",
          icon: "Newspaper",
          subItems: [
            {
              id: "admin-news-list",
              label: "News & Bulletins",
              path: "/admin/news",
            },
          ],
        },
        {
          id: "admin-banner",
          label: "Banner",
          path: "/admin/banners",
          icon: "Image",
          subItems: [
            {
              id: "admin-banner-list",
              label: "Banner Sliders",
              path: "/admin/banners",
            },
          ],
        },
        {
          id: "admin-blog",
          label: "Blog",
          path: "/admin/blogs",
          icon: "BookOpen",
          subItems: [
            {
              id: "admin-blog-posts",
              label: "Blog Posts",
              path: "/admin/blogs",
            },
          ],
        },
        {
          id: "admin-settings",
          label: "Settings",
          path: "/admin/settings",
          icon: "Settings",
          subItems: [
            {
              id: "admin-settings-system",
              label: "System Configuration",
              path: "/admin/settings",
            },
          ],
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
          icon: "CreditCard",
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
          icon: "Server",
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
          icon: "Receipt",
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
          icon: "Receipt",
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
          icon: "Users",
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
