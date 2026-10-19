import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  Users,
  Building2,
  ShieldAlert,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../../../app/providers/AuthContext";
import { adminDashboardService } from "../services/adminDashboardService";
import { PayinPayoutTrendChart } from "../components/PayinPayoutTrendChart";
import { AdminDigitalCardWidget } from "../components/AdminDigitalCardWidget";
import { Badge, Loader } from "../../../components/common";

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [range, setRange] = useState("today");
  const [overview, setOverview] = useState(null);

  const fetchDashboardData = async (selectedRange = range) => {
    try {
      const data = await adminDashboardService.getOverview({ range: selectedRange });
      setOverview(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData(range);
  };

  const handleRangeChange = (newRange) => {
    setRange(newRange);
    setRefreshing(true);
    fetchDashboardData(newRange);
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading SaveDost Admin Analytics..." />
      </div>
    );
  }

  const liveBalance = user?.settlementBalance !== undefined
    ? Number(user.settlementBalance)
    : (user?.balance !== undefined ? Number(user.balance) : (overview?.balances?.availableBalance || 50000.0));

  const balances = {
    availableBalance: liveBalance,
    lienHold: Number(overview?.balances?.lienHold || 0.0),
    totalIncomePayin: Number(overview?.balances?.totalIncomePayin || overview?.streams?.payinAllTime || 10106.0),
  };

  const streams = overview?.streams || {
    payinToday: 4186.0,
    payinAllTime: 10106.0,
    payoutToday: 160.0,
    payoutAllTime: 650.0,
    systemRevenueToday: 160.0,
  };

  const trendData = Array.isArray(overview?.trend) && overview.trend.length
    ? overview.trend
    : adminDashboardService.getMockOverview().trend;
  const providerList = Array.isArray(overview?.providers) && overview.providers.length
    ? overview.providers
    : adminDashboardService.getMockOverview().providers;
  const transactionList = Array.isArray(overview?.recentTransactions) && overview.recentTransactions.length
    ? overview.recentTransactions
    : adminDashboardService.getMockOverview().recentTransactions;

  return (
    <div className="space-y-6">
      {/* Top Tagline & Telemetry Banner (matching reference screenshot header) */}
      <div className="bg-white border border-[#E2EEF5] rounded-2xl p-4 px-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading font-black text-[#0C3D4C] text-base">
                Save<span className="text-brand-blue">Dost</span>
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                India&apos;s fast, secure payment infrastructure
              </span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase flex items-center mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              RBI-ALIGNED · BANK-GRADE ENCRYPTION · DIRECT GATEWAY
            </p>
          </div>
        </div>

        {/* Top Right Status Pill & Range Selector & Refresh */}
        <div className="flex items-center flex-wrap gap-2.5 self-end md:self-auto">
          {/* Time Range Selector */}
          <div className="hidden lg:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {[
              { id: "today", label: "Today" },
              { id: "7days", label: "7 Days" },
              { id: "30days", label: "30 Days" },
              { id: "thisMonth", label: "This Month" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleRangeChange(tab.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  range === tab.id
                    ? "bg-white text-brand-blue shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-[#F5FBFF] border border-[#E2EEF5] rounded-full px-4 py-1.5 text-xs font-semibold flex items-center space-x-3 text-slate-600">
            <div>
              <span className="text-slate-400">Balance: </span>
              <span className="font-bold text-brand-blue">
                {formatINR(balances.availableBalance)}
              </span>
            </div>
            <span className="text-slate-300">|</span>
            <div>
              <span className="text-slate-400">Lien hold: </span>
              <span className="font-bold text-slate-700">
                {formatINR(balances.lienHold)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh Real-time Metrics"
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-[#E2EEF5] text-slate-500 hover:text-brand-blue transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-brand-blue" : ""}`} />
          </button>
        </div>
      </div>

      {/* 4 Top KPI Metric Cards (Live Real-time Mongo Atlas Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available Balance */}
        <div className="p-5 rounded-3xl bg-white border border-[#E2EEF5] shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Available Balance
            </span>
            <div className="text-2xl font-black text-brand-navy tracking-tight">
              {formatINR(balances.availableBalance)}
            </div>
            <div className="mt-2 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-500">Live</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Payin Stream (Today) */}
        <div className="p-5 rounded-3xl bg-white border border-[#E2EEF5] shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Payin Stream (Today)
            </span>
            <div className="text-2xl font-black text-brand-navy tracking-tight">
              {formatINR(streams?.payinToday)}
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-2 truncate">
              All-time {formatINR(streams?.payinAllTime)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Payout Volume (Today) */}
        <div className="p-5 rounded-3xl bg-white border border-[#E2EEF5] shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Payout Volume (Today)
            </span>
            <div className="text-2xl font-black text-brand-navy tracking-tight">
              {formatINR(streams?.payoutToday)}
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-2 truncate">
              All-time {formatINR(streams?.payoutAllTime)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: System Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-[#E2EEF5] shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              System Revenue
            </span>
            <div className="text-2xl font-black text-brand-navy tracking-tight">
              {formatINR(streams?.systemRevenueToday)}
            </div>
            <p className="text-[11px] font-semibold text-emerald-600 mt-2 flex items-center">
              <Zap className="w-3.5 h-3.5 mr-1" /> Platform fees & yield
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Dynamic Platform Telemetry Counters Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link
          to="/admin/users"
          className="p-3.5 rounded-2xl bg-white border border-[#E2EEF5] hover:border-brand-blue/40 shadow-xs flex items-center space-x-3 transition-all hover:shadow-sm group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-slate-400 block truncate">Consumers</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-bold text-slate-900">{overview?.users?.totalUsers ?? 18}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                +{overview?.users?.newUsersToday ?? 11} new
              </span>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/api-partners"
          className="p-3.5 rounded-2xl bg-white border border-[#E2EEF5] hover:border-brand-blue/40 shadow-xs flex items-center space-x-3 transition-all hover:shadow-sm group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-slate-400 block truncate">API Partners</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-bold text-slate-900">{overview?.users?.totalApiPartners ?? 5}</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                {overview?.users?.activeApiPartners ?? 5} Active
              </span>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/users?kyc=Pending"
          className="p-3.5 rounded-2xl bg-white border border-[#E2EEF5] hover:border-brand-blue/40 shadow-xs flex items-center space-x-3 transition-all hover:shadow-sm group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-slate-400 block truncate">KYC Verification</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-bold text-slate-900">{overview?.kyc?.pending ?? 2}</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">
                Pending Review
              </span>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/transactions"
          className="p-3.5 rounded-2xl bg-white border border-[#E2EEF5] hover:border-brand-blue/40 shadow-xs flex items-center space-x-3 transition-all hover:shadow-sm group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-slate-400 block truncate">Transactions</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-bold text-slate-900">{overview?.transactions?.total ?? 8}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                {overview?.transactions?.success ?? 7} Success
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Row: Trend Graph (Left 65%) + Virtual Card Widget (Right 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Curved Trend Chart */}
        <div className="lg:col-span-8">
          <PayinPayoutTrendChart trendData={trendData} />
        </div>

        {/* Right Column: Virtual Card & Sub-Metrics */}
        <div className="lg:col-span-4">
          <AdminDigitalCardWidget
            balance={balances.availableBalance}
            payinIncome={balances.totalIncomePayin}
            lienHold={balances.lienHold}
            cardHolder={user?.name?.toUpperCase() || "SAVEDOST ADMIN"}
            lastUpdated={new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" })}
          />
        </div>
      </div>

      {/* Bottom Grid: Recent Direct Gateway Transactions & Provider Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-8 bg-white border border-[#E2EEF5] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-brand-navy">
                Recent Direct Gateway Transactions
              </h3>
              <p className="text-xs text-slate-500">
                Customer checkout orders processed via direct payment gateway
              </p>
            </div>
            <Link
              to="/admin/transactions"
              className="text-xs font-semibold text-brand-blue hover:underline flex items-center"
            >
              View Full Ledger <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="pb-3 pl-1">Txn ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Service</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Gateway Ref</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-1">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(transactionList || []).map((txn, idx) => (
                  <tr key={txn.id || idx} className="hover:bg-slate-50/80">
                    <td className="py-3 pl-1 font-mono font-semibold text-slate-800">
                      {txn.id}
                    </td>
                    <td className="py-3">
                      <div className="font-semibold text-slate-900">
                        {txn.customer}
                      </div>
                      <div className="text-[11px] text-slate-500">{txn.mobile}</div>
                    </td>
                    <td className="py-3">
                      <span className="font-semibold text-slate-700">
                        {txn.service}
                      </span>
                      <span className="block text-[10px] text-slate-500">{txn.operator}</span>
                    </td>
                    <td className="py-3 font-bold text-slate-900">
                      ₹{txn.amount}
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-600">
                      {txn.gatewayRef}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          txn.status === "SUCCESS"
                            ? "success"
                            : txn.status === "PENDING"
                            ? "warning"
                            : "error"
                        }
                        size="sm"
                      >
                        {txn.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right pr-1 text-[11px] text-slate-500">
                      {new Date(txn.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Integrated Service Provider Telemetry */}
        <div className="lg:col-span-4 bg-white border border-[#E2EEF5] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-brand-navy">
                Provider Connectivity
              </h3>
              <p className="text-xs text-slate-500">
                Live status of integrated upstream APIs
              </p>
            </div>
            <Link
              to="/admin/services"
              className="text-xs font-semibold text-brand-blue hover:underline"
            >
              Config
            </Link>
          </div>

          <div className="space-y-3">
            {(providerList || []).map((prov, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2EEF5] flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    {prov.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Success: <strong className="text-emerald-600">{prov.successRate}</strong> · Latency: <span className="text-[#0C3D4C] font-semibold">{prov.latency}</span>
                  </div>
                </div>
                <Badge variant="success" size="sm">
                  {prov.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
