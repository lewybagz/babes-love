const asyncHandler = require("express-async-handler");
const { auth } = require("../firebase/admin");

// Protect routes - verify Firebase token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token with Firebase
      const decodedToken = await auth.verifyIdToken(token);

      // Get user from decoded token
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role || "customer", // Default to customer if no role
      };

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Admin middleware - check if user has admin role
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};

// Staff middleware - check if user has staff role
const staff = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "staff")) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as staff");
  }
};

module.exports = { protect, admin, staff };
