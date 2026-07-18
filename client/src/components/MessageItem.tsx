import { Message } from "../types/message.types";
import Avatar from "./Avatar";
import AiMessage from "./AiMessage";

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  grouped?: boolean;
}

const formatTime = (isoDate: string): string =>
  new Date(isoDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const MessageItem = ({ message, isOwnMessage, grouped = false }: MessageItemProps) => {
  // AI messages are stored in the exact same collection/history as user
  // messages, but must never look like a normal chat bubble - a completely
  // separate component owns their rendering.
  if (message.senderType === "AI") {
    return <AiMessage message={message} grouped={grouped} />;
  }

  return (
    <div
      className={`flex gap-2.5 ${grouped ? "mb-1" : "mb-4"} animate-fade-in-up ${
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="w-8 shrink-0">{!grouped && <Avatar username={message.senderName} size="sm" />}</div>
      <div className={`flex flex-col max-w-[75%] sm:max-w-xs ${isOwnMessage ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isOwnMessage
              ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-tr-sm"
              : "bg-white text-slate-800 border border-purple-200 rounded-tl-sm"
          }`}
        >
          {!isOwnMessage && !grouped && (
            <p className="text-xs font-semibold mb-1 text-purple-500">{message.senderName}</p>
          )}
          <p className="text-sm break-words leading-relaxed">{message.text}</p>
        </div>
        {!grouped && (
          <div className="flex items-center gap-1 mt-1 px-1">
            <span className="text-[11px] text-slate-400">{formatTime(message.createdAt)}</span>
            {isOwnMessage && (
              <span className="text-[11px] text-slate-400">
                · {message.status === "delivered" ? "Delivered" : "Sent"}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
