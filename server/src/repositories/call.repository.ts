import { CallModel, CallStatus } from "../models/call.model";

export interface RecordCallInput {
  callerId: string;
  receiverId: string;
  status: CallStatus;
  initiatedAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  duration: number;
}

export const recordCall = async (input: RecordCallInput) => {
  return CallModel.create({
    caller: input.callerId,
    receiver: input.receiverId,
    status: input.status,
    initiatedAt: input.initiatedAt,
    startedAt: input.startedAt,
    endedAt: input.endedAt,
    duration: input.duration,
  });
};

// Every call this user was part of (either side), newest first.
export const findCallHistoryForUser = async (userId: string, limit = 50) => {
  return CallModel.find({ $or: [{ caller: userId }, { receiver: userId }] })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("caller", "name email")
    .populate("receiver", "name email");
};
