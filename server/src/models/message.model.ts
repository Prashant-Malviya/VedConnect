import { Schema, model, Types } from "mongoose";

// A message is authored either by a human USER or by the AI (Ved).
// AI messages are stored in this exact same collection - no separate
// storage - so they flow through existing history/pagination/socket code
// unchanged. senderId stays optional so AI messages don't need a fake User.
export type MessageSenderType = "USER" | "AI";

export interface MessageDocument {
  conversationId: Types.ObjectId;
  senderType: MessageSenderType;
  senderId?: Types.ObjectId; // required for USER messages, absent for AI
  senderName: string; // display name - the user's name, or the assistant's name (e.g. "Ved")
  receiverId?: Types.ObjectId;
  text: string;
  status: "sent" | "delivered";
  // AI-only metadata. Left undefined on USER messages.
  assistantName?: string; // e.g. "Ved" - kept distinct from senderName in case that's ever localized
  aiModel?: string; // e.g. "gemini-1.5-flash" - which model/provider produced this reply
  aiError?: boolean; // true if this message is a "Ved is unavailable" fallback, not a real answer
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<MessageDocument>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderType: { type: String, enum: ["USER", "AI"], default: "USER", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User" },
    senderName: { type: String, required: true, trim: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true, trim: true },
    status: { type: String, enum: ["sent", "delivered"], default: "sent" },
    assistantName: { type: String },
    aiModel: { type: String },
    aiError: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: 1 }); // speeds up per-conversation history fetches

export const MessageModel = model<MessageDocument>("Message", messageSchema);
