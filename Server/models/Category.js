const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: String,
  },
  updatedBy: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Category", CategorySchema);
