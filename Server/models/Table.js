const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
    default: 2,
  },
  location: {
    type: String,
    required: true,
    default: "Main Hall",
  },
  status: {
    type: String,
    enum: ["available", "occupied", "reserved"],
    default: "available",
  },
}, { timestamps: true });

module.exports = mongoose.model("Table", tableSchema);
