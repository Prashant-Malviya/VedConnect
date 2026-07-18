import { Request, Response, NextFunction } from "express";
import * as callService from "../services/call.service";
import { sendSuccess } from "../utils/response.util";

export const getMyCallHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const history = await callService.getCallHistory(req.user!.id);
    sendSuccess(res, 200, "Call history fetched", history);
  } catch (error) {
    next(error);
  }
};
