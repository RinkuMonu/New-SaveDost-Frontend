import React from "react";
import Loader from "./Loader";

/**
 * Reusable Button Component adhering to SaveDost Tailwind Design Tokens.
 *
 * @param {('primary'|'secondary'|'outline'|'ghost'|'danger')} variant - Visual style variant
 * @param {('sm'|'md'|'lg')} size - Button size
 * @param {boolean} isLoading - Shows spinner and disables interaction
 * @param {boolean} disabled - Disables the button
 * @param {React.ReactNode} leftIcon - Optional icon rendered before label
 * @param {React.ReactNode} rightIcon - Optional icon rendered after label
 * @param {boolean} fullWidth - Takes up 100% of parent container width
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed select-none";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-5 py-3 gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-brand-blue hover:bg-brand-blue-hover text-white shadow-sm hover:shadow focus:ring-brand-blue disabled:bg-brand-blue/50 active:scale-[0.99]",
    secondary:
      "bg-brand-navy hover:bg-brand-navy-light text-white shadow-sm hover:shadow focus:ring-brand-navy disabled:bg-brand-navy/50 active:scale-[0.99]",
    outline:
      "bg-white border border-brand-border text-brand-navy hover:bg-brand-bg hover:border-brand-blue/40 focus:ring-brand-blue disabled:opacity-50",
    ghost:
      "bg-transparent text-brand-navy hover:bg-brand-bg hover:text-brand-blue focus:ring-brand-blue disabled:opacity-50",
    danger:
      "bg-brand-error hover:bg-red-600 text-white shadow-sm focus:ring-brand-error disabled:bg-brand-error/50 active:scale-[0.99]",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader size="sm" color={variant === "outline" || variant === "ghost" ? "blue" : "white"} />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
