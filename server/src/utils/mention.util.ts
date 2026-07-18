// Matches "@ved" as a whole word, case-insensitive, anywhere in the message -
// "@ved summarize", "hey @Ved, what do you think", "cc @ved" all trigger.
const VED_MENTION_REGEX = /(^|\s)@ved\b/i;

export const mentionsVed = (text: string): boolean => VED_MENTION_REGEX.test(text);

// Strips the "@ved" token itself so the AI receives a clean instruction,
// e.g. "@ved summarize today's discussion" -> "summarize today's discussion".
export const extractVedQuery = (text: string): string => {
  return text.replace(/@ved\b/gi, "").trim();
};
