import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Coffee, Users, LogOut } from "lucide-react";

const Table = () => {
  const { user, logout, makeAuthenticatedRequest } = useAuth();
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingBills, setPendingBills] = useState([]);
  const [processingBillId, setProcessingBillId] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  // Fetch pending bills after tables are loaded
  useEffect(() => {
    if (tables.length > 0) {
      fetchPendingBills();
    }
  }, [tables]);

  const fetchPendingBills = async () => {
    try {
      console.log("=== FETCHING PENDING BILLS ===");
      console.log("All tables:", tables);

      // Get all occupied tables and their bills
      const occupiedTables = tables.filter(
        (table) => table.status === "occupied"
      );
      console.log("Occupied tables:", occupiedTables);

      const bills = [];

      for (const table of occupiedTables) {
        try {
          const tableId = table._id || table.id;
          console.log(
            `Fetching bill for table ${table.tableNumber}, ID: ${tableId}`
          );

          const response = await makeAuthenticatedRequest(
            `/payments/table/${tableId}/bill`
          );
          console.log(
            `Response for table ${table.tableNumber}:`,
            response.status
          );

          if (response.ok) {
            const data = await response.json();
            console.log(`Bill data for table ${table.tableNumber}:`, data);

            if (data.success && data.bill) {
              bills.push(data.bill);
            }
          } else if (response.status === 404) {
            // Table is occupied but no pending order (likely already paid)
            // This is normal - just skip this table
            console.log(
              `Table ${table.tableNumber} is occupied but has no pending orders (likely already paid)`
            );
          } else {
            const errorData = await response.json();
            console.error(
              `Error response for table ${table.tableNumber}:`,
              errorData
            );
          }
        } catch (error) {
          console.error(
            `Error fetching bill for table ${table.tableNumber}:`,
            error
          );
        }
      }

      console.log("Final bills array:", bills);
      setPendingBills(bills);
    } catch (error) {
      console.error("Error fetching pending bills:", error);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await makeAuthenticatedRequest("/tables");
      const data = await response.json();
      setTables(data.tables || []);
    } catch (error) {
      console.error("Error fetching tables:", error);
      // Create dummy tables if API fails
      setTables([
        { id: 1, tableNumber: 1, status: "available" },
        { id: 2, tableNumber: 2, status: "occupied" },
        { id: 3, tableNumber: 3, status: "available" },
        { id: 4, tableNumber: 4, status: "available" },
        { id: 5, tableNumber: 5, status: "occupied" },
        { id: 6, tableNumber: 6, status: "available" },
        { id: 7, tableNumber: 7, status: "available" },
        { id: 8, tableNumber: 8, status: "occupied" },
        { id: 9, tableNumber: 9, status: "available" },
        { id: 10, tableNumber: 10, status: "available" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const selectTable = async (table) => {
    // Debug: Log table data before navigation
    console.log("=== TABLE SELECTION DEBUG ===");
    console.log("Selected table:", table);
    console.log("Table ID (_id):", table._id);
    console.log("Table ID (id):", table.id);
    console.log("Table Number:", table.tableNumber);
    console.log("Table Status:", table.status);
    console.log("Final tableId being passed:", table._id || table.id);
    console.log("===============================");

    if (table.status === "occupied") {
      // Show options for occupied table
      const action = window.confirm(
        `Table ${table.tableNumber} is occupied. Click OK to add more items to their order, or Cancel to mark table as available (customers finished).`
      );

      if (action) {
        // Staff wants to add more items - navigate to menu
        navigate("/management/menu", {
          state: {
            table: { tableNumber: table.tableNumber },
            tableId: table._id || table.id,
            isAdditionalOrder: true, // Flag to indicate this is additional items
          },
        });
      } else {
        // Staff wants to free up the table
        await updateTableStatus(table._id || table.id, "available");
      }
      return;
    }

    // Available table - navigate to menu for new order
    navigate("/management/menu", {
      state: {
        table: { tableNumber: table.tableNumber },
        tableId: table._id || table.id,
        isAdditionalOrder: false, // New order
      },
    });
  };

  const processPayment = async (bill) => {
    // Prevent multiple payments at once
    if (processingBillId) {
      return;
    }

    setProcessingBillId(bill.tableId);
    try {
      const response = await makeAuthenticatedRequest("/payments/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: bill.orderId,
          tableId: bill.tableId,
          paymentMethod: "cash",
          discount: 0,
          staffId: user?._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);

        // Immediately remove the processed bill from UI for instant feedback
        setPendingBills((prevBills) =>
          prevBills.filter((b) => b.tableId !== bill.tableId)
        );

        // Refresh tables and bills with a small delay to ensure backend is updated
        setTimeout(async () => {
          await fetchTables();
          await fetchPendingBills();
        }, 500);
      } else {
        const errorData = await response.json();
        alert(`Payment failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Error processing payment. Please try again.");
    } finally {
      setProcessingBillId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/management/login");
  };

  if (loading) {
    return <div className="p-4">Loading tables...</div>;
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-amber-600 p-1.5 sm:p-2 rounded-lg">
              <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
                Staff Dashboard
              </h1>
              <p className="text-sm sm:text-base text-slate-600">
                Welcome, {user?.name || user?.username}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-sm sm:text-base"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Two Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Table Management */}
        <div className="lg:col-span-2">
          {/* Status Legend */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Table Management
            </h3>
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-slate-600">
                  Available - Click to take order
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-slate-600">
                  Occupied - Click for options
                </span>
              </div>
            </div>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {tables.map((table) => (
              <div
                key={table.id}
                onClick={() => selectTable(table)}
                className={`
                  bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-lg
                  ${
                    table.status === "available"
                      ? "border-2 border-green-200 hover:border-green-400"
                      : "border-2 border-red-200 hover:border-red-400"
                  }
                `}
              >
                <div className="text-center">
                  <div
                    className={`
                    w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center
                    ${
                      table.status === "available"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }
                  `}
                  >
                    <Users
                      className={`w-5 h-5 ${
                        table.status === "available"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    />
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-1">
                    Table {table.tableNumber}
                  </h3>

                  <p
                    className={`text-sm font-medium capitalize
                    ${
                      table.status === "available"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  `}
                  >
                    {table.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Payment Management */}
        <div className="lg:col-span-1">
          {/* Pending Bills */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Pending Bills
            </h3>
            <div className="space-y-4">
              {pendingBills.length > 0 ? (
                pendingBills.map((bill) => (
                  <div
                    key={bill.tableId}
                    className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                  >
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
                          ₹{bill.totalAmount}
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
                              key={index}
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
                              <div className="text-slate-800 font-medium">
                                ₹{(item.price * item.quantity).toFixed(0)}
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
                          <span className="text-amber-600">
                            ₹{bill.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Payment Button */}
                    {/* Add More Items Button */}
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
                    {/* Quick Payment Button */}
                    <button
                      onClick={() => processPayment(bill)}
                      disabled={processingBillId !== null}
                      className="w-full mt-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      {processingBillId === bill.tableId
                        ? "Processing..."
                        : "Process Payment (Cash)"}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-4">
                  No pending bills
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
