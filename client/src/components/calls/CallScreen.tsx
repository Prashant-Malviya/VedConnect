import { useEffect, useState } from "react";
import { Mic, MicOff, PhoneOff, Sparkles } from "lucide-react";
import Avatar from "../Avatar";
import VoiceTranscriptPanel from "./VoiceTranscriptPanel";
import { ActiveCall } from "../../types/call.types";

interface CallScreenProps {
  call: ActiveCall;
  onCancel: () => void;
  onEnd: () => void;
  onToggleMute: () => void;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const statusLabel = (call: ActiveCall): string => {
  if (call.uiState === "outgoing-ringing") return "Calling...";
  if (call.uiState === "connecting") return "Connecting...";
  return "";
};

// Covers outgoing-ringing, connecting, and ongoing - one screen whose
// content/actions shift with uiState, rather than three near-duplicate
// components.
const CallScreen = ({ call, onCancel, onEnd, onToggleMute }: CallScreenProps) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (call.uiState !== "ongoing" || !call.startedAt) return;
    const startedAt = call.startedAt;
    const tick = () => setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt.getTime()) / 1000)));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [call.uiState, call.startedAt]);

  const isOngoing = call.uiState === "ongoing";
  const isOutgoingRinging = call.uiState === "outgoing-ringing";

  const vedStatusLabel = call.isVedThinking ? "Ved is thinking..." : call.isVedSpeaking ? "Ved is speaking..." : null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-card p-8 text-center animate-fade-in-up">
        <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-4">
          {isOngoing ? "On call" : "Calling"}
        </p>

        <div className="flex justify-center mb-4">
          <span className="relative">
            {!isOngoing && <span className="absolute inset-0 rounded-full bg-purple-400/30 animate-ping" />}
            <Avatar username={call.otherParticipant.name} size="md" />
          </span>
        </div>

        <p className="text-lg font-semibold text-slate-800">{call.otherParticipant.name}</p>
        <p className="text-sm text-slate-400 mb-2">
          {isOngoing ? formatDuration(elapsedSeconds) : statusLabel(call)}
        </p>

        {isOngoing && vedStatusLabel && (
          <p className="flex items-center justify-center gap-1.5 text-xs text-indigo-500 italic mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {vedStatusLabel}
          </p>
        )}

        {isOngoing && (
          <div className="mb-6 bg-slate-50/60 rounded-2xl p-2">
            <VoiceTranscriptPanel entries={call.transcript} />
          </div>
        )}

        <div className="flex items-center justify-center gap-6">
          {isOngoing && (
            <button
              onClick={onToggleMute}
              aria-label={call.isMuted ? "Unmute microphone" : "Mute microphone"}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-soft transition-colors ${
                call.isMuted ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {call.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={isOutgoingRinging ? onCancel : onEnd}
            aria-label={isOutgoingRinging ? "Cancel call" : "End call"}
            className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-soft transition-colors"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        {isOngoing && (
          <p className="text-[11px] text-slate-300 mt-5">Say "Hey Ved" anytime to bring the AI into the conversation</p>
        )}
      </div>
    </div>
  );
};

export default CallScreen;
