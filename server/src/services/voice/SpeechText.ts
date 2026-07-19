// Ved's replies are written with Markdown in mind (see PromptBuilder) -
// perfect for the text-chat bubble (AiMessage.tsx renders it properly),
// but a TTS engine reading "asterisk asterisk" or "hash" out loud sounds
// broken. This strips that formatting down to plain, speakable text.
// Used for BOTH the cloud TTS input and the live transcript entry stored
// for voice calls - the transcript panel renders plain text, not
// Markdown, so the same clean version is correct for display too.
export const toSpeechText = (markdown: string): string => {
  let text = markdown;

  // Defensive: strip a self-prefix like "Ved:" / "Ved -" if the model
  // echoed the "Speaker: message" transcript format back at us despite
  // being told not to (PromptBuilder instructs against this, but LLM
  // output isn't 100% guaranteed).
  text = text.replace(/^\s*ved\s*[:\-–]\s*/i, "");

  // Headings, bold/italic/strikethrough markers, inline code backticks.
  text = text.replace(/^#{1,6}\s+/gm, "");
  text = text.replace(/(\*\*\*|\*\*|\*|__|_|~~|`)/g, "");

  // Bullet/numbered list markers at the start of a line - drop the marker,
  // keep the text, so list items read as separate sentences.
  text = text.replace(/^\s*[-*+]\s+/gm, "");
  text = text.replace(/^\s*\d+\.\s+/gm, "");

  // Markdown links -> just the link text; bare code fences.
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  text = text.replace(/```[\s\S]*?```/g, "");

  // Collapse resulting whitespace.
  text = text.replace(/[ \t]+/g, " ").replace(/\n{2,}/g, "\n").trim();

  return text;
};
