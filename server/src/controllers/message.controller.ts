import { Request, Response, NextFunction } from "express";
import * as messageService from "../services/message.service";
import { sendSuccess } from "../utils/response.util";
import { getIO, isAnyoneElseOnlineInConversation, joinUserToConversationRoom } from "../sockets";

export const postMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sender = req.user!; // identity from the verified JWT, not the request body
    const { text, conversationId, receiverId } = req.body;

    const { message, conversation } = await messageService.sendMessage({
      senderId: sender.id,
      senderName: sender.name,
      text,
      conversationId,
      receiverId,
    });

    const conversationIdStr = conversation._id.toString();
    const participantIds = conversation.participants.map((p) => p.toString());

    // Covers a brand-new private conversation nobody has joined yet.
    participantIds.forEach((id) => joinUserToConversationRoom(id, conversationIdStr));

    getIO().to(conversationIdStr).emit("newMessage", message);

    // No read receipts - "delivered" just means someone else is online now.
    if (isAnyoneElseOnlineInConversation(participantIds, sender.id)) {
      const updated = await messageService.markMessageStatus(message._id.toString(), "delivered");
      if (updated) {
        getIO().to(conversationIdStr).emit("messageStatusUpdate", {
          messageId: updated._id,
          status: updated.status,
          conversationId: conversationIdStr,
        });
      }
    }

    sendSuccess(res, 201, "Message sent", message);
  } catch (error) {
    next(error);
  }
};
