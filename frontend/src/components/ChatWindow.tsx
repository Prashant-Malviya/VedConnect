import { Message } from "../types/message.types";
import { Conversation, ConversationUser, DirectMessageEntry, SelectedChat } from "../types/conversation.types";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import EmptyState from "./EmptyState";

interface ChatWindowProps {
  currentUsername: string;
  currentUserId: string;
  communityConversation: Conversation | null;
  directMessages: DirectMessageEntry[];
  selectedChat: SelectedChat | null;
  onSelectCommunity: () => void;
  onSelectUser: (user: ConversationUser, conversation: Conversation | null) => void;
  messages: Message[];
  onSend: (text: string) => void;
  isConnected: boolean;
  typingUsers: string[];
  isOtherUserOnline: boolean;
  activeConversationId: string | null;
}

const ChatWindow = ({
  currentUsername,
  currentUserId,
  communityConversation,
  directMessages,
  selectedChat,
  onSelectCommunity,
  onSelectUser,
  messages,
  onSend,
  isConnected,
  typingUsers,
  isOtherUserOnline,
  activeConversationId,
}: ChatWindowProps) => {
  return (
    <div className="flex w-full max-w-6xl">
      <Sidebar
        currentUsername={currentUsername}
        communityConversation={communityConversation}
        directMessages={directMessages}
        selectedChat={selectedChat}
        onSelectCommunity={onSelectCommunity}
        onSelectUser={onSelectUser}
      />

      <div className="flex flex-col flex-1 h-[80vh] bg-white rounded-3xl shadow-card border border-purple-100/60 overflow-hidden">
        <ChatHeader selectedChat={selectedChat} isConnected={isConnected} isOtherUserOnline={isOtherUserOnline} />
        {selectedChat ? (
          <>
            <MessageList messages={messages} currentUserId={currentUserId} />
            <TypingIndicator typingUsers={typingUsers} />
            <MessageInput onSend={onSend} disabled={!isConnected} conversationId={activeConversationId} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
