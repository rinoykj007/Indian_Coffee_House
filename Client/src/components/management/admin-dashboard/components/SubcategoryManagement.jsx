import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useSubcategories } from '../hooks/useSubcategories';
import { useCategories } from '../hooks/useCategories';

export const SubcategoryManagement = () => {
  const { subcategories, loading, error, addSubcategory, updateSubcategory, deleteSubcategory } = useSubcategories();
  const { categories } = useCategories();
  
  const [showModal, setShowModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    parentCategory: '',
    description: '',
    enabled: true,
    displayOrder: 0
  });

  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setFormData({
      name: subcategory.name,
      parentCategory: subcategory.parentCategory?._id || '',
      description: subcategory.description || '',
      enabled: subcategory.enabled,
      displayOrder: subcategory.displayOrder || 0
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSubcategory(null);
    setFormData({ name: '', parentCategory: '', description: '', enabled: true, displayOrder: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.parentCategory) {
      alert("Please select a parent category.");
      return;
    }

    let result;
    if (editingSubcategory) {
      result = await updateSubcategory(editingSubcategory._id, formData);
    } else {
      result = await addSubcategory(formData);
    }

    if (result.success) {
      handleCloseModal();
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      const result = await deleteSubcategory(id);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  if (loading && subcategories.length === 0) return <div>Loading subcategories...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Subcategories</h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg flex items-center space-x-2 text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Subcategory</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Parent Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Audit</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {subcategories.map((subcategory) => (
              <tr key={subcategory._id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{subcategory.name}</div>
                  <div className="text-sm text-slate-500">{subcategory.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {subcategory.parentCategory?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${subcategory.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {subcategory.enabled ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {subcategory.displayOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                  <div>By: {subcategory.createdBy || 'System'}</div>
                  <div>At: {new Date(subcategory.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(subcategory)} className="text-blue-600 hover:text-blue-900 mr-4">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(subcategory._id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {subcategories.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-slate-500">
                  No subcategories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Parent Category</label>
                <select
                  value={formData.parentCategory}
                  onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.filter(c => c.enabled).map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="rounded"
                />
                <label className="text-sm text-slate-700">Enabled</label>
              </div>
              <div className="flex space-x-4 pt-2">
                <button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg">
                  {editingSubcategory ? 'Update' : 'Add'}
                </button>
                <button type="button" onClick={handleCloseModal} className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
