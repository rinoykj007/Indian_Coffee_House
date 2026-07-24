import React from "react";
import { Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PendingBillCard = ({
  bill,
  reduceItemQuantity,
  cancelItem,
  onProcessPaymentClick,
  processingBillId,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      {/* Bill Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h4 className="font-semibold text-slate-800 text-lg">
            Table {bill.tableNumber}
          </h4>
          <p className="text-sm text-slate-600">
            Order #{bill.orderNumber} • {bill.itemsCount} items
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-amber-600 text-lg">
            €{bill.totalAmount}
          </p>
        </div>
      </div>

      {/* Item Details */}
      <div className="bg-white rounded-lg p-3 mb-3">
        <h5 className="text-sm font-medium text-slate-700 mb-2">
          Order Items:
        </h5>
        <div className="space-y-2">
          {bill.items &&
            bill.items.map((item, index) => (
              <div
                key={item.id || item._id || index}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex-1">
                  <span className="font-medium text-slate-700">
                    {item.name}
                  </span>
                  <span className="text-slate-500 ml-2">
                    × {item.quantity}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-slate-800 font-medium">
                    €{(item.price * item.quantity).toFixed(2)}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => reduceItemQuantity(bill, index)}
                      className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 p-1 rounded transition-colors"
                      title="Reduce quantity by 1"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => cancelItem(bill, index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                      title="Cancel all of this item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Bill Breakdown */}
      <div className="bg-white rounded-lg p-3 border-t border-amber-200">
        <div className="space-y-1">
          <div className="flex justify-between font-semibold text-base mt-2">
            <span className="text-slate-800">Total Amount:</span>
            <span className="text-amber-600">€{bill.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={() =>
          navigate("/management/menu", {
            state: {
              table: { tableNumber: bill.tableNumber },
              tableId: bill.tableId,
              isAdditionalOrder: true,
            },
          })
        }
        className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
      >
        Add More Items
      </button>
      <button
        onClick={() => onProcessPaymentClick(bill)}
        disabled={processingBillId !== null}
        className="w-full mt-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center space-x-2"
      >
        <span>
          {processingBillId === bill.tableId
            ? "Processing..."
            : "Process Payment"}
        </span>
      </button>
    </div>
  );
};

export default PendingBillCard;
