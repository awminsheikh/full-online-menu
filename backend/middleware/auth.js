const jwt = require("jsonwebtoken");

const JWT_SECRET =
	process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

const generateToken = (adminId, username) => {
	return jwt.sign({ id: adminId, username }, JWT_SECRET, { expiresIn: "7d" });
};

const verifyToken = (req, res, next) => {
	const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res
			.status(401)
			.json({ message: "Access denied. No token provided." });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.admin = decoded;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid token." });
	}
};

module.exports = { generateToken, verifyToken };
