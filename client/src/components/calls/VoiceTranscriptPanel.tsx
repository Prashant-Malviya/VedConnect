import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { VoiceTranscriptEntry } from "../../types/call.types";

interface VoiceTranscriptPanelProps {
  entries: VoiceTranscriptEntry[];
}

const VoiceTranscriptPanel = ({ entries }: VoiceTranscriptPanelProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries.length]);

  if (entries.length === 0) {
    return (
      <p className="text-xs text-slate-400 text-center py-4">
        Live transcript will appear here once the conversation starts.
      </p>
    );
  }

  return (
    <div className="max-h-40 overflow-y-auto space-y-2 text-left px-1">
      {entries.map((entry, index) => (
        <div
          key={`${entry.timestamp}-${index}`}
          className={`text-xs rounded-xl px-3 py-2 ${
            entry.speakerType === "AI"
              ? "bg-indigo-50 border border-indigo-100 text-indigo-700"
              : "bg-slate-50 text-slate-600"
          }`}
        >
          <span className={`font-semibold ${entry.speakerType === "AI" ? "inline-flex items-center gap-1" : ""}`}>
            {entry.speakerType === "AI" && <Sparkles className="w-3 h-3" />}
            {entry.speaker}:
          </span>{" "}
          {entry.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default VoiceTranscriptPanel;
