import * as conversationRepository from "../repositories/conversation.repository";
import * as userRepository from "../repositories/user.repository";
import * as messageRepository from "../repositories/message.repository";
import { AppError } from "../utils/app-error";

// Ensures the single shared Community conversation exists, and that every
// currently registered user is a participant of it. Called once at server
// startup so Community is always ready before any request comes in.
export const ensureCommunityConversation = async () => {
  let community = await conversationRepository.findCommunityConversation();
  if (!community) {
    community = await conversationRepository.createCommunityConversation();
  }

  const allUserIds = await userRepository.findAllUserIds();
  for (const userId of allUserIds) {
    await conversationRepository.addParticipant(community._id.toString(), userId);
  }

  return community;
};

// Called right after a new user signs up, so they land in Community chat
// immediately without needing a server restart.
export const addUserToCommunity = async (userId: string) => {
  const community = await conversationRepository.findCommunityConversation();
  if (!community) return;
  await conversationRepository.addParticipant(community._id.toString(), userId);
};

export const getOrCreatePrivateConversation = async (userA: string, userB: string) => {
  if (userA === userB) {
    throw new AppError("Cannot start a conversation with yourself", 400);
  }

  const existing = await conversationRepository.findPrivateConversation(userA, userB);
  if (existing) return existing;

  return conversationRepository.createPrivateConversation(userA, userB);
};

// Builds exactly what the Sidebar needs: every conversation the user
// belongs to, enriched with the "other participant" (for private chats)
// and a last-message preview, in one pass.
export const listConversationsForUser = async (userId: string) => {
  const conversations = await conversationRepository.findConversationsForUser(userId);

  const enriched = await Promise.all(
    conversations.map(async (conversation) => {
      const lastMessage = await messageRepository.findLastMessageForConversation(
        conversation._id.toString()
      );

      let otherUser = null;
      if (conversation.type === "private") {
        const otherUserId = conversation.participants.find((p) => p.toString() !== userId);
        if (otherUserId) {
          const otherUserDoc = await userRepository.findUserById(otherUserId.toString());
          if (otherUserDoc) {
            otherUser = { id: otherUserDoc._id, name: otherUserDoc.name, email: otherUserDoc.email };
          }
        }
      }

      return {
        _id: conversation._id,
        type: conversation.type,
        name: conversation.type === "group" ? conversation.name : otherUser?.name || "Unknown",
        participants: conversation.participants,
        otherUser,
        lastMessage: lastMessage
          ? { text: lastMessage.text, createdAt: lastMessage.createdAt }
          : null,
        updatedAt: conversation.updatedAt,
      };
    })
  );

  return enriched;
};

// Authorization check reused by the message service: you can only read or
// send messages in a conversation you're actually part of.
export const assertUserIsParticipant = async (conversationId: string, userId: string) => {
  const conversation = await conversationRepository.findConversationById(conversationId);
  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  const isParticipant = conversation.participants.some((p) => p.toString() === userId);
  if (!isParticipant) {
    throw new AppError("You are not part of this conversation", 403);
  }

  return conversation;
};
