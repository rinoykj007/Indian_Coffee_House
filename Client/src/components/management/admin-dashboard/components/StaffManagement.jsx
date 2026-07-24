import React, { useState } from 'react';
import { PlusCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';

export const StaffManagement = ({ staffMembers, fetchTabData }) => {
  const { makeAuthenticatedRequest } = useAuth();
  
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [newStaffMember, setNewStaffMember] = useState({
    username: "",
    password: "",
    role: "staff",
    name: "",
  });
  const [editStaffData, setEditStaffData] = useState({
    username: "",
    password: "",
    role: "staff",
    name: "",
  });

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const response = await makeAuthenticatedRequest("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaffMember),
      });

      if (response.ok) {
        alert("Staff member added successfully!");
        setNewStaffMember({
          username: "",
          password: "",
          role: "staff",
          name: "",
        });
        setShowAddStaff(false);
        fetchTabData();
      } else {
        alert("Failed to add staff member");
      }
    } catch (error) {
      console.error("Error adding staff member:", error);
      alert("Error adding staff member");
    }
  };

  const handleEditStaff = (staff) => {
    setEditingStaffId(staff._id);
    setEditStaffData({
      username: staff.username,
      password: "", // intentionally left blank
      role: staff.role,
      name: staff.name || staff.username,
    });
    setShowEditStaffModal(true);
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...editStaffData };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

      const response = await makeAuthenticatedRequest(`/auth/users/${editingStaffId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("Staff member updated successfully!");
        setShowEditStaffModal(false);
        fetchTabData();
      } else {
        const errData = await response.json().catch(() => null);
        alert(errData?.error || "Failed to update staff member");
      }
    } catch (error) {
      console.error("Error updating staff member:", error);
      alert("Error updating staff member");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">
          Staff Management
        </h2>
        <button
          onClick={() => setShowAddStaff(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {showAddStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Add New Staff Member
            </h3>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newStaffMember.name}
                  onChange={(e) =>
                    setNewStaffMember({
                      ...newStaffMember,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={newStaffMember.username}
                  onChange={(e) =>
                    setNewStaffMember({
                      ...newStaffMember,
                      username: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newStaffMember.password}
                  onChange={(e) =>
                    setNewStaffMember({
                      ...newStaffMember,
                      password: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role
                </label>
                <select
                  value={newStaffMember.role}
                  onChange={(e) =>
                    setNewStaffMember({
                      ...newStaffMember,
                      role: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="staff">Staff</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg"
                >
                  Add Staff
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStaff(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Staff Member</h3>
            <form onSubmit={handleUpdateStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editStaffData.name}
                  onChange={(e) =>
                    setEditStaffData({
                      ...editStaffData,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editStaffData.username}
                  onChange={(e) =>
                    setEditStaffData({
                      ...editStaffData,
                      username: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  New Password (Optional)
                </label>
                <div className="relative">
                  <input
                    type={showEditPassword ? "text" : "password"}
                    placeholder="Leave blank to keep current"
                    value={editStaffData.password}
                    onChange={(e) =>
                      setEditStaffData({
                        ...editStaffData,
                        password: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showEditPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role
                </label>
                <select
                  value={editStaffData.role}
                  onChange={(e) =>
                    setEditStaffData({
                      ...editStaffData,
                      role: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="staff">Staff</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditStaffModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg border border-amber-200">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-amber-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-800">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-800">
                    Username
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-800">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-800">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-800">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((staff) => (
                  <tr
                    key={staff._id}
                    className="border-b border-amber-100"
                  >
                    <td className="py-3 px-4 text-slate-800">
                      {staff.name || staff.username}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {staff.username}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${staff.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : staff.role === "kitchen"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {staff.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleEditStaff(staff)}
                        className="text-amber-600 hover:text-amber-800 font-medium text-sm border border-amber-600 hover:bg-amber-50 px-3 py-1 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
