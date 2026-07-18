import { TranscriptEntry } from "../../types/voice.types";

// Lives entirely in memory, keyed by callId - same reasoning as
// call.service.ts's session maps: a call's transcript only matters while
// the call is happening (it feeds AI context in real time), and dropping
// it when the call ends (or the server restarts) is an accepted tradeoff
// for v1. Nothing here is written to Mongo - see the module doc comment
// in voice.types.ts: text only, no raw audio, and per this brief, no
// persistence of the transcript itself (that's the "AI meeting minutes"
// future feature, deliberately not built now).
const MAX_ENTRIES_PER_CALL = 200; // bounds memory for very long calls

const transcriptsByCallId = new Map<string, TranscriptEntry[]>();

export const appendEntry = (entry: TranscriptEntry): void => {
  const entries = transcriptsByCallId.get(entry.callId) || [];
  entries.push(entry);
  if (entries.length > MAX_ENTRIES_PER_CALL) {
    entries.splice(0, entries.length - MAX_ENTRIES_PER_CALL);
  }
  transcriptsByCallId.set(entry.callId, entries);
};

// Chronological, oldest-first - exactly what a context builder needs.
export const getTranscript = (callId: string): TranscriptEntry[] => {
  return transcriptsByCallId.get(callId) || [];
};

export const getRecentEntries = (callId: string, limit: number): TranscriptEntry[] => {
  const entries = getTranscript(callId);
  return entries.slice(Math.max(0, entries.length - limit));
};

export const clearTranscript = (callId: string): void => {
  transcriptsByCallId.delete(callId);
};
