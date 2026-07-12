const COLORS = [
  "bg-gradient-to-br from-purple-600 to-purple-800",
  "bg-gradient-to-br from-violet-500 to-purple-700",
  "bg-gradient-to-br from-fuchsia-500 to-purple-700",
  "bg-gradient-to-br from-amber-500 to-orange-600",
  "bg-gradient-to-br from-rose-500 to-pink-600",
  "bg-gradient-to-br from-indigo-500 to-purple-700",
  "bg-gradient-to-br from-teal-500 to-purple-700",
  "bg-gradient-to-br from-emerald-500 to-teal-600",
];

// Hashes a username into a consistent index, so the same person always
// gets the same avatar color across messages and sessions.
export const getAvatarColor = (username: string): string => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
};
