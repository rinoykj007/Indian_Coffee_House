import React from "react";
import TableCard from "../TableCard";
import { useNavigate } from "react-router-dom";
import { TableStatus } from "../../types/table.enums";

const TableGrid = ({ tables, updateTableStatus }) => {
  const navigate = useNavigate();

  const handleSelectTable = async (table) => {
    if (table.status === TableStatus.OCCUPIED) {
      const action = window.confirm(
        `Table ${table.tableNumber} is occupied. Click OK to add more items to their order, or Cancel to mark table as available (customers finished).`
      );

      if (action) {
        navigate("/management/menu", {
          state: {
            table: { tableNumber: table.tableNumber },
            tableId: table._id || table.id,
            isAdditionalOrder: true,
          },
        });
      } else {
        await updateTableStatus(table._id || table.id, TableStatus.AVAILABLE);
      }
      return;
    }

    navigate("/management/menu", {
      state: {
        table: { tableNumber: table.tableNumber },
        tableId: table._id || table.id,
        isAdditionalOrder: false,
      },
    });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {tables.map((table, index) => (
        <TableCard
          key={table._id || table.id || index}
          table={table}
          onSelect={handleSelectTable}
        />
      ))}
    </div>
  );
};

export default TableGrid;
