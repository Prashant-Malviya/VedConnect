// A single utterance in a call's live transcript. Text only - per the
// brief, raw audio is never captured or stored anywhere on the server.
export interface TranscriptEntry {
  callId: string;
  speaker: string; // display name - the user's name, or "Ved" for AI entries
  speakerType: "USER" | "AI";
  userId?: string; // absent for AI entries
  text: string;
  timestamp: Date;
}

export interface VoiceAIReplyResult {
  entry: TranscriptEntry;
  audioBase64: string | null; // null when TTS wasn't available - client falls back to text-only
  audioMimeType: string | null;
}
