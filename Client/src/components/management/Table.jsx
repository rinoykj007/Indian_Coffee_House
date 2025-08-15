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
  const [selectedTableForPayment, setSelectedTableForPayment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedBillDetails, setSelectedBillDetails] = useState(null);

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
      console.log('=== FETCHING PENDING BILLS ===');
      console.log('All tables:', tables);
      
      // Get all occupied tables and their bills
      const occupiedTables = tables.filter(table => table.status === 'occupied');
      console.log('Occupied tables:', occupiedTables);
      
      const bills = [];
      
      for (const table of occupiedTables) {
        try {
          const tableId = table._id || table.id;
          console.log(`Fetching bill for table ${table.tableNumber}, ID: ${tableId}`);
          
          const response = await makeAuthenticatedRequest(`/payments/table/${tableId}/bill`);
          console.log(`Response for table ${table.tableNumber}:`, response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`Bill data for table ${table.tableNumber}:`, data);
            
            if (data.success && data.bill) {
              bills.push(data.bill);
            }
          } else if (response.status === 404) {
            // Table is occupied but no pending order (likely already paid)
            // This is normal - just skip this table
            console.log(`Table ${table.tableNumber} is occupied but has no pending orders (likely already paid)`);
          } else {
            const errorData = await response.json();
            console.error(`Error response for table ${table.tableNumber}:`, errorData);
          }
        } catch (error) {
          console.error(`Error fetching bill for table ${table.tableNumber}:`, error);
        }
      }
      
      console.log('Final bills array:', bills);
      setPendingBills(bills);
    } catch (error) {
      console.error('Error fetching pending bills:', error);
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

  const handleTableSelection = (tableId) => {
    setSelectedTableForPayment(tableId);
    
    // Find and set the selected bill details
    const selectedBill = pendingBills.find(bill => bill.tableId === tableId);
    setSelectedBillDetails(selectedBill);
  };

  const processPayment = async () => {
    if (!selectedTableForPayment) {
      alert('Please select a table for payment');
      return;
    }

    const selectedBill = pendingBills.find(bill => bill.tableId === selectedTableForPayment);
    if (!selectedBill) {
      alert('No pending bill found for selected table');
      return;
    }

    setPaymentLoading(true);
    try {
      const response = await makeAuthenticatedRequest('/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedBill.orderId,
          tableId: selectedBill.tableId,
          paymentMethod: paymentMethod,
          discount: discount,
          staffId: user?._id
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        
        // Refresh tables and bills
        await fetchTables();
        await fetchPendingBills();
        
        // Reset form
        setSelectedTableForPayment('');
        setSelectedBillDetails(null);
        setPaymentMethod('cash');
        setDiscount(0);
      } else {
        const errorData = await response.json();
        alert(`Payment failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment. Please try again.');
    } finally {
      setPaymentLoading(false);
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
                <span className="text-slate-600">Available - Click to take order</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-slate-600">Occupied - Click for options</span>
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
                    ${table.status === "available" ? "bg-green-100" : "bg-red-100"}
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
            <div className="space-y-3">
              {pendingBills.length > 0 ? (
                pendingBills.map((bill) => (
                  <div
                    key={bill.tableId}
                    className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-200"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">
                        Table {bill.tableNumber}
                      </p>
                      <p className="text-sm text-slate-600">
                        {bill.itemsCount} items • Order #{bill.orderNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-600">
                        ₹{bill.totalAmount}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-4">
                  No pending bills
                </p>
              )}
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Process Payment
            </h3>
            
            <div className="space-y-4">
              {/* Table Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Table
                </label>
                <select
                  value={selectedTableForPayment}
                  onChange={(e) => handleTableSelection(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Choose a table...</option>
                  {pendingBills.map((bill) => (
                    <option key={bill.tableId} value={bill.tableId}>
                      Table {bill.tableNumber} • {bill.itemsCount} items • Order #{bill.orderNumber} • ₹{bill.totalAmount}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="online">Online</option>
                </select>
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Discount (₹)
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  min="0"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="0"
                />
              </div>

              {/* Selected Bill Details */}
              {selectedBillDetails && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800 mb-3">
                    Bill Details - Table {selectedBillDetails.tableNumber}
                  </h4>
                  
                  <div className="space-y-2 mb-4">
                    {selectedBillDetails.items && selectedBillDetails.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <span className="font-medium text-slate-700">{item.name}</span>
                          <span className="text-slate-500 ml-2">× {item.quantity}</span>
                        </div>
                        <div className="text-slate-800 font-medium">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-amber-300 pt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal:</span>
                      <span className="text-slate-800">₹{selectedBillDetails.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Tax (18%):</span>
                      <span className="text-slate-800">₹{selectedBillDetails.tax}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t border-amber-300 pt-2">
                      <span className="text-slate-800">Total:</span>
                      <span className="text-amber-600">₹{selectedBillDetails.totalAmount}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Process Payment Button */}
              <button
                onClick={processPayment}
                disabled={paymentLoading || !selectedTableForPayment}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {paymentLoading ? 'Processing...' : 'Process Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
