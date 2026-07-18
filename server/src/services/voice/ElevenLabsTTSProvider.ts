import { TTSProvider, TTSResult } from "./TTSProvider";

// Uses ElevenLabs' plain REST API via the global fetch (Node 18+) rather
// than pulling in an SDK - one dependency-free HTTP call in, one MP3
// buffer out. Chosen over e.g. Google Cloud TTS because it only needs a
// single API key (consistent with how GEMINI_API_KEY already works),
// instead of a separate GCP service-account file.
export class ElevenLabsTTSProvider implements TTSProvider {
  constructor(
    private readonly apiKey: string,
    private readonly voiceId: string,
    private readonly modelId: string
  ) {}

  async synthesize(text: string): Promise<TTSResult> {
    if (!this.apiKey) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
        "xi-api-key": this.apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: this.modelId,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`ElevenLabs TTS request failed (${response.status}): ${errorBody}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(arrayBuffer).toString("base64");

    return { audioBase64, mimeType: "audio/mpeg" };
  }
}
