import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.util";
import { AppError } from "../utils/app-error";

// Centralized error handler - the last piece of middleware in app.ts.
// Services throw AppError for expected/client-facing problems (bad input,
// wrong password, etc). Anything else is treated as an unexpected 500.
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err.message);

  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message);
  }

  return sendError(res, 500, "Something went wrong on the server");
};
