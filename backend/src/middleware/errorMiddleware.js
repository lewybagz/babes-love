/**
 * Handle 404 Not Found Errors
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Handle all other errors
 */
const errorHandler = (err, req, res, next) => {
  // Handle mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      message: "Validation Error",
      details: messages,
    });
  }

  // Handle mongoose CastError (invalid ObjectId)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({
      message: "Resource not found",
      details: "Invalid ID format",
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate key error",
      details: `${Object.keys(err.keyValue)} already exists`,
    });
  }

  // Set status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Send response with appropriate error details
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
