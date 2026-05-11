const db = require("../config/database");

// Helper function to get product with category name
const getProductWithCategory = (id) => {
	return db
		.prepare(
			`
    SELECT p.*, c.name as category_name, c.id as category_id 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `,
		)
		.get(id);
};

// Get all products (with optional category filter)
exports.getAllProducts = (req, res) => {
	try {
		let query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
		const params = [];

		if (req.query.category) {
			query += " WHERE p.category_id = ?";
			params.push(req.query.category);
		}

		query += ' ORDER BY p."order" ASC, p.id ASC';

		const products = db.prepare(query).all(params);
		res.json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
};

// Get single product
exports.getProductById = (req, res) => {
	try {
		const product = getProductWithCategory(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}
		res.json(product);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
};

// Get products by category
exports.getProductsByCategory = (req, res) => {
	try {
		const products = db
			.prepare(
				`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ?
      ORDER BY p."order" ASC, p.id ASC
    `,
			)
			.all(req.params.categoryId);

		res.json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
};

// Create product
exports.createProduct = (req, res) => {
	try {
		const {
			name,
			description,
			price,
			category,
			image,
			isAvailable,
			isPopular,
			order,
		} = req.body;

		// Validate required fields
		if (!name) {
			return res.status(400).json({ message: "Product name is required" });
		}
		if (!price) {
			return res.status(400).json({ message: "Product price is required" });
		}
		if (!category) {
			return res.status(400).json({ message: "Category ID is required" });
		}

		// Verify category exists
		const categoryExists = db
			.prepare("SELECT id FROM categories WHERE id = ?")
			.get(category);
		if (!categoryExists) {
			return res.status(400).json({ message: "Category not found" });
		}

		const stmt = db.prepare(`
      INSERT INTO products (name, description, price, category_id, image, isAvailable, isPopular, "order")
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

		const result = stmt.run(
			name,
			description || "",
			price,
			category,
			image || "",
			isAvailable !== undefined ? (isAvailable ? 1 : 0) : 1,
			isPopular !== undefined ? (isPopular ? 1 : 0) : 0,
			order || 0,
		);

		const newProduct = getProductWithCategory(result.lastInsertRowid);
		res.status(201).json(newProduct);
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: error.message });
	}
};

// Update product
exports.updateProduct = (req, res) => {
	try {
		const allowedFields = [
			"name",
			"description",
			"price",
			"category",
			"image",
			"isAvailable",
			"isPopular",
			"order",
		];
		const fields = [];
		const values = [];

		allowedFields.forEach((field) => {
			if (req.body[field] !== undefined) {
				if (field === "category") {
					values.push(req.body[field]);
					fields.push("category_id = ?");
				} else if (field === "isAvailable" || field === "isPopular") {
					values.push(req.body[field] ? 1 : 0);
					fields.push(`${field} = ?`);
				} else {
					values.push(req.body[field]);
					fields.push(`"${field}" = ?`);
				}
			}
		});

		if (fields.length === 0) {
			return res.status(400).json({ message: "No valid fields to update" });
		}

		// If updating category, verify it exists
		if (req.body.category) {
			const categoryExists = db
				.prepare("SELECT id FROM categories WHERE id = ?")
				.get(req.body.category);
			if (!categoryExists) {
				return res.status(400).json({ message: "Category not found" });
			}
		}

		values.push(new Date().toISOString());
		values.push(req.params.id);

		const query = `UPDATE products SET ${fields.join(", ")}, updated_at = ? WHERE id = ?`;
		const result = db.prepare(query).run(values);

		if (result.changes === 0) {
			return res.status(404).json({ message: "Product not found" });
		}

		const updatedProduct = getProductWithCategory(req.params.id);
		res.json(updatedProduct);
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: error.message });
	}
};

// Delete product
exports.deleteProduct = (req, res) => {
	try {
		const result = db
			.prepare("DELETE FROM products WHERE id = ?")
			.run(req.params.id);

		if (result.changes === 0) {
			return res.status(404).json({ message: "Product not found" });
		}

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
};
