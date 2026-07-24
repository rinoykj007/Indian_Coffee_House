import { useState, useEffect, useCallback } from "react";
import { fetchMenuItemsApi } from "../api";
import { MENU_CACHE_KEYS, MENU_CACHE_DURATION_MS } from "../utils";

export const useMenu = (makeAuthenticatedRequest) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenuItems = useCallback(async () => {
    try {
      // 1. Try to load from cache first for instant UI
      const cachedMenu = localStorage.getItem(MENU_CACHE_KEYS.MENU_DATA);
      const cacheTime = localStorage.getItem(MENU_CACHE_KEYS.MENU_TIMESTAMP);
      const isCacheValid =
        cacheTime && Date.now() - parseInt(cacheTime) < MENU_CACHE_DURATION_MS;

      if (cachedMenu && isCacheValid) {
        setMenuItems(JSON.parse(cachedMenu));
        setLoading(false);
      }

      // 2. Fetch fresh data in the background (or immediately if no cache)
      const data = await fetchMenuItemsApi(makeAuthenticatedRequest);

      // Handle different response shapes safely
      const menuItemsArray = Array.isArray(data)
        ? data
        : data.menuItems || [];

      // Ensure we only show available items (default to true if undefined)
      const activeItems = menuItemsArray.filter(
        (item) => item.isAvailable !== false && item.available !== false
      );

      setMenuItems(activeItems);

      // Update cache
      localStorage.setItem(
        MENU_CACHE_KEYS.MENU_DATA,
        JSON.stringify(activeItems)
      );
      localStorage.setItem(
        MENU_CACHE_KEYS.MENU_TIMESTAMP,
        Date.now().toString()
      );
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  }, [makeAuthenticatedRequest]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  return {
    menuItems,
    loading,
    refreshMenu: fetchMenuItems,
  };
};
