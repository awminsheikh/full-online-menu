const Database = require("better-sqlite3");
const path = require("path");
require("dotenv").config();

// Get database path from environment or use default
const dbPath = process.env.DB_PATH || path.join(__dirname, "../coffee-shop.db");
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Create all tables
db.exec(`
  -- Shop information table
  CREATE TABLE IF NOT EXISTS shop (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT DEFAULT 'My Coffee Shop',
    address TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    openingHours TEXT DEFAULT 'Mon-Sun: 8:00 - 22:00',
    description TEXT DEFAULT '',
    logo TEXT DEFAULT '',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Categories table
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    "order" INTEGER DEFAULT 0,
    isActive INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Products table
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    price REAL NOT NULL,
    category_id INTEGER NOT NULL,
    image TEXT DEFAULT '',
    isAvailable INTEGER DEFAULT 1,
    isPopular INTEGER DEFAULT 0,
    "order" INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
  CREATE INDEX IF NOT EXISTS idx_categories_order ON categories("order");
  CREATE INDEX IF NOT EXISTS idx_products_order ON products("order");
`);

// Insert default shop record if not exists
const shopExists = db.prepare("SELECT COUNT(*) as count FROM shop").get();
if (shopExists.count === 0) {
	db.prepare(
		`
    INSERT INTO shop (id, name, openingHours, description) 
    VALUES (1, 'My Coffee Shop', 'Mon-Sun: 8:00 - 22:00', 'Welcome to our cozy coffee shop!')
  `,
	).run();
	console.log("✅ Default shop record created");
}

// Insert sample categories if none exist
const categoryCount = db
	.prepare("SELECT COUNT(*) as count FROM categories")
	.get();
if (categoryCount.count === 0) {
	const insertCategory = db.prepare(`
    INSERT INTO categories (name, description, "order", isActive) VALUES (?, ?, ?, ?)
  `);

	const sampleCategories = [
		["Coffee", "Hot and cold coffee drinks", 1, 1],
		["Tea", "Premium tea selection", 2, 1],
		["Pastries", "Fresh baked goods", 3, 1],
		["Sandwiches", "Delicious sandwiches", 4, 1],
	];

	for (const cat of sampleCategories) {
		insertCategory.run(cat[0], cat[1], cat[2], cat[3]);
	}
	console.log("✅ Sample categories created");
}

// Insert sample products if none exist
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get();
if (productCount.count === 0) {
	// Get category IDs
	const coffeeCat = db
		.prepare("SELECT id FROM categories WHERE name = 'Coffee'")
		.get();
	const teaCat = db
		.prepare("SELECT id FROM categories WHERE name = 'Tea'")
		.get();
	const pastriesCat = db
		.prepare("SELECT id FROM categories WHERE name = 'Pastries'")
		.get();

	if (coffeeCat && teaCat && pastriesCat) {
		const insertProduct = db.prepare(`
      INSERT INTO products (name, description, price, category_id, image, isAvailable, isPopular, "order") 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

		const sampleProducts = [
			[
				"Espresso",
				"Strong and rich espresso shot",
				3.5,
				coffeeCat.id,
				"",
				1,
				1,
				1,
			],
			[
				"Cappuccino",
				"Espresso with steamed milk foam",
				4.5,
				coffeeCat.id,
				"",
				1,
				1,
				2,
			],
			[
				"Latte",
				"Smooth espresso with lots of milk",
				4.5,
				coffeeCat.id,
				"",
				1,
				1,
				3,
			],
			["Green Tea", "Organic Japanese green tea", 3.0, teaCat.id, "", 1, 0, 1],
			["Chai Latte", "Spiced tea with milk", 4.0, teaCat.id, "", 1, 1, 2],
			[
				"Croissant",
				"Butter and flaky pastry",
				3.0,
				pastriesCat.id,
				"",
				1,
				1,
				1,
			],
			[
				"Chocolate Muffin",
				"Rich chocolate muffin",
				3.5,
				pastriesCat.id,
				"",
				1,
				0,
				2,
			],
		];

		for (const product of sampleProducts) {
			insertProduct.run(
				product[0],
				product[1],
				product[2],
				product[3],
				product[4],
				product[5],
				product[6],
				product[7],
			);
		}
		console.log("✅ Sample products created");
	}
}

console.log("✅ Database initialized successfully");

module.exports = db;
