import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal, Button } from "../../../components/common";
import adminUserService from "../services/adminUserService";
import { getErrorMessage } from "../../../utils/apiError";

export const StatusChangeModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!user) return null;

  const currentIsActive =
    user.isActive === true ||
    user.status === "Active" ||
    user.status === "ACTIVE";

  const targetStatus = currentIsActive ? "Inactive" : "Active";

  const handleConfirm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      setIsSubmitting(true);
      await adminUserService.updateUserStatus(user._id || user.id, {
        status: targetStatus,
        remarks: remarks.trim() || `Status updated to ${targetStatus} by Administrator`,
      });

      onSuccess(targetStatus);
      onClose();
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Failed to update user status."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentIsActive ? "Deactivate User Account" : "Activate User Account"}
      description="Update account operational status and access permissions"
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center justify-end space-x-2 w-full">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant={currentIsActive ? "danger" : "primary"}
            size="sm"
            isLoading={isSubmitting}
            onClick={handleConfirm}
          >
            Confirm {targetStatus}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleConfirm} className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {errorMessage}
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start space-x-3 text-xs text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
          <p>
            You are changing status for{" "}
            <strong>{user.name || user.mobile}</strong> to{" "}
            <span className="font-bold uppercase tracking-wider">{targetStatus}</span>.
            {currentIsActive
              ? " The user will be immediately prevented from logging into utility and partner portals."
              : " The user will regain normal access to platform services."}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Administrative Remarks (Optional)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            placeholder="Reason for status change..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};

export default StatusChangeModal;
