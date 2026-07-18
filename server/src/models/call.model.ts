import { Schema, model, Types } from "mongoose";

// One document per call *attempt* - covers calls that never connected
// (missed/rejected/cancelled/busy) as well as ones that did (completed).
// No raw audio/video is ever stored here or anywhere else - only metadata.
export type CallStatus = "missed" | "rejected" | "cancelled" | "completed" | "busy";

export interface CallDocument {
  caller: Types.ObjectId;
  receiver: Types.ObjectId;
  status: CallStatus;
  initiatedAt: Date; // when the caller pressed "call"
  startedAt?: Date; // when both sides actually connected (WebRTC "ongoing") - absent if never answered
  endedAt?: Date;
  duration: number; // seconds actually connected; 0 if never answered
  createdAt: Date;
  updatedAt: Date;
}

const callSchema = new Schema<CallDocument>(
  {
    caller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["missed", "rejected", "cancelled", "completed", "busy"], required: true },
    initiatedAt: { type: Date, required: true },
    startedAt: { type: Date },
    endedAt: { type: Date },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Powers "call history with this person" and "my recent calls", newest first.
callSchema.index({ caller: 1, createdAt: -1 });
callSchema.index({ receiver: 1, createdAt: -1 });

export const CallModel = model<CallDocument>("Call", callSchema);
