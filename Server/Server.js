require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

// Import routes
const authRoutes = require("./routes/auth");
const tableRoutes = require("./routes/tables");
const orderRoutes = require("./routes/orders");
const menuRoutes = require("./routes/menu");
const paymentRoutes = require("./routes/payments");

const app = express();

// CORS Configuration
const allowedOrigins = [
  "https://indian-coffee-house-hxyp.vercel.app",
  "https://indian-coffee-house-i6c5.vercel.app",
  "https://www.payasam.ie",
  "https://payasam.ie",
  ...(process.env.NODE_ENV === "production"
    ? []
    : ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"]),
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// Security Middleware
// Helmet - Set security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true,
});

// Apply rate limiting to all routes
app.use("/api/", limiter);
app.use("/api/auth/login", authLimiter);

// NoSQL injection protection
app.use(mongoSanitize());


// Body parsing middleware with size limits
app.use(express.json({ limit: "1mb" })); // Reduced from 10mb
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

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

// Category Management Routes
const categoryRoutes = require("./routes/categories");
const subcategoryRoutes = require("./routes/subcategories");
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);

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
