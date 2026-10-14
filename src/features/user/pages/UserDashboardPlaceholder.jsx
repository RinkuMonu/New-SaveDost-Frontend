import React from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Zap,
  Receipt,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../../app/providers/AuthContext";
import { Card, Badge, Button } from "../../../components/common";

export const UserDashboardPlaceholder = () => {
  const { user, role } = useAuth();

  return (
    <div className="space-y-6">
      {/* Banner Notice */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start space-x-3 text-emerald-900 dark:text-emerald-200 text-sm">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
        <div>
          <strong className="font-semibold">Direct Payment Gateway Architecture Active:</strong> You are logged in as a <strong>USER</strong>. In accordance with SaveDost architecture, all consumer utility services process seamlessly via direct checkout (UPI, Netbanking, Cards) without any personal wallet balance requirement.
        </div>
      </div>

      {/* Customer Account Profile Card */}
      <Card title="Consumer Account Profile" padding="md" className="border-[#E2EEF5] dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Customer Name</span>
            <span className="font-bold text-slate-900 dark:text-white text-base">{user?.name || "Customer User"}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Registered Mobile</span>
            <span className="font-semibold text-slate-900 dark:text-white">{user?.mobile || user?.mobileNumber || "N/A"}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Payment Architecture</span>
            <div className="mt-0.5">
              <Badge variant="success" size="sm">Direct Gateway Checkout</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Services Preview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E2EEF5] dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Mobile Recharge</span>
            <Smartphone className="w-4 h-4 text-brand-blue" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">Instant</p>
          <span className="text-[11px] text-brand-blue font-semibold mt-1 inline-flex items-center">
            All Telecom Circles
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E2EEF5] dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>BBPS Bill Pay</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">Verified</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-flex items-center">
            Bharat BillPay Network
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E2EEF5] dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Payment Modes</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">UPI & Cards</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-flex items-center">
            Zero Wallet Hassles
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E2EEF5] dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Account Security</span>
            <ShieldCheck className="w-4 h-4 text-brand-blue" />
          </div>
          <p className="text-2xl font-black text-brand-blue mt-2">Protected</p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            Role: {role}
          </span>
        </div>
      </div>

      {/* Consumer Services Navigation Cards */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          Available Utility Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow border-[#E2EEF5] dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-2 text-brand-blue">
              <Smartphone className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Mobile & DTH Recharge</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Prepaid mobile, postpaid bills, and DTH subscriptions with instant operator receipt generation.
            </p>
            <Link to="/user/recharge">
              <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Recharge Now
              </Button>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-[#E2EEF5] dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-2 text-amber-500">
              <Zap className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">BBPS Utility Bills</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Pay electricity, water, piped gas, broadband, and municipal taxes via Bharat BillPay.
            </p>
            <Link to="/user/bbps">
              <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Pay Bills
              </Button>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-[#E2EEF5] dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-2 text-emerald-600">
              <CreditCard className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Direct Checkout</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Integrated payment gateway supporting Google Pay, PhonePe, Paytm, and Netbanking.
            </p>
            <Link to="/user/payments">
              <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Checkout Portal
              </Button>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-[#E2EEF5] dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-2 text-purple-600">
              <Receipt className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Receipts & History</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              View transaction logs, check operator reference IDs, and download payment invoices.
            </p>
            <Link to="/user/transactions">
              <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Receipts
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPlaceholder;
