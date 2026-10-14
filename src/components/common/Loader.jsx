import React from "react";

/**
 * Reusable Spinner/Loader Component.
 *
 * @param {('sm'|'md'|'lg')} size - Size of the spinner
 * @param {('blue'|'navy'|'white')} color - Color variant
 * @param {string} text - Optional accompanying text label
 */
const Loader = ({ size = "md", color = "blue", text, className = "" }) => {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
  };

  const colorMap = {
    blue: "border-brand-blue/30 border-t-brand-blue",
    navy: "border-brand-navy/30 border-t-brand-navy",
    white: "border-white/30 border-t-white",
  };

  return (
    <div className={`inline-flex items-center justify-center gap-2 ${className}`}>
      <div
        className={`
          ${sizeMap[size] || sizeMap.md}
          ${colorMap[color] || colorMap.blue}
          rounded-full animate-spin
        `}
        role="status"
        aria-label="loading"
      />
      {text && <span className="text-sm font-medium text-brand-muted">{text}</span>}
    </div>
  );
};

export default Loader;
