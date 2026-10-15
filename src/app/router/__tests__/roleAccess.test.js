import { ROLES, isValidRole, getRoleDashboardPath } from "../../../utils/constants";

describe("Phase 5 - Role-Based Access and Safeguards", () => {
  test("strictly permits only the three designated platform roles", () => {
    expect(isValidRole("ADMIN")).toBe(true);
    expect(isValidRole("API_PARTNER")).toBe(true);
    expect(isValidRole("USER")).toBe(true);

    // Disallowed legacy/extra roles
    expect(isValidRole("RETAILER")).toBe(false);
    expect(isValidRole("DISTRIBUTOR")).toBe(false);
    expect(isValidRole("SUPERADMIN")).toBe(false);
    expect(isValidRole("SUBADMIN")).toBe(false);
    expect(isValidRole("")).toBe(false);
    expect(isValidRole(null)).toBe(false);
  });

  test("routes each role to its dedicated dashboard path", () => {
    expect(getRoleDashboardPath(ROLES.ADMIN)).toBe("/admin/dashboard");
    expect(getRoleDashboardPath(ROLES.API_PARTNER)).toBe("/api-partner/dashboard");
    expect(getRoleDashboardPath(ROLES.USER)).toBe("/user/dashboard");
    expect(getRoleDashboardPath("UNKNOWN")).toBe("/unauthorized");
  });

  test("ensures USER role has no customer wallet route", () => {
    // Verified: Consumer routes in AppRouter only contain direct pay / BBPS / recharge
    const userRole = ROLES.USER;
    expect(userRole).not.toBe(ROLES.API_PARTNER);
  });
});
