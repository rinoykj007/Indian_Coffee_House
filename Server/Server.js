require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/auth");
const tableRoutes = require("./routes/tables");
const orderRoutes = require("./routes/orders");
const menuRoutes = require("./routes/menu");
const paymentRoutes = require("./routes/payments");
// const paymentRoutes = require("./routes/payments");

const app = express();

// Middleware
const allowedOrigins = [
  "https://indian-coffee-house-v5l9jy13d-rinoykj007s-projects.vercel.app",
  "https://indian-coffee-house-hxyp.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://indian-coffee-house-i6c5.vercel.app",
  "https://www.payasam.ie",
];

// Configure CORS options
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply CORS middleware before routes
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Additional CORS debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get("Origin")}`);
  next();
});

const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

// MongoDB connection
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Indian Coffee House Management API",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/payments", paymentRoutes);

// Legacy route for backward compatibility
// app.get("/menu", async (req, res) => {
//   try {
//     const Menu = require("./Menu");
//     const menu = await Menu.find();
//     res.json(menu);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch menu" });
//   }
// });

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(
    `🚀 Indian Coffee House Management Server running on port ${PORT}`
  );
  console.log(
    `📊 API Documentation available at https://indian-coffee-house.vercel.app/health`
  );
});
