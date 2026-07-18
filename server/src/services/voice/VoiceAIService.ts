import { generateVedReplyFromContext, VED_ASSISTANT_NAME } from "../ai/AIService";
import { TranscriptContextService } from "./TranscriptContextService";
import * as transcriptService from "./TranscriptService";
import * as textToSpeechService from "./TextToSpeechService";
import { extractSpokenQuery } from "./WakeWordService";
import { getIO } from "../../sockets";
import { TranscriptEntry } from "../../types/voice.types";

const contextService = new TranscriptContextService(Number(process.env.AI_CONTEXT_MESSAGE_LIMIT) || 50);

// Guards against two overlapping wake-word triggers in the same call (e.g.
// two participants both say "hey Ved" within the same second) queuing up
// duplicate Gemini calls and talking over each other.
const callsCurrentlyProcessing = new Set<string>();

// Called by sockets/voice-call.socket.ts once a transcript entry has
// already been appended/broadcast AND found to contain a wake word. Never
// throws - mirrors AIOrchestratorService's contract for the text-chat
// flow, for the same reason: a slow/failed AI turn must never break the
// live call.
export const handleWakeWordTrigger = async (callId: string, triggeringText: string): Promise<void> => {
  if (callsCurrentlyProcessing.has(callId)) return;
  callsCurrentlyProcessing.add(callId);

  const room = `call:${callId}`;
  const io = getIO();

  try {
    io.to(room).emit("ai-thinking-voice", { callId, assistantName: VED_ASSISTANT_NAME });

    const query = extractSpokenQuery(triggeringText);
    const context = await contextService.getContext(callId);
    const reply = await generateVedReplyFromContext(context, query);

    const entry: TranscriptEntry = {
      callId,
      speaker: VED_ASSISTANT_NAME,
      speakerType: "AI",
      text: reply.text,
      timestamp: new Date(),
    };
    transcriptService.appendEntry(entry);
    io.to(room).emit("voice-transcript-broadcast", entry);

    const tts = reply.isFallback ? null : await textToSpeechService.synthesizeOrNull(reply.text);

    io.to(room).emit("ai-speaking-voice", {
      callId,
      text: reply.text,
      audioBase64: tts?.audioBase64 || null,
      audioMimeType: tts?.mimeType || null,
    });
  } catch (error) {
    console.error("Voice AI orchestration failed unexpectedly:", error);
  } finally {
    io.to(room).emit("ai-stopped-thinking-voice", { callId });
    callsCurrentlyProcessing.delete(callId);
  }
};

// Called by call.socket.ts when a call ends - drops the transcript and any
// in-flight processing flag so nothing lingers for a callId that will
// never be reused.
export const cleanupCall = (callId: string): void => {
  transcriptService.clearTranscript(callId);
  callsCurrentlyProcessing.delete(callId);
};
