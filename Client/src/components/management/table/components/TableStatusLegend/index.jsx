import React from "react";

const TableStatusLegend = () => {
  return (
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
  );
};

export default TableStatusLegend;
