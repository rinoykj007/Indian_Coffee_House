import React from "react";
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
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/MenuList" element={<MenuList />} />
          <Route path="/management/*" element={<ManagementApp />} />
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
