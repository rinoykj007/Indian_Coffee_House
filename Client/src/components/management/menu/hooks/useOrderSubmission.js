import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { submitOrderApi, updateTableStatusApi, fetchExistingOrderApi } from "../api";

export const useOrderSubmission = (makeAuthenticatedRequest, tableId, tableInfo) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [existingOrder, setExistingOrder] = useState(null);
  const [isLoadingExistingOrder, setIsLoadingExistingOrder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing order if this is an additional order
  useEffect(() => {
    const isAdditionalOrder = location.state?.isAdditionalOrder;
    if (isAdditionalOrder && tableId) {
      const fetchOrder = async () => {
        setIsLoadingExistingOrder(true);
        try {
          const data = await fetchExistingOrderApi(makeAuthenticatedRequest, tableId);
          if (data.order) {
            setExistingOrder(data.order);
          }
        } catch (error) {
          console.error("Failed to fetch existing order:", error);
        } finally {
          setIsLoadingExistingOrder(false);
        }
      };
      fetchOrder();
    }
  }, [makeAuthenticatedRequest, tableId, location.state?.isAdditionalOrder]);

  const submitOrder = useCallback(
    async (orderItems, orderTotal, processPaymentImmediately = false, onSuccess = () => {}) => {
      if (orderItems.length === 0 || isSubmitting) return;

      if (!tableId) {
        alert("Error: No table selected. Please go back and select a table.");
        return;
      }

      setIsSubmitting(true);

      try {
        const isAdditionalOrder = location.state?.isAdditionalOrder && existingOrder;

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
          const responseData = await submitOrderApi(makeAuthenticatedRequest, finalOrderData);

          if (!isAdditionalOrder) {
            try {
              await updateTableStatusApi(makeAuthenticatedRequest, tableId, "occupied");
            } catch (error) {
              console.error("Error updating table status:", error);
            }
          }

          const finalTotal = responseData.order?.total || orderTotal;
          const message = isAdditionalOrder
            ? `Items added to Table ${tableInfo?.tableNumber}! Total: €${finalTotal}`
            : `Order placed for Table ${tableInfo?.tableNumber}! Total: €${finalTotal}`;

          onSuccess();

          navigate("/management/staff", {
            state: { openPaymentForTableId: processPaymentImmediately === true ? tableId : null },
          });
        } catch (apiError) {
          console.error("Order submission failed:", apiError);
          alert(`Failed to submit order: ${apiError.message}. Please try again.`);
        }
      } catch (error) {
        console.error("Error submitting order:", error.message || error);
        console.error("Error stack:", error.stack);
        alert(`Error submitting order: ${error.message || "Unknown error"}. Please try again.`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      tableId,
      location.state?.isAdditionalOrder,
      existingOrder,
      makeAuthenticatedRequest,
      tableInfo?.tableNumber,
      navigate,
    ]
  );

  return {
    submitOrder,
    isSubmitting,
    existingOrder,
    isLoadingExistingOrder,
  };
};
