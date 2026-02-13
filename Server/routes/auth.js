const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const corsMiddleware = require("../middleware/cors");
const { authenticate, authorize } = require("../middleware/auth");
const { loginValidator, registerValidator } = require("../middleware/validators");

// Apply CORS middleware to all auth routes
router.use(corsMiddleware);

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// POST /auth/login
router.post("/login", loginValidator, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user in MongoDB
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    // Compare password using bcrypt
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return success with user info and token
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// POST /api/auth/logout
router.post("/logout", authenticate, (req, res) => {
  // Token invalidation would happen on client-side (remove from storage)
  // For server-side blacklist, you'd need Redis or similar
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// GET /api/auth/me - Get current user info
router.get("/me", authenticate, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role,
      name: req.user.name,
    },
  });
});

// GET /auth/users - Get all users (for admin staff management)
router.get("/users", authenticate, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Exclude passwords
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
    });
  }
});

// POST /auth/register - Register new staff member (admin only)
router.post("/register", authenticate, authorize("admin"), registerValidator, async (req, res) => {
  try {
    const { username, password, role, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Username already exists",
      });
    }

    // Create new user (password will be hashed automatically by pre-save hook)
    const newUser = new User({
      username,
      password,
      role,
      name: name || username,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create user",
    });
  }
});

module.exports = router;
