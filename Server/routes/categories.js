const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const { authenticate, authorize } = require("../middleware/auth");

// Get all categories
router.get("/", authenticate, async (req, res) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add a new category
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, description, enabled, displayOrder } = req.body;
    
    // Check if category already exists
    const existing = await Category.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existing) {
      return res.status(400).json({ success: false, error: "Category name must be unique." });
    }

    const category = new Category({
      name,
      description,
      enabled,
      displayOrder,
      createdBy: req.user.username,
      updatedBy: req.user.username
    });

    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Update a category
router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, description, enabled, displayOrder } = req.body;
    
    if (name) {
      const existing = await Category.findOne({ name: new RegExp(`^${name}$`, 'i'), _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ success: false, error: "Category name must be unique." });
      }
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        enabled,
        displayOrder,
        updatedBy: req.user.username
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }

    res.json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Delete a category
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }
    // Note: We might want to check if subcategories/products exist before deleting
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
