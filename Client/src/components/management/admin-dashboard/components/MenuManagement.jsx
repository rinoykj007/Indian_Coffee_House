import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useMenuItems } from "../hooks/useMenuItems";
import { CategoryManagement } from "./CategoryManagement";
import { SubcategoryManagement } from "./SubcategoryManagement";
import { TabButton } from "./ui/TabButton";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { MenuItemForm } from "./MenuItemForm";
import { MenuItemCard } from "./MenuItemCard";

export const MenuManagement = () => {
  const { menuItems, loading, error, addMenuItem, updateMenuItem, deleteMenuItem } = useMenuItems();

  const [menuSubTab, setMenuSubTab] = useState("items");
  const [showAddMenuItem, setShowAddMenuItem] = useState(false);
  const [showEditMenuItem, setShowEditMenuItem] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState(null);

  const [newMenuItem, setNewMenuItem] = useState({
    id: Math.floor(Math.random() * 10000),
    name: "",
    type: "",
    image: "https://via.placeholder.com/400x300?text=Menu+Item",
    price: "",
    rating: 5.0,
    reviewCount: 0,
    description: "",
    category: "",
    available: true,
  });

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    const menuItemWithId = {
      ...newMenuItem,
      id: parseInt(newMenuItem.id || Math.floor(Math.random() * 10000)),
      price: parseFloat(newMenuItem.price),
      rating: parseFloat(newMenuItem.rating),
      reviewCount: parseInt(newMenuItem.reviewCount),
    };

    const requiredFields = [
      "id", "name", "type", "image", "price", "rating", "reviewCount", "description", "category"
    ];
    const missingFields = requiredFields.filter((field) => !menuItemWithId[field]);

    if (missingFields.length > 0) {
      alert(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    const result = await addMenuItem(menuItemWithId);

    if (result.success) {
      alert("Menu item added successfully!");
      setNewMenuItem({
        id: Math.floor(Math.random() * 10000),
        name: "",
        type: "",
        image: "https://via.placeholder.com/400x300?text=Menu+Item",
        price: "",
        rating: 5.0,
        reviewCount: 0,
        description: "",
        category: "",
        available: true,
      });
      setShowAddMenuItem(false);
    } else {
      alert(`Failed to add menu item: ${result.error}`);
    }
  };

  const handleEditMenuItem = (item) => {
    setCurrentMenuItem(item);
    setNewMenuItem({
      id: item.id || Math.floor(Math.random() * 10000),
      name: item.name,
      type: item.type || "",
      image: item.image || "https://via.placeholder.com/400x300?text=Menu+Item",
      price: item.price || "",
      rating: item.rating || 5.0,
      reviewCount: item.reviewCount || 0,
      description: item.description || "",
      category: item.category || item.type || "",
      available: item.available !== false,
    });
    setShowEditMenuItem(true);
  };

  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    const updatedMenuItem = {
      ...newMenuItem,
      id: parseInt(newMenuItem.id || Math.floor(Math.random() * 10000)),
      price: parseFloat(newMenuItem.price),
      rating: parseFloat(newMenuItem.rating),
      reviewCount: parseInt(newMenuItem.reviewCount),
    };

    const requiredFields = [
      "id", "name", "type", "image", "price", "rating", "reviewCount", "description", "category"
    ];
    const missingFields = requiredFields.filter((field) => !updatedMenuItem[field]);

    if (missingFields.length > 0) {
      alert(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    const result = await updateMenuItem(currentMenuItem._id, updatedMenuItem);

    if (result.success) {
      alert("Menu item updated successfully!");
      setNewMenuItem({
        id: Math.floor(Math.random() * 10000),
        name: "",
        type: "",
        image: "https://via.placeholder.com/400x300?text=Menu+Item",
        price: "",
        rating: 5.0,
        reviewCount: 0,
        description: "",
        category: "",
        available: true,
      });
      setShowEditMenuItem(false);
      setCurrentMenuItem(null);
    } else {
      alert(`Failed to update menu item: ${result.error}`);
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      const result = await deleteMenuItem(itemId);
      if (result.success) {
        alert("Menu item deleted successfully!");
      } else {
        alert(`Failed to delete menu item: ${result.error}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[1rem] font-bold text-slate-800">
          Menu Management
        </h2>
        {menuSubTab === "items" && (
          <Button
            onClick={() => setShowAddMenuItem(true)}
            variant="primary"
            size="md"
            className="flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Menu Item</span>
          </Button>
        )}
      </div>

      <div className="flex border-b border-slate-200">
        <TabButton
          active={menuSubTab === "items"}
          label="Menu Items"
          onClick={() => setMenuSubTab("items")}
        />
        <TabButton
          active={menuSubTab === "categories"}
          label="Categories"
          onClick={() => setMenuSubTab("categories")}
        />
        <TabButton
          active={menuSubTab === "subcategories"}
          label="Subcategories"
          onClick={() => setMenuSubTab("subcategories")}
        />
      </div>

      {menuSubTab === "categories" && <CategoryManagement />}
      {menuSubTab === "subcategories" && <SubcategoryManagement />}

      <Modal
        isOpen={menuSubTab === "items" && showAddMenuItem}
        title="Add New Menu Item"
        onClose={() => setShowAddMenuItem(false)}
      >
        <MenuItemForm
          item={newMenuItem}
          onChange={(field, value) =>
            setNewMenuItem({ ...newMenuItem, [field]: value })
          }
          onSubmit={handleAddMenuItem}
          onCancel={() => setShowAddMenuItem(false)}
          submitText="Add Item"
          submitVariant="primary"
        />
      </Modal>

      <Modal
        isOpen={showEditMenuItem}
        title="Edit Menu Item"
        onClose={() => {
          setShowEditMenuItem(false);
          setCurrentMenuItem(null);
          setNewMenuItem({
            id: Math.floor(Math.random() * 10000),
            name: "",
            type: "",
            image: "https://via.placeholder.com/400x300?text=Menu+Item",
            price: "",
            rating: 5.0,
            reviewCount: 0,
            description: "",
            category: "",
            available: true,
          });
        }}
      >
        <MenuItemForm
          item={newMenuItem}
          onChange={(field, value) =>
            setNewMenuItem({ ...newMenuItem, [field]: value })
          }
          onSubmit={handleUpdateMenuItem}
          onCancel={() => {
            setShowEditMenuItem(false);
            setCurrentMenuItem(null);
            setNewMenuItem({
              id: Math.floor(Math.random() * 10000),
              name: "",
              type: "",
              image: "https://via.placeholder.com/400x300?text=Menu+Item",
              price: "",
              rating: 5.0,
              reviewCount: 0,
              description: "",
              category: "",
              available: true,
            });
          }}
          submitText="Update Item"
          submitVariant="info"
        />
      </Modal>

      {menuSubTab === "items" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <MenuItemCard
              key={item._id}
              item={item}
              onEdit={handleEditMenuItem}
              onDelete={handleDeleteMenuItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};
