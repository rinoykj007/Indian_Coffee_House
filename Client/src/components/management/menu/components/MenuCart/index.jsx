import React from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";

export const MenuCart = ({
  orderItems,
  orderTotal,
  addToOrder,
  removeFromOrder,
  setShowConfirmation,
}) => {
  return (
    <div className="hidden lg:block w-full lg:w-1/3 xl:w-1/4">
      <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sticky top-4">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2 text-amber-600" />
          Selected Items
        </h2>

        {orderItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>Your order is empty.</p>
            <p className="text-sm mt-2">Add items from the menu.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
              {orderItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center bg-amber-50 p-2 rounded-lg border border-amber-100"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p
                      className="font-semibold text-slate-800 text-sm truncate"
                      title={item.name}
                    >
                      {item.name}
                    </p>
                    <p className="text-amber-600 font-bold text-sm">
                      €{item.price}
                    </p>
                  </div>
                  <div className="flex items-center bg-white rounded-md border border-slate-200">
                    <button
                      onClick={() => removeFromOrder(item._id)}
                      className="text-red-500 hover:bg-red-50 p-1.5 transition-colors rounded-l-md"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addToOrder(item)}
                      className="text-green-500 hover:bg-green-50 p-1.5 transition-colors rounded-r-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-amber-200 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4 text-lg">
                <span className="font-semibold text-slate-600">Total:</span>
                <span className="font-bold text-amber-600">€{orderTotal}</span>
              </div>
              <button
                onClick={() => setShowConfirmation(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-colors shadow-md"
              >
                Submit Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
