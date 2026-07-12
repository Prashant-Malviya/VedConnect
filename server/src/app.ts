import express, { Application } from "express";
import cors from "cors";
import messageRoutes from "./routes/message.routes";
import authRoutes from "./routes/auth.routes";
import conversationRoutes from "./routes/conversation.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middleware/error.middleware";

// app.ts is only about WIRING: middleware + routes + error handler.
// It doesn't start the server (that's server.ts) and doesn't contain
// any business logic itself.

export const createApp = (clientUrl: string): Application => {
  const app = express();

  app.use(cors({ origin: clientUrl }));
  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api", messageRoutes);
  app.use("/api", conversationRoutes);
  app.use("/api", userRoutes);

  app.get("/health", (req, res) => {
    res.status(200).json({ success: true, message: "Server is healthy" });
  });

  app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "VedConnect API is running",
  });
});

  // Error handler must always be registered last.
  app.use(errorHandler);

  return app;
};
