const bcrypt = require("bcryptjs");
const { Admin } = require("../models/Admin");
const { generateToken } = require("../middleware/auth");

// Login
const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res
				.status(400)
				.json({ message: "Username and password are required" });
		}

		const admin = await Admin.findByUsername(username);

		if (!admin) {
			return res.status(401).json({ message: "Invalid username or password" });
		}

		const isValidPassword = bcrypt.compareSync(password, admin.password);

		if (!isValidPassword) {
			return res.status(401).json({ message: "Invalid username or password" });
		}

		const token = generateToken(admin.id, admin.username);

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.json({
			message: "Login successful",
			token,
			admin: {
				id: admin.id,
				username: admin.username,
				role: admin.role,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
};

// Logout
const logout = async (req, res) => {
	res.clearCookie("token");
	res.json({ message: "Logout successful" });
};

// Get current admin info
const getCurrentAdmin = async (req, res) => {
	try {
		const admin = await Admin.findById(req.admin.id);
		if (!admin) {
			return res.status(404).json({ message: "Admin not found" });
		}
		res.json(admin);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Create new admin (by logged-in admin)
const createAdmin = async (req, res) => {
	try {
		const { username, password } = req.body;
		const currentAdminId = req.admin.id;

		if (!username || !password) {
			return res
				.status(400)
				.json({ message: "Username and password are required" });
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "Password must be at least 6 characters" });
		}

		const newAdmin = await Admin.create(username, password, currentAdminId);
		res
			.status(201)
			.json({ message: "Admin created successfully", admin: newAdmin });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Delete admin
const deleteAdmin = async (req, res) => {
	try {
		const adminId = parseInt(req.params.id);
		const currentAdminId = req.admin.id;

		await Admin.delete(adminId, currentAdminId);
		res.json({ message: "Admin deleted successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Get all admins
const getAllAdmins = async (req, res) => {
	try {
		const admins = await Admin.getAll();
		res.json(admins);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Change admin role
const changeAdminRole = async (req, res) => {
	try {
		const adminId = parseInt(req.params.id);
		const { role } = req.body;
		const currentAdminId = req.admin.id;

		if (!role || !["admin", "super_admin"].includes(role)) {
			return res.status(400).json({ message: "Invalid role" });
		}

		await Admin.changeRole(adminId, role, currentAdminId);
		res.json({ message: "Admin role updated successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Change own password
const changePassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;
		const adminId = req.admin.id;

		const admin = await Admin.findById(adminId);
		const fullAdmin = await Admin.findByUsername(admin.username);

		if (!bcrypt.compareSync(currentPassword, fullAdmin.password)) {
			return res.status(401).json({ message: "Current password is incorrect" });
		}

		if (newPassword.length < 6) {
			return res
				.status(400)
				.json({ message: "New password must be at least 6 characters" });
		}

		await Admin.updatePassword(adminId, newPassword);
		res.json({ message: "Password updated successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	login,
	logout,
	getCurrentAdmin,
	createAdmin,
	deleteAdmin,
	getAllAdmins,
	changeAdminRole,
	changePassword,
};
