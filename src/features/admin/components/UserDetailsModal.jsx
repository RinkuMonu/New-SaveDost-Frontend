import React from "react";
import {
  Phone,
  Mail,
  Shield,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Edit2,
  Power,
} from "lucide-react";
import { Modal, Badge, Button } from "../../../components/common";
import { ROLES } from "../../../utils/constants";

export const UserDetailsModal = ({
  isOpen,
  onClose,
  user,
  onEdit,
  onChangeStatus,
  onResetPassword,
}) => {
  if (!user) return null;

  const getRoleVariant = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return "navy";
      case ROLES.API_PARTNER:
        return "warning";
      case ROLES.USER:
      default:
        return "primary";
    }
  };

  const isUserActive =
    user.isActive === true ||
    user.status === "Active" ||
    user.status === "ACTIVE";

  const kycState = user.isKYC || user.kycStatus || (user.isKycVerified ? "Approved" : "Pending");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Profile & Verification"
      description="Inspect account identity, KYC standing, and administrative actions"
      maxWidth="max-w-2xl"
      footer={
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full">
          <Button variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              onClick={() => {
                onClose();
                onEdit(user);
              }}
              className="w-full sm:w-auto"
            >
              Edit Profile
            </Button>
            <Button
              variant={isUserActive ? "danger" : "primary"}
              size="sm"
              leftIcon={<Power className="w-3.5 h-3.5" />}
              onClick={() => {
                onClose();
                onChangeStatus(user);
              }}
              className="w-full sm:w-auto"
            >
              {isUserActive ? "Deactivate User" : "Activate User"}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Profile Header Summary */}
        <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#F5FBFF] border border-[#E2EEF5]">
          <div className="w-14 h-14 rounded-2xl bg-brand-blue text-white flex items-center justify-center font-bold text-xl shadow-md shadow-brand-blue/20 flex-shrink-0">
            {(user.name?.charAt(0) || "U").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-bold text-slate-900 truncate">
                {user.name || "Customer User"}
              </h4>
              <Badge variant={getRoleVariant(user.role)} size="sm">
                {user.role}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              User ID: <span className="font-mono text-slate-700">{user._id || user.id || "N/A"}</span>
            </p>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                isUserActive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {isUserActive ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" /> Inactive
                </>
              )}
            </span>
          </div>
        </div>

        {/* Detailed Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
              <Phone className="w-3.5 h-3.5 text-brand-blue" />
              <span>Mobile Number</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {user.mobile || user.mobileNumber || "N/A"}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
              <Mail className="w-3.5 h-3.5 text-brand-blue" />
              <span>Email Address</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user.email || "N/A"}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>KYC Status</span>
            </div>
            <div className="mt-0.5">
              <span
                className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-md ${
                  kycState === "Approved" || user.isKycVerified
                    ? "bg-emerald-50 text-emerald-700"
                    : kycState === "Pending"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {String(kycState)}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Registration Date</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Standard"}
            </p>
          </div>
        </div>

        {/* Password Reset Trigger */}
        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Administrative credential override available if customer lost access</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onResetPassword(user);
            }}
            className="font-bold text-amber-700 hover:text-amber-900 hover:underline ml-2 whitespace-nowrap"
          >
            Reset Password
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
