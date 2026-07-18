import express, { Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import messageRoutes from "./routes/message.routes";
import authRoutes from "./routes/auth.routes";
import conversationRoutes from "./routes/conversation.routes";
import userRoutes from "./routes/user.routes";
import communityRoutes from "./routes/community.routes";
import callRoutes from "./routes/call.routes";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import openApiDocument from "./docs/openapi.json";

// Wires up middleware, routes, and the error handler. server.ts owns startup.
export const createApp = (clientUrl: string): Application => {
  const app = express();

  app.use(cors({ origin: clientUrl }));
  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api", messageRoutes);
  app.use("/api", conversationRoutes);
  app.use("/api", userRoutes);
  app.use("/api", communityRoutes);
  app.use("/api", callRoutes);

  // Interactive API docs: /api/docs is a live Swagger UI where every route
  // can be tried directly from the browser ("Try it out" - paste a JWT
  // from POST /api/auth/login into the Authorize button). /api/docs.json
  // is the raw OpenAPI spec, which Postman can import directly via
  // "Import > Link" using that URL.
  app.get("/api/docs.json", (req, res) => res.json(openApiDocument));
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, { customSiteTitle: "VedConnect API Docs" })
  );

  app.get("/health", (req, res) => {
    res.status(200).json({ success: true, message: "Server is healthy" });
  });

  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "VedConnect API is running",
    });
  });

  // Anything that didn't match a route above - kept separate from
  // errorHandler because this isn't a thrown error, just an unknown URL.
  app.use(notFoundHandler);

  // Error handler must always be registered last.
  app.use(errorHandler);

  return app;
};
