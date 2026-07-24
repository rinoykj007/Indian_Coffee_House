import React from "react";
import { Users } from "lucide-react";
import { TableStatus } from "../../types/table.enums";

const TableCard = ({ table, onSelect }) => {
  const isAvailable = table.status === TableStatus.AVAILABLE;

  return (
    <div
      onClick={() => onSelect(table)}
      className={`
        bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-lg
        ${
          isAvailable
            ? "border-2 border-green-200 hover:border-green-400"
            : "border-2 border-red-200 hover:border-red-400"
        }
      `}
    >
      <div className="text-center">
        <div
          className={`
          w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center
          ${isAvailable ? "bg-green-100" : "bg-red-100"}
        `}
        >
          <Users
            className={`w-5 h-5 ${
              isAvailable ? "text-green-600" : "text-red-600"
            }`}
          />
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-1">
          Table {table.tableNumber}
        </h3>

        <p
          className={`text-sm font-medium capitalize
          ${isAvailable ? "text-green-600" : "text-red-600"}
        `}
        >
          {table.status}
        </p>
      </div>
    </div>
  );
};

export default TableCard;
