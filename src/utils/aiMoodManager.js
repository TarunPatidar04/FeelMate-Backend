// utils/aiMoodManager.js
let aiMood = "calm"; // default

function updateAIMood(userMood) {
  switch (userMood) {
    case "sad": aiMood = "hurt"; break;
    case "happy": aiMood = "excited"; break;
    case "bored": aiMood = "tired"; break;
    case "angry": aiMood = "defensive"; break;
    default: aiMood = "calm"; break;
  }
  return aiMood;
}
