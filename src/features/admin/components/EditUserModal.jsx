import React, { useState, useEffect } from "react";
import { User, Mail } from "lucide-react";
import { Modal, Button, Input } from "../../../components/common";
import adminUserService from "../services/adminUserService";
import { getErrorMessage } from "../../../utils/apiError";

export const EditUserModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
      setErrorMessage("");
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("User full name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await adminUserService.updateUser(user._id || user.id, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
      });

      onSuccess(res.data || { ...user, ...formData });
      onClose();
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Failed to update user profile."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User Profile"
      description={`Update permitted profile information for ${user.mobile || user.mobileNumber}`}
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center justify-end space-x-2 w-full">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" isLoading={isSubmitting} onClick={handleSubmit}>
            Save Changes
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
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            leftIcon={<User className="w-4 h-4 text-slate-400" />}
            required
          />
        </div>

        <div>
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="text-[11px] text-slate-400">
          Mobile Number (<span className="font-mono">{user.mobile || user.mobileNumber}</span>) and Role (<span className="font-semibold">{user.role}</span>) are system immutable identifiers.
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
