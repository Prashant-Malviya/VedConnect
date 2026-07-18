import { Socket } from "socket.io";
import * as callService from "../services/call.service";
import * as transcriptService from "../services/voice/TranscriptService";
import * as wakeWordService from "../services/voice/WakeWordService";
import * as voiceAIService from "../services/voice/VoiceAIService";
import { TranscriptEntry } from "../types/voice.types";
import { getIO } from "./index";

interface VoiceTranscriptPayload {
  callId: string;
  text: string;
}

// Each participant's browser runs its own local speech recognition (see
// client/src/services/voice/SpeechToTextService.ts) on its own microphone
// only - no raw audio is ever sent to or through the server, only the
// recognized text. This handler is where that text enters the backend.
export const registerVoiceCallHandlers = (socket: Socket, userId: string, userName: string): void => {
  socket.on("voice-transcript", async ({ callId, text }: VoiceTranscriptPayload) => {
    const cleanText = (text || "").trim();
    if (!callId || !cleanText) return;

    // Only an actual participant of this specific, currently-ongoing call
    // may contribute to its transcript - this is also what keeps voice AI
    // context scoped to exactly one call, never bleeding across calls.
    const session = callService.getSession(callId);
    if (!session || session.state !== "ongoing") return;
    if (session.callerId !== userId && session.receiverId !== userId) return;

    const entry: TranscriptEntry = {
      callId,
      speaker: userName,
      speakerType: "USER",
      userId,
      text: cleanText,
      timestamp: new Date(),
    };

    transcriptService.appendEntry(entry);
    getIO().to(`call:${callId}`).emit("voice-transcript-broadcast", entry);

    if (wakeWordService.detectsWakeWord(cleanText)) {
      voiceAIService.handleWakeWordTrigger(callId, cleanText).catch((error) => {
        console.error("Unhandled error triggering voice Ved:", error);
      });
    }
  });
};
