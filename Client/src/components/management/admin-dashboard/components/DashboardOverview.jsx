import React from 'react';
import { Table, Coffee, ShoppingCart, DollarSign, Users, BarChart3, Settings } from 'lucide-react';
import { StatCard } from './StatsCard';
import { QuickAction } from './QuickActions';

export const DashboardOverview = ({ stats, loading, setActiveTab }) => {
  const statCardsConfig = [
    {
      title: "Total Tables",
      value: stats.totalTables,
      icon: Table,
      color: "text-blue-600",
      subtitle: `${stats.availableTables} available, ${stats.occupiedTables} occupied`
    },
    {
      title: "Total Menu Items",
      value: stats.totalMenuItems,
      icon: Coffee,
      color: "text-amber-600",
      subtitle: "Active items on menu"
    },
    {
      title: "Active Orders",
      value: stats.activeOrders,
      icon: ShoppingCart,
      color: "text-orange-600",
      subtitle: "Currently being prepared"
    },
    {
      title: "Today's Revenue",
      value: `€${stats.todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      subtitle: "Total sales today"
    }
  ];

  const quickActionsConfig = [
    { title: "Manage Tables", description: "View and manage restaurant tables", icon: Table, color: "text-blue-600", tabId: "tables" },
    { title: "Menu Management", description: "Add, edit, and manage menu items", icon: Coffee, color: "text-amber-600", tabId: "menu" },
    { title: "Staff Management", description: "Manage staff accounts and permissions", icon: Users, color: "text-purple-600", tabId: "staff" },
    { title: "View Reports", description: "Sales reports and analytics", icon: BarChart3, color: "text-green-600", tabId: "reports" },
    { title: "Order History", description: "View all orders and transactions", icon: ShoppingCart, color: "text-orange-600", tabId: "orders" },
    { title: "Settings", description: "System settings and configuration", icon: Settings, color: "text-slate-600", tabId: "settings" }
  ];

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCardsConfig.map((stat, index) => (
          <StatCard
            key={index}
            loading={loading}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActionsConfig.map((action, index) => (
            <QuickAction
              key={index}
              title={action.title}
              description={action.description}
              icon={action.icon}
              color={action.color}
              onClick={() => setActiveTab(action.tabId)}
            />
          ))}
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
};
