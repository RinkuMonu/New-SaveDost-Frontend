import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Plus,
  Eye,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
} from "lucide-react";
import {
  PageContainer,
  Card,
  Table,
  Badge,
  Button,
} from "../../../components/common";
import partnerWalletService from "../services/partnerWalletService";
import { PartnerTopUpModal, TransactionDetailsModal } from "../components";
import { getErrorMessage } from "../../../utils/apiError";

/**
 * API Partner Dedicated Wallet Page
 * Exclusive to API_PARTNER role.
 * Displays authoritative balance, ledger transactions, and top-up requests.
 */
export const PartnerWalletPage = () => {
  // Wallet balance state
  const [balanceData, setBalanceData] = useState({
    balance: 0,
    currency: "INR",
    status: "Active",
  });
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);

  // Ledger state
  const [transactions, setTransactions] = useState([]);
  const [isLedgerLoading, setIsLedgerLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  // Pagination & filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal states
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Auto-dismiss toast
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  // Fetch wallet balance
  const fetchBalance = useCallback(async () => {
    setIsBalanceLoading(true);
    try {
      const res = await partnerWalletService.getWalletBalance();
      // Handle responses like { statusCode: 200, data: { balance: 15000 } } or { data: 15000 }
      const data = res.data;
      if (typeof data === "number") {
        setBalanceData({ balance: data, currency: "INR", status: "Active" });
      } else if (data && typeof data.balance === "number") {
        setBalanceData({
          balance: data.balance,
          currency: data.currency || "INR",
          status: data.status || "Active",
        });
      } else if (data && typeof data.walletBalance === "number") {
        setBalanceData({
          balance: data.walletBalance,
          currency: data.currency || "INR",
          status: data.status || "Active",
        });
      }
    } catch (err) {
      console.warn("Could not fetch real-time wallet balance:", err);
      // Retain previous or default state without crashing
    } finally {
      setIsBalanceLoading(false);
    }
  }, []);

  // Fetch transactions ledger
  const fetchLedger = useCallback(async () => {
    setIsLedgerLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit,
        type: typeFilter,
        status: statusFilter,
      };

      const res = await partnerWalletService.getWalletTransactions(params);
      const payload = res.data || {};
      const txList = Array.isArray(payload) ? payload : (payload.transactions || []);
      setTransactions(txList);
      setTotalTransactions(payload.totalTransactions !== undefined ? payload.totalTransactions : txList.length);
      setTotalPages(payload.totalPages || 1);
    } catch (err) {
      console.error("Failed to load wallet ledger:", err);
      setError(getErrorMessage(err, "Could not fetch wallet ledger transactions."));
      setTransactions([]);
    } finally {
      setIsLedgerLoading(false);
    }
  }, [currentPage, limit, typeFilter, statusFilter]);

  // Initial load
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  const handleRefreshAll = () => {
    fetchBalance();
    fetchLedger();
  };

  const handleTopUpSuccess = (msg) => {
    setSuccessToast(msg);
    // Refresh authoritative balance and ledger from backend
    fetchBalance();
    fetchLedger();
  };

  const handleOpenDetails = (row) => {
    setSelectedTransaction(row);
    setIsDetailsOpen(true);
  };

  const handleResetFilters = () => {
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setCurrentPage(1);
  };

  // Table columns definition
  const columns = useMemo(() => [
    {
      key: "referenceId",
      title: "Transaction ID / Ref",
      render: (val, row) => {
        const id = val || row._id || row.id || "—";
        return (
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-semibold text-brand-navy select-all">
              {id.length > 16 ? `${id.substring(0, 14)}...` : id}
            </span>
          </div>
        );
      },
    },
    {
      key: "type",
      title: "Type",
      align: "center",
      render: (val, row) => {
        const isCredit = val === "credit" || row.transactionType === "credit" || val === "CREDIT";
        return (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              isCredit
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                : "bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            {isCredit ? (
              <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
            ) : (
              <ArrowUpRight className="w-3 h-3 text-slate-500" />
            )}
            {isCredit ? "Credit" : "Debit"}
          </span>
        );
      },
    },
    {
      key: "amount",
      title: "Amount (₹)",
      align: "right",
      render: (val, row) => {
        const isCredit = row.type === "credit" || row.transactionType === "credit" || row.type === "CREDIT";
        const amt = Number(val || 0);
        return (
          <span
            className={`font-mono text-xs sm:text-sm font-bold ${
              isCredit ? "text-emerald-600" : "text-brand-navy"
            }`}
          >
            {isCredit ? "+" : "-"} ₹{amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      key: "status",
      title: "Status",
      align: "center",
      render: (status) => {
        switch (status) {
          case "Success":
          case "SUCCESS":
            return (
              <Badge variant="success" size="sm" dot>
                Success
              </Badge>
            );
          case "Pending":
          case "PENDING":
            return (
              <Badge variant="warning" size="sm">
                Pending
              </Badge>
            );
          case "Failed":
          case "FAILED":
            return (
              <Badge variant="error" size="sm">
                Failed
              </Badge>
            );
          case "Refunded":
          case "REFUNDED":
            return (
              <Badge variant="neutral" size="sm">
                Refunded
              </Badge>
            );
          default:
            return (
              <Badge variant="primary" size="sm">
                {status || "Success"}
              </Badge>
            );
        }
      },
    },
    {
      key: "description",
      title: "Narration / Service",
      render: (val) => (
        <span className="text-xs text-brand-muted truncate max-w-[200px] block" title={val}>
          {val || "API Service Settlement"}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: "Date & Time",
      render: (val) => (
        <span className="text-xs text-brand-muted whitespace-nowrap">
          {val
            ? new Date(val).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Details",
      align: "right",
      render: (_, row) => (
        <button
          type="button"
          onClick={() => handleOpenDetails(row)}
          title="Inspect Ledger Entry"
          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-blue hover:bg-brand-blue/10 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ], []);

  // Compute summary stats from current transactions
  const totalInflow = useMemo(() => {
    return transactions
      .filter((t) => t.type === "credit" || t.transactionType === "credit")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [transactions]);

  const totalOutflow = useMemo(() => {
    return transactions
      .filter((t) => t.type === "debit" || t.transactionType === "debit")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [transactions]);

  return (
    <PageContainer
      title="API Partner Dedicated Wallet"
      subtitle="B2B pre-funded balance for automated utility API operations and real-time ledger settlements"
      actions={
        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isBalanceLoading || isLedgerLoading ? "animate-spin" : ""}`} />}
            onClick={handleRefreshAll}
            disabled={isBalanceLoading || isLedgerLoading}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsTopUpOpen(true)}
          >
            Top Up Wallet
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Success Banner */}
        {successToast && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm shadow-sm transition-all animate-fadeIn">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">{successToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessToast(null)}
              className="text-emerald-600 hover:text-emerald-800 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefreshAll}>
              Retry
            </Button>
          </div>
        )}

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Primary Available Balance Card */}
          <Card className="p-5 md:col-span-2 bg-gradient-to-br from-[#0C3D4C] to-[#018EDE] text-white shadow-lg border-0 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
              <Wallet className="w-44 h-44 text-white" />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm border border-white/30">
                    B2B Dedicated Wallet
                  </span>
                  <span className="flex items-center space-x-1 text-xs text-white/80">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Authoritative</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={fetchBalance}
                  title="Refresh Balance"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isBalanceLoading ? "animate-spin" : ""}`} />
                </button>
              </div>

              <div className="my-4">
                <p className="text-xs uppercase tracking-wider text-white/80 font-medium">
                  Available Settlement Balance
                </p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    ₹{balanceData.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs uppercase text-white/70 font-semibold">
                    {balanceData.currency}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs text-white/80">
                <span>Account Status: <strong className="text-white font-bold">{balanceData.status}</strong></span>
                <button
                  type="button"
                  onClick={() => setIsTopUpOpen(true)}
                  className="inline-flex items-center space-x-1 font-bold text-white hover:underline focus:outline-none"
                >
                  <span>Request Top-Up</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Card>

          {/* Credits Metric Card */}
          <Card className="p-5 bg-white border border-brand-border flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Recent Inflows
              </p>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-emerald-600">
                +₹{totalInflow.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-brand-muted mt-0.5">
                Total credits in active view
              </p>
            </div>
          </Card>

          {/* Debits Metric Card */}
          <Card className="p-5 bg-white border border-brand-border flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Recent Outflows
              </p>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-brand-navy">
                -₹{totalOutflow.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-brand-muted mt-0.5">
                API executions & debits
              </p>
            </div>
          </Card>
        </div>

        {/* Ledger Filtering Toolbar */}
        <Card className="p-4 border border-brand-border bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-brand-blue" />
              <h3 className="text-sm font-bold text-brand-navy">Wallet Ledger Transactions</h3>
              <span className="text-xs text-brand-muted font-normal">
                ({totalTransactions} records)
              </span>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              {/* Type filter */}
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 px-3 rounded-xl border border-brand-border text-xs text-brand-navy bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 font-medium"
              >
                <option value="ALL">All Types</option>
                <option value="credit">Credits (Top-up/Inflow)</option>
                <option value="debit">Debits (API Usage)</option>
              </select>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 px-3 rounded-xl border border-brand-border text-xs text-brand-navy bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 text-xs"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Ledger Table */}
        <Table
          columns={columns}
          data={transactions}
          isLoading={isLedgerLoading}
          emptyMessage="No ledger transactions recorded for this wallet."
        />

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <div className="text-xs text-brand-muted">
            Showing{" "}
            <span className="font-semibold text-brand-navy">
              {totalTransactions === 0 ? 0 : (currentPage - 1) * limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-brand-navy">
              {Math.min(currentPage * limit, totalTransactions)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-brand-navy">{totalTransactions}</span> entries
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-brand-muted">
              <span>Per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded-lg border border-brand-border bg-white text-brand-navy font-semibold text-xs focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1 || isLedgerLoading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <span className="px-3 text-xs font-semibold text-brand-navy">
                Page {currentPage} of {Math.max(1, totalPages)}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages || isLedgerLoading}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Up Modal */}
      <PartnerTopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onSuccess={handleTopUpSuccess}
      />

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        transaction={selectedTransaction}
      />
    </PageContainer>
  );
};

export default PartnerWalletPage;
