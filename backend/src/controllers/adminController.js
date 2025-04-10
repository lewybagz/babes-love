const asyncHandler = require("express-async-handler");
const { auth, db } = require("../firebase/admin");

/**
 * @desc    Set user role
 * @route   POST /api/admin/users/role
 * @access  Admin
 */
const setUserRole = asyncHandler(async (req, res) => {
  const { uid, role } = req.body;

  if (!uid || !role) {
    res.status(400);
    throw new Error("User ID and role are required");
  }

  // Verify role is valid
  const validRoles = ["customer", "admin", "staff"];
  if (!validRoles.includes(role)) {
    res.status(400);
    throw new Error("Invalid role. Must be one of: customer, admin, staff");
  }

  try {
    // Update custom claims
    await auth.setCustomUserClaims(uid, { role });

    // Update role in Firestore user document
    await db.collection("users").doc(uid).update({
      role,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error updating user role: ${error.message}`);
  }
});

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Admin
 */
const getUsers = asyncHandler(async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = [];

    usersSnapshot.forEach((doc) => {
      users.push({
        uid: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500);
    throw new Error(`Error fetching users: ${error.message}`);
  }
});

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:uid
 * @access  Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;

  try {
    // Delete from Authentication
    await auth.deleteUser(uid);

    // Delete from Firestore
    await db.collection("users").doc(uid).delete();

    // Delete user's cart
    await db.collection("carts").doc(uid).delete();

    // Note: Orders remain for record-keeping

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error deleting user: ${error.message}`);
  }
});

module.exports = {
  setUserRole,
  getUsers,
  deleteUser,
};
