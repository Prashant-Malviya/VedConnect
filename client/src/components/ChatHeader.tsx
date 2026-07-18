import { Phone } from "lucide-react";
import Logo from "./Logo";
import { SelectedChat } from "../types/conversation.types";
import { useCall } from "../context/CallContext";

interface ChatHeaderProps {
  selectedChat: SelectedChat | null;
  isConnected: boolean;
  isOtherUserOnline: boolean;
}

const ChatHeader = ({ selectedChat, isConnected, isOtherUserOnline }: ChatHeaderProps) => {
  const { activeCall, startCall } = useCall();

  const title = !selectedChat
    ? "VedConnect Chat"
    : selectedChat.kind === "community"
    ? selectedChat.name
    : selectedChat.user.name;

  const subtitle = !selectedChat
    ? "Select a conversation to get started"
    : selectedChat.kind === "community"
    ? "Mention @ved for AI help"
    : isOtherUserOnline
    ? "Online"
    : "Offline";

  const canCall = selectedChat?.kind === "private" && isOtherUserOnline && !activeCall;

  return (
    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-purple-100 bg-white/80 backdrop-blur rounded-t-3xl">
      <div className="flex items-center gap-3 min-w-0">
        <Logo size="sm" withText={false} />
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 truncate">{title}</p>
          <p className="text-xs text-slate-400 truncate">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {selectedChat?.kind === "private" && (
          <button
            onClick={() => canCall && startCall(selectedChat.user)}
            disabled={!canCall}
            aria-label="Start audio call"
            title={isOtherUserOnline ? "Call" : "User is offline"}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-purple-100 text-purple-600 hover:bg-purple-200 disabled:opacity-40 disabled:hover:bg-purple-100 transition-colors"
          >
            <Phone className="w-4 h-4" />
          </button>
        )}

        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
            isConnected ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-emerald-500 animate-pulse-soft" : "bg-amber-500"
            }`}
          />
          {isConnected ? "Connected" : "Reconnecting..."}
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
