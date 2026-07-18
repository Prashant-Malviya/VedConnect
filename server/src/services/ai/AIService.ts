import { AIProvider } from "./AIProvider";
import { GeminiProvider } from "./GeminiProvider";
import { IContextService, RecentMessagesContextService, ContextMessage } from "./ContextService";
import { buildVedPrompt } from "./PromptBuilder";
import { extractVedQuery } from "../../utils/mention.util";

export const VED_ASSISTANT_NAME = process.env.AI_ASSISTANT_NAME || "Ved";
export const VED_FALLBACK_TEXT =
  "I'm having trouble reaching my AI backend right now, so I can't respond properly. " +
  "Your message is saved - feel free to ask me again in a moment.";

export interface VedReply {
  text: string;
  model: string;
  isFallback: boolean;
}

// Lazily constructed so a missing/invalid GEMINI_API_KEY doesn't crash the
// whole server at import time - only @ved mentions actually need it, and
// those fail gracefully (see AIOrchestratorService / VoiceAIService).
let provider: AIProvider | null = null;
const getProvider = (): AIProvider => {
  if (!provider) {
    provider = new GeminiProvider(
      process.env.GEMINI_API_KEY || "",
      process.env.GEMINI_MODEL || "gemini-1.5-flash"
    );
  }
  return provider;
};

const contextService: IContextService = new RecentMessagesContextService(
  Number(process.env.AI_CONTEXT_MESSAGE_LIMIT) || 50
);

// The shared core: given context that's ALREADY been assembled (regardless
// of where it came from - recent text messages, a live call transcript,
// eventually RAG results, etc.) and a query, build the prompt, call the
// provider, and never throw - always resolve to either a real reply or a
// friendly fallback. Both the text-chat orchestrator and VoiceAIService
// call this same function, so there is exactly one place that talks to
// Gemini and exactly one fallback message.
export const generateVedReplyFromContext = async (
  context: ContextMessage[],
  query: string
): Promise<VedReply> => {
  try {
    const prompt = buildVedPrompt(context, query);
    const { text, model } = await getProvider().generate(prompt);
    return { text, model, isFallback: false };
  } catch (error) {
    console.error("Ved AI generation failed:", error);
    return { text: VED_FALLBACK_TEXT, model: process.env.GEMINI_MODEL || "gemini-1.5-flash", isFallback: true };
  }
};

// Text-chat entry point (unchanged signature/behavior) - fetches context
// via the message-history ContextService, then delegates to the shared
// core above.
export const generateVedReply = async (conversationId: string, triggeringText: string): Promise<VedReply> => {
  const query = extractVedQuery(triggeringText);

  try {
    const context = await contextService.getContext(conversationId);
    return generateVedReplyFromContext(context, query);
  } catch (error) {
    console.error("Ved AI generation failed (context fetch):", error);
    return { text: VED_FALLBACK_TEXT, model: process.env.GEMINI_MODEL || "gemini-1.5-flash", isFallback: true };
  }
};
