import React from 'react';

export const QuickAction = ({ title, description, icon: Icon, onClick, color }) => (
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
