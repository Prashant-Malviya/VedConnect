import { Schema, model, Types } from "mongoose";

interface MessageDocument {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderName: string;
  receiverId?: Types.ObjectId;
  text: string;
  status: "sent" | "delivered";
  createdAt: Date;
  updatedAt: Date;
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

messageSchema.index({ conversationId: 1, createdAt: 1 }); // speeds up per-conversation history fetches

export const MessageModel = model<MessageDocument>("Message", messageSchema);
