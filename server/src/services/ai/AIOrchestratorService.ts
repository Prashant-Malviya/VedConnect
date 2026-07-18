import * as messageRepository from "../../repositories/message.repository";
import { getIO } from "../../sockets";
import { mentionsVed } from "../../utils/mention.util";
import { generateVedReply, VED_ASSISTANT_NAME } from "./AIService";

// Called (fire-and-forget, from the message controller) right after a USER
// message has been stored and broadcast. Never blocks or throws back into
// the request that sent the triggering message - a slow/failed AI call
// must never delay or break sending a normal chat message.
export const maybeRespondAsVed = async (conversationId: string, triggeringText: string): Promise<void> => {
  if (!mentionsVed(triggeringText)) return;

  const io = getIO();

  try {
    io.to(conversationId).emit("aiThinking", { conversationId, assistantName: VED_ASSISTANT_NAME });

    const reply = await generateVedReply(conversationId, triggeringText);

    const aiMessage = await messageRepository.createMessage({
      conversationId,
      senderName: VED_ASSISTANT_NAME,
      text: reply.text,
      senderType: "AI",
      assistantName: VED_ASSISTANT_NAME,
      aiModel: reply.model,
      aiError: reply.isFallback,
    });

    io.to(conversationId).emit("newMessage", aiMessage);
  } catch (error) {
    // generateVedReply already catches provider errors and returns a
    // fallback - reaching here means something else went wrong (e.g. the
    // DB write itself). Log it and stop; the user's own message is
    // unaffected either way.
    console.error("Ved orchestration failed unexpectedly:", error);
  } finally {
    io.to(conversationId).emit("aiStoppedThinking", { conversationId });
  }
};
