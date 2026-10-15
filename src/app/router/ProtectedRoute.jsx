import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";
import { Loader } from "../../components/common";
import { getRoleDashboardPath } from "../../utils/constants";

/**
 * Reusable route guard enforcing authentication and exact three-role RBAC.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements to render if authorized
 * @param {React.ReactNode} [props.element] - Alternate element prop
 * @param {string[]} [props.allowedRoles] - Specific roles permitted (ADMIN, API_PARTNER, USER)
 * @param {boolean} [props.requireAuth=true] - Whether authentication is required
 * @param {boolean} [props.publicOnly=false] - For auth pages (login/register) where logged-in users should redirect
 */
export const ProtectedRoute = ({
  children,
  element,
  allowedRoles,
  requireAuth = true,
  publicOnly = false,
}) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();
  const content = children || element;

  // 1. Initial session restoration in progress
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader size="lg" text="Verifying session and permissions..." />
      </div>
    );
  }

  // 2. Public-only routes (e.g. /login, /register): redirect authenticated users to their role dashboard
  if (publicOnly) {
    if (isAuthenticated && role) {
      const dashboardPath = getRoleDashboardPath(role);
      return <Navigate to={dashboardPath} replace />;
    }
    return <>{content}</>;
  }

  // 3. Protected route requires authentication
  if (requireAuth && !isAuthenticated) {
    if (location.pathname === "/login") {
      return <>{content}</>;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 4. Role restriction check: user must possess one of the allowed roles
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" state={{ requestedPath: location.pathname }} replace />;
    }
  }

  return <>{content}</>;
};

export default ProtectedRoute;
