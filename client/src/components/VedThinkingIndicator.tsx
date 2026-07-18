import { Sparkles } from "lucide-react";

interface VedThinkingIndicatorProps {
  assistantName: string | null;
}

const VedThinkingIndicator = ({ assistantName }: VedThinkingIndicatorProps) => {
  if (!assistantName) return null;

  return (
    <p className="flex items-center gap-1.5 text-xs text-indigo-500 px-6 pb-1 italic">
      <Sparkles className="w-3.5 h-3.5" />
      <span className="flex gap-0.5">
        <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse-soft" />
        <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse-soft [animation-delay:0.15s]" />
        <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse-soft [animation-delay:0.3s]" />
      </span>
      {assistantName} is thinking...
    </p>
  );
};

export default VedThinkingIndicator;
