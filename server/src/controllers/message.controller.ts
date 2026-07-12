import { Request, Response, NextFunction } from "express";
import * as messageService from "../services/message.service";
import { sendSuccess } from "../utils/response.util";
import { getIO, isAnyoneElseOnlineInConversation, joinUserToConversationRoom } from "../sockets";

export const postMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // The sender's identity comes from the verified JWT (req.user), not the
    // request body - this stops anyone from sending messages as someone else.
    const sender = req.user!;
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

    // Make sure every participant's open sockets are in this room - covers
    // the case where this message just created a brand-new private
    // conversation that nobody has joined yet.
    participantIds.forEach((id) => joinUserToConversationRoom(id, conversationIdStr));

    // Private messages must only reach the two participants, and community
    // messages only reach community members - broadcasting to the
    // conversation's room (instead of io.emit) is what guarantees that.
    getIO().to(conversationIdStr).emit("newMessage", message);

    // Simple delivery status: if another participant is online right now,
    // the message counts as "delivered" the moment it's broadcast. No read
    // receipts, per the spec.
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
