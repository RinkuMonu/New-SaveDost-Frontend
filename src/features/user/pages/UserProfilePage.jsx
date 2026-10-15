import React, { useState, useEffect, useCallback } from "react";
import {
  Phone,
  Mail,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { useAuth } from "../../../app/providers/AuthContext";
import { PageContainer, Card, Badge, Button, Input } from "../../../components/common";
import userService from "../services/userService";
import { getErrorMessage } from "../../../utils/apiError";

export const UserProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user || {});
  const [loginHistory, setLoginHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const loadProfileAndHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const [profileRes, historyRes] = await Promise.allSettled([
        userService.getProfile(),
        userService.getLoginHistory(),
      ]);

      if (profileRes.status === "fulfilled") {
        setProfile(profileRes.value.data || user || {});
      }
      if (historyRes.status === "fulfilled") {
        setLoginHistory(historyRes.value.data || []);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfileAndHistory();
  }, [loadProfileAndHistory]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await userService.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      setSuccessMessage("Password updated successfully.");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Failed to update password. Check old password."));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <PageContainer
      title="My Account Profile"
      subtitle="Manage your personal contact details, security credentials, and review login activity"
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={loadProfileAndHistory}
          disabled={isLoading}
          isLoading={isLoading}
        >
          Refresh
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Success / Error Banners */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Identity & Account Info Card */}
          <Card className="p-6 bg-white border border-brand-border lg:col-span-1 space-y-5">
            <div className="flex items-center space-x-4 pb-4 border-b border-brand-border">
              <div className="w-14 h-14 rounded-2xl bg-[#027da8] text-white flex items-center justify-center font-bold text-xl shadow-md shadow-[#027da8]/20 shrink-0">
                {(profile.name?.charAt(0) || "U").toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-brand-navy truncate">{profile.name || "Customer User"}</h3>
                <Badge variant="primary" size="sm">
                  {profile.role || "USER"}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-brand-muted flex items-center space-x-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Mobile Number</span>
                </span>
                <strong className="text-brand-navy text-sm font-mono">{profile.mobile || profile.mobileNumber || "—"}</strong>
              </div>

              <div>
                <span className="text-brand-muted flex items-center space-x-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Email Address</span>
                </span>
                <strong className="text-brand-navy text-sm truncate block">{profile.email || "—"}</strong>
              </div>

              <div>
                <span className="text-brand-muted flex items-center space-x-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>KYC Standing</span>
                </span>
                <Badge variant={profile.isKycVerified || profile.isKYC === "Approved" ? "success" : "warning"} size="sm">
                  {profile.isKycVerified ? "Approved" : "Pending"}
                </Badge>
              </div>

              <div>
                <span className="text-brand-muted flex items-center space-x-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Member Since</span>
                </span>
                <strong className="text-brand-navy text-sm">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN") : "Standard Member"}
                </strong>
              </div>
            </div>
          </Card>

          {/* Change Password Form & Login History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Password Update Card */}
            <Card className="p-6 bg-white border border-brand-border space-y-4">
              <div className="flex items-center space-x-2 text-brand-navy">
                <KeyRound className="w-5 h-5 text-brand-blue" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Change Password</h3>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="Enter current password"
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, oldPassword: e.target.value }))}
                    required
                  />

                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Min 8 characters"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                    required
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    required
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isUpdatingPassword}
                    disabled={isUpdatingPassword || !passwordForm.oldPassword || !passwordForm.newPassword}
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>

            {/* Login Activity Card */}
            <Card className="p-6 bg-white border border-brand-border space-y-3">
              <div className="flex items-center space-x-2 text-brand-navy">
                <Clock className="w-5 h-5 text-brand-blue" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Recent Login Audit</h3>
              </div>

              {loginHistory.length > 0 ? (
                <div className="divide-y divide-slate-100 text-xs">
                  {loginHistory.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-brand-navy block">{item.device || item.userAgent || "Web Browser"}</span>
                        <span className="text-slate-400 text-[11px] font-mono">IP: {item.ip || "127.0.0.1"}</span>
                      </div>
                      <span className="text-slate-500">
                        {item.loginTime ? new Date(item.loginTime).toLocaleString("en-IN") : "Recent"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-brand-muted py-2">
                  Standard audit session active. Detailed IP logs recorded upon authentication.
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default UserProfilePage;
