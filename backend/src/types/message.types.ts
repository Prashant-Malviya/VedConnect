// What the controller passes in - the caller supplies EITHER an existing
// conversationId OR a receiverId (first message to someone new). The
// service resolves receiverId into a real (or newly-created) conversation.
export interface SendMessageInput {
  conversationId?: string;
  receiverId?: string;
  senderId: string;
  senderName: string;
  text: string;
}

// What actually gets written to the database, once the service has
// resolved a concrete conversationId.
export interface CreateMessageInput {
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId?: string;
  text: string;
}

export type MessageStatus = "sent" | "delivered";
