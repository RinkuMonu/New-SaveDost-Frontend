import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Modal, Button, Input } from "../../../components/common";
import adminUserService from "../services/adminUserService";
import { getErrorMessage } from "../../../utils/apiError";

export const ResetPasswordModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      await adminUserService.resetUserPassword(user._id || user.id, newPassword);
      onSuccess();
      onClose();
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Failed to reset password."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset User Password"
      description={`Set a new login password for ${user.name || user.mobile}`}
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center justify-end space-x-2 w-full">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" isLoading={isSubmitting} onClick={handleSubmit}>
            Update Password
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {errorMessage}
          </div>
        )}

        <div>
          <Input
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            placeholder="Minimum 6 characters"
            required
          />
        </div>

        <p className="text-xs text-slate-500">
          The user will immediately need this new password to access SaveDost.
        </p>
      </form>
    </Modal>
  );
};

export default ResetPasswordModal;
