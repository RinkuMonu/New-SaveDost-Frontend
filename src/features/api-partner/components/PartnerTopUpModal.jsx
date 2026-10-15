import React, { useState } from "react";
import { AlertCircle, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Modal, Button } from "../../../components/common";
import partnerWalletService from "../services/partnerWalletService";
import { getErrorMessage } from "../../../utils/apiError";

/**
 * Partner Wallet Top-Up / Pre-funding Request Modal
 * Enforces financial integrity and duplicate submission protection.
 */
export const PartnerTopUpModal = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const quickAmounts = [1000, 5000, 10000, 25000, 50000];

  const handleQuickSelect = (val) => {
    setAmount(String(val));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const parsedAmount = Number(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Please enter a valid funding amount greater than ₹0.");
      return;
    }

    if (parsedAmount > 1000000) {
      setErrorMessage("Maximum single funding limit is ₹10,00,000.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        amount: parsedAmount,
        description: description.trim() || `API Partner Wallet Top-up (₹${parsedAmount})`,
      };

      const res = await partnerWalletService.requestWalletCredit(payload);

      // Financial rule: Balance is refreshed directly from backend via onSuccess callback
      onSuccess(res.message || "Wallet funding request submitted successfully.");
      setAmount("");
      setDescription("");
      onClose();
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Failed to submit wallet funding request."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="B2B Wallet Funding Request"
      description="Request pre-funding balance for automated API service settlements"
      maxWidth="max-w-lg"
      footer={
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            onClick={handleSubmit}
            leftIcon={<ArrowUpRight className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Submit Funding Request
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMessage && (
          <div className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Security & Integrity Notice */}
        <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-brand-navy">
          <ShieldCheck className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-brand-navy">Authoritative Financial Processing</p>
            <p className="text-brand-muted mt-0.5">
              Wallet balances are updated strictly upon backend settlement confirmation. Under backend specification, direct balance crediting (/wallet/credit) is an Admin/Testing privileged adjustment. Ordinary partner self-credit is subject to backend authorization.
            </p>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5">
            Funding Amount (₹) <span className="text-brand-error">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-sm">
              ₹
            </span>
            <input
              type="number"
              min="1"
              max="1000000"
              step="any"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrorMessage("");
              }}
              placeholder="Enter amount (e.g. 10000)"
              disabled={isSubmitting}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-brand-border text-base font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              required
            />
          </div>
        </div>

        {/* Quick Amount Pills */}
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Quick Select
          </span>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {quickAmounts.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickSelect(val)}
                className={`px-3 py-1 text-xs rounded-lg font-semibold border transition-all ${
                  amount === String(val)
                    ? "bg-brand-blue text-white border-brand-blue shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-brand-blue/40 hover:bg-slate-50"
                }`}
              >
                ₹{val.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
        </div>

        {/* Description / Remarks */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5">
            Reference Note / Remarks (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Monthly API quota prefund, Settlement adjustment"
            disabled={isSubmitting}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
      </form>
    </Modal>
  );
};

export default PartnerTopUpModal;
