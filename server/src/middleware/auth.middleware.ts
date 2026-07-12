import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/response.util";
import { JwtPayload } from "../types/auth.types";

// Protects any route it's attached to - verifies the JWT sent in the
// Authorization header and attaches the decoded user to req.user.
// Any route using this middleware can safely assume req.user exists.
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, 401, "Authentication required");
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "dev_secret";
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 401, "Invalid or expired token");
  }
};
