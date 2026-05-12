const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
	login,
	logout,
	getCurrentAdmin,
	createAdmin,
	deleteAdmin,
	getAllAdmins,
	changeAdminRole,
	changePassword,
} = require("../controllers/authController");

// Public routes
router.post("/login", login);
router.post("/logout", logout);

// Protected routes (require authentication)
router.get("/me", verifyToken, getCurrentAdmin);
router.get("/all", verifyToken, getAllAdmins);
router.post("/create", verifyToken, createAdmin);
router.delete("/delete/:id", verifyToken, deleteAdmin);
router.put("/change-role/:id", verifyToken, changeAdminRole);
router.put("/change-password", verifyToken, changePassword);

module.exports = router;
