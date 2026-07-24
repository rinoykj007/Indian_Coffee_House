import React from "react";

export const TabButton = ({ active, label, onClick }) => (
  <button
    className={`py-2 px-4 font-medium text-sm ${
      active
        ? "border-b-2 border-amber-600 text-amber-600"
        : "text-slate-500 hover:text-slate-700"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);
