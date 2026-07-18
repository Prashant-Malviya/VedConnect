import { IContextService, ContextMessage } from "../ai/ContextService";
import * as transcriptService from "./TranscriptService";

// This is the reuse point called for in the brief: AIService/PromptBuilder
// only ever depend on the IContextService interface (defined in
// services/ai/ContextService.ts), never on where context comes from. For
// text chat that's RecentMessagesContextService, backed by Mongo message
// history. For an in-call voice mention, it's this class instead, backed
// by TranscriptService's in-memory live transcript - same interface, so
// AIService.generateVedReplyFromContext doesn't need to know or care which
// one produced its input.
//
// callId is used as the "conversationId" here - each call's transcript is
// already fully isolated per callId, so this trivially satisfies "never
// use context from other conversations or communities" for voice.
export class TranscriptContextService implements IContextService {
  constructor(private readonly entryLimit: number) {}

  async getContext(callId: string): Promise<ContextMessage[]> {
    const entries = transcriptService.getRecentEntries(callId, this.entryLimit);

    return entries.map(
      (entry): ContextMessage => ({
        senderName: entry.speaker,
        senderType: entry.speakerType,
        text: entry.text,
        createdAt: entry.timestamp,
      })
    );
  }
}
