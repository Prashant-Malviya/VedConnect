import { useState, useEffect, useRef, FormEvent } from "react";
import { Smile, Send } from "lucide-react";
import { socket } from "../sockets/socket";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  conversationId: string | null;
}

const TYPING_TIMEOUT_MS = 1500;

const MessageInput = ({ onSend, disabled, conversationId }: MessageInputProps) => {
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (value: string) => {
    setText(value);
    if (conversationId) {
      socket.emit("typing", { conversationId });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (conversationId) socket.emit("stopTyping", { conversationId });
    }, TYPING_TIMEOUT_MS);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSend(text.trim());
    setText("");
    if (conversationId) socket.emit("stopTyping", { conversationId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3 p-4 sm:p-5 border-t border-purple-100 bg-white">
      <button
        type="button"
        aria-label="Add emoji"
        className="hidden sm:flex p-2.5 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors shrink-0"
      >
        <Smile className="w-5 h-5" />
      </button>
      <input
        type="text"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Share your thoughts..."
        disabled={disabled}
        aria-label="Message"
        className="flex-1 min-w-0 border border-purple-200 bg-lavender-50 rounded-2xl px-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:opacity-60 transition-shadow"
      />
      <button
        type="submit"
        disabled={disabled}
        aria-label="Send message"
        className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-purple-600 to-purple-700 text-white px-4 sm:px-5 py-2.5 rounded-2xl font-medium text-sm shadow-soft hover:shadow-card hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all shrink-0"
      >
        <Send className="w-4 h-4" />
        <span className="hidden sm:inline">Send</span>
      </button>
    </form>
  );
};

export default MessageInput;
