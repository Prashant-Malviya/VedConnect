import { Request, Response, NextFunction } from "express";
import * as conversationService from "../services/conversation.service";
import * as messageService from "../services/message.service";
import { sendSuccess } from "../utils/response.util";

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversations = await conversationService.listConversationsForUser(req.user!.id);
    sendSuccess(res, 200, "Conversations fetched", conversations);
  } catch (error) {
    next(error);
  }
};

export const getConversationMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const messages = await messageService.getConversationHistory(id, req.user!.id);
    sendSuccess(res, 200, "Messages fetched", messages);
  } catch (error) {
    next(error);
  }
};
