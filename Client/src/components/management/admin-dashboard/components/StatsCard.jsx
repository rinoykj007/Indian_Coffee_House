import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color, subtitle, loading }) => (
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
