import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Sparkles, Copy, Check, AlertTriangle } from "lucide-react";
import { Message } from "../types/message.types";

interface AiMessageProps {
  message: Message;
  grouped?: boolean;
}

const formatTime = (isoDate: string): string =>
  new Date(isoDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// One reusable "copy" button, used both for the whole message and for each code block.
const CopyButton = ({ text, className = "" }: { text: string; className?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail (permissions, insecure context) - fail silently, it's a nice-to-have.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy"
      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${className}`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

// AI messages never share styling with MessageItem's user bubbles - a
// different background, border, avatar treatment, and full Markdown
// rendering (including fenced code blocks with syntax highlighting).
const AiMessage = ({ message, grouped = false }: AiMessageProps) => {
  return (
    <div className={`flex gap-2.5 ${grouped ? "mb-1" : "mb-4"} animate-fade-in-up flex-row`}>
      <div className="w-8 shrink-0">
        {!grouped && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-fuchsia-600 flex items-center justify-center ring-2 ring-white shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="flex flex-col max-w-[85%] sm:max-w-md items-start min-w-0">
        <div className="w-full rounded-2xl rounded-tl-sm border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 shadow-sm overflow-hidden">
          {!grouped && (
            <div className="flex items-center gap-1.5 px-4 pt-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                {message.assistantName || "Ved AI"}
              </span>
              {message.aiError && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  Unavailable
                </span>
              )}
            </div>
          )}

          <div className="px-4 py-3 text-sm leading-relaxed text-slate-800 markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0 break-words">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700"
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeText = String(children).replace(/\n$/, "");
                  const isBlock = Boolean(match);

                  if (!isBlock) {
                    return (
                      <code className="bg-indigo-100 text-indigo-700 rounded px-1.5 py-0.5 text-[13px]" {...props}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <div className="my-2 rounded-xl overflow-hidden border border-slate-700/40">
                      <div className="flex items-center justify-between bg-slate-800 px-3 py-1.5">
                        <span className="text-[11px] font-medium text-slate-300">{match![1]}</span>
                        <CopyButton text={codeText} className="text-slate-300 hover:bg-slate-700" />
                      </div>
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match![1]}
                        PreTag="div"
                        customStyle={{ margin: 0, fontSize: "13px", padding: "12px" }}
                      >
                        {codeText}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>

          <div className="flex items-center justify-between px-4 pb-2.5">
            <span className="text-[11px] text-slate-400">{formatTime(message.createdAt)}</span>
            <CopyButton text={message.text} className="text-indigo-400 hover:bg-indigo-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiMessage;
