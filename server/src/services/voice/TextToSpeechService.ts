import { TTSProvider, TTSResult } from "./TTSProvider";
import { ElevenLabsTTSProvider } from "./ElevenLabsTTSProvider";

// Lazily constructed, same pattern as AIService's Gemini provider - a
// missing ELEVENLABS_API_KEY shouldn't crash the server, only mean voice
// replies fall back to text-only/browser speech (see synthesizeOrNull
// below, and VoiceAIService's error handling).
let provider: TTSProvider | null = null;
const getProvider = (): TTSProvider => {
  if (!provider) {
    provider = new ElevenLabsTTSProvider(
      process.env.ELEVENLABS_API_KEY || "",
      process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM", // ElevenLabs' default public "Rachel" voice
      process.env.ELEVENLABS_MODEL_ID || "eleven_turbo_v2"
    );
  }
  return provider;
};

// TTS_PROVIDER=browser (or "none") skips the cloud call entirely and
// always resolves to null immediately - the client then speaks Ved's
// reply itself via the browser's built-in speechSynthesis, with zero
// network dependency. Useful whenever a cloud TTS key is missing,
// misconfigured, or you'd rather not risk a live network call failing
// mid-demo. Default stays "elevenlabs" so nothing changes for anyone who
// hasn't set this.
const TTS_PROVIDER = (process.env.TTS_PROVIDER || "elevenlabs").toLowerCase();

// Never throws - returns null on any failure (missing key, network error,
// provider outage) OR when explicitly bypassed via TTS_PROVIDER, so a TTS
// problem degrades to "show the text response in the UI instead of
// crashing" (brief, error handling #8) rather than breaking the voice-AI
// flow. The client treats a null result as "synthesize this yourself" -
// see CallContext.tsx's handleAiSpeakingVoice.
export const synthesizeOrNull = async (text: string): Promise<TTSResult | null> => {
  if (TTS_PROVIDER === "browser" || TTS_PROVIDER === "none") {
    return null;
  }

  try {
    return await getProvider().synthesize(text);
  } catch (error) {
    console.error("Text-to-speech failed, falling back to text-only:", error);
    return null;
  }
};
