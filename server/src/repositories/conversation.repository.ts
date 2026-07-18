import { ConversationModel } from "../models/conversation.model";

// Retained for backward compatibility with the pre-Communities bootstrap flow.
// Community creation now goes through community.service.ts, which creates
// the backing group Conversation via createGroupConversation below.
export const COMMUNITY_NAME = "🌍 VedConnect Community";

export const findCommunityConversation = async () => {
  return ConversationModel.findOne({ type: "group", communityId: { $exists: false } });
};

export const createCommunityConversation = async () => {
  return ConversationModel.create({ type: "group", name: COMMUNITY_NAME, participants: [] });
};

// Every user-created (and the default) Community owns exactly one group
// Conversation. The community doesn't exist yet at this point (it needs
// this conversation's id), so communityId is attached afterwards by the
// caller once the Community document has been created.
export const createGroupConversation = async (name: string) => {
  return ConversationModel.create({ type: "group", name, participants: [] });
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
