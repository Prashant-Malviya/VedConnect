import { Schema, model, Types } from "mongoose";

// A Conversation is either the shared "group" chat (Community) or a
// "private" 1-to-1 chat. Every Message belongs to one.
export type ConversationType = "group" | "private";

export interface ConversationDocument {
  type: ConversationType;
  participants: Types.ObjectId[];
  name: string; // only set for "group" - private chats use the other participant's name
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
