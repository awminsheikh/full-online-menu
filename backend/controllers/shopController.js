const db = require("../config/database");

// Get shop information
exports.getShopInfo = (req, res) => {
	try {
		const shop = db.prepare("SELECT * FROM shop WHERE id = 1").get();
		res.json(shop);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
};

// Update shop information
exports.updateShopInfo = (req, res) => {
	try {
		const allowedFields = [
			"name",
			"address",
			"phone",
			"email",
			"openingHours",
			"description",
			"logo",
		];
		const fields = [];
		const values = [];

		allowedFields.forEach((field) => {
			if (req.body[field] !== undefined) {
				fields.push(`${field} = ?`);
				values.push(req.body[field]);
			}
		});

		if (fields.length === 0) {
			return res.status(400).json({ message: "No valid fields to update" });
		}

		values.push(new Date().toISOString());
		values.push(1); // id = 1

		const query = `UPDATE shop SET ${fields.join(", ")}, updated_at = ? WHERE id = ?`;
		const result = db.prepare(query).run(values);

		if (result.changes === 0) {
			return res.status(404).json({ message: "Shop not found" });
		}

		const updatedShop = db.prepare("SELECT * FROM shop WHERE id = 1").get();
		res.json(updatedShop);
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: error.message });
	}
};
