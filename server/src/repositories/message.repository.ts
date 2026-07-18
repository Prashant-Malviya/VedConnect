import { MessageModel } from "../models/message.model";
import { CreateMessageInput, MessageStatus } from "../types/message.types";

export const findMessagesByConversation = async (conversationId: string) => {
  return MessageModel.find({ conversationId }).sort({ createdAt: 1 });
};

export const createMessage = async (input: CreateMessageInput) => {
  return MessageModel.create(input);
};

export const updateMessageStatus = async (messageId: string, status: MessageStatus) => {
  return MessageModel.findByIdAndUpdate(messageId, { status }, { new: true });
};

// Powers the sidebar's "last message" preview for each conversation.
export const findLastMessageForConversation = async (conversationId: string) => {
  return MessageModel.findOne({ conversationId }).sort({ createdAt: -1 });
};

// Latest N messages for a conversation, oldest-first - what ContextService
// feeds to the AI prompt. Sorting desc-then-reverse is cheaper than an
// unbounded ascending scan once a conversation has a long history.
export const findRecentMessages = async (conversationId: string, limit: number) => {
  const recent = await MessageModel.find({ conversationId }).sort({ createdAt: -1 }).limit(limit);
  return recent.reverse();
};

export const deleteMessagesForConversation = async (conversationId: string) => {
  return MessageModel.deleteMany({ conversationId });
};
