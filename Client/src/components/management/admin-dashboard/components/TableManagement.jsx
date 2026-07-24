import React, { useState } from 'react';
import { Table, Plus, Trash2 } from 'lucide-react';
import { useTableManagement } from '../hooks/useTableManagement';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

export const TableManagement = ({ tables, fetchTabData }) => {
  const { createTable, deleteTable, loading, error, setError } = useTableManagement(fetchTabData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: 2,
    location: 'Main Hall',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createTable({
      tableNumber: formData.tableNumber,
      capacity: parseInt(formData.capacity),
      location: formData.location
    });

    if (result.success) {
      setIsAddModalOpen(false);
      setFormData({ tableNumber: '', capacity: 2, location: 'Main Hall' });
    }
  };

  const handleDelete = async (tableId, tableNumber) => {
    if (window.confirm(`Are you sure you want to delete Table ${tableNumber}?`)) {
      await deleteTable(tableId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">
          Table Management
        </h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Table</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <div
            key={table._id}
            className={`relative p-4 rounded-lg border-2 ${table.status === "available"
                ? "bg-green-50 border-green-200"
                : table.status === "occupied"
                  ? "bg-red-50 border-red-200"
                  : "bg-amber-50 border-amber-200"
              }`}
          >
            <button
              onClick={() => handleDelete(table._id, table.tableNumber)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white hover:bg-red-50 p-1.5 rounded-full shadow-sm transition-colors"
              title="Delete Table"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="text-center mt-2">
              <Table
                className={`w-8 h-8 mx-auto mb-2 ${table.status === "available"
                    ? "text-green-600"
                    : table.status === "occupied"
                      ? "text-red-600"
                      : "text-amber-600"
                  }`}
              />
              <h3 className="font-semibold text-slate-800">
                Table {table.tableNumber}
              </h3>
              <p className="text-sm text-slate-600">
                {table.capacity} guests
              </p>
              <p className="text-sm text-slate-600">{table.location}</p>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${table.status === "available"
                    ? "bg-green-100 text-green-800"
                    : table.status === "occupied"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
              >
                {table.status}
              </span>
            </div>
          </div>
        ))}
        {tables.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            No tables found. Add your first table!
          </div>
        )}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setError(null);
        }}
        title="Add New Table"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <Input
            label="Table Number / Name"
            required
            value={formData.tableNumber}
            onChange={(e) =>
              setFormData({ ...formData, tableNumber: e.target.value })
            }
            placeholder="e.g., 12 or Patio-1"
          />
          <Input
            label="Capacity"
            type="number"
            min="1"
            max="100"
            required
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: e.target.value })
            }
          />
          <Input
            label="Location"
            required
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="e.g., Main Hall, Balcony"
          />
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Add Table
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
