import Logo from "./Logo";
import { SelectedChat } from "../types/conversation.types";

interface ChatHeaderProps {
  selectedChat: SelectedChat | null;
  isConnected: boolean;
  isOtherUserOnline: boolean;
}

const ChatHeader = ({ selectedChat, isConnected, isOtherUserOnline }: ChatHeaderProps) => {
  const title = !selectedChat
    ? "VedConnect Chat"
    : selectedChat.kind === "community"
    ? "🌍 VedConnect Community"
    : selectedChat.user.name;

  const subtitle = !selectedChat
    ? "Select a conversation to get started"
    : selectedChat.kind === "community"
    ? "Everyone at VedConnect"
    : isOtherUserOnline
    ? "Online"
    : "Offline";

  return (
    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-purple-100 bg-white/80 backdrop-blur rounded-t-3xl">
      <div className="flex items-center gap-3 min-w-0">
        <Logo size="sm" withText={false} />
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 truncate">{title}</p>
          <p className="text-xs text-slate-400 truncate">{subtitle}</p>
        </div>
      </div>

      <span
        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full shrink-0 ${
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
  );
};

export default ChatHeader;
