const express = require("express");
const router = express.Router();
const { askFeelMate } = require("../controllers/chatController");

router.post("/ask", askFeelMate);

module.exports = router;
