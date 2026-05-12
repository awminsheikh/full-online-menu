const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const db = new Database(path.join(__dirname, "../coffee-shop.db"));

// Create admin table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER DEFAULT NULL
  );
`);

// Read initial admin from config file
function getInitialAdmin() {
	const configPath = path.join(__dirname, "../config/initial-admin.json");

	// Default credentials if config doesn't exist
	const defaultAdmin = {
		username: "admin",
		password: "admin123",
	};

	if (fs.existsSync(configPath)) {
		try {
			const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
			return config.initialAdmin || defaultAdmin;
		} catch (error) {
			console.error("Error reading admin config:", error);
			return defaultAdmin;
		}
	}

	return defaultAdmin;
}

// Initialize first admin if no admins exist
function initializeFirstAdmin() {
	const adminCount = db.prepare("SELECT COUNT(*) as count FROM admins").get();

	if (adminCount.count === 0) {
		const initialAdmin = getInitialAdmin();
		const hashedPassword = bcrypt.hashSync(initialAdmin.password, 10);

		db.prepare(
			`
      INSERT INTO admins (username, password, role, created_by) 
      VALUES (?, ?, 'super_admin', NULL)
    `,
		).run(initialAdmin.username, hashedPassword);

		console.log(`✅ First admin created: ${initialAdmin.username}`);
		return true;
	}
	return false;
}

// Run initialization
initializeFirstAdmin();

class Admin {
	// Find admin by username
	static async findByUsername(username) {
		const admin = db
			.prepare("SELECT * FROM admins WHERE username = ?")
			.get(username);
		return admin;
	}

	// Find admin by ID
	static async findById(id) {
		const admin = db
			.prepare(
				"SELECT id, username, role, created_at, created_by FROM admins WHERE id = ?",
			)
			.get(id);
		return admin;
	}

	// Get all admins (for management)
	static async getAll() {
		const admins = db
			.prepare(
				`
      SELECT a.id, a.username, a.role, a.created_at, 
             u.username as created_by_username
      FROM admins a
      LEFT JOIN admins u ON a.created_by = u.id
      ORDER BY a.id
    `,
			)
			.all();
		return admins;
	}

	// Create new admin (by existing admin)
	static async create(username, password, createdBy) {
		// Check if username exists
		const existing = db
			.prepare("SELECT id FROM admins WHERE username = ?")
			.get(username);
		if (existing) {
			throw new Error("Username already exists");
		}

		const hashedPassword = bcrypt.hashSync(password, 10);
		const result = db
			.prepare(
				`
      INSERT INTO admins (username, password, role, created_by) 
      VALUES (?, ?, 'admin', ?)
    `,
			)
			.run(username, hashedPassword, createdBy);

		return { id: result.lastInsertRowid, username };
	}

	// Update admin password
	static async updatePassword(id, newPassword) {
		const hashedPassword = bcrypt.hashSync(newPassword, 10);
		const result = db
			.prepare("UPDATE admins SET password = ? WHERE id = ?")
			.run(hashedPassword, id);
		return result.changes > 0;
	}

	// Delete admin (cannot delete self or last super admin)
	static async delete(id, currentAdminId) {
		// Prevent self-deletion
		if (id === currentAdminId) {
			throw new Error("Cannot delete your own account");
		}

		// Get admin to delete
		const adminToDelete = db
			.prepare("SELECT * FROM admins WHERE id = ?")
			.get(id);
		if (!adminToDelete) {
			throw new Error("Admin not found");
		}

		// Prevent deleting if it's the only super admin
		const superAdminCount = db
			.prepare(
				'SELECT COUNT(*) as count FROM admins WHERE role = "super_admin"',
			)
			.get();
		if (adminToDelete.role === "super_admin" && superAdminCount.count <= 1) {
			throw new Error("Cannot delete the only super admin account");
		}

		const result = db.prepare("DELETE FROM admins WHERE id = ?").run(id);
		return result.changes > 0;
	}

	// Change admin role (only super admin can do this)
	static async changeRole(id, role, currentAdminId) {
		const currentAdmin = db
			.prepare("SELECT role FROM admins WHERE id = ?")
			.get(currentAdminId);
		if (currentAdmin.role !== "super_admin") {
			throw new Error("Only super admin can change roles");
		}

		// Prevent changing own role if it's the only super admin
		if (id === currentAdminId) {
			const superAdminCount = db
				.prepare(
					'SELECT COUNT(*) as count FROM admins WHERE role = "super_admin"',
				)
				.get();
			if (role !== "super_admin" && superAdminCount.count <= 1) {
				throw new Error("Cannot demote the only super admin");
			}
		}

		const result = db
			.prepare("UPDATE admins SET role = ? WHERE id = ?")
			.run(role, id);
		return result.changes > 0;
	}
}

module.exports = { Admin, db };
