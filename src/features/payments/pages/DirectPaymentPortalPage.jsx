import React, { useState } from "react";
import {
  CreditCard,
  Search,
  AlertCircle,
  ShieldCheck,
  Hash,
  ExternalLink,
} from "lucide-react";
import { PageContainer, Card, Badge, Button, Input } from "../../../components/common";
import paymentService from "../services/paymentService";
import { getErrorMessage } from "../../../utils/apiError";

export const DirectPaymentPortalPage = () => {
  const [orderId, setOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setErrorMessage("");
    setPaymentResult(null);

    try {
      setIsSearching(true);
      const res = await paymentService.getPaymentStatus(orderId.trim());
      setPaymentResult(res.data || res);
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Payment order lookup failed. Check Order ID."));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <PageContainer
      title="Direct Payment Gateway Portal"
      subtitle="Authoritative payment tracking, gateway verification, and transaction status lookup"
    >
      <div className="space-y-6">
        {/* Architecture & Security Notice */}
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start space-x-3 text-emerald-950 text-sm">
          <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <strong className="font-semibold">Authoritative Payment Verification:</strong> In compliance with financial security standards, payment transactions are settled directly via the payment gateway and verified against the backend. No consumer wallet balance is maintained or deducted.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Status Lookup Card */}
          <Card className="p-6 bg-white border border-brand-border lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
              Payment Status Lookup
            </h3>
            <p className="text-xs text-brand-muted">
              Enter a Payment Order ID or Service Order ID to query the real-time settlement status from the gateway.
            </p>

            <form onSubmit={handleLookup} className="space-y-4">
              <Input
                label="Payment Order ID"
                placeholder="e.g. 67104b281f5c..."
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                leftIcon={<Hash className="w-4 h-4 text-slate-400" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isSearching}
                disabled={isSearching || !orderId.trim()}
                leftIcon={<Search className="w-4 h-4" />}
              >
                Inspect Payment Status
              </Button>
            </form>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
          </Card>

          {/* Details & Payment Gateways Information */}
          <div className="lg:col-span-2 space-y-4">
            {paymentResult ? (
              <Card className="p-6 bg-white border border-brand-border space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-brand-border">
                  <div>
                    <span className="text-xs text-brand-muted block">Order ID</span>
                    <strong className="font-mono text-brand-navy select-all break-all">
                      {paymentResult.orderId || paymentResult._id || orderId}
                    </strong>
                  </div>
                  <Badge
                    variant={
                      paymentResult.status === "Success" || paymentResult.status === "COMPLETED"
                        ? "success"
                        : paymentResult.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                    size="md"
                    dot
                  >
                    {paymentResult.status || "Pending Verification"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-brand-muted block">Payment Amount</span>
                    <strong className="text-brand-navy text-sm font-bold">
                      ₹{Number(paymentResult.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                  <div>
                    <span className="text-brand-muted block">Gateway Provider</span>
                    <strong className="text-brand-navy text-sm">
                      {paymentResult.gateway || "Zaakpay Direct"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-brand-muted block">Gateway Reference ID</span>
                    <strong className="font-mono text-brand-navy text-sm select-all break-all">
                      {paymentResult.gatewayRefId || paymentResult.referenceId || "—"}
                    </strong>
                  </div>
                </div>

                {paymentResult.paymentUrl && (
                  <div className="pt-2">
                    <a
                      href={paymentResult.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-blue text-white font-semibold text-xs hover:bg-brand-blue/90 transition-colors"
                    >
                      <span>Complete Checkout on Payment Gateway</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-8 bg-white border border-brand-border space-y-4">
                <div className="flex items-center space-x-3 text-brand-blue">
                  <CreditCard className="w-7 h-7" />
                  <div>
                    <h4 className="text-base font-bold text-brand-navy">Direct Payment Gateway Architecture</h4>
                    <p className="text-xs text-brand-muted">Standardized UPI, Cards, and Netbanking processing</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 leading-relaxed pt-2">
                  <p>
                    • <strong>Zero Customer Wallet:</strong> Retail consumers are never required to maintain or pre-load balances.
                  </p>
                  <p>
                    • <strong>Synchronous Verification:</strong> Every payment response is validated cryptographically against backend checkout records before service execution.
                  </p>
                  <p>
                    • <strong>Idempotency:</strong> Prevents duplicate transactions and verifies merchant order references.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default DirectPaymentPortalPage;
