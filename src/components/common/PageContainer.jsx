import React from "react";

/**
 * Reusable Page Container Layout Component.
 */
const PageContainer = ({
  children,
  title,
  subtitle,
  action,
  maxWidth = "max-w-7xl",
  className = "",
}) => {
  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 ${maxWidth} ${className}`}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-brand-border">
          <div>
            {title && (
              <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm sm:text-base text-brand-muted mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {children}
    </div>
  );
};

export default PageContainer;
