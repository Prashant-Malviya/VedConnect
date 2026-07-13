import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.util";
import { AppError } from "../utils/app-error";

// Services throw AppError for expected problems; anything else is a 500.
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
