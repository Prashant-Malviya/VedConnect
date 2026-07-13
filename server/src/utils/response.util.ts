import { Response } from "express";

// Keeps every API response in the same { success, message, data } shape.
interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface ErrorResponse {
  success: false;
  message: string;
}

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T
) => {
  const body: SuccessResponse<T> = { success: true, message, data };
  return res.status(statusCode).json(body);
};

export const sendError = (res: Response, statusCode: number, message: string) => {
  const body: ErrorResponse = { success: false, message };
  return res.status(statusCode).json(body);
};
