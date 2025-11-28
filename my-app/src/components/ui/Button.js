import React from "react";

export function Button({ children, className, variant, size, ...props }) {
  let base = "px-4 py-2 rounded ";
  if (variant === "link") base += "underline text-blue-600 ";
  if (size === "sm") base += "text-sm ";
  return (
    <button className={base + (className || "")} {...props}>
      {children}
    </button>
  );
}
