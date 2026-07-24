import React from "react";
import { Coffee, LogOut } from "lucide-react";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const TableHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/management/login");
  };

  return (
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
          className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-sm sm:text-base transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default TableHeader;
