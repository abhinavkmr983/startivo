const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));

const DATA_FILE = path.join(__dirname, "ideas.json");

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

app.post("/api/submit", (req, res) => {
  try {
    const { fullName, email, phone, projectType, ideaDescription, budgetRange, timeline } = req.body;

    if (!fullName || !email || !phone || !projectType || !ideaDescription) {
      return res.status(400).json({ success: false, message: "Please fill all required fields." });
    }

    const ideas = JSON.parse(fs.readFileSync(DATA_FILE));
    const newIdea = {
      _id: Date.now().toString(),
      fullName, email, phone, projectType, ideaDescription,
      budgetRange: budgetRange || "Not specified",
      timeline: timeline || "Not specified",
      submittedAt: new Date().toISOString()
    };

    ideas.push(newIdea);
    fs.writeFileSync(DATA_FILE, JSON.stringify(ideas, null, 2));

    res.status(201).json({
      success: true,
      message: "Your idea has been submitted to Startivo successfully. We will contact you soon!"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

app.get("/api/admin/ideas", (req, res) => {
  try {
    const secret = req.query.secret;
    if (secret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const ideas = JSON.parse(fs.readFileSync(DATA_FILE));
    res.status(200).json({ success: true, count: ideas.length, data: ideas.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

app.delete("/api/admin/ideas/:id", (req, res) => {
  try {
    const secret = req.query.secret;
    if (secret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    let ideas = JSON.parse(fs.readFileSync(DATA_FILE));
    ideas = ideas.filter(i => i._id !== req.params.id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(ideas, null, 2));
    res.status(200).json({ success: true, message: "Idea deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

app.listen(process.env.PORT || 5000, () => {
  console.log("✅ Startivo Server Running!");
  console.log(`🚀 Open: http://localhost:5000`);
});