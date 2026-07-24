import React from 'react';
import { BarChart3, Table, Coffee, Users, ShoppingCart, TrendingUp } from 'lucide-react';

export const DashboardNavbar = ({ activeTab, setActiveTab }) => {
  return (
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
  );
};
