export type MessageSenderType = "USER" | "AI";

export interface Message {
  _id: string;
  conversationId: string;
  senderType: MessageSenderType;
  senderId?: string; // absent on AI messages
  senderName: string;
  receiverId?: string;
  text: string;
  status: "sent" | "delivered";
  // AI-only metadata - present only when senderType === "AI".
  assistantName?: string;
  aiModel?: string;
  aiError?: boolean;
  createdAt: string;
  updatedAt: string;
}
