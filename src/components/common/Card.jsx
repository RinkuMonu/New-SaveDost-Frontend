import React from "react";

/**
 * Reusable Card Surface Component.
 */
const Card = ({
  children,
  className = "",
  hover = false,
  padding = "md",
  ...props
}) => {
  const paddingMap = {
    none: "p-0",
    sm: "p-4",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  return (
    <div
      className={`
        bg-brand-card border border-brand-border rounded-2xl shadow-card
        ${hover ? "transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5" : ""}
        ${paddingMap[padding] || paddingMap.md}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "", action }) => {
  return (
    <div className={`flex items-center justify-between pb-4 mb-4 border-b border-brand-border ${className}`}>
      <div>{children}</div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </div>
  );
};

const CardTitle = ({ children, className = "" }) => {
  return (
    <h3 className={`text-lg font-bold text-brand-navy tracking-tight ${className}`}>
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className = "" }) => {
  return (
    <p className={`text-xs sm:text-sm text-brand-muted mt-0.5 ${className}`}>
      {children}
    </p>
  );
};

const CardBody = ({ children, className = "" }) => {
  return <div className={`text-sm text-brand-navy ${className}`}>{children}</div>;
};

const CardFooter = ({ children, className = "" }) => {
  return (
    <div className={`pt-4 mt-4 border-t border-brand-border flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
