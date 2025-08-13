import React, { useEffect, useState } from "react";
import axios from "axios";
import FloatingCartButton from "./components/FloatingCartButton";
import OrderPopup from "./components/OrderPopup";
import HeaderSection from "./components/HeaderSection";

export default function Meanulist() {
  // Complete order handler
  const completeOrder = () => {
    alert("Order completed!");
    setCart([]);
    setShowOrderPopup(false);
  };
  // Cart total calculatio
  const getCartTotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  };
  const [filter, setFilter] = useState("");
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) =>
      prev.some((i) => i._id === item._id || i.id === item.id)
        ? prev.map((i) =>
            i._id === item._id || i.id === item.id
              ? { ...i, quantity: (i.quantity || 1) + 1 }
              : i
          )
        : [...prev, { ...item, quantity: 1 }]
    );
  };

  // Cart quantity update logic for popup
  const updateQuantity = (index, newQty) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: newQty } : item
      )
    );
  };

  useEffect(() => {
    axios
      .get("https://indian-coffee-house.onrender.com/menu")
      .then((res) => {
        setMenu(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch menu");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div>{error}</div>;

  // Get unique categories/types for filter dropdown
  const categories = Array.from(
    new Set(menu.map((item) => item.category || item.type || "Other"))
  );

  // Filtered menu
  const filteredMenu = filter
    ? menu.filter((item) => (item.category || item.type) === filter)
    : menu;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-orange-50 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-5xl mx-auto">
        <HeaderSection title="Menu" />
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat === "All" ? "" : cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 shadow-sm
                ${
                  filter === cat || (cat === "All" && !filter)
                    ? "bg-amber-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-slate-700 hover:bg-amber-100 hover:text-amber-700 border border-amber-200"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {filteredMenu.map((item) => (
            <div
              key={item._id || item.id}
              className="bg-white border border-amber-200 rounded-2xl shadow-lg w-56 mb-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-amber-300 flex flex-col"
            >
              <img
                src={
                  item.image ||
                  "https://via.placeholder.com/220x120?text=No+Image"
                }
                alt={item.name || "No Name"}
                className="w-full h-32 object-cover rounded-t-2xl border-b border-amber-100"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-lg mb-2 text-slate-800">
                    {item.name || "N/A"}
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="flex items-center text-amber-600 text-sm">
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke="#d97706"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="mr-1"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      {item.preparationTime || "N/A"}
                    </span>
                    <span className="flex items-center text-orange-500 text-sm">
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke="#ea580c"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="mr-1"
                      >
                        <polygon points="12,2 15,8.5 22,9.3 17,14.1 18.5,21 12,17.8 5.5,21 7,14.1 2,9.3 9,8.5" />
                      </svg>
                      {item.rating ? item.rating : "N/A"}
                    </span>
                  </div>
                  <div className="font-bold text-xl text-orange-600 mb-4">
                    {item.price ? `${item.price.toFixed(2)}$` : "N/A"}
                  </div>
                </div>
                <button
                  className="mt-auto bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-all duration-200 w-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Floating Cart Button */}
        <FloatingCartButton cart={cart} setShowOrderPopup={setShowOrderPopup} />
        <OrderPopup
          showOrderPopup={showOrderPopup}
          setShowOrderPopup={setShowOrderPopup}
          cart={cart}
          updateQuantity={updateQuantity}
          getCartTotal={getCartTotal}
          completeOrder={completeOrder}
        />
      </div>
    </div>
  );
}
