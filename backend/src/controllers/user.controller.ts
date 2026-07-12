import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { sendSuccess } from "../utils/response.util";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.listUsers(req.user!.id);
    sendSuccess(res, 200, "Users fetched", users);
  } catch (error) {
    next(error);
  }
};
