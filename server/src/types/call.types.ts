import { CallStatus } from "../models/call.model";

export type { CallStatus };

// The ephemeral in-memory session for a call that's ringing or ongoing.
// This is intentionally NOT persisted while active - only the final
// outcome is written to Mongo (via CallSession -> CallDocument on
// termination). Keeping live state in memory keeps the hot path
// (offer/answer/ice-candidate relay) fast and avoids a DB write per event.
export type CallLifecycleState = "ringing" | "ongoing";

export interface CallSession {
  callId: string;
  callerId: string;
  callerName: string;
  receiverId: string;
  receiverName: string;
  state: CallLifecycleState;
  initiatedAt: Date;
  startedAt?: Date;
  ringTimeout?: NodeJS.Timeout;
}

export interface CallParticipantSummary {
  id: string;
  name: string;
}

export type CallEndReason = "missed" | "rejected" | "cancelled" | "ended" | "busy" | "offline" | "disconnected";

export interface CallHistoryEntry {
  id: string;
  caller: CallParticipantSummary;
  receiver: CallParticipantSummary;
  status: CallStatus;
  initiatedAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  duration: number;
}
