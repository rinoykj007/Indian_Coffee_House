import { useState, useEffect, useCallback } from "react";
import { getCartStorageKey } from "../utils";

export const useOrderCart = (tableId) => {
  const [orderItems, setOrderItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);

  const cartStorageKey = getCartStorageKey(tableId);

  // Restore cart from localStorage on mount
  useEffect(() => {
    if (tableId) {
      const savedCart = localStorage.getItem(cartStorageKey);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (parsedCart.length > 0) {
            setOrderItems(parsedCart);
            const total = parsedCart.reduce(
              (sum, item) =>
                sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0),
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

  // Update order total whenever items change
  useEffect(() => {
    const total = orderItems.reduce(
      (sum, item) =>
        sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0),
      0
    );
    setOrderTotal(total);
  }, [orderItems]);

  const addToOrder = useCallback((item) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find(
        (orderItem) => orderItem._id === item._id
      );
      if (existingItem) {
        return prevItems.map((orderItem) =>
          orderItem._id === item._id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  }, []);

  const removeFromOrder = useCallback((itemId) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find(
        (orderItem) => orderItem._id === itemId
      );
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map((orderItem) =>
          orderItem._id === itemId
            ? { ...orderItem, quantity: orderItem.quantity - 1 }
            : orderItem
        );
      } else {
        return prevItems.filter((orderItem) => orderItem._id !== itemId);
      }
    });
  }, []);

  const clearCart = useCallback(() => {
    setOrderItems([]);
    localStorage.removeItem(cartStorageKey);
  }, [cartStorageKey]);

  return {
    orderItems,
    orderTotal,
    addToOrder,
    removeFromOrder,
    clearCart,
  };
};
