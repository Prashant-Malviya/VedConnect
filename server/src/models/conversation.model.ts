import { Schema, model, Types } from "mongoose";

// A Conversation is either the single shared "group" chat (Community), or a
// "private" 1-to-1 chat between exactly two participants. Every Message
// belongs to a Conversation - this is what lets Community and Private chat
// reuse the same Message model and the same Socket.io room mechanism
// (the room name is just the conversation's _id).

export type ConversationType = "group" | "private";

export interface ConversationDocument {
  type: ConversationType;
  participants: Types.ObjectId[];
  // Only used for the "group" conversation (holds the Community's display
  // name). Private chats derive their display name from the other
  // participant instead, so this stays empty for them.
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<ConversationDocument>(
  {
    type: { type: String, enum: ["group", "private"], required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    name: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export const ConversationModel = model<ConversationDocument>("Conversation", conversationSchema);
