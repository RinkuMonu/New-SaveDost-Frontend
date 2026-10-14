/**
 * SaveDost Core Application Constants & Enums.
 *
 * Strict 3-Role Specification:
 * 1. ADMIN
 * 2. API_PARTNER
 * 3. USER
 */

export const ROLES = Object.freeze({
  ADMIN: "ADMIN",
  API_PARTNER: "API_PARTNER",
  USER: "USER",
});

export const TOKEN_STORAGE_KEY = "savedost_token";

export const ROLE_DASHBOARDS = Object.freeze({
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.API_PARTNER]: "/api-partner/dashboard",
  [ROLES.USER]: "/user/dashboard",
});

export const PAYMENT_MODELS = Object.freeze({
  DIRECT_GATEWAY: "DIRECT_GATEWAY",
  API_PARTNER_WALLET: "API_PARTNER_WALLET",
});

/**
 * Validates if a role is one of the strictly permitted 3 roles.
 * @param {string} role
 * @returns {boolean}
 */
export const isValidRole = (role) => {
  return typeof role === "string" && Object.values(ROLES).includes(role.toUpperCase());
};

/**
 * Retrieves the dashboard route for a given user role.
 * @param {string} role
 * @returns {string}
 */
export const getRoleDashboardPath = (role) => {
  if (!role) return "/login";
  const normalized = role.toUpperCase();
  return ROLE_DASHBOARDS[normalized] || "/unauthorized";
};
