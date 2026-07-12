import { Schema, model, Types } from "mongoose";

// Every message belongs to a Conversation (Community or private). For
// private messages, receiverId is set so the DB can answer "who was this
// meant for" without re-deriving it from the Conversation every time.

interface MessageDocument {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderName: string;
  receiverId?: Types.ObjectId;
  text: string;
  status: "sent" | "delivered";
}

const messageSchema = new Schema<MessageDocument>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, required: true, trim: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true, trim: true },
    status: { type: String, enum: ["sent", "delivered"], default: "sent" },
  },
  { timestamps: true }
);

// Every message list fetch is scoped to one conversation and ordered by
// time - this index makes both parts of that query fast.
messageSchema.index({ conversationId: 1, createdAt: 1 });

export const MessageModel = model<MessageDocument>("Message", messageSchema);
