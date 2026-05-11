const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize database (this will create tables and sample data)
require("./config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
	next();
});

// Routes
app.use("/api/shop", require("./routes/shopRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

// Basic route
app.get("/", (req, res) => {
	res.json({
		message: "Coffee Shop API is running",
		version: "1.0.0",
		endpoints: {
			shop: "/api/shop",
			categories: "/api/categories",
			products: "/api/products",
		},
	});
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error("Error:", err.stack);
	res
		.status(500)
		.json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`\n🚀 Server running on port ${PORT}`);
	console.log(`📝 API URL: http://localhost:${PORT}`);
	console.log(`🏪 Shop endpoint: http://localhost:${PORT}/api/shop`);
	console.log(
		`📂 Categories endpoint: http://localhost:${PORT}/api/categories`,
	);
	console.log(`📦 Products endpoint: http://localhost:${PORT}/api/products`);
	console.log("\n✅ Ready to use!\n");
});
