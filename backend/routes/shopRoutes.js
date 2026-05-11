const express = require("express");
const router = express.Router();
const {
	getShopInfo,
	updateShopInfo,
} = require("../controllers/shopController");

router.get("/", getShopInfo);
router.put("/", updateShopInfo);

module.exports = router;
