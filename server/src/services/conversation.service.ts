import * as conversationRepository from "../repositories/conversation.repository";
import * as userRepository from "../repositories/user.repository";
import * as messageRepository from "../repositories/message.repository";
import * as communityService from "./community.service";
import { AppError } from "../utils/app-error";

export const getOrCreatePrivateConversation = async (userA: string, userB: string) => {
  if (userA === userB) {
    throw new AppError("Cannot start a conversation with yourself", 400);
  }

  const existing = await conversationRepository.findPrivateConversation(userA, userB);
  if (existing) return existing;

  return conversationRepository.createPrivateConversation(userA, userB);
};

// Builds what the Sidebar needs: every conversation the user belongs to,
// enriched with the other participant and a last-message preview. Group
// conversations now also carry communityId, so the frontend can tell
// multiple communities apart (previously there was only ever one).
export const listConversationsForUser = async (userId: string) => {
  await communityService.addUserToDefaultCommunity(userId); // self-heals default Community membership on every fetch

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
        communityId: conversation.communityId || null,
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
