// Same shape as services/ai/AIProvider.ts: one small interface, one
// concrete implementation today, swappable later without touching
// VoiceAIService or anything upstream of it.
export interface TTSResult {
  audioBase64: string;
  mimeType: string;
}

export interface TTSProvider {
  synthesize(text: string): Promise<TTSResult>;
}
