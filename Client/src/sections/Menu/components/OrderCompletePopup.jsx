import React from "react";

const OrderCompletePopup = ({ orderComplete }) => (
  orderComplete && (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-2xl transform transition-all duration-500 scale-100 animate-bounce">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-check text-green-600 text-3xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 text-lg">
            Thank you for your order. Your delicious food will be prepared shortly!
          </p>
        </div>
        <div className="space-y-2 text-sm text-gray-500">
          <p><i className="fas fa-clock mr-2"></i>Estimated delivery: 30-45 minutes</p>
          <p><i className="fas fa-phone mr-2"></i>We'll call you when ready</p>
        </div>
      </div>
    </div>
  )
);

export default OrderCompletePopup;
