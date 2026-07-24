import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";

// Hooks
import { useMenu, useOrderCart, useOrderSubmission } from "../hooks";

// UI Components
import {
  MenuHeader,
  MenuSearch,
  MenuFilters,
  MenuGrid,
  MenuCart,
  MobileCartButton,
  ConfirmDialog,
  LoadingOverlay,
  EmptyState,
} from "../components";

const MenuPage = () => {
  const { makeAuthenticatedRequest } = useAuth();
  const navigate = useNavigate();
  const { tableParam } = useParams();
  const location = useLocation();

  // Local UI State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Table Info from navigation state
  const tableInfo = location.state?.table || {
    tableNumber: "Unknown",
    capacity: 0,
    location: "Unknown",
  };
  const tableId = location.state?.tableId;

  // Custom Hooks
  const { menuItems, loading } = useMenu(makeAuthenticatedRequest);
  
  const {
    orderItems,
    orderTotal,
    addToOrder,
    removeFromOrder,
    clearCart,
  } = useOrderCart(tableId);

  const { submitOrder, isSubmitting } = useOrderSubmission(
    makeAuthenticatedRequest,
    tableId,
    tableInfo
  );

  // Derived state
  const categories = [...new Set(menuItems.map((item) => item.category))];

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOrderSubmission = (processPaymentImmediately) => {
    submitOrder(orderItems, orderTotal, processPaymentImmediately, () => {
      // On success, clear the cart and close modal
      clearCart();
      setShowConfirmation(false);
    });
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <MenuHeader
        navigate={navigate}
        tableInfo={tableInfo}
        orderItemsCount={orderItems.length}
        orderTotal={orderTotal}
        setShowConfirmation={setShowConfirmation}
      />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <MenuCart
            orderItems={orderItems}
            orderTotal={orderTotal}
            addToOrder={addToOrder}
            removeFromOrder={removeFromOrder}
            setShowConfirmation={setShowConfirmation}
          />

          <div className="w-full lg:w-2/3 xl:w-3/4">
            <MenuSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <MenuFilters
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <MenuGrid
              menuItems={filteredMenuItems}
              orderItems={orderItems}
              addToOrder={addToOrder}
              removeFromOrder={removeFromOrder}
            />

            {filteredMenuItems.length === 0 && (
              <EmptyState searchQuery={searchQuery} />
            )}
          </div>
        </div>
      </main>

      <MobileCartButton
        orderItemsCount={orderItems.length}
        orderTotal={orderTotal}
        setShowConfirmation={setShowConfirmation}
      />

      <ConfirmDialog
        show={showConfirmation}
        tableInfo={tableInfo}
        orderItems={orderItems}
        orderTotal={orderTotal}
        submitOrder={handleOrderSubmission}
        isSubmitting={isSubmitting}
        onClose={() => setShowConfirmation(false)}
      />
    </div>
  );
};

export default MenuPage;
