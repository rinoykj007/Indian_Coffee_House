import React from "react";
import PendingBillCard from "../PendingBillCard";

const PendingBillsList = ({
  pendingBills,
  reduceItemQuantity,
  cancelItem,
  onProcessPaymentClick,
  processingBillId,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Pending Bills
      </h3>
      <div className="space-y-4">
        {pendingBills.length > 0 ? (
          pendingBills.map((bill) => (
            <PendingBillCard
              key={bill.tableId}
              bill={bill}
              reduceItemQuantity={reduceItemQuantity}
              cancelItem={cancelItem}
              onProcessPaymentClick={onProcessPaymentClick}
              processingBillId={processingBillId}
            />
          ))
        ) : (
          <p className="text-slate-500 text-center py-4">No pending bills</p>
        )}
      </div>
    </div>
  );
};

export default PendingBillsList;
