import React from 'react';
import { Table } from 'lucide-react';

export const TableManagement = ({ tables }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-slate-800">
        Table Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((table) => (
          <div
            key={table._id}
            className={`p-4 rounded-lg border-2 ${table.status === "available"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
              }`}
          >
            <div className="text-center">
              <Table
                className={`w-8 h-8 mx-auto mb-2 ${table.status === "available"
                    ? "text-green-600"
                    : "text-red-600"
                  }`}
              />
              <h3 className="font-semibold text-slate-800">
                Table {table.tableNumber}
              </h3>
              <p className="text-sm text-slate-600">
                {table.capacity} guests
              </p>
              <p className="text-sm text-slate-600">{table.location}</p>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${table.status === "available"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                  }`}
              >
                {table.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
