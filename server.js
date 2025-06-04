require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/config/db.js");

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

connectDB();

server.listen(PORT, () => {
  console.log(`🚀 FeelMate server running at http://localhost:${PORT}`);
});
