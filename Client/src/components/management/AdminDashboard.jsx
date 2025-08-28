import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Coffee,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  BarChart3,
  Settings,
  Table,
  LogOut,
  PlusCircle,
} from "lucide-react";

const AdminDashboard = () => {
  const { user, logout, makeAuthenticatedRequest } = useAuth();
  const [stats, setStats] = useState({
    totalTables: 0,
    availableTables: 0,
    occupiedTables: 0,
    totalMenuItems: 0,
    activeOrders: 0,
    todayRevenue: 0,
    totalStaff: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [showAddMenuItem, setShowAddMenuItem] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);

  // Form states for adding new items
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    type: "",
    price: "",
    description: "",
    available: true,
  });

  const [newStaffMember, setNewStaffMember] = useState({
    username: "",
    password: "",
    role: "staff",
    name: "",
  });

  useEffect(() => {
    fetchDashboardStats();
    if (activeTab !== "overview") {
      fetchTabData();
    }
  }, [activeTab]);

  const fetchTabData = async () => {
    try {
      switch (activeTab) {
        case "tables":
          const tablesRes = await makeAuthenticatedRequest("/tables");
          if (tablesRes.ok) {
            const tablesData = await tablesRes.json();
            setTables(tablesData.tables || []);
          }
          break;
        case "menu":
          const menuRes = await makeAuthenticatedRequest("/menu");
          if (menuRes.ok) {
            const menuData = await menuRes.json();
            setMenuItems(menuData.menuItems || []);
          }
          break;
        case "staff":
          const staffRes = await makeAuthenticatedRequest("/auth/users");
          if (staffRes.ok) {
            const staffData = await staffRes.json();
            setStaffMembers(staffData || []);
          }
          break;
        case "orders":
          const ordersRes = await makeAuthenticatedRequest("/orders");
          if (ordersRes.ok) {
            const ordersData = await ordersRes.json();
            setRecentOrders(ordersData.orders || []);
          }
          break;
      }
    } catch (error) {
      console.error("Error fetching tab data:", error);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      const response = await makeAuthenticatedRequest("/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMenuItem),
      });

      if (response.ok) {
        alert("Menu item added successfully!");
        setNewMenuItem({
          name: "",
          type: "",
          price: "",
          description: "",
          available: true,
        });
        setShowAddMenuItem(false);
        fetchTabData(); // Refresh menu items
      } else {
        alert("Failed to add menu item");
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Error adding menu item");
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const response = await makeAuthenticatedRequest("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaffMember),
      });

      if (response.ok) {
        alert("Staff member added successfully!");
        setNewStaffMember({
          username: "",
          password: "",
          role: "staff",
          name: "",
        });
        setShowAddStaff(false);
        fetchTabData(); // Refresh staff list
      } else {
        alert("Failed to add staff member");
      }
    } catch (error) {
      console.error("Error adding staff member:", error);
      alert("Error adding staff member");
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch multiple endpoints in parallel
      const [tablesRes, menuRes, ordersRes, paymentsRes, usersRes] =
        await Promise.all([
          makeAuthenticatedRequest("/tables/summary/availability"),
          makeAuthenticatedRequest("/menu/stats/summary"),
          makeAuthenticatedRequest("/orders/stats/summary"),
          makeAuthenticatedRequest("/payments/reports/daily"),
          makeAuthenticatedRequest("/auth/users"),
        ]);

      const [tablesData, menuData, ordersData, paymentsData, usersData] =
        await Promise.all([
          tablesRes.json(),
          menuRes.json(),
          ordersRes.json(),
          paymentsRes.json(),
          usersRes.json(),
        ]);

      console.log("Dashboard API responses:", {
        tablesData,
        menuData,
        ordersData,
        paymentsData,
        usersData: usersData?.length,
      });

      setStats({
        totalTables: tablesData.totalTables || 0,
        availableTables: tablesData.availableTables || 0,
        occupiedTables: tablesData.occupiedTables || 0,
        totalMenuItems: menuData.totalMenuItems || 0,
        activeOrders: ordersData.activeOrders || 0,
        todayRevenue: paymentsData.todayRevenue || 0,
        totalStaff: Array.isArray(usersData) ? usersData.length : 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${color} mt-1`}>
            {loading ? "..." : value}
          </p>
          {subtitle && (
            <p className="text-slate-500 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={`p-3 rounded-full ${color
            .replace("text-", "bg-")
            .replace("-600", "-100")}`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ title, description, icon: Icon, onClick, color }) => (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-amber-200 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left w-full"
    >
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div
          className={`p-2 sm:p-3 rounded-full ${color
            .replace("text-", "bg-")
            .replace("-600", "-100")}`}
        >
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-slate-800">
            {title}
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm">{description}</p>
        </div>
      </div>
    </button>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Tables"
                value={stats.totalTables}
                icon={Table}
                color="text-blue-600"
                subtitle={`${stats.availableTables} available, ${stats.occupiedTables} occupied`}
              />
              <StatCard
                title="Menu Items"
                value={stats.totalMenuItems}
                icon={Coffee}
                color="text-amber-600"
              />
              <StatCard
                title="Active Orders"
                value={stats.activeOrders}
                icon={ShoppingCart}
                color="text-orange-600"
              />
              <StatCard
                title="Today's Revenue"
                value={` €${stats.todayRevenue.toFixed(2)}`}
                icon={DollarSign}
                color="text-green-600"
              />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <QuickAction
                  title="Manage Tables"
                  description="View and manage restaurant tables"
                  icon={Table}
                  color="text-blue-600"
                  onClick={() => setActiveTab("tables")}
                />
                <QuickAction
                  title="Menu Management"
                  description="Add, edit, and manage menu items"
                  icon={Coffee}
                  color="text-amber-600"
                  onClick={() => setActiveTab("menu")}
                />
                <QuickAction
                  title="Staff Management"
                  description="Manage staff accounts and permissions"
                  icon={Users}
                  color="text-purple-600"
                  onClick={() => setActiveTab("staff")}
                />
                <QuickAction
                  title="View Reports"
                  description="Sales reports and analytics"
                  icon={BarChart3}
                  color="text-green-600"
                  onClick={() => setActiveTab("reports")}
                />
                <QuickAction
                  title="Order History"
                  description="View all orders and transactions"
                  icon={ShoppingCart}
                  color="text-orange-600"
                  onClick={() => setActiveTab("orders")}
                />
                <QuickAction
                  title="Settings"
                  description="System settings and configuration"
                  icon={Settings}
                  color="text-slate-600"
                  onClick={() => setActiveTab("settings")}
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">
                  Recent Activity
                </h2>
                <button className="text-amber-600 hover:text-amber-700 font-medium text-sm">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-amber-50 rounded-lg">
                  <div className="bg-amber-600 p-2 rounded-full">
                    <ShoppingCart className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      New order received
                    </p>
                    <p className="text-xs text-slate-600">
                      Table 5 - €850 - 2 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                  <div className="bg-green-600 p-2 rounded-full">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      Payment completed
                    </p>
                    <p className="text-xs text-slate-600">
                      Table 3 - €1,200 - 5 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                  <div className="bg-blue-600 p-2 rounded-full">
                    <Table className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      Table status updated
                    </p>
                    <p className="text-xs text-slate-600">
                      Table 7 now available - 8 minutes ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "menu":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[1rem] font-bold text-slate-800">
                Menu Management
              </h2>
              <button
                onClick={() => setShowAddMenuItem(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Menu Item</span>
              </button>
            </div>

            {/* Add Menu Item Modal */}
            {showAddMenuItem && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Add New Menu Item
                  </h3>
                  <form onSubmit={handleAddMenuItem} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newMenuItem.name}
                        onChange={(e) =>
                          setNewMenuItem({
                            ...newMenuItem,
                            name: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Type
                      </label>
                      <select
                        value={newMenuItem.type}
                        onChange={(e) =>
                          setNewMenuItem({
                            ...newMenuItem,
                            type: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="appetizer">Appetizer</option>
                        <option value="main">Main Course</option>
                        <option value="dessert">Dessert</option>
                        <option value="beverage">Beverage</option>
                        <option value="snack">Snack</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Price ( €)
                      </label>
                      <input
                        type="number"
                        value={newMenuItem.price}
                        onChange={(e) =>
                          setNewMenuItem({
                            ...newMenuItem,
                            price: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={newMenuItem.description}
                        onChange={(e) =>
                          setNewMenuItem({
                            ...newMenuItem,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        rows="3"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newMenuItem.available}
                        onChange={(e) =>
                          setNewMenuItem({
                            ...newMenuItem,
                            available: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <label className="text-sm text-slate-700">
                        Available
                      </label>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg"
                      >
                        Add Item
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddMenuItem(false)}
                        className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-lg border border-amber-200 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-800">
                      {item.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{item.type}</p>
                  <p className="text-lg font-bold text-amber-600">
                    €{item.price}
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "staff":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-2xl       font-bold text-slate-800">
                Staff Management
              </h2>
              <button
                onClick={() => setShowAddStaff(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Staff Member</span>
              </button>
            </div>

            {/* Add Staff Modal */}
            {showAddStaff && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Add New Staff Member
                  </h3>
                  <form onSubmit={handleAddStaff} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={newStaffMember.name}
                        onChange={(e) =>
                          setNewStaffMember({
                            ...newStaffMember,
                            name: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={newStaffMember.username}
                        onChange={(e) =>
                          setNewStaffMember({
                            ...newStaffMember,
                            username: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={newStaffMember.password}
                        onChange={(e) =>
                          setNewStaffMember({
                            ...newStaffMember,
                            password: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Role
                      </label>
                      <select
                        value={newStaffMember.role}
                        onChange={(e) =>
                          setNewStaffMember({
                            ...newStaffMember,
                            role: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      >
                        <option value="staff">Staff</option>
                        <option value="kitchen">Kitchen</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg"
                      >
                        Add Staff
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddStaff(false)}
                        className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Staff Members List */}
            <div className="bg-white rounded-lg shadow-lg border border-amber-200">
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-amber-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-800">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-800">
                          Username
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-800">
                          Role
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-800">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffMembers.map((staff) => (
                        <tr
                          key={staff._id}
                          className="border-b border-amber-100"
                        >
                          <td className="py-3 px-4 text-slate-800">
                            {staff.name || staff.username}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {staff.username}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                staff.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : staff.role === "kitchen"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {staff.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case "tables":
        return (
          <div className="space-y-6">
            <h2 className="text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-2xl       font-bold text-slate-800">
              Table Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tables.map((table) => (
                <div
                  key={table._id}
                  className={`p-4 rounded-lg border-2 ${
                    table.status === "available"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="text-center">
                    <Table
                      className={`w-8 h-8 mx-auto mb-2 ${
                        table.status === "available"
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
                      className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                        table.status === "available"
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

      case "orders":
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-2xl       font-bold text-slate-800">
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
                                className={`px-2 py-1 rounded-full text-xs ${
                                  order.status === "completed"
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

      case "reports":
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-2xl       font-bold text-slate-800">
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
                          className={`text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-2xl       font-bold mb-1 ${
                            status === "completed"
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

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-amber-600 p-1.5 sm:p-2 rounded-full">
                <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-sm:text-xl md:text-2xl       font-bold text-slate-800">
                  Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Welcome back, {user?.username || "Admin"}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "tables", label: "Tables", icon: Table },
              { id: "menu", label: "Menu", icon: Coffee },
              { id: "staff", label: "Staff", icon: Users },
              { id: "orders", label: "Orders", icon: ShoppingCart },
              { id: "reports", label: "Reports", icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-amber-600 text-amber-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
