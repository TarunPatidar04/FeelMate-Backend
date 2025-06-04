// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  userId: String,
  text: String,
  mood: String,
  aiMood: String,
  sender: { type: String, enum: ["user", "ai"] },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
