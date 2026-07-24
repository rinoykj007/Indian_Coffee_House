import React from 'react';
import { ShoppingCart } from 'lucide-react';

export const RecentOrders = ({ recentOrders }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">
          Recent Orders
        </h2>
        <div className="text-sm text-slate-600">
          Total Orders: {recentOrders.length}
        </div>
      </div>

      {recentOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg border border-amber-200 p-8 text-center">
          <ShoppingCart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">
            No Orders Yet
          </h3>
          <p className="text-slate-500">
            Orders will appear here when customers place them.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg border border-amber-200">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-amber-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">
                      Table
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">
                      Items
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">
                      Total
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-amber-100 hover:bg-amber-50"
                    >
                      <td className="py-3 px-4 text-slate-800 font-mono text-sm">
                        #{order._id?.slice(-6) || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        Table{" "}
                        {order.table?.tableNumber ||
                          order.tableNumber ||
                          "N/A"}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {order.items?.length || 0} items
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-semibold">
                        €{order.total || 0}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "preparing"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "pending"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {order.status || "pending"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-sm">
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
