import React, { useEffect, useState } from "react";
import axios from "axios";
import FloatingCartButton from "./components/FloatingCartButton";
import OrderPopup from "./components/OrderPopup";
import HeaderSection from "./components/HeaderSection";
import MenuItemCard from "./components/MenuItemCard";

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
      .get(`${import.meta.env.VITE_API_URL}/api/menu`)
      .then((res) => {
        console.log("Menu data from backend:", res.data);
        let menuData = res.data.menuItems || res.data;
        if (!Array.isArray(menuData)) {
          menuData = [menuData];
        }
        setMenu(menuData);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 px-4">
          {filteredMenu.map((item) => (
            <div key={item._id || item.id} className="flex justify-center">
              <MenuItemCard item={item} addToCart={addToCart} />
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
