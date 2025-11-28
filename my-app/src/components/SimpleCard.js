import React from "react";

export function SimpleCard({ children, className = "", ...rest }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm overflow-hidden ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SimpleCardContent({ children, className = "", ...rest }) {
  return (
    <div className={`px-4 py-6 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export default SimpleCard;
