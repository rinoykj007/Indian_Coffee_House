const express = require("express");
const Table = require("../models/Table");
const router = express.Router();

// GET /api/tables - Get all tables from MongoDB
router.get("/", async (req, res) => {
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

// GET /api/tables/summary/availability - Get table availability summary for admin dashboard
router.get("/summary/availability", async (req, res) => {
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

// PUT /api/tables/:id/status - Update table status
router.put("/:id/status", async (req, res) => {
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

module.exports = router;
