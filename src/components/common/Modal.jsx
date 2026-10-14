import React, { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Reusable Accessible Modal Dialog Component.
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "max-w-lg",
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-navy/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        role="dialog"
        aria-modal="true"
        className={`
          relative w-full ${maxWidth} bg-white rounded-2xl shadow-modal border border-brand-border
          overflow-hidden transform transition-all z-10 animate-in fade-in zoom-in-95 duration-150
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-brand-border">
          <div>
            {title && (
              <h3 className="text-lg font-bold text-brand-navy">{title}</h3>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-brand-muted mt-0.5">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 border-t border-brand-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
