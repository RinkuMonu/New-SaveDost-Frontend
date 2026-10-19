import React, { useState } from "react";
import { Settings, Save } from "lucide-react";
import { Card, Button } from "../../../components/common";
import Swal from "sweetalert2";

export const SystemSettingsPage = () => {
  const [settings, setSettings] = useState({
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    directGatewayProvider: "ZAAKPAY",
    webhookCallbackUrl: "https://server.finuniques.in/api/v1/payment/payin/callback",
    maintenanceMode: false,
    requireKycForLargePayments: true,
    kycThresholdAmount: 50000,
    smsAlertsEnabled: true,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Swal.fire({
        title: "Settings Saved",
        text: "Platform configuration updated successfully across all cluster nodes.",
        icon: "success",
        confirmButtonColor: "#018EDE",
      });
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0C3D4C] flex items-center">
          <Settings className="w-6 h-6 mr-2 text-brand-blue" />
          System Settings & Platform Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure security policies, payment gateway routing parameters, and administrative controls.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Security & Access Policies */}
        <Card title="Security & Authentication Policies" padding="md" className="border-[#E2EEF5] shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Admin Session Timeout (Minutes)
              </label>
              <input
                type="number"
                value={settings.sessionTimeoutMinutes}
                onChange={(e) =>
                  setSettings({ ...settings, sessionTimeoutMinutes: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue text-slate-800"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Automatic logout for inactive administrative sessions
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Max Login Attempt Lockout
              </label>
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) =>
                  setSettings({ ...settings, maxLoginAttempts: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue text-slate-800"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Account locked after consecutive failed OTP or password attempts
              </span>
            </div>
          </div>
        </Card>

        {/* Direct Payment Gateway Configurations */}
        <Card title="Direct Payment Gateway Routing" padding="md" className="border-[#E2EEF5] shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Primary Payment Gateway
              </label>
              <select
                value={settings.directGatewayProvider}
                onChange={(e) =>
                  setSettings({ ...settings, directGatewayProvider: e.target.value })
                }
                className="w-full sm:w-1/2 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue font-semibold text-brand-navy"
              >
                <option value="ZAAKPAY">Zaakpay Direct Gateway (Active Primary)</option>
                <option value="PAYTM">Paytm PG Fallback</option>
                <option value="CASHFREE">Cashfree Payments</option>
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Routes all customer utility, mobile recharge, and BBPS checkouts directly
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Webhook Callback Endpoint
              </label>
              <input
                type="text"
                value={settings.webhookCallbackUrl}
                onChange={(e) =>
                  setSettings({ ...settings, webhookCallbackUrl: e.target.value })
                }
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue text-slate-800"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Target URL for payment notifications and webhook events
              </span>
            </div>
          </div>
        </Card>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="md" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving Changes..." : "Save Configuration"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettingsPage;
