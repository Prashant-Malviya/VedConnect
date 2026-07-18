import { TTSProvider, TTSResult } from "./TTSProvider";
import { ElevenLabsTTSProvider } from "./ElevenLabsTTSProvider";

// Lazily constructed, same pattern as AIService's Gemini provider - a
// missing ELEVENLABS_API_KEY shouldn't crash the server, only mean voice
// replies fall back to text-only (see synthesizeOrNull below, and
// VoiceAIService's error handling).
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

// Never throws - returns null on any failure (missing key, network error,
// provider outage), so a TTS problem degrades to "show the text response
// in the UI instead of crashing" (brief, error handling #8) rather than
// breaking the voice-AI flow.
export const synthesizeOrNull = async (text: string): Promise<TTSResult | null> => {
  try {
    return await getProvider().synthesize(text);
  } catch (error) {
    console.error("Text-to-speech failed, falling back to text-only:", error);
    return null;
  }
};
