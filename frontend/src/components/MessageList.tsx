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

// Two messages are grouped (no repeated avatar/name) when they're from the
// same sender, back to back, within a few minutes of each other.
const isGrouped = (current: Message, previous: Message | undefined): boolean => {
  if (!previous) return false;
  if (previous.senderId !== current.senderId) return false;
  const gapMs = new Date(current.createdAt).getTime() - new Date(previous.createdAt).getTime();
  return gapMs < 5 * 60 * 1000;
};

// Renders the scrollable list of messages, inserting date separators and
// grouping consecutive messages from the same sender. Auto-scrolls to the
// bottom whenever a new message arrives.
const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-soft-gradient">
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
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
