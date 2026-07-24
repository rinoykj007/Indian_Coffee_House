import React, { useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useDashboardData } from "../hooks/useDashboardData";
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
  Eye,
  EyeOff,
} from "lucide-react";
import logo from "../../logo.png";
import { CategoryManagement } from "../components/CategoryManagement";
import { SubcategoryManagement } from "../components/SubcategoryManagement";
import { StaffManagement } from "../components/StaffManagement";
import { TableManagement } from "../components/TableManagement";
import { RecentOrders } from "../components/RecentOrders";
import { DashboardOverview } from "../components/DashboardOverview";
import { DashboardNavbar } from "../components/DashboardNavbar";
import { ReportsAnalytics } from "../components/ReportsAnalytics";
import { MenuManagement } from "../components/MenuManagement";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  const { stats, loading } = useDashboardStats();
  const { tables, staffMembers, recentOrders, fetchTabData } = useDashboardData(activeTab);

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <DashboardOverview stats={stats} loading={loading} setActiveTab={setActiveTab} />
        );

      case "menu":
        return (
          <MenuManagement />
        );

      case "staff":
        return (
          <StaffManagement staffMembers={staffMembers} fetchTabData={fetchTabData} />
        );

      case "tables":
        return (
          <TableManagement tables={tables} fetchTabData={fetchTabData} />
        );

      case "orders":
        return (
          <RecentOrders recentOrders={recentOrders} />
        );

      case "reports":
        return (
          <ReportsAnalytics recentOrders={recentOrders} />
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
              <img src={logo} alt="" className="w-10 h-10" />
              <div>
                <h1 className="text-lg sm:text-xl md:text-xl md:text-2xl font-bold text-slate-800">
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
      <DashboardNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

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
