import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

export const useDashboardData = (activeTab) => {
  const { makeAuthenticatedRequest } = useAuth();
  const [tables, setTables] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const fetchTabData = async () => {
    try {
      switch (activeTab) {
        case "tables":
          const tablesRes = await makeAuthenticatedRequest("/tables");
          if (tablesRes.ok) {
            const tablesData = await tablesRes.json();
            setTables(tablesData.tables || []);
          }
          break;
        case "staff":
          const staffRes = await makeAuthenticatedRequest("/auth/users");
          if (staffRes.ok) {
            const staffData = await staffRes.json();
            setStaffMembers(staffData.users || staffData || []);
          }
          break;
        case "orders":
          const ordersRes = await makeAuthenticatedRequest("/orders");
          if (ordersRes.ok) {
            const ordersData = await ordersRes.json();
            setRecentOrders(ordersData.orders || []);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error fetching tab data:", error);
    }
  };

  useEffect(() => {
    if (activeTab !== "overview") {
      fetchTabData();
    }
  }, [activeTab]);

  return { tables, staffMembers, recentOrders, fetchTabData };
};
