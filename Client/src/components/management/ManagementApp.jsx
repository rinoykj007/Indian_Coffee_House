import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Settings, ChefHat } from "lucide-react";

export default function ManagementApp() {
  const navigate = useNavigate();
  const roles = [
    {
      id: "staff",
      title: "Staff",
      description: "Manage tables, take orders, and process payments",
      icon: Users,
    },
    {
      id: "admin",
      title: "Admin",
      description: "Manage staff, view reports, and configure settings",
      icon: Settings,
    },
    {
      id: "kitchen",
      title: "Kitchen",
      description: "View and manage incoming orders",
      icon: ChefHat,
    },
  ];
  const handleRoleSelection = () => {
    navigate("/management/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-red-500 mb-2">
            Restaurant Management
          </h1>
          <div className="mt-8">
            <h2 className="text-4xl font-bold text-slate-800 mb-2">Welcome</h2>
            <p className="text-slate-600">
              Please select your role to continue
            </p>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <div
                key={role.id}
                onClick={() => handleRoleSelection()}
                className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow border-2 border-transparent hover:border-amber-200"
              >
                <div className="text-center">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {role.title}
                  </h3>
                  <p className="text-slate-600 text-sm">{role.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
