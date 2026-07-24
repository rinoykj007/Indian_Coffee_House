import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

export const useSubcategories = () => {
  const { makeAuthenticatedRequest } = useAuth();
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubcategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await makeAuthenticatedRequest("/subcategories");
      if (res.ok) {
        const data = await res.json();
        setSubcategories(data.data || []);
      } else {
        const errData = await res.json().catch(() => null);
        setError(errData?.error || "Failed to fetch subcategories");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [makeAuthenticatedRequest]);

  const addSubcategory = async (subcategoryData) => {
    try {
      const res = await makeAuthenticatedRequest("/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subcategoryData),
      });
      if (res.ok) {
        await fetchSubcategories();
        return { success: true };
      } else {
        const errData = await res.json().catch(() => null);
        return { success: false, error: errData?.error || "Failed to add subcategory" };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateSubcategory = async (id, subcategoryData) => {
    try {
      const res = await makeAuthenticatedRequest(`/subcategories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subcategoryData),
      });
      if (res.ok) {
        await fetchSubcategories();
        return { success: true };
      } else {
        const errData = await res.json().catch(() => null);
        return { success: false, error: errData?.error || "Failed to update subcategory" };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteSubcategory = async (id) => {
    try {
      const res = await makeAuthenticatedRequest(`/subcategories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchSubcategories();
        return { success: true };
      } else {
        const errData = await res.json().catch(() => null);
        return { success: false, error: errData?.error || "Failed to delete subcategory" };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  return {
    subcategories,
    loading,
    error,
    fetchSubcategories,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory
  };
};
