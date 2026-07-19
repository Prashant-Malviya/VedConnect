import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Message } from "../types/message.types";
import { ConversationUser, Conversation, DirectMessageEntry, SelectedChat } from "../types/conversation.types";
import { Community } from "../types/community.types";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import VedThinkingIndicator from "./VedThinkingIndicator";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import EmptyState from "./EmptyState";

interface ChatWindowProps {
  currentUsername: string;
  currentUserId: string;
  communities: Community[];
  directMessages: DirectMessageEntry[];
  selectedChat: SelectedChat | null;
  onSelectCommunity: (community: Community) => void;
  onSelectUser: (user: ConversationUser, conversation: Conversation | null) => void;
  onCreateCommunity: () => void;
  onBrowseCommunities: () => void;
  messages: Message[];
  onSend: (text: string) => void;
  isConnected: boolean;
  typingUsers: string[];
  isVedThinking: boolean;
  isOtherUserOnline: boolean;
  activeConversationId: string | null;
  isSingleChatView?: boolean;
}

const ChatWindow = ({
  currentUsername,
  currentUserId,
  communities,
  directMessages,
  selectedChat,
  onSelectCommunity,
  onSelectUser,
  onCreateCommunity,
  onBrowseCommunities,
  messages,
  onSend,
  isConnected,
  typingUsers,
  isVedThinking,
  isOtherUserOnline,
  activeConversationId,
  isSingleChatView = false,
}: ChatWindowProps) => {
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 768 : false));
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldShowSidebar = !isMobile || !isSingleChatView;
  const shouldShowChatPanel = !isMobile || isSingleChatView;
  // Only meaningful on mobile, viewing a single chat (community or DM) full-screen -
  // that's the view with no visible conversation list, so it needs an explicit way back.
  const handleBack = isMobile && isSingleChatView ? () => navigate("/chat") : undefined;

  return (
    <div className="flex flex-col md:flex-row w-full max-w-6xl gap-4 md:gap-0 animate-fade-in-up">
      {shouldShowSidebar && (
        <>
          <div className="hidden md:flex">
            <Sidebar
              currentUsername={currentUsername}
              communities={communities}
              directMessages={directMessages}
              selectedChat={selectedChat}
              onSelectCommunity={onSelectCommunity}
              onSelectUser={onSelectUser}
              onCreateCommunity={onCreateCommunity}
              onBrowseCommunities={onBrowseCommunities}
            />
          </div>
          <div className="md:hidden">
            <Sidebar
              currentUsername={currentUsername}
              communities={communities}
              directMessages={directMessages}
              selectedChat={selectedChat}
              onSelectCommunity={onSelectCommunity}
              onSelectUser={onSelectUser}
              onCreateCommunity={onCreateCommunity}
              onBrowseCommunities={onBrowseCommunities}
              isMobile
            />
          </div>
        </>
      )}

      {shouldShowChatPanel && (
        // h-[80dvh] (not vh): mobile browsers resize the visible viewport as
        // the address bar and on-screen keyboard show/hide, and `vh` doesn't
        // track that - it's what caused the whole chat panel to visually grow
        // instead of MessageList scrolling internally. `dvh` tracks the real,
        // current visible viewport, so the panel's height stays put and
        // MessageList's own overflow-y-auto (see MessageList.tsx) is the only
        // thing that scrolls.
        <div className="flex flex-col flex-1 h-[85dvh] md:h-[80vh] bg-white rounded-3xl shadow-card border border-purple-100/60 overflow-hidden">
          <ChatHeader
            selectedChat={selectedChat}
            isConnected={isConnected}
            isOtherUserOnline={isOtherUserOnline}
            onBack={handleBack}
          />
          {selectedChat ? (
            <>
              <MessageList messages={messages} currentUserId={currentUserId} />
              <TypingIndicator typingUsers={typingUsers} />
              {isVedThinking && <VedThinkingIndicator assistantName="Ved" />}
              <MessageInput onSend={onSend} disabled={!isConnected} conversationId={activeConversationId} />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
