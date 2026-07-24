import { useState, useCallback, useEffect } from "react";
import { 
  fetchPendingBillsApi, 
  fetchPendingBillsLegacyApi,
  reduceItemQuantityApi, 
  cancelItemApi 
} from "../api/table.api";
import { useAuth } from "../../../../contexts/AuthContext";
import { TableStatus } from "../types/table.enums";

export const usePendingBills = (tables, updateTableStatus) => {
  const { makeAuthenticatedRequest } = useAuth();
  const [pendingBills, setPendingBills] = useState([]);

  // Sync table statuses based on pending bills
  const updateTablesBasedOnBills = useCallback(async (bills) => {
    for (const bill of bills) {
      const table = tables.find(
        (t) => String(t._id || t.id) === String(bill.tableId)
      );

      if (table && table.status === TableStatus.AVAILABLE) {
        await updateTableStatus(bill.tableId, TableStatus.OCCUPIED);
      }
    }
  }, [tables, updateTableStatus]);

  const fetchPendingBillsLegacy = useCallback(async () => {
    const bills = [];
    const occupiedTables = tables.filter(
      (table) => table.status === TableStatus.OCCUPIED
    );

    for (const table of occupiedTables) {
      try {
        const tableId = table._id || table.id;
        const data = await fetchPendingBillsLegacyApi(makeAuthenticatedRequest, tableId);
        if (data.success && data.bill) {
          bills.push(data.bill);
        }
      } catch (error) {
        console.error(`Error fetching bill for table ${table.tableNumber}:`, error);
      }
    }

    setPendingBills(bills);
  }, [tables, makeAuthenticatedRequest]);

  const fetchPendingBills = useCallback(async () => {
    try {
      const data = await fetchPendingBillsApi(makeAuthenticatedRequest);
      if (data.success && data.bills) {
        setPendingBills(data.bills);
        updateTablesBasedOnBills(data.bills);
      } else {
        setPendingBills([]);
      }
    } catch (error) {
      console.error("Error fetching pending bills:", error);
      await fetchPendingBillsLegacy();
    }
  }, [makeAuthenticatedRequest, updateTablesBasedOnBills, fetchPendingBillsLegacy]);

  // Fetch pending bills after tables are loaded
  useEffect(() => {
    if (tables.length > 0) {
      fetchPendingBills();
    }
  }, [tables.length, fetchPendingBills]);

  const reduceItemQuantity = async (bill, itemIndex) => {
    try {
      const data = await reduceItemQuantityApi(makeAuthenticatedRequest, bill.orderId, itemIndex);
      await fetchPendingBills();

      if (data.orderDeleted) {
        alert("Last item removed. Order has been cancelled.");
      }
    } catch (error) {
      console.error("Error reducing item quantity:", error);
      alert(`Failed to reduce item: ${error.message || "Unknown error"}`);
    }
  };

  const cancelItem = async (bill, itemIndex) => {
    const item = bill.items[itemIndex];
    const confirmCancel = window.confirm(
      `Cancel all ${item.quantity}x ${item.name} (€${(item.price * item.quantity).toFixed(2)})?`
    );

    if (!confirmCancel) return;

    try {
      const data = await cancelItemApi(makeAuthenticatedRequest, bill.orderId, itemIndex);
      alert(data.message || "Item cancelled successfully");
      await fetchPendingBills();
    } catch (error) {
      console.error("Error cancelling item:", error);
      alert(`Failed to cancel item: ${error.message || "Unknown error"}`);
    }
  };

  const removeBillFromState = useCallback((tableId) => {
    setPendingBills((prevBills) => prevBills.filter((b) => b.tableId !== tableId));
  }, []);

  return {
    pendingBills,
    fetchPendingBills,
    reduceItemQuantity,
    cancelItem,
    removeBillFromState,
  };
};
