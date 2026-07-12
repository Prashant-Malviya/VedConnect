import { ConversationModel } from "../models/conversation.model";

export const COMMUNITY_NAME = "🌍 VedConnect Community";

export const findCommunityConversation = async () => {
  return ConversationModel.findOne({ type: "group" });
};

export const createCommunityConversation = async () => {
  return ConversationModel.create({ type: "group", name: COMMUNITY_NAME, participants: [] });
};

export const addParticipant = async (conversationId: string, userId: string) => {
  return ConversationModel.findByIdAndUpdate(
    conversationId,
    { $addToSet: { participants: userId } },
    { new: true }
  );
};

export const findPrivateConversation = async (userA: string, userB: string) => {
  return ConversationModel.findOne({
    type: "private",
    participants: { $all: [userA, userB], $size: 2 },
  });
};

export const createPrivateConversation = async (userA: string, userB: string) => {
  return ConversationModel.create({ type: "private", participants: [userA, userB] });
};

// Every conversation (Community + every private chat) this user belongs to
// - newest first, since that's the order the sidebar wants them in.
export const findConversationsForUser = async (userId: string) => {
  return ConversationModel.find({ participants: userId }).sort({ updatedAt: -1 });
};

export const findConversationById = async (conversationId: string) => {
  return ConversationModel.findById(conversationId);
};
