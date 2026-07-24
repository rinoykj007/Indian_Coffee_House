export const MENU_CACHE_KEYS = {
  MENU_DATA: "ich_menu_cache",
  MENU_TIMESTAMP: "ich_menu_cache_timestamp",
};

export const MENU_CACHE_DURATION_MS = 1000 * 60 * 30; // 30 minutes

export const getCartStorageKey = (tableId) => `ich_draft_cart_${tableId || "default"}`;
