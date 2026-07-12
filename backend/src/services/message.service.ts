import * as messageRepository from "../repositories/message.repository";
import * as conversationService from "./conversation.service";
import { SendMessageInput, MessageStatus } from "../types/message.types";
import { AppError } from "../utils/app-error";

export const getConversationHistory = async (conversationId: string, userId: string) => {
  await conversationService.assertUserIsParticipant(conversationId, userId);
  return messageRepository.findMessagesByConversation(conversationId);
};

// Resolves the target conversation (existing conversationId, or a
// receiverId that may need a brand-new private conversation), then saves
// the message into it. Returns both, since the controller needs the
// conversation's participants to know who to broadcast/notify.
export const sendMessage = async (input: SendMessageInput) => {
  if (!input.text?.trim()) {
    throw new AppError("Message text is required", 400);
  }

  let conversation;
  if (input.conversationId) {
    conversation = await conversationService.assertUserIsParticipant(
      input.conversationId,
      input.senderId
    );
  } else if (input.receiverId) {
    conversation = await conversationService.getOrCreatePrivateConversation(
      input.senderId,
      input.receiverId
    );
  } else {
    throw new AppError("conversationId or receiverId is required", 400);
  }

  const receiverId =
    conversation.type === "private"
      ? conversation.participants.find((p) => p.toString() !== input.senderId)?.toString()
      : undefined;

  const message = await messageRepository.createMessage({
    conversationId: conversation._id.toString(),
    senderId: input.senderId,
    senderName: input.senderName,
    receiverId,
    text: input.text,
  });

  return { message, conversation };
};

export const markMessageStatus = async (messageId: string, status: MessageStatus) => {
  return messageRepository.updateMessageStatus(messageId, status);
};
