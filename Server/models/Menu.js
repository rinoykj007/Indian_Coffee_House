const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    id: Number,
    name: {
      type: String,
      required: true,
    },
    type: String,
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: Number,
    rating: Number,
    reviewCount: Number,
    image: String,
    ingredients: [String],
    dietary: [String],
    spiceLevel: {
      type: String,
      enum: ["None", "Mild", "Medium", "Hot"],
    },
    preparationTime: String,
    calories: Number,
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isRecommended: Boolean,
    isPopular: Boolean,
    category: String,
    tags: [String],
    allergens: [String],
    portion: String,
    chef: String,
    nutritionalInfo: {
      protein: String,
      carbs: String,
      fat: String,
      fiber: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Menu", menuSchema);
