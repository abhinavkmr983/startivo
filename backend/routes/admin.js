const express = require("express");
const router = express.Router();
const Idea = require("../models/Idea");

const checkAdminSecret = (req, res, next) => {
  const secret = req.query.secret || req.headers["x-admin-secret"];
  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
};

router.get("/ideas", checkAdminSecret, async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ submittedAt: -1 });
    res.status(200).json({ success: true, count: ideas.length, data: ideas });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

router.delete("/ideas/:id", checkAdminSecret, async (req, res) => {
  try {
    await Idea.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Idea deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;