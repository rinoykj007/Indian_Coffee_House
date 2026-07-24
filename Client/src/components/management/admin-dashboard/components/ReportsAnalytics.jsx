import React from 'react';
import { ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

export const ReportsAnalytics = ({ recentOrders }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">
          Reports & Analytics
        </h2>
        <div className="text-sm text-slate-600">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">
                Today's Orders
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {
                  recentOrders.filter((order) => {
                    const orderDate = new Date(order.orderDate);
                    const today = new Date();
                    return (
                      orderDate.toDateString() === today.toDateString()
                    );
                  }).length
                }
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">
                Today's Revenue
              </p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                €
                {recentOrders
                  .filter((order) => {
                    const orderDate = new Date(order.orderDate);
                    const today = new Date();
                    return (
                      orderDate.toDateString() === today.toDateString()
                    );
                  })
                  .reduce((sum, order) => sum + (order.total || 0), 0)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">
                Avg Order Value
              </p>
              <p className="text-3xl font-bold text-amber-600 mt-1">
                €
                {recentOrders.length > 0
                  ? Math.round(
                    recentOrders.reduce(
                      (sum, order) => sum + (order.total || 0),
                      0
                    ) / recentOrders.length
                  )
                  : 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-amber-100">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-lg shadow-lg border border-amber-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Order Status Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["pending", "preparing", "completed", "cancelled"].map(
            (status) => {
              const count = recentOrders.filter(
                (order) => order.status === status
              ).length;
              const percentage =
                recentOrders.length > 0
                  ? Math.round((count / recentOrders.length) * 100)
                  : 0;

              return (
                <div
                  key={status}
                  className="text-center p-4 bg-slate-50 rounded-lg"
                >
                  <div
                    className={`text-xl md:text-2xl font-bold mb-1 ${status === "completed"
                        ? "text-green-600"
                        : status === "preparing"
                          ? "text-yellow-600"
                          : status === "pending"
                            ? "text-blue-600"
                            : "text-red-600"
                      }`}
                  >
                    {count}
                  </div>
                  <div className="text-sm text-slate-600 capitalize">
                    {status}
                  </div>
                  <div className="text-xs text-slate-500">
                    {percentage}%
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};
