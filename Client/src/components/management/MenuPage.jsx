import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Coffee,
  Users,
} from "lucide-react";

const MenuPage = () => {
  const { user, makeAuthenticatedRequest } = useAuth();
  const navigate = useNavigate();
  const { tableParam } = useParams(); // This will be "table-5" format
  const location = useLocation();

  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [orderItems, setOrderItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [existingOrder, setExistingOrder] = useState(null);
  const [isLoadingExistingOrder, setIsLoadingExistingOrder] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get table info from navigation state
  const tableInfo = location.state?.table || {
    tableNumber: "Unknown",
    capacity: 0,
    location: "Unknown",
  };

  // Get the actual table ID for API calls
  const tableId = location.state?.tableId;
  
  // Debug: Log navigation state and table ID
  console.log("=== MENUPAGE DEBUG ===");
  console.log("Location state:", location.state);
  console.log("Table ID received:", tableId);
  console.log("Table info:", tableInfo);
  console.log("Is additional order:", location.state?.isAdditionalOrder);
  console.log("=====================");

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
      const response = await makeAuthenticatedRequest(`/orders/table/${tableId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.order) {
          setExistingOrder(data.order);
          console.log('Existing order found:', data.order);
        }
      }
    } catch (error) {
      console.error('Error fetching existing order:', error);
    } finally {
      setIsLoadingExistingOrder(false);
    }
  };

  useEffect(() => {
    updateOrderTotal();
  }, [orderItems]);

  const fetchMenuItems = async () => {
    try {
      const response = await makeAuthenticatedRequest("/menu");
      const data = await response.json();
      
      // Handle both old format (array) and new format (object with menuItems)
      const menuItemsArray = Array.isArray(data) ? data : data.menuItems || [];
      setMenuItems(menuItemsArray.filter((item) => item.isAvailable));
    } catch (error) {
      console.error("Error fetching menu items:", error);
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
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setOrderTotal(total);
  };

  const submitOrder = async () => {
    if (orderItems.length === 0) return;

    if (!tableId) {
      alert("Error: No table selected. Please go back and select a table.");
      return;
    }

    try {
      let finalOrderData;
      const isAdditionalOrder = location.state?.isAdditionalOrder && existingOrder;

      if (isAdditionalOrder) {
        // Combine existing order items with new items
        const combinedItems = [
          ...existingOrder.items,
          ...orderItems.map((item) => ({
            menuItemId: item._id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            specialNotes: "",
          }))
        ];

        // Calculate total for combined order
        const combinedTotal = combinedItems.reduce((sum, item) => 
          sum + (item.quantity * item.price), 0
        );

        finalOrderData = {
          tableId: tableId,
          items: combinedItems,
          customerCount: existingOrder.customerCount || 1,
          specialRequests: existingOrder.specialRequests || "",
          total: combinedTotal,
          orderId: existingOrder.id,
          isUpdate: true
        };

        console.log("Adding items to existing order:", finalOrderData);
      } else {
        // New order
        const newItems = orderItems.map((item) => ({
          menuItemId: item._id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          specialNotes: "",
        }));

        finalOrderData = {
          tableId: tableId,
          items: newItems,
          customerCount: 1,
          specialRequests: "",
          total: orderTotal,
          isUpdate: false
        };

        console.log("Creating new order:", finalOrderData);
      }

      console.log("Submitting order data:", finalOrderData);
    
    const response = await makeAuthenticatedRequest("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalOrderData),
    });

    console.log("Order submission response status:", response.status);

    if (response.ok) {
        // Update table status to occupied after successful order (only for new orders)
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
        
        const message = isAdditionalOrder 
          ? `Items added to Table ${tableInfo?.tableNumber}! Total: ₹${finalOrderData.total}`
          : `Order placed for Table ${tableInfo?.tableNumber}! Total: ₹${finalOrderData.total}`;
        
        alert(message);
        navigate("/management/staff");
      } else {
        const errorData = await response.json();
        console.error("Order submission failed:", {
          status: response.status,
          error: errorData,
          submittedData: finalOrderData
        });
        alert(`Failed to submit order: ${errorData.error || 'Unknown error'}. Please try again.`);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Error submitting order. Please try again.");
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
          <div className="flex items-center justify-between py-4">
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
                <div className="bg-amber-600 p-2 rounded-lg">
                  <Coffee className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">
                    Table {tableInfo.tableNumber}
                  </h1>
                  <p className="text-sm text-slate-600">
                    <Users className="w-4 h-4 inline mr-1" />
                    {tableInfo.capacity} guests • {tableInfo.location}
                  </p>
                </div>
              </div>
            </div>

            {orderItems.length > 0 && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">
                    {orderItems.length} items
                  </p>
                  <p className="text-lg font-bold text-amber-600">
                    ₹{orderTotal}
                  </p>
                </div>
                <button
                  onClick={submitOrder}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Submit Order</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            .filter(
              (item) =>
                selectedCategory === "all" || item.category === selectedCategory
            )
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
                  {item.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {item.description}
                        </p>
                        <p className="text-lg font-bold text-amber-600">
                          ₹{item.price}
                        </p>
                      </div>
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

        {menuItems.filter(
          (item) =>
            selectedCategory === "all" || item.category === selectedCategory
        ).length === 0 && (
          <div className="text-center py-12">
            <Coffee className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              No items available
            </h3>
            <p className="text-slate-600">
              No menu items found in this category.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MenuPage;
