const { body, param, validationResult } = require("express-validator");

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

// Auth validators
const loginValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

const registerValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "staff"])
    .withMessage("Role must be either admin or staff"),
  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Name must be less than 100 characters"),
  validate,
];

// Menu validators
const menuItemValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Menu item name is required")
    .isLength({ max: 100 })
    .withMessage("Name must be less than 100 characters"),
  body("type")
    .trim()
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["veg", "non-veg", "beverage"])
    .withMessage("Type must be veg, non-veg, or beverage"),
  body("price")
    .isFloat({ min: 0, max: 10000 })
    .withMessage("Price must be a positive number less than 10000"),
  body("category")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Category must be less than 50 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),
  body("image")
    .optional()
    .trim()
    .isURL()
    .withMessage("Image must be a valid URL"),
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  body("reviewCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Review count must be a positive integer"),
  validate,
];

const menuIdValidator = [
  param("id").isMongoId().withMessage("Invalid menu item ID"),
  validate,
];

// Order validators
const orderValidator = [
  body("tableId").isMongoId().withMessage("Invalid table ID"),
  body("items").isArray({ min: 1 }).withMessage("Order must contain at least one item"),
  body("items.*.menuItemId").isMongoId().withMessage("Invalid menu item ID"),
  body("items.*.quantity")
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity must be between 1 and 100"),
  body("items.*.price")
    .isFloat({ min: 0, max: 10000 })
    .withMessage("Price must be a positive number"),
  body("customerCount")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Customer count must be between 1 and 50"),
  body("specialRequests")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Special requests must be less than 500 characters"),
  validate,
];

const orderIdValidator = [
  param("orderId").isMongoId().withMessage("Invalid order ID"),
  validate,
];

const reduceItemValidator = [
  param("orderId").isMongoId().withMessage("Invalid order ID"),
  body("itemId").isMongoId().withMessage("Invalid item ID"),
  validate,
];

// Payment validators
const paymentValidator = [
  body("orderId").isMongoId().withMessage("Invalid order ID"),
  body("tableId").optional({ nullable: true }).isMongoId().withMessage("Invalid table ID"),
  body("paymentMethod")
    .isIn(["cash", "card", "upi", "online"])
    .withMessage("Invalid payment method"),
  body("discount")
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage("Discount must be a positive number"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must be less than 500 characters"),
  validate,
];

// Table validators
const tableStatusValidator = [
  body("status")
    .isIn(["available", "occupied", "reserved"])
    .withMessage("Status must be available, occupied, or reserved"),
  validate,
];

const tableIdValidator = [
  param("id").isMongoId().withMessage("Invalid table ID"),
  validate,
];

module.exports = {
  loginValidator,
  registerValidator,
  menuItemValidator,
  menuIdValidator,
  orderValidator,
  orderIdValidator,
  reduceItemValidator,
  paymentValidator,
  tableStatusValidator,
  tableIdValidator,
};
