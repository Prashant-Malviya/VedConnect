export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId?: string;
  text: string;
  status: "sent" | "delivered";
  createdAt: string;
  updatedAt: string;
}
