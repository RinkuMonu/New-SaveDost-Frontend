import React from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  Code,
  Activity,
  FileText,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../../app/providers/AuthContext";
import { Card, Badge, Button } from "../../../components/common";

export const ApiPartnerDashboardPlaceholder = () => {
  const { user, role } = useAuth();

  return (
    <div className="space-y-6">
      {/* Banner Notice */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start space-x-3 text-amber-900 dark:text-amber-200 text-sm">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
        <div>
          <strong className="font-semibold">B2B Partner Dedicated Wallet Architecture:</strong> You are logged in as an <strong>API_PARTNER</strong>. Unlike consumer users, API Partners operate on a dedicated prefunded B2B wallet model for high-frequency automated recharge & bill payment execution. Wallet management and API credentials will be fully operational in Phase 5.
        </div>
      </div>

      {/* Partner Account Overview */}
      <Card title="Partner Account Profile" padding="md" className="border-[#E2EEF5] dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Partner Account Name</span>
            <span className="font-bold text-slate-900 dark:text-white text-base">{user?.name || "API Partner"}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Authorized Mobile</span>
            <span className="font-semibold text-slate-900 dark:text-white">{user?.mobile || user?.mobileNumber || "N/A"}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Partner Tier</span>
            <div className="mt-0.5">
              <Badge variant="warning" size="sm">{role} — B2B Standard</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E2EEF5] dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>B2B Wallet Staging</span>
            <Wallet className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">Phase 5</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-flex items-center">
            Virtual Account Staged
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E2EEF5] dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>API Status</span>
            <Code className="w-4 h-4 text-brand-blue" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">Active</p>
          <span className="text-[11px] text-brand-blue font-semibold mt-1 inline-flex items-center">
            OpenAPI 3.0 Ready
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E2EEF5] dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Webhooks</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">Ready</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-flex items-center">
            Real-time Callbacks
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E2EEF5] dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Success Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">99.9%</p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            Target SLA
          </span>
        </div>
      </div>

      {/* Partner Modules Cards */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          API Partner Integration Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow border-[#E2EEF5] dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-2 text-amber-600">
              <Wallet className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">B2B Partner Wallet</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Prefund B2B wallet balance via virtual account or netbanking for high-volume automated API debits.
            </p>
            <Link to="/api-partner/wallet">
              <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Wallet Portal
              </Button>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-[#E2EEF5] dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-2 text-blue-600">
              <Code className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">API Documentation</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Explore REST endpoints, authentication headers, request payloads, and response structures.
            </p>
            <Link to="/api-partner/docs">
              <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Docs
              </Button>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-[#E2EEF5] dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-2 text-emerald-600">
              <Activity className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Webhooks & Logs</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Configure callback URLs to receive real-time webhook payloads for transaction status changes.
            </p>
            <Link to="/api-partner/webhooks">
              <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Configure Callbacks
              </Button>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-[#E2EEF5] dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-2 text-slate-600">
              <FileText className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Transaction Reports</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Export API transaction logs, reconcile commission ledger, and analyze traffic volume.
            </p>
            <Link to="/api-partner/reports">
              <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Partner Reports
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApiPartnerDashboardPlaceholder;
