import React from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Hash,
  Info,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { Modal, Button, Badge } from "../../../components/common";

/**
 * Transaction Details Modal for API Partner Wallet
 * Displays detailed information about a single ledger entry.
 */
export const TransactionDetailsModal = ({ isOpen, onClose, transaction }) => {
  if (!transaction) return null;

  const isCredit =
    transaction.type === "credit" ||
    transaction.transactionType === "credit" ||
    transaction.type === "CREDIT";

  const amount = Number(transaction.amount || 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Success":
      case "SUCCESS":
        return { variant: "success", label: "Success", icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
      case "Pending":
      case "PENDING":
        return { variant: "warning", label: "Pending", icon: <Clock className="w-3.5 h-3.5" /> };
      case "Failed":
      case "FAILED":
        return { variant: "error", label: "Failed", icon: <XCircle className="w-3.5 h-3.5" /> };
      case "Refunded":
      case "REFUNDED":
        return { variant: "neutral", label: "Refunded", icon: <RotateCcw className="w-3.5 h-3.5" /> };
      default:
        return { variant: "primary", label: status || "Completed", icon: <Info className="w-3.5 h-3.5" /> };
    }
  };

  const statusMeta = getStatusBadge(transaction.status);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Wallet Ledger Details"
      description="Authoritative financial record and transaction metadata"
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center justify-end w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Header Amount Card */}
        <div className="text-center p-6 rounded-2xl bg-[#F5FBFF] border border-[#E2EEF5]">
          <div
            className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3 ${
              isCredit
                ? "bg-emerald-100 text-emerald-600"
                : "bg-rose-100 text-rose-600"
            }`}
          >
            {isCredit ? (
              <ArrowDownLeft className="w-6 h-6" />
            ) : (
              <ArrowUpRight className="w-6 h-6" />
            )}
          </div>

          <p className="text-xs uppercase tracking-wider font-semibold text-brand-muted">
            {isCredit ? "Wallet Credit / Inflow" : "Wallet Debit / Settlement"}
          </p>

          <p
            className={`text-2xl font-black mt-1 ${
              isCredit ? "text-emerald-600" : "text-brand-navy"
            }`}
          >
            {isCredit ? "+" : "-"} ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>

          <div className="flex items-center justify-center mt-3">
            <Badge variant={statusMeta.variant} size="sm">
              <span className="flex items-center space-x-1">
                {statusMeta.icon}
                <span>{statusMeta.label}</span>
              </span>
            </Badge>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-3 divide-y divide-slate-100 text-xs">
          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-500 flex items-center space-x-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <span>Reference ID</span>
            </span>
            <span className="font-mono font-semibold text-slate-800 select-all">
              {transaction.referenceId || transaction._id || transaction.id || "—"}
            </span>
          </div>

          {transaction.utr && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">UTR / Bank Ref</span>
              <span className="font-mono font-semibold text-slate-800">
                {transaction.utr}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-500 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Timestamp</span>
            </span>
            <span className="font-medium text-slate-800">
              {transaction.createdAt
                ? new Date(transaction.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "—"}
            </span>
          </div>

          {transaction.description && (
            <div className="flex flex-col pt-2 space-y-1">
              <span className="text-slate-500">Narration / Description</span>
              <span className="font-medium text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {transaction.description}
              </span>
            </div>
          )}

          {transaction.balanceAfter !== undefined && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Balance After Transaction</span>
              <span className="font-bold text-brand-navy">
                ₹{Number(transaction.balanceAfter).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetailsModal;
