// Voice transcripts come from speech recognition, so they'll never contain
// a literal "@" the way typed chat does - "hey ved", "ved", "at ved", and
// "@ved" (in case a client-side STT engine or a pasted/typed fallback does
// produce the symbol) are all treated as equivalent wake phrases.
//
// This is deliberately a separate module from utils/mention.util.ts rather
// than a shared one: text-chat mentions and spoken wake words have
// different false-positive risks (e.g. "ved" alone is fine to require as a
// whole word in speech, but would be far too easy to trigger accidentally
// in typed text if it weren't already anchored to "@"). Keeping them
// separate lets each be tuned independently without the other regressing.
const WAKE_WORD_PATTERNS = [/\bhey\s+ved\b/i, /\bat\s+ved\b/i, /@ved\b/i, /\bved\b/i];

export const detectsWakeWord = (text: string): boolean => {
  return WAKE_WORD_PATTERNS.some((pattern) => pattern.test(text));
};

// Strips whichever wake phrase matched, leaving Ved with a clean spoken
// query - "hey ved what's your take" -> "what's your take".
export const extractSpokenQuery = (text: string): string => {
  let cleaned = text;
  for (const pattern of WAKE_WORD_PATTERNS) {
    cleaned = cleaned.replace(pattern, "");
  }
  return cleaned.trim();
};
