const express = require("express");
const Table = require("../models/Table");
const { authenticate } = require("../middleware/auth");
const { tableStatusValidator, tableIdValidator, createTableValidator } = require("../middleware/validators");
const router = express.Router();

// GET /api/tables - Get all tables from MongoDB (authenticated staff)
router.get("/", authenticate, async (req, res) => {
  try {
    const tables = await Table.find({});
    res.json({ tables });
  } catch (error) {
    console.error("Tables fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tables",
    });
  }
});

// GET /api/tables/summary/availability - Get table availability summary for admin dashboard (authenticated staff)
router.get("/summary/availability", authenticate, async (req, res) => {
  try {
    const totalTables = await Table.countDocuments({});
    const availableTables = await Table.countDocuments({ status: "available" });
    const occupiedTables = await Table.countDocuments({ status: "occupied" });

    res.json({
      totalTables,
      availableTables,
      occupiedTables,
    });
  } catch (error) {
    console.error("Table summary error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch table summary",
    });
  }
});

// POST /api/tables - Create a new table (authenticated admin)
router.post("/", authenticate, createTableValidator, async (req, res) => {
  try {
    const { tableNumber, capacity, location } = req.body;
    
    // Check if table number already exists
    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return res.status(400).json({
        success: false,
        error: "Table number already exists",
      });
    }

    const table = new Table({
      tableNumber,
      capacity,
      location,
      status: "available",
    });

    await table.save();

    res.status(201).json({
      success: true,
      table,
    });
  } catch (error) {
    console.error("Table creation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create table",
    });
  }
});

// PUT /api/tables/:id/status - Update table status (authenticated staff)
router.put("/:id/status", authenticate, tableIdValidator, tableStatusValidator, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const table = await Table.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        error: "Table not found",
      });
    }

    res.json({
      success: true,
      table,
    });
  } catch (error) {
    console.error("Table update error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update table status",
    });
  }
});

// DELETE /api/tables/:id - Delete a table (authenticated admin)
router.delete("/:id", authenticate, tableIdValidator, async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findByIdAndDelete(id);

    if (!table) {
      return res.status(404).json({
        success: false,
        error: "Table not found",
      });
    }

    res.json({
      success: true,
      message: "Table deleted successfully",
    });
  } catch (error) {
    console.error("Table deletion error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete table",
    });
  }
});

module.exports = router;
