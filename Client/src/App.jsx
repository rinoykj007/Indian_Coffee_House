import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import Home from "./components/Home.jsx";
import MenuList from "./sections/Menu/Meanulist.jsx";
import ManagementApp from "./components/management/ManagementApp.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./components/management/Login.jsx";
import Table from "./components/management/Table.jsx";
import Admin from "./components/management/AdminDashboard.jsx";
import Menu from "./components/management/MenuPage.jsx";
// import Kitchen from "./components/management/Kitchen.jsx";

export default function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/MenuList" element={<MenuList />} />

          {/* Management Role Selection - Public (redirects to login) */}
          <Route path="/management" element={<ManagementApp />} />

          {/* Login Route - Public */}
          <Route path="/management/login" element={<Login />} />

          {/* Protected Staff Routes - Require Authentication */}
          <Route
            path="/management/staff"
            element={
              <ProtectedRoute>
                <Table />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes - Require Admin Role */}
          <Route
            path="/management/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Protected Menu Management - Require Admin Role */}
          <Route
            path="/management/menu"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Menu />
              </ProtectedRoute>
            }
          />

          {/* Legacy redirect */}
          <Route
            path="/staff/*"
            element={<Navigate to="/management/staff" replace />}
          />

          {/* <Route path="/management/kitchen" element={<Kitchen />} /> */}
        </Routes>
      </div>
    </AuthProvider>
  );
}
