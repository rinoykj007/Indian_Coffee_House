import React, { useState } from "react";

const MenuItemCard = ({ item, index, addToCart }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addToCart(item);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border border-gray-100">
      {/* Dish Image */}
      {item.image && (
        <div className="relative h-56 overflow-hidden rounded-t-2xl">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Heart Icon */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                isLiked
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <i
                className={`fas fa-heart text-lg ${
                  isLiked ? "animate-pulse" : ""
                }`}
              ></i>
            </button>
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
              <i className="fas fa-utensils mr-1.5"></i>
              {item.type}
            </span>
          </div>

          {/* Price Tag */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg">
              ${Math.floor(Math.random() * 15) + 8}
            </span>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Dish Name & Description */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Authentic Indian cuisine prepared with traditional spices and fresh
            ingredients
          </p>

          {/* Type Badge for items without images */}
          {!item.image && (
            <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              <i className="fas fa-utensils mr-1"></i>
              {item.type}
            </span>
          )}
        </div>

        {/* Rating & Add to Cart */}
        <div className="flex items-center justify-between pt-2">
          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fas fa-star text-amber-400 text-sm"></i>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-600">(4.8)</span>
            <span className="text-xs text-gray-400">• 127 reviews</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform ${
            isAdding
              ? "bg-green-500 text-white scale-95"
              : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:scale-105 hover:shadow-lg"
          } disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
        >
          {isAdding ? (
            <>
              <i className="fas fa-check animate-bounce"></i>
              <span>Added!</span>
            </>
          ) : (
            <>
              <i className="fas fa-shopping-cart"></i>
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-amber-200 transition-colors duration-300 pointer-events-none"></div>
    </div>
  );
};

export default MenuItemCard;
