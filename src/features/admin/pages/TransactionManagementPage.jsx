import React, { useEffect, useState, useCallback } from "react";
import {
  FileText,
  Search,
  Filter,
  Eye,
  CreditCard,
  Layers,
} from "lucide-react";
import { adminTransactionService } from "../services/adminTransactionService";
import { Card, Badge, Button, Modal, Loader } from "../../../components/common";

export const TransactionManagementPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [traceData, setTraceData] = useState(null);
  const [traceLoading, setTraceLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminTransactionService.getTransactions({
        search,
        status: statusFilter,
      });
      setTransactions(res.transactions || []);
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handleViewTrace = async (txn) => {
    setSelectedTxn(txn);
    setIsModalOpen(true);
    setTraceLoading(true);
    try {
      const trace = await adminTransactionService.getTransactionTrace(txn.transactionId || txn._id);
      setTraceData(trace);
    } catch (err) {
      console.error("Failed to fetch trace:", err);
    } finally {
      setTraceLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0C3D4C] flex items-center">
            <FileText className="w-6 h-6 mr-2 text-brand-blue" />
            Direct Gateway Transactions & Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete platform transaction ledger processed via direct payment gateway checkouts.
          </p>
        </div>

        <Badge variant="blue" size="md">
          {transactions.length} Records Loaded
        </Badge>
      </div>

      {/* Filter and Search Bar */}
      <Card padding="sm" className="border-[#E2EEF5] shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Txn ID, customer name, mobile, or gateway reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue font-medium text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>

            <Button type="submit" variant="primary" size="sm">
              Search
            </Button>
          </div>
        </form>
      </Card>

      {/* Transactions Table */}
      <Card padding="none" className="border-[#E2EEF5] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader size="md" text="Loading Transaction Ledger..." />
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <CreditCard className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-sm">No transaction records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Txn ID & Date</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Service & Provider</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Gateway Reference</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Lifecycle Trace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((txn) => (
                  <tr key={txn._id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">
                        {txn.transactionId}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(txn.createdAt).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {txn.customerName}
                      </div>
                      <div className="text-xs text-slate-500">{txn.mobile}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-brand-navy">
                        {txn.serviceName}
                      </div>
                      <div className="text-xs text-slate-500">{txn.operator}</div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{Number(txn.amount).toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      {txn.gatewayRef}
                    </td>

                    <td className="py-3.5 px-4">
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

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTrace(txn)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Trace
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Lifecycle Trace Modal */}
      {selectedTxn && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Lifecycle Audit: ${selectedTxn.transactionId}`}
          maxWidth="md"
        >
          {traceLoading ? (
            <div className="py-8 flex justify-center">
              <Loader size="md" text="Tracing transaction lifecycle..." />
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-xs uppercase font-semibold text-slate-500">Checkout Amount</span>
                  <span className="text-xl font-black text-brand-navy">
                    ₹{selectedTxn.amount}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Service</span>
                    <strong className="text-slate-800">{selectedTxn.serviceName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Operator</span>
                    <strong className="text-slate-800">{selectedTxn.operator}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Customer</span>
                    <strong className="text-slate-800">{selectedTxn.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Mobile</span>
                    <strong className="text-slate-800">{selectedTxn.mobile}</strong>
                  </div>
                </div>
              </div>

              {/* Step-by-step Audit Trail */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                  <Layers className="w-3.5 h-3.5 mr-1 text-brand-blue" />
                  Order & Gateway Audit Trail
                </h4>

                <div className="relative pl-6 space-y-4 border-l-2 border-brand-blue/30 ml-2">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                    <p className="font-bold text-xs text-slate-800">Customer Order Initialized</p>
                    <p className="text-[11px] text-slate-500">Direct payment gateway checkout created</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                    <p className="font-bold text-xs text-slate-800">Gateway Payment Captured</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Ref: {traceData?.gatewayReference || selectedTxn.gatewayRef}
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                    <p className="font-bold text-xs text-slate-800">Provider Fulfillment</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Ref: {traceData?.providerReference || "AERON_LIVE_DISPATCH"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default TransactionManagementPage;
