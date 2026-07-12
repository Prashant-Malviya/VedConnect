interface TypingIndicatorProps {
  typingUsers: string[];
}

const TypingIndicator = ({ typingUsers }: TypingIndicatorProps) => {
  if (typingUsers.length === 0) return null;

  const text =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing...`
      : `${typingUsers.join(", ")} are typing...`;

  return (
    <p className="flex items-center gap-1.5 text-xs text-purple-500 px-6 pb-1 italic">
      <span className="flex gap-0.5">
        <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse-soft" />
        <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse-soft [animation-delay:0.15s]" />
        <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse-soft [animation-delay:0.3s]" />
      </span>
      {text}
    </p>
  );
};

export default TypingIndicator;
