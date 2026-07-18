// Caller supplies EITHER an existing conversationId OR a receiverId
// (first message to someone new).
export interface SendMessageInput {
  conversationId?: string;
  receiverId?: string;
  senderId: string;
  senderName: string;
  text: string;
}

export interface CreateMessageInput {
  conversationId: string;
  senderId?: string; // absent for AI-authored messages
  senderName: string;
  receiverId?: string;
  text: string;
  senderType?: "USER" | "AI";
  assistantName?: string;
  aiModel?: string;
  aiError?: boolean;
}

export type MessageStatus = "sent" | "delivered";
