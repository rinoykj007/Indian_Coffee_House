const express = require("express");
const Menu = require("../models/Menu");
const router = express.Router();

// GET /api/menu - Get all menu items from MongoDB Cloud
router.get("/", async (req, res) => {
  try {
    const menuItems = await Menu.find({});
    res.json({ menuItems });
  } catch (error) {
    console.error("Menu fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch menu items",
    });
  }
});

// GET /api/menu/stats/summary - Get menu statistics for admin dashboard
router.get("/stats/summary", async (req, res) => {
  try {
    const totalMenuItems = await Menu.countDocuments({});
    const availableItems = await Menu.countDocuments({ isAvailable: true });
    const unavailableItems = await Menu.countDocuments({ isAvailable: false });

    res.json({
      totalMenuItems,
      availableItems,
      unavailableItems,
    });
  } catch (error) {
    console.error("Menu stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch menu statistics",
    });
  }
});

// POST /api/menu - Add new menu item (admin only)
router.post("/", async (req, res) => {
  try {
    const {
      id,
      name,
      type,
      image,
      price,
      rating,
      reviewCount,
      description,
      category,
    } = req.body;

    if (
      !id ||
      !name ||
      !type ||
      !image ||
      !price ||
      !rating ||
      !reviewCount ||
      !description ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        error:
          "All fields (id, name, type, image, price, rating, reviewCount, description, category) are required",
      });
    }

    const newMenuItem = new Menu({
      id,
      name,
      type,
      image,
      price: parseFloat(price),
      rating: parseFloat(rating),
      reviewCount: parseInt(reviewCount),
      description,
      category,
    });

    await newMenuItem.save();

    res.json({
      success: true,
      message: "Menu item added successfully",
      menuItem: newMenuItem,
    });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add menu item",
    });
  }
});

// PUT /api/menu/:id - Update a menu item (admin only)
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      type,
      image,
      price,
      rating,
      reviewCount,
      description,
      category,
      available,
    } = req.body;

    // Find the menu item by ID
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: "Menu item not found",
      });
    }

    // Update the menu item fields if they exist in the request body
    if (name) menuItem.name = name;
    if (type) menuItem.type = type;
    if (image) menuItem.image = image;
    if (price !== undefined) menuItem.price = parseFloat(price);
    if (rating !== undefined) menuItem.rating = parseFloat(rating);
    if (reviewCount !== undefined) menuItem.reviewCount = parseInt(reviewCount);
    if (description) menuItem.description = description;
    if (category) menuItem.category = category;
    if (available !== undefined) menuItem.available = available;

    await menuItem.save();

    res.json({
      success: true,
      message: "Menu item updated successfully",
      menuItem: menuItem,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update menu item",
    });
  }
});

// DELETE /api/menu/:id - Delete a menu item (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const menuItem = await Menu.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete menu item",
    });
  }
});

module.exports = router;
