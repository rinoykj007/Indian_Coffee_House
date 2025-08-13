import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import Home from "./components/Home.jsx";
import MenuList from "./sections/Menu/Meanulist.jsx";
import ManagementApp from "./components/management/ManagementApp.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import Login from "./components/management/Login.jsx";
import Table from "./components/management/Table.jsx";
import Admin from "./components/management/AdminDashboard.jsx";
import Menu from "./components/management/MenuPage.jsx";
// import Kitchen from "./components/management/Kitchen.jsx";

export default function App() {
  // Loader state
  const [loading, setLoading] = useState(true);

  // Loader effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loader-container fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
        <div className="loader-content text-center">
          <div className="loader-spinner w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Indian Coffee House
          </h2>
          <p className="text-amber-400">Loading authentic flavors...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/MenuList" element={<MenuList />} />
          <Route path="/management/*" element={<ManagementApp />} />
          {/* Catch old routes and redirect */}
          <Route
            path="/staff/*"
            element={<Navigate to="/management/staff" replace />}
          />
          <Route path="/management/login" element={<Login />} />
          <Route path="/management/staff" element={<Table />} />
          <Route path="/management/admin" element={<Admin />} />
          <Route path="/management/menu" element={<Menu />} />
          {/* <Route path="/management/kitchen" element={<Kitchen />} /> */}
        </Routes>
      </div>
    </AuthProvider>
  );
}
