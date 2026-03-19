const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  projectType: {
    type: String,
    required: true,
    enum: ["Website", "Mobile App", "Startup Idea", "Other"],
  },
  ideaDescription: {
    type: String,
    required: true,
  },
  budgetRange: {
    type: String,
    default: "Not specified",
  },
  timeline: {
    type: String,
    default: "Not specified",
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Idea || mongoose.model("Idea", IdeaSchema);