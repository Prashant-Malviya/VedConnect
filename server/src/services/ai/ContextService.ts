import * as messageRepository from "../../repositories/message.repository";

export interface ContextMessage {
  senderName: string;
  senderType: "USER" | "AI";
  text: string;
  createdAt: Date;
}

// Any future context strategy (e.g. MongoDB Atlas Vector Search / RAG over
// full history) implements this same interface, so AIService and
// PromptBuilder never need to change when the strategy does - only which
// IContextService gets constructed in AIService.
export interface IContextService {
  getContext(conversationId: string): Promise<ContextMessage[]>;
}

// Today's strategy: just the most recent N messages in the conversation.
// This is intentionally the ONLY context source right now - no cross-
// conversation or cross-community bleed, which is what Part 8/9 of the
// brief require ("Ved only uses messages from that community/conversation").
export class RecentMessagesContextService implements IContextService {
  constructor(private readonly messageLimit: number) {}

  async getContext(conversationId: string): Promise<ContextMessage[]> {
    const messages = await messageRepository.findRecentMessages(conversationId, this.messageLimit);

    return messages.map((m) => ({
      senderName: m.senderName,
      senderType: m.senderType,
      text: m.text,
      createdAt: m.createdAt,
    }));
  }
}

// --- Future extension point (not implemented, per the brief) ---
// class VectorSearchContextService implements IContextService {
//   async getContext(conversationId: string): Promise<ContextMessage[]> {
//     // Would embed the triggering query, run a MongoDB Atlas $vectorSearch
//     // against a per-conversation embeddings collection, and return the
//     // top-K most relevant historical messages instead of just the latest N.
//   }
// }
