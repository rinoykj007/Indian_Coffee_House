import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Table, Clock, CheckCircle, Coffee, LogOut, Users } from "lucide-react";
import logo from "./logo.png";

const StaffDashboard = () => {
  const { user, logout, makeAuthenticatedRequest } = useAuth();
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    // Set up polling for real-time updates
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds

    // Refresh data when user returns to this page
    const handleFocus = () => {
      fetchDashboardData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const tablesRes = await makeAuthenticatedRequest("/tables");
      const tablesData = await tablesRes.json();
      setTables(tablesData);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const getTableStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 border-green-300 text-green-800";
      case "occupied":
        return "bg-red-100 border-red-300 text-red-800";
      case "reserved":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "cleaning":
        return "bg-blue-100 border-blue-300 text-blue-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const getTableStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-4 h-4" />;
      case "occupied":
        return <Users className="w-4 h-4" />;
      case "reserved":
        return <Clock className="w-4 h-4" />;
      case "cleaning":
        return <Coffee className="w-4 h-4" />;
      default:
        return <Table className="w-4 h-4" />;
    }
  };

  const handleTableClick = (table) => {
    // Navigate to menu page for the selected table using table number
    navigate(`/management/staff/menu/table-${table.tableNumber}`, {
      state: {
        table: table,
        tableId: table._id, // Still pass the actual ID for API calls
        tableNumber: table.tableNumber,
        capacity: table.capacity,
        location: table.location,
      },
    });
  };

  const TableCard = ({ table }) => (
    <div
      onClick={() => handleTableClick(table)}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${getTableStatusColor(
        table.status
      )}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getTableStatusIcon(table.status)}
          <span className="font-semibold">Table {table.tableNumber}</span>
        </div>
        <span className="text-xs font-medium uppercase tracking-wide">
          {table.status}
        </span>
      </div>
      <div className="text-sm opacity-75">
        <p>Capacity: {table.capacity} guests</p>
        <p>Location: {table.location}</p>
        {table.currentOrder && (
          <p className="mt-1 font-medium">
            Order: {table.currentOrder.orderNumber}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img src={logo} alt="" className="w-5 h-5" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Staff Dashboard
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                  Indian Coffee House
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-left sm:text-right">
                <p className="text-sm font-medium text-slate-800">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-600">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tables Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">
            Restaurant Tables
          </h2>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Reserved</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tables.map((table) => (
            <TableCard key={table._id} table={table} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
