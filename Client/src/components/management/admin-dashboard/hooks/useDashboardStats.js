import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

export const useDashboardStats = () => {
  const { makeAuthenticatedRequest } = useAuth();
  const [stats, setStats] = useState({
    totalTables: 0,
    availableTables: 0,
    occupiedTables: 0,
    totalMenuItems: 0,
    activeOrders: 0,
    todayRevenue: 0,
    totalStaff: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [tablesRes, menuRes, ordersRes, paymentsRes, usersRes] =
        await Promise.all([
          makeAuthenticatedRequest("/tables/summary/availability"),
          makeAuthenticatedRequest("/menu/stats/summary"),
          makeAuthenticatedRequest("/orders/stats/summary"),
          makeAuthenticatedRequest("/payments/reports/daily"),
          makeAuthenticatedRequest("/auth/users"),
        ]);

      const [tablesData, menuData, ordersData, paymentsData, usersData] =
        await Promise.all([
          tablesRes.json(),
          menuRes.json(),
          ordersRes.json(),
          paymentsRes.json(),
          usersRes.json(),
        ]);

      setStats({
        totalTables: tablesData.totalTables || 0,
        availableTables: tablesData.availableTables || 0,
        occupiedTables: tablesData.occupiedTables || 0,
        totalMenuItems: menuData.totalMenuItems || 0,
        activeOrders: ordersData.activeOrders || 0,
        todayRevenue: paymentsData.todayRevenue || 0,
        totalStaff: Array.isArray(usersData) ? usersData.length : 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return { stats, loading, fetchDashboardStats };
};
