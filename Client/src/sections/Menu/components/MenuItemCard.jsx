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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 max-w-sm w-full flex flex-col h-[420px]">
      {/* Dish Image */}
      {item.image && (
        <div className="h-40 w-full overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        {/* Dish Name & Type */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {item.name}
          </h3>
          <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded mb-2">
            {item.type}
          </span>
        </div>

        {/* Description */}
        <div className="mb-2 flex-1">
          {item.description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-green-600">
            ${item.price || Math.floor(Math.random() * 15) + 8}
          </span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <i key={i} className="fas fa-star text-amber-400 text-xs"></i>
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.8)</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-colors duration-200 ${
            isAdding
              ? "bg-green-500 text-white"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          } disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
        >
          {isAdding ? (
            <>
              <i className="fas fa-check"></i>
              <span>Added!</span>
            </>
          ) : (
            <>
              <i className="fas fa-plus"></i>
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// In parent component (not in MenuItemCard itself):
// const pendingOrders = orders.filter(order => order.status === "pending");
// Render MenuItemCard only for pending orders
// pendingOrders.map(order => (
//   <MenuItemCard key={order._id} item={order} addToCart={addToCart} />
// ));

export default MenuItemCard;
