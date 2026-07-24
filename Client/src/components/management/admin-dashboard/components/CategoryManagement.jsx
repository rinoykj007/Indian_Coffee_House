import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { useCrudForm } from "../hooks/useCrudForm";

export const CategoryManagement = () => {
  const { categories, loading, error, addCategory, updateCategory, deleteCategory } = useCategories();
  
  const {
    showModal,
    editingItem: editingCategory,
    formData,
    setFormData,
    handleEdit,
    handleAdd,
    handleCloseModal,
    handleSubmit,
    handleDelete
  } = useCrudForm({
    initialFormData: {
      name: '',
      description: '',
      enabled: true,
      displayOrder: 0
    },
    createAction: addCategory,
    updateAction: updateCategory,
    deleteAction: deleteCategory
  });

  if (loading && categories.length === 0) return <div>Loading categories...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Categories</h3>
        <Button
          onClick={handleAdd}
          variant="primary"
          size="md"
          className="flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Category</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Audit</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{category.name}</div>
                  <div className="text-sm text-slate-500">{category.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {category.enabled ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {category.displayOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                  <div>By: {category.createdBy || 'System'}</div>
                  <div>At: {new Date(category.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button variant="infoLight" size="sm" onClick={() => handleEdit(category, (c) => ({
                      name: c.name,
                      description: c.description || '',
                      enabled: c.enabled,
                      displayOrder: c.displayOrder || 0
                    }))}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(category._id, "category")}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-slate-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
          />
          <Input
            label="Display Order"
            id="displayOrder"
            type="number"
            value={formData.displayOrder}
            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="enabled" className="text-sm text-slate-700">Enabled</label>
          </div>
          <div className="flex space-x-4 pt-2">
            <Button type="submit" variant="primary" size="flex">
              {editingCategory ? 'Update' : 'Add'}
            </Button>
            <Button type="button" variant="secondary" size="flex" onClick={handleCloseModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
