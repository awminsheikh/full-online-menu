const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

// Initialize database (this will create tables and sample data)
require("./config/database");

const app = express();

// Update CORS configuration
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"http://localhost:3001",
			"http://localhost:3002",
		],
		credentials: true, // Allow credentials (cookies, authorization headers)
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
	next();
});

// Routes
app.use("/api/shop", require("./routes/shopRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// Basic route
app.get("/", (req, res) => {
	res.json({
		message: "Coffee Shop API is running",
		version: "1.0.0",
		endpoints: {
			auth: "/api/auth",
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`\n🚀 Server running on port ${PORT}`);
	console.log(`📝 API URL: http://localhost:${PORT}`);
	console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth`);
	console.log(`🏪 Shop endpoint: http://localhost:${PORT}/api/shop`);
	console.log(
		`📂 Categories endpoint: http://localhost:${PORT}/api/categories`,
	);
	console.log(`📦 Products endpoint: http://localhost:${PORT}/api/products`);
	console.log("\n✅ Ready to use!\n");
});
