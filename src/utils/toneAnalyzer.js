// utils/toneAnalyzer.js
function detectMoodFromMessage(message) {
  const msg = message.toLowerCase();
  if (msg.includes("sad") || msg.includes("tired")) return "sad";
  if (msg.includes("happy") || msg.includes("excited")) return "happy";
  if (msg.includes("bored") || msg.includes("lazy")) return "bored";
  if (msg.includes("angry") || msg.includes("hate")) return "angry";
  return "neutral";
}
module.exports = detectMoodFromMessage;
