// Wraps the browser's built-in SpeechRecognition. This is a deliberate
// architectural choice, not an oversight: the server never receives any
// call media today (this is a peer-to-peer WebRTC mesh, not an SFU/media
// server), so server-side speech-to-text on live call audio isn't
// available without a much larger infrastructure change. Running
// recognition locally, on each participant's own microphone, means:
//   - no raw audio ever has to leave the browser to produce a transcript
//   - "do not store raw audio" (brief, Part 1) is trivially satisfied
//   - it works today, on top of the existing 1:1 mesh, with zero changes
//     to the WebRTC/signaling layer
// The interface below is intentionally small so a future server-side
// streaming STT provider (once/if a media server exists) could implement
// the same shape without touching CallContext.

export interface SpeechToTextHandlers {
  onFinalResult: (text: string) => void;
}

// The Web Speech API isn't in the standard TS lib yet - minimal shape for
// what we actually use.
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

const getSpeechRecognitionCtor = (): (new () => SpeechRecognitionLike) | null => {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

export const isSpeechRecognitionSupported = (): boolean => Boolean(getSpeechRecognitionCtor());

export class SpeechToTextService {
  private recognition: SpeechRecognitionLike | null = null;
  private shouldBeRunning = false;

  constructor(private readonly handlers: SpeechToTextHandlers) {}

  start(): void {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      // Per the brief: "If speech recognition fails, continue the call."
      // Unsupported browsers simply don't contribute to the transcript or
      // wake-word detection - the call itself is entirely unaffected.
      console.warn("SpeechRecognition is not supported in this browser - voice AI wake-word detection is disabled for this participant.");
      return;
    }

    this.shouldBeRunning = true;
    this.recognition = new Ctor();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = "en-US";

    this.recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1];
      if (!lastResult?.isFinal) return;
      const text = lastResult[0]?.transcript?.trim();
      if (text) this.handlers.onFinalResult(text);
    };

    this.recognition.onerror = (event: any) => {
      console.warn("Speech recognition error (continuing call):", event?.error);
    };

    // Browser speech recognition sessions end on their own periodically -
    // auto-restart for as long as the call is still ongoing.
    this.recognition.onend = () => {
      if (this.shouldBeRunning && this.recognition) {
        try {
          this.recognition.start();
        } catch {
          // Already running / transient restart error - safe to ignore.
        }
      }
    };

    try {
      this.recognition.start();
    } catch (error) {
      console.warn("Failed to start speech recognition (continuing call):", error);
    }
  }

  stop(): void {
    this.shouldBeRunning = false;
    this.recognition?.stop();
    this.recognition = null;
  }
}
