import { Request, Response } from "express";
import { sendError } from "../utils/response.util";

// Registered after every real route, before the error handler - catches
// any URL that didn't match anything above, instead of letting Express
// fall through to its default (unbranded, non-JSON) 404 page.
export const notFoundHandler = (req: Request, res: Response) => {
  sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};
