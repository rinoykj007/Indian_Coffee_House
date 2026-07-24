import React from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import logo from "../../../logo.png"; // Ensure this path correctly resolves to the logo file

export const MenuHeader = ({
  navigate,
  tableInfo,
  orderItemsCount,
  orderTotal,
  setShowConfirmation,
}) => {
  return (
    <div className="bg-white shadow-sm border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/management/staff")}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Tables</span>
            </button>
            <div className="h-6 w-px bg-slate-300"></div>
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Logo" className="w-5 h-5" />
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  Table {tableInfo?.tableNumber || "Unknown"}
                </h1>
              </div>
            </div>
          </div>

          {/* Show summary and button only on md and up, all info inside button */}
          {orderItemsCount > 0 && (
            <div className="hidden md:flex items-center justify-end text-right">
              <button
                onClick={() => setShowConfirmation(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-4 text-lg"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Submit Order</span>
                <span className="text-sm font-semibold bg-white text-green-700 rounded px-2 py-1 ml-2">
                  {orderItemsCount} items
                </span>
                <span className="text-base font-bold ml-2 text-amber-300">
                  €{orderTotal}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
