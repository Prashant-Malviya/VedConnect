import { Phone, PhoneOff } from "lucide-react";
import Avatar from "../Avatar";
import { ActiveCall } from "../../types/call.types";

interface IncomingCallModalProps {
  call: ActiveCall;
  onAccept: () => void;
  onReject: () => void;
}

const IncomingCallModal = ({ call, onAccept, onReject }: IncomingCallModalProps) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-card p-8 text-center animate-fade-in-up">
        <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-4">Incoming call</p>
        <div className="flex justify-center mb-4">
          <span className="relative">
            <span className="absolute inset-0 rounded-full bg-purple-400/30 animate-ping" />
            <Avatar username={call.otherParticipant.name} size="md" />
          </span>
        </div>
        <p className="text-lg font-semibold text-slate-800">{call.otherParticipant.name}</p>
        <p className="text-sm text-slate-400 mb-8">is calling you...</p>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={onReject}
            aria-label="Reject call"
            className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-soft transition-colors"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
          <button
            onClick={onAccept}
            aria-label="Accept call"
            className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-soft transition-colors animate-pulse-soft"
          >
            <Phone className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
