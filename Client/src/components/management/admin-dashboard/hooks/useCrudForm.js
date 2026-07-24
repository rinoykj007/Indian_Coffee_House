import { useState } from 'react';

export const useCrudForm = ({ initialFormData, createAction, updateAction, deleteAction, onSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const handleEdit = (item, mapItemToFormData) => {
    setEditingItem(item);
    setFormData(mapItemToFormData ? mapItemToFormData(item) : { ...initialFormData, ...item });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e, customFormData = null) => {
    e?.preventDefault();
    const dataToSubmit = customFormData || formData;
    
    let result;
    if (editingItem) {
      result = await updateAction(editingItem._id, dataToSubmit);
    } else {
      result = await createAction(dataToSubmit);
    }

    if (result.success) {
      handleCloseModal();
      if (onSuccess) onSuccess();
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id, itemName = "item") => {
    if (window.confirm(`Are you sure you want to delete this ${itemName}?`)) {
      const result = await deleteAction(id);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleAdd = () => {
    setFormData(initialFormData);
    setEditingItem(null);
    setShowModal(true);
  };

  return {
    showModal,
    editingItem,
    formData,
    setFormData,
    handleEdit,
    handleAdd,
    handleCloseModal,
    handleSubmit,
    handleDelete
  };
};
