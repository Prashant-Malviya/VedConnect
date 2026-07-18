import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider, AIGenerationResult } from "./AIProvider";

export class GeminiProvider implements AIProvider {
  readonly modelId: string;
  private readonly client: GoogleGenerativeAI;

  constructor(apiKey: string, modelId: string) {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    this.modelId = modelId;
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generate(prompt: string): Promise<AIGenerationResult> {
    const model = this.client.getGenerativeModel({ model: this.modelId });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return { text, model: this.modelId };
  }
}
