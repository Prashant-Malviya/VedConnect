import { randomUUID } from "crypto";
import * as callRepository from "../repositories/call.repository";
import { CallSession, CallEndReason } from "../types/call.types";
import { CallStatus } from "../models/call.model";

const RING_TIMEOUT_MS = 45_000; // unanswered calls auto-resolve to "missed" after this long

// Live sessions only exist here, in memory, for calls that are currently
// ringing or ongoing - never persisted mid-call. This is intentionally the
// ONLY piece of call state that isn't backed by Mongo; a server restart
// drops in-flight calls, which is an acceptable tradeoff for a 1:1 calling
// feature (same as most WebRTC signaling servers).
const sessionsByCallId = new Map<string, CallSession>();
const activeCallIdByUserId = new Map<string, string>(); // busy-detection: userId -> callId

const reasonToStatus = (reason: CallEndReason): CallStatus => {
  switch (reason) {
    case "missed":
    case "offline":
      return "missed";
    case "rejected":
      return "rejected";
    case "cancelled":
      return "cancelled";
    case "busy":
      return "busy";
    case "ended":
    case "disconnected":
    default:
      return "completed";
  }
};

export const isUserBusy = (userId: string): boolean => activeCallIdByUserId.has(userId);

export const getSession = (callId: string): CallSession | undefined => sessionsByCallId.get(callId);

// A user can only ever be in zero or one call at a time (1:1 calling) -
// this is what lets the receiver's client find "the" active call without
// passing callId around everywhere on the frontend.
export const getActiveSessionForUser = (userId: string): CallSession | undefined => {
  const callId = activeCallIdByUserId.get(userId);
  return callId ? sessionsByCallId.get(callId) : undefined;
};

// Creates a new ringing session. Caller is responsible for having already
// checked isUserBusy for both sides - this function does not re-check, to
// keep it a pure state transition.
export const createRingingSession = (
  callerId: string,
  callerName: string,
  receiverId: string,
  receiverName: string,
  onRingTimeout: (session: CallSession) => void
): CallSession => {
  const callId = randomUUID();
  const session: CallSession = {
    callId,
    callerId,
    callerName,
    receiverId,
    receiverName,
    state: "ringing",
    initiatedAt: new Date(),
  };

  session.ringTimeout = setTimeout(() => onRingTimeout(session), RING_TIMEOUT_MS);

  sessionsByCallId.set(callId, session);
  activeCallIdByUserId.set(callerId, callId);
  activeCallIdByUserId.set(receiverId, callId);

  return session;
};

export const markOngoing = (callId: string): CallSession | undefined => {
  const session = sessionsByCallId.get(callId);
  if (!session) return undefined;

  if (session.ringTimeout) clearTimeout(session.ringTimeout);
  session.state = "ongoing";
  session.startedAt = new Date();
  return session;
};

// Tears down in-memory state and writes the final outcome to Mongo. Safe to
// call more than once for the same callId (e.g. both peers signal "end
// call" near-simultaneously) - only the first call has an effect.
export const endSession = async (
  callId: string,
  reason: CallEndReason
): Promise<CallSession | undefined> => {
  const session = sessionsByCallId.get(callId);
  if (!session) return undefined;

  if (session.ringTimeout) clearTimeout(session.ringTimeout);
  sessionsByCallId.delete(callId);
  activeCallIdByUserId.delete(session.callerId);
  activeCallIdByUserId.delete(session.receiverId);

  const endedAt = new Date();
  const status = reasonToStatus(reason);
  const duration =
    status === "completed" && session.startedAt
      ? Math.max(0, Math.round((endedAt.getTime() - session.startedAt.getTime()) / 1000))
      : 0;

  await callRepository.recordCall({
    callerId: session.callerId,
    receiverId: session.receiverId,
    status,
    initiatedAt: session.initiatedAt,
    startedAt: session.startedAt,
    endedAt,
    duration,
  });

  return session;
};

// Used when a call never even reaches the ringing map (e.g. receiver is
// offline, or busy) - there's no session to tear down, just a history row.
export const recordUnreachedCall = async (
  callerId: string,
  receiverId: string,
  reason: Extract<CallEndReason, "offline" | "busy">
): Promise<void> => {
  const now = new Date();
  await callRepository.recordCall({
    callerId,
    receiverId,
    status: reasonToStatus(reason),
    initiatedAt: now,
    endedAt: now,
    duration: 0,
  });
};

export const getCallHistory = async (userId: string) => {
  const calls = await callRepository.findCallHistoryForUser(userId);
  return calls.map((call: any) => ({
    id: call._id.toString(),
    caller: { id: call.caller._id.toString(), name: call.caller.name },
    receiver: { id: call.receiver._id.toString(), name: call.receiver.name },
    status: call.status,
    initiatedAt: call.initiatedAt,
    startedAt: call.startedAt,
    endedAt: call.endedAt,
    duration: call.duration,
  }));
};
