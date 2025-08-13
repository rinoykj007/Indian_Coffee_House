import React from "react";

const CartItem = ({ item, index, updateQuantity }) => (
  <div
    key={index}
    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
  >
    <div className="flex items-center space-x-3">
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-12 h-12 object-cover rounded-lg"
        />
      )}
      <div>
        <h4 className="font-semibold text-gray-800">{item.name}</h4>
        <p className="text-sm text-gray-600">${item.price}</p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <button
        onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center"
      >
        <i className="fas fa-minus text-xs"></i>
      </button>
      <span className="font-semibold text-gray-800 w-8 text-center">
        {item.quantity}
      </span>
      <button
        onClick={() => updateQuantity(index, item.quantity + 1)}
        className="bg-amber-600 hover:bg-amber-700 text-white w-8 h-8 rounded-full flex items-center justify-center"
      >
        <i className="fas fa-plus text-xs"></i>
      </button>
    </div>
  </div>
);

export default CartItem;
