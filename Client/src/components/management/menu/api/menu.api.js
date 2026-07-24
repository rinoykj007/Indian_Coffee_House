/**
 * Fetches all menu items from the server.
 * @param {Function} makeAuthenticatedRequest - The authenticated request function from AuthContext.
 * @returns {Promise<Object>} The API response containing menu items.
 */
export const fetchMenuItemsApi = async (makeAuthenticatedRequest) => {
  const response = await makeAuthenticatedRequest("/menu");
  if (!response.ok) {
    throw new Error("Failed to fetch menu items");
  }
  return response.json();
};

/**
 * Fetches an existing order for a specific table.
 * @param {Function} makeAuthenticatedRequest - The authenticated request function from AuthContext.
 * @param {string} tableId - The ID of the table.
 * @returns {Promise<Object>} The API response containing the order.
 */
export const fetchExistingOrderApi = async (makeAuthenticatedRequest, tableId) => {
  const response = await makeAuthenticatedRequest(`/orders/table/${tableId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch existing order");
  }
  return response.json();
};

/**
 * Submits a new or updated order.
 * @param {Function} makeAuthenticatedRequest - The authenticated request function from AuthContext.
 * @param {Object} orderData - The structured order payload.
 * @returns {Promise<Object>} The API response.
 */
export const submitOrderApi = async (makeAuthenticatedRequest, orderData) => {
  const response = await makeAuthenticatedRequest("/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
  
  if (!response.ok) {
    const clonedResponse = response.clone();
    let errorMessage = "Server error";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || "Unknown error";
    } catch (e) {
      try {
        const errorText = await clonedResponse.text();
        errorMessage = errorText || "Server error";
      } catch (textError) {
        console.error("Failed to read error response:", textError);
      }
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  
  return response.json();
};

/**
 * Updates the status of a table.
 * @param {Function} makeAuthenticatedRequest - The authenticated request function from AuthContext.
 * @param {string} tableId - The ID of the table.
 * @param {string} status - The new status (e.g., "occupied").
 * @returns {Promise<void>}
 */
export const updateTableStatusApi = async (makeAuthenticatedRequest, tableId, status) => {
  const response = await makeAuthenticatedRequest(`/tables/${tableId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to update table status");
  }
};
