import React from "react";
import { ShoppingCart } from "lucide-react";

export const MobileCartButton = ({ orderItemsCount, orderTotal, setShowConfirmation }) => {
  if (orderItemsCount === 0) return null;

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xs px-4">
      <button
        onClick={() => setShowConfirmation(true)}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center space-x-2 text-lg transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        <span>Submit Order</span>
        <span className="ml-2 text-base font-bold"> €{orderTotal}</span>
      </button>
    </div>
  );
};
