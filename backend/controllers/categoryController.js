const db = require("../config/database");

// Get all categories
exports.getAllCategories = (req, res) => {
	try {
		const categories = db
			.prepare('SELECT * FROM categories ORDER BY "order" ASC, id ASC')
			.all();
		res.json(categories);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
};

// Get single category
exports.getCategoryById = (req, res) => {
	try {
		const category = db
			.prepare("SELECT * FROM categories WHERE id = ?")
			.get(req.params.id);
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}
		res.json(category);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
};

// Create category
exports.createCategory = (req, res) => {
	try {
		const { name, description, order, isActive } = req.body;

		if (!name) {
			return res.status(400).json({ message: "Category name is required" });
		}

		const stmt = db.prepare(`
      INSERT INTO categories (name, description, "order", isActive) 
      VALUES (?, ?, ?, ?)
    `);

		const result = stmt.run(
			name,
			description || "",
			order || 0,
			isActive !== undefined ? (isActive ? 1 : 0) : 1,
		);

		const newCategory = db
			.prepare("SELECT * FROM categories WHERE id = ?")
			.get(result.lastInsertRowid);
		res.status(201).json(newCategory);
	} catch (error) {
		console.error(error);
		if (error.message.includes("UNIQUE constraint failed")) {
			res.status(400).json({ message: "Category name already exists" });
		} else {
			res.status(400).json({ message: error.message });
		}
	}
};

// Update category
exports.updateCategory = (req, res) => {
	try {
		const allowedFields = ["name", "description", "order", "isActive"];
		const fields = [];
		const values = [];

		allowedFields.forEach((field) => {
			if (req.body[field] !== undefined) {
				if (field === "isActive") {
					values.push(req.body[field] ? 1 : 0);
				} else {
					values.push(req.body[field]);
				}
				fields.push(`"${field}" = ?`);
			}
		});

		if (fields.length === 0) {
			return res.status(400).json({ message: "No valid fields to update" });
		}

		values.push(new Date().toISOString());
		values.push(req.params.id);

		const query = `UPDATE categories SET ${fields.join(", ")}, updated_at = ? WHERE id = ?`;
		const result = db.prepare(query).run(values);

		if (result.changes === 0) {
			return res.status(404).json({ message: "Category not found" });
		}

		const updatedCategory = db
			.prepare("SELECT * FROM categories WHERE id = ?")
			.get(req.params.id);
		res.json(updatedCategory);
	} catch (error) {
		console.error(error);
		if (error.message.includes("UNIQUE constraint failed")) {
			res.status(400).json({ message: "Category name already exists" });
		} else {
			res.status(400).json({ message: error.message });
		}
	}
};

// Delete category
exports.deleteCategory = (req, res) => {
	try {
		// Check if category has products
		const productCount = db
			.prepare("SELECT COUNT(*) as count FROM products WHERE category_id = ?")
			.get(req.params.id);

		if (productCount.count > 0) {
			return res.status(400).json({
				message: `Cannot delete category with ${productCount.count} existing products. Delete or reassign products first.`,
			});
		}

		const result = db
			.prepare("DELETE FROM categories WHERE id = ?")
			.run(req.params.id);

		if (result.changes === 0) {
			return res.status(404).json({ message: "Category not found" });
		}

		res.json({ message: "Category deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
};
