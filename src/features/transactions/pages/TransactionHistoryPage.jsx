import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Receipt,
  Search,
  RefreshCw,
  Eye,
  AlertCircle,
  Printer,
} from "lucide-react";
import { PageContainer, Card, Table, Badge, Button, Input, Modal } from "../../../components/common";
import userService from "../../user/services/userService";
import { getErrorMessage } from "../../../utils/apiError";

export const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await userService.getDashboardData();
      const list = res.data?.recentTransactions || res.recentTransactions || [];
      setTransactions(list);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load transaction history."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        !searchQuery ||
        (t.order_id && t.order_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.service_name && t.service_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.referenceId && t.referenceId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" ||
        (t.status && t.status.toLowerCase() === statusFilter.toLowerCase());

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  const handleOpenReceipt = (row) => {
    setSelectedReceipt(row);
    setIsReceiptOpen(true);
  };

  const columns = [
    {
      key: "id",
      title: "Order ID",
      render: (_, row) => (
        <span className="font-mono text-xs font-semibold text-brand-navy select-all">
          {row.order_id || row.referenceId || row._id || "—"}
        </span>
      ),
    },
    {
      key: "service",
      title: "Service",
      render: (_, row) => (
        <span className="text-xs font-semibold text-brand-navy">
          {row.service_name || row.service_code || row.service || "Utility Payment"}
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
        const st = row.status || row.paymentStatus || "Success";
        const isSuccess = st === "Success" || st === "SUCCESS" || st === "COMPLETED";
        return (
          <Badge variant={isSuccess ? "success" : "warning"} size="sm" dot>
            {st}
          </Badge>
        );
      },
    },
    {
      key: "createdAt",
      title: "Timestamp",
      render: (_, row) => (
        <span className="text-xs text-brand-muted">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Recent"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Receipt",
      align: "right",
      render: (_, row) => (
        <button
          type="button"
          onClick={() => handleOpenReceipt(row)}
          title="View Receipt"
          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-blue hover:bg-brand-blue/10 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <PageContainer
      title="Transaction Receipts & History"
      subtitle="Comprehensive audit trail of customer utility payments, recharge orders, and gateway references"
      actions={
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
          onClick={fetchTransactions}
          disabled={isLoading}
        >
          Refresh
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Error Notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchTransactions}>
              Retry
            </Button>
          </div>
        )}

        {/* Filter and Search Bar */}
        <Card className="p-4 border border-brand-border bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-80">
              <Input
                placeholder="Search by order ID or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto flex-1 sm:flex-initial h-[42px] px-3 rounded-xl border border-brand-border text-xs text-brand-navy bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>

              {(searchQuery || statusFilter !== "ALL") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                  }}
                  className="h-[42px] text-xs"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <Table
          columns={columns}
          data={filteredTransactions}
          isLoading={isLoading}
          emptyMessage="No transaction receipts matching your criteria."
        />
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          title="Payment Invoice & Receipt"
          description="Authoritative customer utility payment confirmation"
          maxWidth="max-w-md"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
              >
                Print Receipt
              </Button>
              <Button variant="primary" size="sm" onClick={() => setIsReceiptOpen(false)}>
                Done
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="text-center p-5 rounded-2xl bg-sky-50/60 border border-sky-100">
              <Receipt className="w-8 h-8 text-brand-blue mx-auto mb-2" />
              <p className="text-xs text-brand-muted uppercase tracking-wider">Amount Paid</p>
              <p className="text-3xl font-black text-brand-navy mt-0.5">
                ₹{Number(selectedReceipt.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <div className="mt-2">
                <Badge variant="success" size="sm">
                  {selectedReceipt.status || "Completed"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500 shrink-0">Order ID</span>
                <span className="font-mono font-bold text-slate-800 select-all break-all text-right ml-2">{selectedReceipt.order_id || selectedReceipt._id || "—"}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Service</span>
                <span className="font-semibold text-slate-800">{selectedReceipt.service_name || selectedReceipt.service_code || "Utility Service"}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Payment Gateway</span>
                <span className="font-semibold text-slate-800">Direct Gateway (Zaakpay)</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Date</span>
                <span className="font-medium text-slate-800">
                  {selectedReceipt.createdAt ? new Date(selectedReceipt.createdAt).toLocaleString("en-IN") : "Recent"}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};

export default TransactionHistoryPage;
