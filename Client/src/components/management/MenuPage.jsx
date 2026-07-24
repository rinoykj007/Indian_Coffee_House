import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import logo from "./logo.png";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Coffee,
  Users,
  Search,
  X,
} from "lucide-react";

const MenuPage = () => {
  const { user, makeAuthenticatedRequest } = useAuth();
  const navigate = useNavigate();
  const { tableParam } = useParams();
  const location = useLocation();

  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [existingOrder, setExistingOrder] = useState(null);
  const [isLoadingExistingOrder, setIsLoadingExistingOrder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get table info from navigation state
  const tableInfo = location.state?.table || {
    tableNumber: "Unknown",
    capacity: 0,
    location: "Unknown",
  };

  const tableId = location.state?.tableId;

  // LocalStorage keys for this specific table
  const cartStorageKey = `ich_draft_cart_${tableId || 'default'}`;
  const menuCacheKey = 'ich_menu_cache';
  const menuCacheTimeKey = 'ich_menu_cache_timestamp';

  // Restore cart from localStorage on mount
  useEffect(() => {
    if (tableId) {
      const savedCart = localStorage.getItem(cartStorageKey);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (parsedCart.length > 0) {
            setOrderItems(parsedCart);
            // Recalculate total
            const total = parsedCart.reduce(
              (sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0),
              0
            );
            setOrderTotal(total);
          }
        } catch (e) {
          console.error("Failed to parse saved cart", e);
        }
      }
    }
  }, [tableId, cartStorageKey]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (tableId) {
      if (orderItems.length > 0) {
        localStorage.setItem(cartStorageKey, JSON.stringify(orderItems));
      } else {
        localStorage.removeItem(cartStorageKey);
      }
    }
  }, [orderItems, tableId, cartStorageKey]);

  useEffect(() => {
    fetchMenuItems();

    // If this is an additional order, fetch existing order for this table
    if (location.state?.isAdditionalOrder && tableId) {
      fetchExistingOrder();
    }
  }, []);

  const fetchExistingOrder = async () => {
    setIsLoadingExistingOrder(true);
    try {
      const response = await makeAuthenticatedRequest(
        `/orders/table/${tableId}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.order) {
          setExistingOrder(data.order);
        }
      }
    } catch (error) {
    } finally {
      setIsLoadingExistingOrder(false);
    }
  };

  useEffect(() => {
    updateOrderTotal();
  }, [orderItems]);

  const fetchMenuItems = async () => {
    try {
      // 1. Try to load from cache first for instant UI
      const cachedMenu = localStorage.getItem(menuCacheKey);
      const cacheTime = localStorage.getItem(menuCacheTimeKey);
      const isCacheValid = cacheTime && (Date.now() - parseInt(cacheTime) < 1000 * 60 * 30); // 30 min cache

      if (cachedMenu && isCacheValid) {
        setMenuItems(JSON.parse(cachedMenu));
        setLoading(false);
      }

      // 2. Fetch fresh data in the background (or immediately if no cache)
      const response = await makeAuthenticatedRequest("/menu");
      if (response.ok) {
        const data = await response.json();
        
        // Handle different response shapes safely
        const menuItemsArray = Array.isArray(data) ? data : (data.menuItems || []);
        
        // Ensure we only show available items (default to true if undefined)
        const activeItems = menuItemsArray.filter((item) => item.isAvailable !== false && item.available !== false);
        
        setMenuItems(activeItems);
        
        // Update cache
        localStorage.setItem(menuCacheKey, JSON.stringify(activeItems));
        localStorage.setItem(menuCacheTimeKey, Date.now().toString());
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToOrder = (item) => {
    const existingItem = orderItems.find(
      (orderItem) => orderItem._id === item._id
    );
    if (existingItem) {
      setOrderItems(
        orderItems.map((orderItem) =>
          orderItem._id === item._id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        )
      );
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromOrder = (itemId) => {
    const existingItem = orderItems.find(
      (orderItem) => orderItem._id === itemId
    );
    if (existingItem && existingItem.quantity > 1) {
      setOrderItems(
        orderItems.map((orderItem) =>
          orderItem._id === itemId
            ? { ...orderItem, quantity: orderItem.quantity - 1 }
            : orderItem
        )
      );
    } else {
      setOrderItems(orderItems.filter((orderItem) => orderItem._id !== itemId));
    }
  };

  const updateOrderTotal = () => {
    const total = orderItems.reduce(
      (sum, item) =>
        sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0),
      0
    );
    setOrderTotal(total);
  };

  const submitOrder = async (processPaymentImmediately = false) => {
    if (orderItems.length === 0 || isSubmitting) return;
    setIsSubmitting(true);

    if (!tableId) {
      alert("Error: No table selected. Please go back and select a table.");
      return;
    }

    try {
      const isAdditionalOrder =
        location.state?.isAdditionalOrder && existingOrder;

      const newItems = orderItems.map((item) => {
        const menuItemId = item._id || item.id;
        const price = parseFloat(item.price);
        const quantity = parseInt(item.quantity);

        return {
          menuItemId: menuItemId,
          quantity: quantity || 1,
          price: price || 0,
          name: item.name || "Unknown Item",
          specialNotes: "",
        };
      });

      const validItems = newItems.filter(
        (item) => item.price > 0 && item.quantity > 0 && !isNaN(item.price)
      );

      const finalOrderData = isAdditionalOrder
        ? {
            tableId: tableId,
            items: validItems.map((item) => ({
              ...item,
              menuItemId: String(item.menuItemId),
            })),
            customerCount: existingOrder?.customerCount || 1,
            specialRequests: existingOrder?.specialRequests || "",
            orderId: existingOrder?._id || "",
            isUpdate: true,
          }
        : {
            tableId: String(tableId),
            items: validItems.map((item) => ({
              ...item,
              menuItemId: String(item.menuItemId),
            })),
            customerCount: 1,
            specialRequests: "",
            isUpdate: false,
          };

      try {
        const response = await makeAuthenticatedRequest("/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalOrderData),
        });

        if (response.ok) {
          const responseData = await response.json();

          if (!isAdditionalOrder) {
            try {
              await makeAuthenticatedRequest(`/tables/${tableId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "occupied" }),
              });
            } catch (error) {
              console.error("Error updating table status:", error);
            }
          }

          const orderTotal = responseData.order?.total || orderTotal;
          const message = isAdditionalOrder
            ? `Items added to Table ${tableInfo?.tableNumber}! Total: €${orderTotal}`
            : `Order placed for Table ${tableInfo?.tableNumber}! Total: €${orderTotal}`;
          // Clear local state and localStorage
          setOrderItems([]);
          localStorage.removeItem(cartStorageKey);
          
          navigate("/management/staff", {
            state: { openPaymentForTableId: processPaymentImmediately === true ? tableId : null }
          });
        } else {
          // For error responses, use clone() before reading the body
          const clonedResponse = response.clone();
          let errorMessage = "Server error";

          try {
            const errorData = await response.json();
            errorMessage = errorData.error || "Unknown error";
          } catch (e) {
            // If JSON parsing fails, try getting text
            try {
              const errorText = await clonedResponse.text();
              errorMessage = errorText || "Server error";
            } catch (textError) {
              console.error("Failed to read error response:", textError);
            }
          }

          console.error("Order submission failed:", {
            status: response.status,
            errorMessage,
          });

          alert(`Failed to submit order: ${errorMessage}. Please try again.`);
        }
      } catch (fetchError) {
        console.error("Network error:", fetchError);
        alert(
          `Network error: ${fetchError.message}. Please check your connection.`
        );
      }
    } catch (error) {
      // Add more detailed error logging
      console.error("Error submitting order:", error.message || error);
      console.error("Error stack:", error.stack);
      alert(
        `Error submitting order: ${
          error.message || "Unknown error"
        }. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  const categories = [...new Set(menuItems.map((item) => item.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/management/staff")}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Tables</span>
              </button>
              <div className="h-6 w-px bg-slate-300"></div>
              <div className="flex items-center space-x-3">
                <img src={logo} alt="" className="w-5 h-5" />
                <div>
                  <h1 className="text-xl font-bold text-slate-800">
                    Table {tableInfo.tableNumber}
                  </h1>
                </div>
              </div>
            </div>
            {/* Show summary and button only on md and up, all info inside button */}
            {orderItems.length > 0 && (
              <div className="hidden md:flex items-center justify-end text-right">
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-4 text-lg"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Submit Order</span>
                  <span className="text-sm font-semibold bg-white text-green-700 rounded px-2 py-1 ml-2">
                    {orderItems.length} items
                  </span>
                  <span className="text-base font-bold ml-2 text-amber-300">
                    €{orderTotal}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Selected Items (Cart) - Hidden on Mobile */}
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
                      <div key={item._id} className="flex justify-between items-center bg-amber-50 p-2 rounded-lg border border-amber-100">
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="font-semibold text-slate-800 text-sm truncate" title={item.name}>{item.name}</p>
                          <p className="text-amber-600 font-bold text-sm">€{item.price}</p>
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

          {/* Right Side - Menu Items */}
          <div className="w-full lg:w-2/3 xl:w-3/4">
            {/* Search Bar */}
            <div className="mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-amber-600 text-white"
                  : "bg-white text-slate-700 hover:bg-amber-50 border border-amber-200"
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                  selectedCategory === category
                    ? "bg-amber-600 text-white"
                    : "bg-white text-slate-700 hover:bg-amber-50 border border-amber-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems
            .filter((item) => {
              // Category filter
              const matchesCategory =
                selectedCategory === "all" ||
                item.category === selectedCategory;

              // Search filter
              const matchesSearch =
                searchQuery.trim() === "" ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description &&
                  item.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()));

              return matchesCategory && matchesSearch;
            })
            .map((item) => {
              const orderItem = orderItems.find(
                (orderItem) => orderItem._id === item._id
              );
              const quantity = orderItem ? orderItem.quantity : 0;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Item Image */}
                  {/* {item.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )} */}

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-slate-800">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-amber-600 ml-4">
                        €{item.price}
                      </p>
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
            })}
        </div>

        {menuItems.filter((item) => {
          const matchesCategory =
            selectedCategory === "all" || item.category === selectedCategory;
          const matchesSearch =
            searchQuery.trim() === "" ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description &&
              item.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()));
          return matchesCategory && matchesSearch;
        }).length === 0 && (
          <div className="text-center py-12">
            <Coffee className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              No items found
            </h3>
            <p className="text-slate-600">
              {searchQuery
                ? `No menu items match "${searchQuery}"`
                : "No menu items found in this category."}
            </p>
          </div>
        )}
          </div>
        </div>
      </main>

      {/* Floating Submit Order Button - only on mobile */}
      {orderItems.length > 0 && (
        <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xs px-4">
          <button
            onClick={() => setShowConfirmation(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center space-x-2 text-lg transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Submit Order</span>
            <span className="ml-2 text-base font-bold"> €{orderTotal}</span>
          </button>
        </div>
      )}
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl transform transition-all overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 mr-2 text-amber-600" />
              Confirm Order
            </h2>
            <p className="text-slate-500 text-center mb-6">
              Table {tableInfo.tableNumber}
            </p>

            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 max-h-64 overflow-y-auto">
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center text-sm">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-semibold text-slate-700 truncate">{item.name}</p>
                      <p className="text-slate-500">€{item.price} × {item.quantity}</p>
                    </div>
                    <p className="font-bold text-slate-800">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-200 mt-4 pt-3 flex justify-between items-center">
                <span className="font-semibold text-slate-600">Total:</span>
                <span className="text-xl font-bold text-amber-600">€{orderTotal}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => submitOrder(true)}
                disabled={isSubmitting}
                className={`w-full text-white font-bold py-3.5 rounded-xl transition-colors shadow-md text-lg flex items-center justify-center ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}
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
                  onClick={() => setShowConfirmation(false)}
                  disabled={isSubmitting}
                  className={`flex-1 font-medium py-3 rounded-xl transition-colors ${isSubmitting ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => submitOrder(false)}
                  disabled={isSubmitting}
                  className={`flex-1 text-white font-bold py-3 rounded-xl transition-colors shadow-md ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'}`}
                >
                  {isSubmitting ? "Processing..." : "Confirm Only"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
