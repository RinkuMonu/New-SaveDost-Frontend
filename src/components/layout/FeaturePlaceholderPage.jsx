import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  ArrowLeft,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Home,
} from "lucide-react";
import { useAuth } from "../../app/providers/AuthContext";
import { Card, Button, Badge } from "../common";
import { getRoleDashboardPath } from "../../utils/constants";
import { findActiveNavItem } from "../../utils/navigationConfig";

export const FeaturePlaceholderPage = ({
  title,
  description,
  plannedPhase,
  badgeText,
  icon: CustomIcon,
}) => {
  const { role, user } = useAuth();
  const location = useLocation();

  const { item, parent, groupName } = findActiveNavItem(location.pathname, role);

  const displayTitle = title || item?.label || "Service Portal";
  const displayDescription =
    description ||
    `This module is configured under the ${role} portal. Complete operational components will be connected during ${plannedPhase || "upcoming implementation phases"}.`;

  const dashboardPath = getRoleDashboardPath(role);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500">
        <Link
          to={dashboardPath}
          className="flex items-center space-x-1 hover:text-brand-blue transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
        {groupName && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span>{groupName}</span>
          </>
        )}
        {parent && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link to={parent.path} className="hover:text-brand-blue">
              {parent.label}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-800">
          {displayTitle}
        </span>
      </nav>

      {/* Main Feature Banner Card */}
      <Card padding="lg" className="border-[#E2EEF5] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0 shadow-sm">
              {CustomIcon ? (
                <CustomIcon className="w-6 h-6" />
              ) : (
                <Layers className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight">
                  {displayTitle}
                </h1>
                {badgeText && (
                  <Badge variant="primary" size="sm">
                    {badgeText}
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {displayDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <Badge variant="purple" size="md">
              Authorized: {role}
            </Badge>
          </div>
        </div>

        {/* Phase Scope Card */}
        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#F5FBFF] border border-[#E2EEF5]">
            <div className="flex items-center space-x-2 text-brand-blue text-xs font-bold mb-1">
              <Clock className="w-4 h-4" />
              <span>Project Roadmap</span>
            </div>
            <p className="text-xs text-slate-600">
              Scheduled for <strong>{plannedPhase || "Upcoming Phase"}</strong>. All backend contracts and integration points are staged.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Role Permissions Verified</span>
            </div>
            <p className="text-xs text-slate-600">
              Authenticated user: <strong>{user?.name || user?.mobile}</strong> possesses confirmed access permissions for this module.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
            <div className="flex items-center space-x-2 text-purple-700 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Architecture Notice</span>
            </div>
            <p className="text-xs text-slate-600">
              {role === "USER"
                ? "Direct payment gateway integration active. No personal wallet is required."
                : role === "API_PARTNER"
                ? "Dedicated prefunded B2B partner wallet architecture applies."
                : "Platform-wide administrative governance and audit oversight."}
            </p>
          </div>
        </div>

        {/* Navigation Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link to={dashboardPath}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Dashboard
            </Button>
          </Link>
          <span className="text-[11px] text-slate-400">
            Route: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{location.pathname}</code>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default FeaturePlaceholderPage;
