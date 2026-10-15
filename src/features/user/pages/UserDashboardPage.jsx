import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Zap,
  CreditCard,
  Receipt,
  User as UserIcon,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../../app/providers/AuthContext";
import { PageContainer, Card, Badge, Button, Table } from "../../../components/common";
import userService from "../services/userService";
import { getErrorMessage } from "../../../utils/apiError";

/**
 * SaveDost User Dashboard Page
 * Real-time consumer dashboard consuming GET /api/v1/dashboard/user
 * Enforces Direct Payment Gateway architecture without customer wallet.
 */
export const UserDashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await userService.getDashboardData();
      setDashboardData(res.data || {});
    } catch (err) {
      console.warn("Could not fetch aggregated user dashboard:", err);
      setError(getErrorMessage(err, "Failed to load dashboard data."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Derived attributes from real backend or session fallback
  const profile = dashboardData?.userSummary || user || {};
  const kycStatus = dashboardData?.kycStatus?.status || profile.kycStatus || (profile.isKycVerified ? "Approved" : "Pending");
  const recentTransactions = dashboardData?.recentTransactions || [];
  const rewards = dashboardData?.rewards || {};

  // Table columns for recent transactions
  const transactionColumns = [
    {
      key: "id",
      title: "Order / Ref ID",
      render: (_, row) => (
        <span className="font-mono text-xs font-semibold text-brand-navy select-all">
          {row.order_id || row.referenceId || row._id || row.id || "—"}
        </span>
      ),
    },
    {
      key: "service",
      title: "Service",
      render: (_, row) => (
        <span className="text-xs font-semibold text-brand-navy">
          {row.service_name || row.service_code || row.service || "Utility Service"}
        </span>
      ),
    },
    {
      key: "amount",
      title: "Amount (₹)",
      align: "right",
      render: (val, row) => {
        const amt = Number(val || row.amount || 0);
        return (
          <span className="font-mono text-xs sm:text-sm font-bold text-brand-navy">
            ₹{amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      key: "status",
      title: "Status",
      align: "center",
      render: (_, row) => {
        const status = row.status || row.paymentStatus || "Success";
        const isSuccess = status === "Success" || status === "SUCCESS" || status === "COMPLETED";
        const isPending = status === "Pending" || status === "PENDING";
        return (
          <Badge
            variant={isSuccess ? "success" : isPending ? "warning" : "error"}
            size="sm"
            dot
          >
            {status}
          </Badge>
        );
      },
    },
    {
      key: "date",
      title: "Date",
      render: (_, row) => (
        <span className="text-xs text-brand-muted">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "Recent"}
        </span>
      ),
    },
  ];

  return (
    <PageContainer
      title={`Welcome, ${profile.name || "Customer"}`}
      subtitle="Your SaveDost consumer utility dashboard with direct payment gateway checkout"
      actions={
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
          onClick={fetchDashboard}
          disabled={isLoading}
        >
          Refresh
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Architecture Banner */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl flex items-start space-x-3 text-emerald-950 text-sm shadow-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <strong className="font-bold">Direct Payment Gateway Architecture Active:</strong> All utility recharges and bill payments settle directly through verified checkout (UPI, Netbanking, Cards). In accordance with SaveDost design, no customer wallet pre-funding is required.
          </div>
        </div>

        {/* Error Banner if API fails */}
        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchDashboard}>
              Retry
            </Button>
          </div>
        )}

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border border-brand-border flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Account Standing</p>
              <p className="text-xl font-bold text-brand-navy mt-1">Active</p>
              <span className="text-[11px] text-emerald-600 font-semibold inline-flex items-center mt-0.5">
                Role: USER
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-4 bg-white border border-brand-border flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">KYC Verification</p>
              <p className="text-xl font-bold text-brand-navy mt-1 capitalize">{String(kycStatus)}</p>
              <span className="text-[11px] text-brand-blue font-semibold inline-flex items-center mt-0.5">
                Identity Profile
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-sky-50 text-brand-blue flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-4 bg-white border border-brand-border flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Checkout Mode</p>
              <p className="text-xl font-bold text-brand-navy mt-1">Direct Pay</p>
              <span className="text-[11px] text-purple-600 font-semibold inline-flex items-center mt-0.5">
                Zero Wallet Needed
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-4 bg-white border border-brand-border flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Reward Cash</p>
              <p className="text-xl font-bold text-amber-600 mt-1">
                ₹{Number(rewards.totalWon || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[11px] text-amber-600 font-semibold inline-flex items-center mt-0.5">
                Scratch Card Rewards
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* Consumer Utility Services Navigation Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-navy">
              Available Utility Services
            </h2>
            <span className="text-xs text-brand-muted">Direct Payment Enabled</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recharge Card */}
            <Card className="p-5 bg-white border border-brand-border hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#027da8] flex items-center justify-center mb-3">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-brand-navy text-base">Mobile & DTH Recharge</h3>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  Prepaid mobile recharges and DTH plans across Airtel, Jio, Vi, BSNL, and Tata Play.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border">
                <Link to="/user/recharge">
                  <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Recharge Now
                  </Button>
                </Link>
              </div>
            </Card>

            {/* BBPS Utility Bills Card */}
            <Card className="p-5 bg-white border border-brand-border hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-brand-navy text-base">BBPS Bill Payments</h3>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  Pay electricity, water, piped gas, broadband, FASTag, and municipal taxes directly.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border">
                <Link to="/user/bbps">
                  <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Pay Bills
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Direct Checkout Portal Card */}
            <Card className="p-5 bg-white border border-brand-border hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-brand-navy text-base">Direct Checkout Portal</h3>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  Track orders, verify payment status, and inspect gateway settlement receipts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border">
                <Link to="/user/payments">
                  <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Open Portal
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Transaction Receipts Card */}
            <Card className="p-5 bg-white border border-brand-border hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                  <Receipt className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-brand-navy text-base">Invoices & Receipts</h3>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  View complete service history, download operator receipts, and verify transaction statuses.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border">
                <Link to="/user/transactions">
                  <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View History
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-brand-blue" />
              <h3 className="text-sm font-bold text-brand-navy">Recent Service Orders</h3>
            </div>
            <Link to="/user/transactions" className="text-xs text-[#027da8] font-semibold hover:underline">
              View All Invoices →
            </Link>
          </div>

          <Table
            columns={transactionColumns}
            data={recentTransactions}
            isLoading={isLoading}
            emptyMessage="No recent service orders found. Use Recharge or BBPS to create a transaction."
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default UserDashboardPage;
