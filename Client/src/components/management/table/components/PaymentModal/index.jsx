import React from "react";
import { Banknote, CreditCard, ArrowLeft, RotateCcw } from "lucide-react";
import { PaymentModalView, PaymentMethod } from "../../types/table.enums";

const PaymentModal = ({
  paymentModalBill,
  paymentModalView,
  cashReceived,
  handleClosePaymentModal,
  setPaymentModalView,
  handleCashDenomination,
  setCashReceived,
  processPayment,
}) => {
  if (!paymentModalBill) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl transform transition-all overflow-hidden">
        {paymentModalView === PaymentModalView.SELECT ? (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">
              Select Payment Method
            </h2>
            <p className="text-slate-500 text-center mb-6">
              Table {paymentModalBill.tableNumber} - Total:{" "}
              <span className="font-bold text-slate-800">
                €{paymentModalBill.totalAmount.toFixed(2)}
              </span>
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentModalView(PaymentModalView.CASH)}
                className="flex flex-col items-center justify-center p-4 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-all border-2 border-amber-200 hover:border-amber-400"
              >
                <Banknote className="w-8 h-8 mb-2" />
                <span className="font-bold">Cash</span>
              </button>

              <button
                onClick={() => processPayment(paymentModalBill, PaymentMethod.CARD)}
                className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all border-2 border-blue-200 hover:border-blue-400"
              >
                <CreditCard className="w-8 h-8 mb-2" />
                <span className="font-bold">Card</span>
              </button>
            </div>

            <button
              onClick={handleClosePaymentModal}
              className="w-full mt-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-2.5 px-4 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center mb-4">
              <button
                onClick={() => setPaymentModalView(PaymentModalView.SELECT)}
                className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-slate-800 flex-1 text-center pr-6">
                Cash Payment
              </h2>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500">Total Due:</span>
                <span className="text-xl font-bold text-slate-800">
                  €{paymentModalBill.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500">Received:</span>
                <div className="text-xl font-bold text-amber-600 flex items-center">
                  €{cashReceived.toFixed(2)}
                  {cashReceived > 0 && (
                    <button
                      onClick={() => setCashReceived(0)}
                      className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-200 mt-2">
                <span className="text-slate-500 font-medium">Change:</span>
                <span
                  className={`text-xl font-bold ${
                    cashReceived >= paymentModalBill.totalAmount
                      ? "text-green-600"
                      : "text-slate-300"
                  }`}
                >
                  €
                  {Math.max(
                    0,
                    cashReceived - paymentModalBill.totalAmount
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[50, 20, 10, 5, 2, 1].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleCashDenomination(amount)}
                  className="bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-700 font-bold py-2 rounded-lg transition-colors"
                >
                  €{amount}
                </button>
              ))}
              {[0.5, 0.2, 0.1, 0.05].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleCashDenomination(amount)}
                  className="bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-600 font-medium py-2 rounded-lg transition-colors text-sm"
                >
                  {amount * 100}c
                </button>
              ))}
            </div>

            <button
              onClick={() => processPayment(paymentModalBill, PaymentMethod.CASH)}
              disabled={cashReceived < paymentModalBill.totalAmount}
              className={`w-full font-bold py-3 px-4 rounded-xl transition-colors flex justify-center items-center ${
                cashReceived >= paymentModalBill.totalAmount
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Banknote className="w-5 h-5 mr-2" />
              Confirm Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
