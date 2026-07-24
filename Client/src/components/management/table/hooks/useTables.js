import { useState, useCallback, useEffect } from "react";
import { fetchTablesApi, updateTableStatusApi } from "../api/table.api";
import { useAuth } from "../../../../contexts/AuthContext";

export const useTables = () => {
  const { makeAuthenticatedRequest } = useAuth();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTables = useCallback(async () => {
    try {
      const data = await fetchTablesApi(makeAuthenticatedRequest);
      setTables(data.tables || []);
    } catch (error) {
      console.error("Error fetching tables:", error);
      setTables([]);
    } finally {
      setLoading(false);
    }
  }, [makeAuthenticatedRequest]);

  const updateTableStatus = useCallback(async (tableId, status) => {
    try {
      await updateTableStatusApi(makeAuthenticatedRequest, tableId, status);
      setTables((currentTables) =>
        currentTables.map((table) =>
          (table._id || table.id) === tableId ? { ...table, status } : table
        )
      );
    } catch (error) {
      console.error(`Failed to update table status:`, error);
    }
  }, [makeAuthenticatedRequest]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  return {
    tables,
    loading,
    fetchTables,
    updateTableStatus,
  };
};
