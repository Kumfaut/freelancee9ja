import React from "react";

export function Input(props) {
  return (
    <input
      className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-600"
      {...props}
    />
  );
}
