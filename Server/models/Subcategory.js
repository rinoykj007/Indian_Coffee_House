const mongoose = require("mongoose");

const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
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

// Ensure subcategory names are unique within a parent category
SubcategorySchema.index({ name: 1, parentCategory: 1 }, { unique: true });

module.exports = mongoose.model("Subcategory", SubcategorySchema);
