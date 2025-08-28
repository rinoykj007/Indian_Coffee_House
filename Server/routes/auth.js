const express = require("express");
const User = require("../models/User");
const router = express.Router();
const corsMiddleware = require("../middleware/cors");

// Apply CORS middleware to all auth routes
router.use(corsMiddleware);

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required",
      });
    }

    // Find user in MongoDB
    const user = await User.findOne({
      username: username,
    });

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    // Return success with user info (excluding password)
    res.json({
      success: true,
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
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// GET /api/auth/me - Get current user info
router.get("/me", (req, res) => {
  // For now, just return a simple response
  res.json({
    success: true,
    message: "Auth endpoint working",
  });
});

// GET /auth/users - Get all users (for admin staff management)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
    });
  }
});

// POST /auth/register - Register new staff member (admin only)
router.post("/register", async (req, res) => {
  try {
    const { username, password, role, name } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        error: "Username, password, and role are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Username already exists",
      });
    }

    // Create new user
    const newUser = new User({
      username,
      password, // In production, this should be hashed
      role,
      name: name || username,
    });

    await newUser.save();

    res.json({
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
