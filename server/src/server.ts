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

const start = async () => {
  try {
    await connectDB(MONGODB_URI);
    await ensureCommunityConversation(); // Community must exist before requests come in

    const app = createApp(CLIENT_URL);
    const server = http.createServer(app);

    initSocket(server, CLIENT_URL);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API docs available at http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Without these, an error thrown outside a request (e.g. inside a
// fire-and-forget async call) would crash the process with no explanation
// in the logs. Logging it and exiting cleanly is safer than leaving the
// process running in a half-broken state.
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

start();
