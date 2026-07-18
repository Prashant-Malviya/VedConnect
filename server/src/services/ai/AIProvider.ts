// Every AI vendor (Gemini today, OpenAI/Groq/etc later) implements this.
// Nothing outside this ai/ folder should ever import a vendor SDK directly -
// AIService is the only consumer of AIProvider.
export interface AIGenerationResult {
  text: string;
  model: string;
}

export interface AIProvider {
  // Human-readable id, e.g. "gemini-1.5-flash" - stored on AI messages as aiModel.
  readonly modelId: string;

  generate(prompt: string): Promise<AIGenerationResult>;
}
