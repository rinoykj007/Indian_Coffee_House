const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  id: Number,
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/220x120?text=No+Image"
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: Number,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    maxlength: 500
  },
  ingredients: [String],
  dietary: [String],
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'very hot'],
    default: 'medium'
  },
  preparationTime: String,
  calories: Number,
  isAvailable: {
    type: Boolean,
    default: true
  },
  isRecommended: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: true,
    enum: ['Snacks', 'Main', 'Dessert', 'Drinks', 'Appetizers', 'Beverages']
  },
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
menuSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to toggle availability
menuSchema.methods.toggleAvailability = function() {
  this.isAvailable = !this.isAvailable;
  return this.save();
};

// Static method to get available items by category
menuSchema.statics.getByCategory = function(category) {
  return this.find({ category, isAvailable: true });
};

module.exports = mongoose.model("Menu", menuSchema);
