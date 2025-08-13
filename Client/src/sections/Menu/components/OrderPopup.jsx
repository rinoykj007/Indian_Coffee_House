import React, { useState } from "react";
import CartItem from "./CartItem";

const OrderPopup = ({
  showOrderPopup,
  setShowOrderPopup,
  cart,
  updateQuantity,
  getCartTotal,
  completeOrder,
}) => {
  const [selectedTable, setSelectedTable] = useState("");

  const handleCompleteOrder = () => {
    if (!selectedTable) return;
    completeOrder(selectedTable);
  };

  return (
    showOrderPopup && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Order</h2>
              <button
                onClick={() => setShowOrderPopup(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Table Selection */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Select Table
              </label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Choose a table...</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Table {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cart.map((item, index) => (
                <CartItem
                  key={index}
                  item={item}
                  index={index}
                  updateQuantity={updateQuantity}
                />
              ))}
            </div>

            {/* Order Total */}
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center text-xl font-bold text-gray-800">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Order Button */}
            <button
              onClick={handleCompleteOrder}
              className={`w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-full font-semibold text-lg transition-colors duration-300 transform hover:scale-105 ${
                !selectedTable ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!selectedTable}
            >
              Complete Order
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default OrderPopup;
