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
    const { name, type, price, description, available } = req.body;

    if (!name || !type || !price) {
      return res.status(400).json({
        success: false,
        error: "Name, type, and price are required",
      });
    }

    // Create new menu item
    const newMenuItem = new Menu({
      name,
      type,
      price: parseFloat(price),
      description: description || "",
      available: available !== undefined ? available : true,
      isAvailable: available !== undefined ? available : true,
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

module.exports = router;
