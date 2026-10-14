import React, { forwardRef } from "react";

/**
 * Reusable Form Input Component.
 *
 * @param {string} label - Input label
 * @param {string} error - Error message to display
 * @param {string} helperText - Descriptive helper note
 * @param {React.ReactNode} leftIcon - Leading icon inside input
 * @param {React.ReactNode} rightIcon - Trailing icon inside input
 * @param {boolean} fullWidth - 100% width
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = "",
      id,
      name,
      type = "text",
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`${fullWidth ? "w-full" : "inline-block"} ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5"
          >
            {label}
            {required && <span className="text-brand-error ml-1">*</span>}
          </label>
        )}

        <div className="relative rounded-xl shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            disabled={disabled}
            required={required}
            className={`
              block w-full rounded-xl border transition-colors duration-150 text-sm font-medium
              placeholder:text-slate-400 text-brand-navy bg-white
              ${leftIcon ? "pl-10" : "pl-3.5"}
              ${rightIcon ? "pr-10" : "pr-3.5"}
              py-2.5
              ${
                error
                  ? "border-brand-error focus:border-brand-error focus:ring-brand-error/20"
                  : "border-brand-border focus:border-brand-blue focus:ring-brand-blue/20"
              }
              focus:outline-none focus:ring-2
              disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            `}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="mt-1.5 text-xs text-brand-error font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-brand-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
