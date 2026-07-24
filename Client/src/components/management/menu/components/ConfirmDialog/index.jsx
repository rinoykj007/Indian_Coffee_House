import React from "react";
import { ShoppingCart, Loader2 } from "lucide-react";

export const ConfirmDialog = ({
  show,
  tableInfo,
  orderItems,
  orderTotal,
  submitOrder,
  isSubmitting,
  onClose,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl transform transition-all overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center justify-center">
          <ShoppingCart className="w-6 h-6 mr-2 text-amber-600" />
          Confirm Order
        </h2>
        <p className="text-slate-500 text-center mb-6">
          Table {tableInfo?.tableNumber || "Unknown"}
        </p>

        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 max-h-64 overflow-y-auto">
          <div className="space-y-3">
            {orderItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-semibold text-slate-700 truncate">
                    {item.name}
                  </p>
                  <p className="text-slate-500">
                    €{item.price} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-slate-800">
                  €{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 mt-4 pt-3 flex justify-between items-center">
            <span className="font-semibold text-slate-600">Total:</span>
            <span className="text-xl font-bold text-amber-600">
              €{orderTotal}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => submitOrder(true)}
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-3.5 rounded-xl transition-colors shadow-md text-lg flex items-center justify-center ${
              isSubmitting
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 shadow-green-200"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm & Pay"
            )}
          </button>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className={`flex-1 font-medium py-3 rounded-xl transition-colors ${
                isSubmitting
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={() => submitOrder(false)}
              disabled={isSubmitting}
              className={`flex-1 text-white font-bold py-3 rounded-xl transition-colors shadow-md ${
                isSubmitting
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-600 shadow-amber-200"
              }`}
            >
              {isSubmitting ? "Processing..." : "Confirm Only"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
