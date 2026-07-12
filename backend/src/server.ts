import http from "http";
import dotenv from "dotenv";
import { createApp } from "./app";
import { connectDB } from "./config/db";
import { initSocket } from "./sockets";
import { ensureCommunityConversation } from "./services/conversation.service";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/chat-app";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// server.ts is the entry point: connect to the DB, build the Express app,
// wrap it in a raw HTTP server (needed so socket.io can attach to the same
// server), then start listening.
const start = async () => {
  await connectDB(MONGODB_URI);

  // Guarantees the Community group chat exists (and includes every
  // existing user) before the server starts accepting requests.
  await ensureCommunityConversation();

  const app = createApp(CLIENT_URL);
  const server = http.createServer(app);

  initSocket(server, CLIENT_URL);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
