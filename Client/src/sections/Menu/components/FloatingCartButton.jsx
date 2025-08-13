import React from "react";

const FloatingCartButton = ({ cart, setShowOrderPopup }) => (
  cart.length > 0 && (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setShowOrderPopup(true)}
        className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 animate-pulse"
      >
        <div className="relative">
          <i className="fas fa-shopping-cart text-xl"></i>
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </div>
      </button>
    </div>
  )
);

export default FloatingCartButton;
