import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Server,
  FileText,
  Settings,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../../app/providers/AuthContext";
import { Card, Badge, Button } from "../../../components/common";

export const AdminDashboardPlaceholder = () => {
  const { user, role } = useAuth();

  return (
    <div className="space-y-6">
      {/* Banner Notice */}
      <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl flex items-start space-x-3 text-purple-900 dark:text-purple-200 text-sm">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-purple-600 mt-0.5" />
        <div>
          <strong className="font-semibold">SaveDost Administrator Console Active:</strong> You are authenticated as an <strong>ADMIN</strong>. You have exclusive governance privileges. Legacy Retailer, Distributor, and Sub-admin modules have been permanently removed. Full operational panels will be implemented in subsequent dashboard phases.
        </div>
      </div>

      {/* Admin Identity Card */}
      <Card title="Administrator Overview" padding="md" className="border-[#E2EEF5] dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Administrator Name</span>
            <span className="font-bold text-slate-900 dark:text-white text-base">{user?.name || "System Admin"}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Registered Mobile</span>
            <span className="font-semibold text-slate-900 dark:text-white">{user?.mobile || user?.mobileNumber || "N/A"}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Assigned Role</span>
            <div className="mt-0.5">
              <Badge variant="purple" size="sm">{role}</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Metrics Bar (Placeholder) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E2EEF5] dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Consumers</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">Active</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> Direct Checkout Active
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E2EEF5] dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>API Partners</span>
            <Server className="w-4 h-4 text-brand-blue" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">B2B Ready</p>
          <span className="text-[11px] text-brand-blue font-semibold mt-1 inline-flex items-center">
            Wallet Staging (Phase 5)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E2EEF5] dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>BBPS Billers</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">Connected</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-flex items-center">
            Live Gateway
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E2EEF5] dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Security Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">Protected</p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            RBAC 3-Role Guard Active
          </span>
        </div>
      </div>

      {/* Admin Modules Navigation Cards */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          Platform Governance Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow border-[#E2EEF5] dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-2 text-purple-600">
              <Users className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">User Management</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Audit consumers, API partners, verify accounts, and toggle active permissions.
            </p>
            <Link to="/admin/users">
              <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Manage Users
              </Button>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-[#E2EEF5] dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-2 text-blue-600">
              <Server className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Service Providers</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Configure BBPS billers, AeronPay recharge APIs, and payment gateway routing.
            </p>
            <Link to="/admin/services">
              <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Services
              </Button>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-[#E2EEF5] dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-2 text-emerald-600">
              <FileText className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Reports & Audits</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Platform revenue, settlement reconciliation, and audit trail reports.
            </p>
            <Link to="/admin/reports/transactions">
              <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Reports
              </Button>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-[#E2EEF5] dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-2 text-slate-600">
              <Settings className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">System Settings</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Security settings, access token policies, and platform notifications.
            </p>
            <Link to="/admin/settings">
              <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Configure
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPlaceholder;
