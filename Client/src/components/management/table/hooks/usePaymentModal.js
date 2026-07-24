import { useState, useCallback } from "react";
import { processPaymentApi } from "../api/table.api";
import { useAuth } from "../../../../contexts/AuthContext";
import { PaymentModalView } from "../types/table.enums";

export const usePaymentModal = (removeBillFromState, fetchTables, fetchPendingBills) => {
  const { user, makeAuthenticatedRequest } = useAuth();
  
  const [processingBillId, setProcessingBillId] = useState(null);
  const [paymentModalBill, setPaymentModalBill] = useState(null);
  const [paymentModalView, setPaymentModalView] = useState(PaymentModalView.SELECT);
  const [cashReceived, setCashReceived] = useState(0);

  const handleClosePaymentModal = useCallback(() => {
    setPaymentModalBill(null);
    setTimeout(() => {
      setPaymentModalView(PaymentModalView.SELECT);
      setCashReceived(0);
    }, 200);
  }, []);

  const openPaymentModal = useCallback((bill) => {
    setPaymentModalBill(bill);
    setPaymentModalView(PaymentModalView.SELECT);
    setCashReceived(0);
  }, []);

  const handleCashDenomination = useCallback((amount) => {
    setCashReceived((prev) => parseFloat((prev + amount).toFixed(2)));
  }, []);

  const processPayment = async (bill, paymentMethod = "cash") => {
    if (processingBillId) return;

    setProcessingBillId(bill.tableId);
    handleClosePaymentModal();
    
    try {
      const data = await processPaymentApi(makeAuthenticatedRequest, {
        orderId: bill.orderId,
        tableId: bill.tableId,
        paymentMethod,
        discount: 0,
        staffId: user?._id,
      });

      alert(data.message);
      
      // Immediately remove from UI for quick feedback
      removeBillFromState(bill.tableId);

      // Refresh in background
      setTimeout(async () => {
        await fetchTables();
        await fetchPendingBills();
      }, 500);

    } catch (error) {
      console.error("Error processing payment:", error);
      alert(`Payment failed: ${error.message || "Unknown error"}`);
    } finally {
      setProcessingBillId(null);
    }
  };

  return {
    processingBillId,
    paymentModalBill,
    paymentModalView,
    cashReceived,
    openPaymentModal,
    handleClosePaymentModal,
    setPaymentModalView,
    handleCashDenomination,
    setCashReceived,
    processPayment,
  };
};
