// Voice transcripts come from speech recognition, so they'll never contain
// a literal "@" the way typed chat does. This list intentionally covers a
// wide range of natural ways someone might say Ved's name mid-conversation
// - greetings, filler ("ohh ved"), the product name, and a couple of
// common speech-to-text mishearings of "Ved" - so invoking the AI feels
// natural rather than requiring one exact phrase.
const WAKE_WORD_PATTERNS = [
  /\bhey\s+ved(u|connect)?\b/i,
  /\bhi\s+ved(u|connect)?\b/i,
  /\bhello\s+ved(u|connect)?\b/i,
  /\bhellow\s+ved(u|connect)?\b/i,
  /\bat\s+ved\b/i,
  /@ved\b/i,
  /\boh+\s+ved\b/i,
  /\bokay?\s+ved\b/i,
  /\byo\s+ved\b/i,
  /\bvedconnect\b/i,
  /\bvedu\b/i,
  /\bved\b/i,
];

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
