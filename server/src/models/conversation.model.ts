import { Schema, model, Types } from "mongoose";

// A Conversation is either a community's group chat ("group") or a
// "private" 1-to-1 chat. Every Message belongs to one. Ved (the AI) never
// gets its own participant entry - it participates via @ved mentions in
// whichever conversation it's addressed in.
export type ConversationType = "group" | "private";

export interface ConversationDocument {
  type: ConversationType;
  participants: Types.ObjectId[];
  name: string; // only set for "group" - private chats use the other participant's name
  // Set only for "group" conversations that back a Community. Kept optional/nullable
  // so this model stays valid for private chats and for the legacy single-community
  // setup without a migration being strictly required.
  communityId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<ConversationDocument>(
  {
    type: { type: String, enum: ["group", "private"], required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    name: { type: String, trim: true, default: "" },
    communityId: { type: Schema.Types.ObjectId, ref: "Community" },
  },
  { timestamps: true }
);

conversationSchema.index({ communityId: 1 });

export const ConversationModel = model<ConversationDocument>("Conversation", conversationSchema);
