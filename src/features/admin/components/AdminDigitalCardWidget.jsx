import React from "react";
import { Plus, Coins, Lock } from "lucide-react";

/**
 * Admin Digital Virtual Card & Sub-Stat Metrics Widget
 * Reproduces the right-column card and metrics from the reference screenshot
 * using SaveDost's brand aesthetic and live platform telemetry.
 */
export const AdminDigitalCardWidget = ({
  balance = 50000.0,
  payinIncome = 10106.0,
  lienHold = 0.0,
  cardHolder = "SAVEDOST ADMIN",
  lastUpdated = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }),
}) => {
  const formatINR = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="space-y-4">
      {/* Widget Header with Card Title & Quick Action */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#0C3D4C]">
          Card
        </h3>
        <button
          type="button"
          title="Virtual Gateway Settings"
          className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Modern Virtual Card (SaveDost Navy-to-Blue Palette) */}
      <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-[#0C3D4C] via-[#0D4B5E] to-[#018EDE] text-white shadow-xl shadow-brand-navy/15">
        {/* Subtle decorative radial glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-cyan-400/15 rounded-full blur-xl pointer-events-none" />

        {/* Card Top Row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2 text-cyan-200/90 text-sm font-medium tracking-wide">
            <span className="tracking-widest">••••</span>
            <span className="text-xs uppercase font-mono">atin</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="font-heading font-black text-sm tracking-tight text-white">
              Save<span className="text-cyan-300">Dost</span>
            </span>
          </div>
        </div>

        {/* Card Middle Balance */}
        <div className="mb-8">
          <span className="text-xs font-medium text-cyan-100/70 block uppercase tracking-wider mb-1">
            Settlement Gateway Balance
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {formatINR(balance)}
          </div>
        </div>

        {/* Card Footer Row */}
        <div className="flex items-end justify-between pt-2 border-t border-white/15 text-[11px]">
          <div>
            <span className="text-cyan-200/70 font-semibold uppercase tracking-wider block text-[9px]">
              Card Holder
            </span>
            <span className="font-bold tracking-wider">{cardHolder}</span>
          </div>

          <div className="text-right">
            <span className="text-cyan-200/70 font-semibold uppercase tracking-wider block text-[9px]">
              Updated
            </span>
            <span className="font-bold tracking-wider">{lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Sub-Stat Metric 1: Total income (payin) */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2EEF5] shadow-sm flex items-center space-x-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
          <Coins className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-medium text-slate-500 block truncate">
            Total income (payin)
          </span>
          <span className="text-lg font-bold text-brand-navy">
            {formatINR(payinIncome)}
          </span>
        </div>
      </div>

      {/* Sub-Stat Metric 2: Lien hold */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2EEF5] shadow-sm flex items-center space-x-4">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
          <Lock className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-medium text-slate-500 block truncate">
            Lien hold
          </span>
          <span className="text-lg font-bold text-brand-navy">
            {formatINR(lienHold)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminDigitalCardWidget;
