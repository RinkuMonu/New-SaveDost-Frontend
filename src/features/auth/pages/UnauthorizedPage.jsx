import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home, LogOut } from "lucide-react";
import { useAuth } from "../../../app/providers/AuthContext";
import { Button, Card } from "../../../components/common";
import { getRoleDashboardPath } from "../../../utils/constants";

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, user, logout } = useAuth();

  const handleGoToDashboard = () => {
    if (isAuthenticated && role) {
      navigate(getRoleDashboardPath(role));
    } else {
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg text-center">
        <Card className="border-slate-200 dark:border-slate-800 shadow-xl" padding="lg">
          {/* Icon Header */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mb-6 border border-amber-200 dark:border-amber-800">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Access Restricted
          </h1>
          <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-4 uppercase tracking-wider">
            403 — Unauthorized Role Permission
          </p>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            You do not have the required permissions to access this page.
            {location.state?.requestedPath && (
              <span className="block mt-2 font-mono text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-700 dark:text-slate-300">
                Attempted route: {location.state.requestedPath}
              </span>
            )}
          </p>

          {/* User & Role Badge */}
          {isAuthenticated && (
            <div className="mb-6 p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-400">
              Logged in as: <strong className="text-slate-900 dark:text-white">{user?.name || user?.mobile}</strong>
              <div className="mt-1">
                Assigned Role: <span className="font-semibold text-brand-blue">{role}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              id="unauthorized-dashboard-btn"
              variant="primary"
              size="md"
              leftIcon={<Home className="w-4 h-4" />}
              onClick={handleGoToDashboard}
              className="w-full sm:w-auto"
            >
              Go to My Dashboard
            </Button>

            {isAuthenticated ? (
              <Button
                id="unauthorized-logout-btn"
                variant="outline"
                size="md"
                leftIcon={<LogOut className="w-4 h-4" />}
                onClick={handleLogout}
                className="w-full sm:w-auto"
              >
                Switch Account
              </Button>
            ) : (
              <Button
                id="unauthorized-login-btn"
                variant="secondary"
                size="md"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto"
              >
                Back to Sign In
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
