import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

export const useTableManagement = (fetchTabData) => {
  const { makeAuthenticatedRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTable = async (tableData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await makeAuthenticatedRequest('/tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tableData),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchTabData(); // Refresh the list
        return { success: true };
      } else {
        setError(data.error || 'Failed to create table');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error creating table:', err);
      setError('Network error occurred');
      return { success: false, error: 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const deleteTable = async (tableId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await makeAuthenticatedRequest(`/tables/${tableId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        await fetchTabData(); // Refresh the list
        return { success: true };
      } else {
        setError(data.error || 'Failed to delete table');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error deleting table:', err);
      setError('Network error occurred');
      return { success: false, error: 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  return {
    createTable,
    deleteTable,
    loading,
    error,
    setError
  };
};
