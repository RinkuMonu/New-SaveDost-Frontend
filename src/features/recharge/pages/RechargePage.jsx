import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Tv,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Zap,
} from "lucide-react";
import { PageContainer, Card, Badge, Button, Input } from "../../../components/common";
import rechargeService from "../services/rechargeService";
import { getErrorMessage } from "../../../utils/apiError";

export const RechargePage = () => {
  const [rechargeType, setRechargeType] = useState("mobile"); // mobile | dth
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("Jio");
  const [selectedCircle, setSelectedCircle] = useState("Delhi NCR");
  const [amount, setAmount] = useState("");
  const [selectedPlanDesc, setSelectedPlanDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const samplePlans = [
    { id: "p1", amount: 199, validity: "28 Days", data: "1.5 GB/Day", desc: "Unlimited Voice + 100 SMS/day" },
    { id: "p2", amount: 299, validity: "28 Days", data: "2.0 GB/Day", desc: "Unlimited 5G Data + Disney+ Hotstar" },
    { id: "p3", amount: 666, validity: "84 Days", data: "1.5 GB/Day", desc: "Popular quarterly value pack" },
    { id: "p4", amount: 839, validity: "84 Days", data: "2.0 GB/Day", desc: "High-speed 5G + Prime Video Mobile" },
    { id: "p5", amount: 2999, validity: "365 Days", data: "2.5 GB/Day", desc: "Annual powerhouse pack" },
  ];

  const handlePlanSelect = (plan) => {
    setAmount(String(plan.amount));
    setSelectedPlanDesc(`${plan.desc} (${plan.validity})`);
  };

  const handleInitiateRecharge = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setOrderResult(null);

    if (rechargeType === "mobile" && mobileNumber.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage("Please enter or select a valid recharge amount.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await rechargeService.createRechargeOrder({
        mobile: mobileNumber,
        operator: selectedOperator,
        circle: selectedCircle,
        amount: numAmount,
        planDescription: selectedPlanDesc || `Prepaid Recharge ₹${numAmount}`,
      });

      setOrderResult(res.data || res);
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Failed to create recharge order."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer
      title="Mobile & DTH Recharge"
      subtitle="Instant prepaid mobile and DTH recharge via direct payment gateway checkout"
    >
      <div className="space-y-6">
        {/* Architecture Note */}
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start space-x-3 text-emerald-950 text-sm">
          <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <strong className="font-semibold">Direct Payment Checkout:</strong> When you initiate a recharge, SaveDost generates an authoritative Service Order and directs you to complete payment via UPI, Netbanking, or Debit/Credit card. No customer wallet balance is deducted.
          </div>
        </div>

        {/* Successful Order Prepared Card */}
        {orderResult && (
          <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 text-brand-navy space-y-3 animate-fadeIn">
            <div className="flex items-center space-x-2 text-emerald-600 font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <span>Service Order Created Successfully!</span>
            </div>
            <p className="text-xs text-brand-muted">
              Order ID: <strong className="font-mono text-brand-navy select-all break-all">{orderResult.serviceOrder?._id || orderResult.order_id || "ORD-" + Date.now()}</strong>
            </p>
            <p className="text-xs text-brand-muted">
              Payment Order Ref: <strong className="font-mono text-brand-navy select-all break-all">{orderResult.paymentOrder?._id || "PAY-" + Date.now()}</strong>
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
              <Link to="/user/payments" className="w-full sm:w-auto">
                <Button variant="primary" size="sm" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Proceed to Direct Gateway Checkout
                </Button>
              </Link>
              <Button variant="outline" size="sm" fullWidth onClick={() => setOrderResult(null)} className="sm:w-auto">
                Start Another Recharge
              </Button>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recharge Input Form */}
          <Card className="p-6 bg-white border border-brand-border lg:col-span-1 space-y-5">
            {/* Toggle Type */}
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setRechargeType("mobile")}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  rechargeType === "mobile" ? "bg-white text-brand-navy shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile</span>
              </button>
              <button
                type="button"
                onClick={() => setRechargeType("dth")}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  rechargeType === "dth" ? "bg-white text-brand-navy shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>DTH</span>
              </button>
            </div>

            <form onSubmit={handleInitiateRecharge} className="space-y-4">
              <div>
                <Input
                  label={rechargeType === "mobile" ? "Mobile Number" : "Subscriber / Smart Card ID"}
                  placeholder={rechargeType === "mobile" ? "Enter 10-digit number" : "Enter DTH subscriber ID"}
                  value={mobileNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setMobileNumber(rechargeType === "mobile" ? val.slice(0, 10) : val);
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1.5 uppercase tracking-wider">
                  Operator
                </label>
                <select
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm text-brand-navy bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                >
                  {rechargeType === "mobile" ? (
                    <>
                      <option value="Jio">Jio Prepaid</option>
                      <option value="Airtel">Airtel Prepaid</option>
                      <option value="Vi">Vodafone Idea (Vi)</option>
                      <option value="BSNL">BSNL Prepaid</option>
                    </>
                  ) : (
                    <>
                      <option value="Tata Play">Tata Play</option>
                      <option value="Airtel Digital TV">Airtel Digital TV</option>
                      <option value="Dish TV">Dish TV</option>
                      <option value="Sun Direct">Sun Direct</option>
                    </>
                  )}
                </select>
              </div>

              {rechargeType === "mobile" && (
                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5 uppercase tracking-wider">
                    Telecom Circle
                  </label>
                  <select
                    value={selectedCircle}
                    onChange={(e) => setSelectedCircle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm text-brand-navy bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  >
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Maharashtra & Goa">Maharashtra & Goa</option>
                    <option value="Uttar Pradesh (East)">Uttar Pradesh (East)</option>
                    <option value="Uttar Pradesh (West)">Uttar Pradesh (West)</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Bihar & Jharkhand">Bihar & Jharkhand</option>
                  </select>
                </div>
              )}

              <div>
                <Input
                  label="Recharge Amount (₹)"
                  placeholder="Select a plan or enter amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value.replace(/\D/g, ""));
                    setSelectedPlanDesc("");
                  }}
                  required
                />
                {selectedPlanDesc && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    Selected: {selectedPlanDesc}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading || !amount || !mobileNumber}
                leftIcon={<CreditCard className="w-4 h-4" />}
              >
                Proceed to Checkout (₹{amount || "0"})
              </Button>
            </form>
          </Card>

          {/* Browse Plans Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                  Available Plans for {selectedOperator}
                </h3>
                <p className="text-xs text-brand-muted">Select a pack to populate the recharge amount</p>
              </div>
              <Badge variant="primary" size="sm">
                Instant Processing
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {samplePlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => handlePlanSelect(plan)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    amount === String(plan.amount)
                      ? "border-[#027da8] bg-sky-50/50 shadow-sm ring-2 ring-[#027da8]/20"
                      : "border-brand-border bg-white hover:border-brand-blue/40 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-black text-brand-navy">₹{plan.amount}</span>
                    <Badge variant="success" size="sm">
                      {plan.validity}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="font-semibold text-brand-blue flex items-center space-x-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{plan.data}</span>
                    </div>
                    <p className="text-brand-muted">{plan.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default RechargePage;
