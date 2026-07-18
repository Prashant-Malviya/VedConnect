import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { Message } from "../types/message.types";
import MessageItem from "./MessageItem";
import DateSeparator from "./DateSeparator";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const isSameDay = (a: string, b: string) => new Date(a).toDateString() === new Date(b).toDateString();

// Grouped = same sender, back to back, within a few minutes.
const isGrouped = (current: Message, previous: Message | undefined): boolean => {
  if (!previous) return false;
  if (previous.senderType !== current.senderType) return false;
  if (previous.senderType === "USER" && previous.senderId !== current.senderId) return false;
  const gapMs = new Date(current.createdAt).getTime() - new Date(previous.createdAt).getTime();
  return gapMs < 5 * 60 * 1000;
};

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  // We scroll THIS container directly (container.scrollTop), instead of
  // calling scrollIntoView() on a child. scrollIntoView() asks the browser
  // to find "the nearest scrollable ancestor" on its own, and if this
  // container isn't properly height-constrained it can pick the whole page
  // instead - which is what caused messages to scroll the entire browser
  // window instead of just this message list. Scrolling the container
  // ourselves removes that guesswork entirely.
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    // min-h-0 is required here: this div is a flex child inside a
    // fixed-height column, and without min-h-0 a flex-1 child refuses to
    // shrink below its content size - it would grow to fit every message
    // instead of scrolling, which is what pushed the scroll onto the page.
    <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-soft-gradient">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center gap-2 text-slate-400">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-500">
            <MessageCircle className="w-6 h-6" />
          </div>
          <p className="text-sm">No messages yet. Say hello!</p>
        </div>
      )}
      {messages.map((message, index) => {
        const previous = messages[index - 1];
        const showDateSeparator = !previous || !isSameDay(previous.createdAt, message.createdAt);
        const grouped = isGrouped(message, previous) && !showDateSeparator;

        return (
          <div key={message._id}>
            {showDateSeparator && <DateSeparator isoDate={message.createdAt} />}
            <MessageItem
              message={message}
              isOwnMessage={message.senderId === currentUserId}
              grouped={grouped}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
