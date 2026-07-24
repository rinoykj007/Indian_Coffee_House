import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

export const useCategories = () => {
  const { makeAuthenticatedRequest } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await makeAuthenticatedRequest("/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      } else {
        const errData = await res.json().catch(() => null);
        setError(errData?.error || "Failed to fetch categories");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [makeAuthenticatedRequest]);

  const addCategory = async (categoryData) => {
    try {
      const res = await makeAuthenticatedRequest("/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
      if (res.ok) {
        await fetchCategories();
        return { success: true };
      } else {
        const errData = await res.json().catch(() => null);
        return { success: false, error: errData?.error || "Failed to add category" };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const res = await makeAuthenticatedRequest(`/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
      if (res.ok) {
        await fetchCategories();
        return { success: true };
      } else {
        const errData = await res.json().catch(() => null);
        return { success: false, error: errData?.error || "Failed to update category" };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await makeAuthenticatedRequest(`/categories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchCategories();
        return { success: true };
      } else {
        const errData = await res.json().catch(() => null);
        return { success: false, error: errData?.error || "Failed to delete category" };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };
};
