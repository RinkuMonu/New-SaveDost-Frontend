import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import { LoginPage, RegisterPage, UnauthorizedPage } from "../../features/auth";
import { AdminDashboardPlaceholder, UserListPage } from "../../features/admin";
import { ApiPartnerDashboardPlaceholder, PartnerWalletPage } from "../../features/api-partner";
import { UserDashboardPlaceholder } from "../../features/user";
import { AppLayout, FeaturePlaceholderPage } from "../../components/layout";
import { ROLES, getRoleDashboardPath } from "../../utils/constants";
import { Loader } from "../../components/common";
import {
  Server,
  FileText,
  Settings,
  Code,
  Activity,
  Smartphone,
  Zap,
  CreditCard,
  Receipt,
  User as UserIcon,
} from "lucide-react";

/**
 * Root index component that intelligently routes users to their role dashboard
 * or to the login page if not authenticated.
 */
const RootRedirect = () => {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5FBFF] dark:bg-slate-900">
        <Loader size="lg" text="Loading SaveDost..." />
      </div>
    );
  }

  if (isAuthenticated && role) {
    return <Navigate to={getRoleDashboardPath(role)} replace />;
  }

  return <Navigate to="/login" replace />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* =================================================================== */}
        {/* PUBLIC UNGUARDED / PUBLIC-ONLY ROUTES                               */}
        {/* =================================================================== */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public Auth Routes (Redirects authenticated users away to their dashboard) */}
        <Route
          path="/login"
          element={
            <ProtectedRoute publicOnly>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute publicOnly>
              <RegisterPage />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* =================================================================== */}
        {/* AUTHENTICATED SHARED APPLICATION LAYOUT                             */}
        {/* =================================================================== */}
        <Route
          element={
            <ProtectedRoute requireAuth>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* ================================================================= */}
          {/* 1. ADMIN PROTECTED ROUTES                                         */}
          {/* ================================================================= */}
          <Route
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboardPlaceholder />} />
            <Route path="/admin/users" element={<UserListPage />} />
            <Route
              path="/admin/services"
              element={
                <FeaturePlaceholderPage
                  title="Service Providers"
                  description="Configure and monitor external integrations including AeronPay, Bharat BillPay, and payment gateways."
                  plannedPhase="Phase 6 Services Integration"
                  icon={Server}
                />
              }
            />
            <Route
              path="/admin/reports"
              element={<Navigate to="/admin/reports/transactions" replace />}
            />
            <Route
              path="/admin/reports/transactions"
              element={
                <FeaturePlaceholderPage
                  title="All Transactions"
                  description="Platform-wide ledger of utility bill payments, recharges, and payment gateway checkout records."
                  plannedPhase="Phase 7 Reports & Audits"
                  icon={FileText}
                />
              }
            />
            <Route
              path="/admin/reports/settlement"
              element={
                <FeaturePlaceholderPage
                  title="Settlement Audits"
                  description="Financial reconciliation logs, banking settlement batches, and provider commissions."
                  plannedPhase="Phase 7 Reports & Audits"
                  icon={FileText}
                />
              }
            />
            <Route
              path="/admin/settings"
              element={
                <FeaturePlaceholderPage
                  title="System Settings"
                  description="Platform configurations, API rate-limiting rules, maintenance toggles, and security policies."
                  plannedPhase="Phase 8 System Settings"
                  icon={Settings}
                />
              }
            />
            <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* ================================================================= */}
          {/* 2. API PARTNER PROTECTED ROUTES                                   */}
          {/* ================================================================= */}
          <Route
            element={
              <ProtectedRoute allowedRoles={[ROLES.API_PARTNER]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/api-partner/dashboard" element={<ApiPartnerDashboardPlaceholder />} />
            <Route path="/api-partner/wallet" element={<PartnerWalletPage />} />
            <Route
              path="/api-partner/docs"
              element={
                <FeaturePlaceholderPage
                  title="API Documentation"
                  description="Explore OpenAPI 3.0 specs, Bearer authentication headers, endpoint schemas, and code samples."
                  plannedPhase="Phase 5 Partner Tools"
                  icon={Code}
                />
              }
            />
            <Route
              path="/api-partner/webhooks"
              element={
                <FeaturePlaceholderPage
                  title="Webhooks & Callbacks"
                  description="Configure endpoint URLs and secret keys to receive real-time webhook push notifications."
                  plannedPhase="Phase 5 Partner Tools"
                  icon={Activity}
                />
              }
            />
            <Route
              path="/api-partner/reports"
              element={
                <FeaturePlaceholderPage
                  title="API Transaction Reports"
                  description="View and export API-initiated transaction logs, response codes, and partner commissions."
                  plannedPhase="Phase 7 Reports"
                  icon={FileText}
                />
              }
            />
            <Route path="/api-partner/*" element={<Navigate to="/api-partner/dashboard" replace />} />
          </Route>

          {/* ================================================================= */}
          {/* 3. USER (CONSUMER) PROTECTED ROUTES                               */}
          {/* ================================================================= */}
          <Route
            element={
              <ProtectedRoute allowedRoles={[ROLES.USER]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/user/dashboard" element={<UserDashboardPlaceholder />} />
            <Route
              path="/user/recharge"
              element={
                <FeaturePlaceholderPage
                  title="Mobile & DTH Recharge"
                  description="Instant mobile prepaid, postpaid, and DTH recharges across all telecom circles with direct payment gateway checkout."
                  plannedPhase="Phase 6 Consumer Services"
                  badgeText="Direct Pay"
                  icon={Smartphone}
                />
              }
            />
            <Route
              path="/user/bbps"
              element={
                <FeaturePlaceholderPage
                  title="Utility Bill Payments"
                  description="Pay electricity, gas, water, municipal, and broadband bills via direct payment gateway without customer wallet balance."
                  plannedPhase="Phase 6 Consumer Services"
                  badgeText="BBPS"
                  icon={Zap}
                />
              }
            />
            <Route
              path="/user/payments"
              element={
                <FeaturePlaceholderPage
                  title="Direct Gateway Checkout"
                  description="Direct payment gateway integration supporting UPI, Netbanking, and Debit/Credit cards. No personal wallet is required."
                  plannedPhase="Phase 6 Payment Integration"
                  icon={CreditCard}
                />
              }
            />
            <Route
              path="/user/transactions"
              element={
                <FeaturePlaceholderPage
                  title="Transaction Receipts"
                  description="Download invoices, inspect operator reference numbers, and review payment status history."
                  plannedPhase="Phase 7 History & Receipts"
                  icon={Receipt}
                />
              }
            />
            <Route
              path="/user/profile"
              element={
                <FeaturePlaceholderPage
                  title="My Account Profile"
                  description="Manage personal contact details, security credentials, and communication preferences."
                  plannedPhase="Phase 8 Account Management"
                  icon={UserIcon}
                />
              }
            />
            <Route path="/user/*" element={<Navigate to="/user/dashboard" replace />} />
          </Route>
        </Route>

        {/* Fallback Catch-all: Route back to root redirect */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
