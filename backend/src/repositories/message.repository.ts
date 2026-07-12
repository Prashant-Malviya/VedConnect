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
