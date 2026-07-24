import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

export const useMenuItems = () => {
  const { makeAuthenticatedRequest } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMenuItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await makeAuthenticatedRequest("/menu");
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data.menuItems || []);
      } else {
        const errData = await res.json().catch(() => null);
        setError(errData?.error || "Failed to fetch menu items");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [makeAuthenticatedRequest]);

  const addMenuItem = async (menuItemData) => {
    try {
      const res = await makeAuthenticatedRequest("/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuItemData),
      });
      if (res.ok) {
        await fetchMenuItems();
        return { success: true };
      } else {
        const errData = await res.json().catch(() => null);
        return { success: false, error: errData?.error || "Failed to add menu item" };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateMenuItem = async (id, menuItemData) => {
    try {
      const res = await makeAuthenticatedRequest(`/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuItemData),
      });
      if (res.ok) {
        await fetchMenuItems();
        return { success: true };
      } else {
        const errData = await res.json().catch(() => null);
        return { success: false, error: errData?.error || "Failed to update menu item" };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      const res = await makeAuthenticatedRequest(`/menu/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchMenuItems();
        return { success: true };
      } else {
        const errData = await res.json().catch(() => null);
        return { success: false, error: errData?.error || "Failed to delete menu item" };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  return {
    menuItems,
    loading,
    error,
    fetchMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
  };
};
