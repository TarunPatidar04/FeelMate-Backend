// utils/silenceWatcher.js
function startSilenceTimer(socket) {
  let timer = setTimeout(() => {
    socket.emit("ai-message", "🤔 Tu thoda chup sa lag raha hai...");
    // follow-up responses
  }, 15000);
  return timer;
}
