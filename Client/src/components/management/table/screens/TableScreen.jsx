import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TableHeader from "../components/TableHeader";
import TableStatusLegend from "../components/TableStatusLegend";
import TableGrid from "../components/TableGrid";
import PendingBillsList from "../components/PendingBillsList";
import PaymentModal from "../components/PaymentModal";

import { useTables } from "../hooks/useTables";
import { usePendingBills } from "../hooks/usePendingBills";
import { usePaymentModal } from "../hooks/usePaymentModal";

const TableScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tables, loading, fetchTables, updateTableStatus } = useTables();
  
  const { 
    pendingBills, 
    fetchPendingBills, 
    reduceItemQuantity, 
    cancelItem,
    removeBillFromState
  } = usePendingBills(tables, updateTableStatus);

  const {
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
  } = usePaymentModal(removeBillFromState, fetchTables, fetchPendingBills);

  // Automatically open payment modal if navigated from 'Confirm & Pay'
  useEffect(() => {
    const paymentTableId = location.state?.openPaymentForTableId;
    if (paymentTableId && pendingBills.length > 0) {
      const billToPay = pendingBills.find((b) => b.tableId === paymentTableId);
      if (billToPay) {
        openPaymentModal(billToPay);
        // Clear the state so it doesn't reopen if the component re-renders
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, pendingBills, openPaymentModal, navigate, location.pathname]);

  if (loading) {
    return <div className="p-4">Loading tables...</div>;
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4">
      <TableHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Table Management */}
        <div className="lg:col-span-2">
          <TableStatusLegend />
          <TableGrid 
            tables={tables} 
            updateTableStatus={updateTableStatus} 
          />
        </div>

        {/* Right Panel - Payment Management */}
        <div className="lg:col-span-1">
          <PendingBillsList
            pendingBills={pendingBills}
            reduceItemQuantity={reduceItemQuantity}
            cancelItem={cancelItem}
            onProcessPaymentClick={openPaymentModal}
            processingBillId={processingBillId}
          />
        </div>
      </div>

      <PaymentModal
        paymentModalBill={paymentModalBill}
        paymentModalView={paymentModalView}
        cashReceived={cashReceived}
        handleClosePaymentModal={handleClosePaymentModal}
        setPaymentModalView={setPaymentModalView}
        handleCashDenomination={handleCashDenomination}
        setCashReceived={setCashReceived}
        processPayment={processPayment}
      />
    </div>
  );
};

export default TableScreen;
