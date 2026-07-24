const express = require("express");
const router = express.Router();
const Subcategory = require("../models/Subcategory");
const { authenticate, authorize } = require("../middleware/auth");

// Get all subcategories
router.get("/", authenticate, async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate("parentCategory", "name").sort({ parentCategory: 1, displayOrder: 1, name: 1 });
    res.json({ success: true, data: subcategories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add a new subcategory
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, parentCategory, description, enabled, displayOrder } = req.body;
    
    // Check if subcategory already exists under this parent
    const existing = await Subcategory.findOne({ name: new RegExp(`^${name}$`, 'i'), parentCategory });
    if (existing) {
      return res.status(400).json({ success: false, error: "Subcategory name must be unique within its parent category." });
    }

    const subcategory = new Subcategory({
      name,
      parentCategory,
      description,
      enabled,
      displayOrder,
      createdBy: req.user.username,
      updatedBy: req.user.username
    });

    await subcategory.save();
    res.status(201).json({ success: true, data: subcategory });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Update a subcategory
router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, parentCategory, description, enabled, displayOrder } = req.body;
    
    if (name || parentCategory) {
      const sub = await Subcategory.findById(req.params.id);
      const newName = name || sub.name;
      const newParent = parentCategory || sub.parentCategory;

      const existing = await Subcategory.findOne({ 
        name: new RegExp(`^${newName}$`, 'i'), 
        parentCategory: newParent,
        _id: { $ne: req.params.id } 
      });
      if (existing) {
        return res.status(400).json({ success: false, error: "Subcategory name must be unique within its parent category." });
      }
    }

    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      {
        name,
        parentCategory,
        description,
        enabled,
        displayOrder,
        updatedBy: req.user.username
      },
      { new: true, runValidators: true }
    );

    if (!subcategory) {
      return res.status(404).json({ success: false, error: "Subcategory not found" });
    }

    res.json({ success: true, data: subcategory });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Delete a subcategory
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ success: false, error: "Subcategory not found" });
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
