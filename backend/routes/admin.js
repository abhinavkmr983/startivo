const express = require("express");
const router = express.Router();

router.get("/ideas", (req, res) => {
  res.json({ success: true, message: "Use /api/admin/ideas directly" });
});

module.exports = router;