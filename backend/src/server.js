const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
require("dotenv").config();

// Load Firebase Admin SDK
require("./firebase/admin");

// Initialize express app
const app = express();

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Apply security middleware
app.use(helmet());
app.use(limiter);
app.use(cors());

// Logger middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: false }));

// Import routes
const adminRoutes = require("./routes/adminRoutes"); // For admin operations

// API Routes
app.use("/api/admin", adminRoutes); // Endpoint for admin operations

// Tax configuration endpoint (simplified)
app.get("/api/tax/config", (req, res) => {
  const { FIXED_TAX_RATE } = require("./config/taxConfig");
  res.json({
    success: true,
    data: {
      rate: FIXED_TAX_RATE,
      description: "Fixed tax rate of 7.43% for all transactions",
    },
  });
});

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "BabesLove Backend API - Firebase Support Services",
    environment: process.env.NODE_ENV,
    version: "1.0.0",
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Set PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

module.exports = app; // Export for testing
