/**
 * Table API Layer
 * Handles all low-level HTTP requests to the backend for table management.
 */

export const fetchTablesApi = async (makeAuthenticatedRequest) => {
  const response = await makeAuthenticatedRequest("/tables");
  if (!response.ok) {
    throw new Error(`Failed to fetch tables: ${response.status}`);
  }
  return response.json();
};

export const fetchPendingBillsApi = async (makeAuthenticatedRequest) => {
  const response = await makeAuthenticatedRequest("/payments/pending-bills");
  if (!response.ok) {
    throw new Error(`Failed to fetch pending bills: ${response.status}`);
  }
  return response.json();
};

export const fetchPendingBillsLegacyApi = async (makeAuthenticatedRequest, tableId) => {
  const response = await makeAuthenticatedRequest(`/payments/table/${tableId}/bill`);
  if (!response.ok) {
    throw new Error(`Failed to fetch legacy bill for table ${tableId}: ${response.status}`);
  }
  return response.json();
};

export const updateTableStatusApi = async (makeAuthenticatedRequest, tableId, status) => {
  const response = await makeAuthenticatedRequest(`/tables/${tableId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update table status: ${response.status}`);
  }
  return response.json();
};

export const processPaymentApi = async (makeAuthenticatedRequest, paymentData) => {
  const response = await makeAuthenticatedRequest("/payments/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to process payment: ${response.status}`);
  }
  return response.json();
};

export const reduceItemQuantityApi = async (makeAuthenticatedRequest, orderId, itemIndex) => {
  const response = await makeAuthenticatedRequest(`/orders/${orderId}/reduce-item`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemIndex }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to reduce item: ${response.status}`);
  }
  return response.json();
};

export const cancelItemApi = async (makeAuthenticatedRequest, orderId, itemIndex) => {
  const response = await makeAuthenticatedRequest(`/orders/${orderId}/cancel-item`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemIndex }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to cancel item: ${response.status}`);
  }
  return response.json();
};
