export type CallEndReason = "missed" | "rejected" | "cancelled" | "ended" | "busy" | "offline" | "disconnected";

export type CallStatus = "missed" | "rejected" | "cancelled" | "completed" | "busy";

export interface CallParticipant {
  id: string;
  name: string;
}

// The full set of states the local call UI can be in. "idle" means no
// CallOverlay renders at all.
export type CallUiState =
  | "idle"
  | "outgoing-ringing" // I called someone, waiting for them to answer
  | "incoming-ringing" // someone is calling me
  | "connecting" // accepted, WebRTC handshake in progress
  | "ongoing"; // media flowing

export interface ActiveCall {
  callId: string;
  otherParticipant: CallParticipant;
  direction: "outgoing" | "incoming";
  uiState: CallUiState;
  startedAt: Date | null; // set once truly connected - drives the duration timer
  isMuted: boolean;
}

export interface CallHistoryEntry {
  id: string;
  caller: CallParticipant;
  receiver: CallParticipant;
  status: CallStatus;
  initiatedAt: string;
  startedAt?: string;
  endedAt?: string;
  duration: number;
}
