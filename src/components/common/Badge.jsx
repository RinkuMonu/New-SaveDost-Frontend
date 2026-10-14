import React from "react";

/**
 * Reusable Status Badge Component.
 *
 * @param {('primary'|'success'|'warning'|'error'|'neutral'|'navy')} variant
 * @param {('sm'|'md')} size
 * @param {boolean} dot - Renders a pulsating status dot
 */
const Badge = ({
  children,
  variant = "primary",
  size = "md",
  dot = false,
  className = "",
  ...props
}) => {
  const variantStyles = {
    primary: "bg-blue-50 text-brand-blue border-blue-200/60",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    warning: "bg-amber-50 text-amber-700 border-amber-200/60",
    error: "bg-rose-50 text-brand-error border-rose-200/60",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    navy: "bg-cyan-900/10 text-brand-navy border-brand-navy/20",
  };

  const dotColors = {
    primary: "bg-brand-blue",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-brand-error",
    neutral: "bg-slate-400",
    navy: "bg-brand-navy",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 font-medium",
    md: "text-xs px-2.5 py-1 font-semibold",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.primary}`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
