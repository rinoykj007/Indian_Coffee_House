import React from "react";
import { Plus, Minus } from "lucide-react";

export const MenuCard = ({ item, quantity, addToOrder, removeFromOrder }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-slate-800">{item.name}</h3>
          <p className="text-lg font-bold text-amber-600 ml-4">€{item.price}</p>
        </div>

        <div className="flex items-center justify-between">
          {quantity === 0 ? (
            <button
              onClick={() => addToOrder(item)}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Order</span>
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => removeFromOrder(item._id)}
                className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold text-lg text-slate-800">
                {quantity}
              </span>
              <button
                onClick={() => addToOrder(item)}
                className="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
