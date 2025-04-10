const express = require("express");
const router = express.Router();
const {
  setUserRole,
  getUsers,
  deleteUser,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/firebaseAuthMiddleware");

// All routes require admin privileges
router.use(protect, admin);

// User management routes
router.route("/users").get(getUsers);
router.route("/users/role").post(setUserRole);
router.route("/users/:uid").delete(deleteUser);

module.exports = router;
