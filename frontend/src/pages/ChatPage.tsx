import { useEffect, useMemo, useRef, useState } from "react";
import ChatWindow from "../components/ChatWindow";
import { Message } from "../types/message.types";
import { OnlineUser } from "../types/chat.types";
import { UserListItem } from "../types/user.types";
import { Conversation, ConversationUser, DirectMessageEntry, SelectedChat } from "../types/conversation.types";
import { fetchUsers, fetchConversations, fetchConversationMessages, sendMessage } from "../services/api";
import { socket } from "../sockets/socket";
import { useAuth } from "../context/AuthContext";

interface StatusUpdatePayload {
  messageId: string;
  status: "sent" | "delivered";
  conversationId: string;
}

interface TypingPayload {
  username: string;
  conversationId: string;
}

interface NotificationPayload {
  message: string;
}

const ChatPage = () => {
  const { user, token } = useAuth();
  const username = user?.name || "";
  const userId = user?.id || "";

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);
  const [messagesByKey, setMessagesByKey] = useState<Record<string, Message[]>>({});
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingByConversation, setTypingByConversation] = useState<Record<string, string[]>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadedConversations = useRef<Set<string>>(new Set());
  const knownConversationIds = useRef<Set<string>>(new Set());

  // Load the user list and conversation list 
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [userList, conversationList] = await Promise.all([fetchUsers(), fetchConversations()]);
        setUsers(userList);
        setConversations(conversationList);

        const community = conversationList.find((c) => c.type === "group");
        if (community) {
          setSelectedChat({ kind: "community", conversationId: community._id });
        }
      } catch (err) {
        setError("Failed to load conversations");
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    knownConversationIds.current = new Set(conversations.map((c) => c._id));
  }, [conversations]);

  // Connect the shared socket instance now that we have a valid JWT, and
  // wire up all the realtime event listeners.
  useEffect(() => {
    if (!token) return;

    socket.auth = { token };
    socket.connect();

    const handleNewMessage = (message: Message) => {
      setMessagesByKey((prev) => ({
        ...prev,
        [message.conversationId]: [...(prev[message.conversationId] || []), message],
      }));
      loadedConversations.current.add(message.conversationId);

      if (!knownConversationIds.current.has(message.conversationId)) {
        // A brand-new conversation we don't know about yet (e.g. someone
        // else just DM'd us for the first time) - refresh the sidebar.
        fetchConversations().then(setConversations).catch(() => {});
      } else {
        setConversations((prev) =>
          prev.map((c) =>
            c._id === message.conversationId
              ? { ...c, lastMessage: { text: message.text, createdAt: message.createdAt } }
              : c
          )
        );
      }
    };

    const handleStatusUpdate = ({ messageId, status, conversationId }: StatusUpdatePayload) => {
      setMessagesByKey((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map((m) =>
          m._id === messageId ? { ...m, status } : m
        ),
      }));
    };

    const handleOnlineUsers = (list: OnlineUser[]) => setOnlineUsers(list);

    const handleUserTyping = ({ username: typingUsername, conversationId }: TypingPayload) => {
      if (typingUsername === username) return;
      setTypingByConversation((prev) => {
        const list = prev[conversationId] || [];
        if (list.includes(typingUsername)) return prev;
        return { ...prev, [conversationId]: [...list, typingUsername] };
      });
    };

    const handleUserStopTyping = ({ username: typingUsername, conversationId }: TypingPayload) => {
      setTypingByConversation((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).filter((u) => u !== typingUsername),
      }));
    };

    const handleNotification = ({ message }: NotificationPayload) => {
      setNotification(message);
      setTimeout(() => setNotification(null), 4000);
    };

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("newMessage", handleNewMessage);
    socket.on("messageStatusUpdate", handleStatusUpdate);
    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStopTyping", handleUserStopTyping);
    socket.on("notification", handleNotification);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newMessage", handleNewMessage);
      socket.off("messageStatusUpdate", handleStatusUpdate);
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStopTyping", handleUserStopTyping);
      socket.off("notification", handleNotification);
      socket.disconnect();
    };
  }, [token, username]);

  // Lazily loads message history the first time a real (already-created)
  // conversation is selected. A brand-new private chat (conversationId
  // still null) simply starts empty - no history to fetch yet.
  useEffect(() => {
    const id = selectedChat?.conversationId;
    if (!id || loadedConversations.current.has(id)) return;
    loadedConversations.current.add(id);

    fetchConversationMessages(id)
      .then((history) => setMessagesByKey((prev) => ({ ...prev, [id]: history })))
      .catch(() => setError("Failed to load messages"));
  }, [selectedChat]);

  // Tells the server we're actively viewing this conversation, so a
  // brand-new room (e.g. a private chat that only just got created) is
  // joined right away instead of waiting for the next reconnect.
  useEffect(() => {
    if (selectedChat?.conversationId) {
      socket.emit("joinConversation", selectedChat.conversationId);
    }
  }, [selectedChat?.conversationId]);

  const onlineUserIds = useMemo(() => new Set(onlineUsers.map((u) => u.userId)), [onlineUsers]);

  const communityConversation = useMemo(
    () => conversations.find((c) => c.type === "group") || null,
    [conversations]
  );

  // Merges the full user list with any existing private conversations, so
  // every registered user shows up in Direct Messages - whether or not a
  // chat with them exists yet - sorted by most recent activity.
  const directMessages: DirectMessageEntry[] = useMemo(() => {
    const conversationByUserId = new Map<string, Conversation>();
    conversations
      .filter((c) => c.type === "private" && c.otherUser)
      .forEach((c) => conversationByUserId.set(c.otherUser!.id, c));

    const entries: DirectMessageEntry[] = users.map((u) => ({
      user: { id: u.id, name: u.name, email: u.email },
      conversation: conversationByUserId.get(u.id) || null,
      isOnline: onlineUserIds.has(u.id),
    }));

    entries.sort((a, b) => {
      const aTime = a.conversation?.lastMessage?.createdAt || "";
      const bTime = b.conversation?.lastMessage?.createdAt || "";
      if (aTime && bTime) return bTime.localeCompare(aTime);
      if (aTime) return -1;
      if (bTime) return 1;
      return a.user.name.localeCompare(b.user.name);
    });

    return entries;
  }, [users, conversations, onlineUserIds]);

  const activeKey = selectedChat
    ? selectedChat.conversationId || (selectedChat.kind === "private" ? `pending:${selectedChat.user.id}` : null)
    : null;
  const activeMessages = activeKey ? messagesByKey[activeKey] || [] : [];
  const activeTypingUsers = selectedChat?.conversationId
    ? typingByConversation[selectedChat.conversationId] || []
    : [];
  const isOtherUserOnline = selectedChat?.kind === "private" ? onlineUserIds.has(selectedChat.user.id) : false;

  const handleSelectCommunity = () => {
    if (!communityConversation) return;
    setSelectedChat({ kind: "community", conversationId: communityConversation._id });
  };

  const handleSelectUser = (chatUser: ConversationUser, conversation: Conversation | null) => {
    setSelectedChat({ kind: "private", user: chatUser, conversationId: conversation?._id || null });
  };

  const handleSend = async (text: string) => {
    if (!selectedChat) return;
    try {
      const message =
        selectedChat.kind === "private" && !selectedChat.conversationId
          ? await sendMessage({ text, receiverId: selectedChat.user.id })
          : await sendMessage({ text, conversationId: selectedChat.conversationId! });

      // First message in a brand-new private chat: a real conversation now
      // exists, so switch the selection over to it and refresh the sidebar
      // so it shows up in Direct Messages with a last-message preview.
      if (selectedChat.kind === "private" && !selectedChat.conversationId) {
        setSelectedChat({ kind: "private", user: selectedChat.user, conversationId: message.conversationId });
        const refreshed = await fetchConversations();
        setConversations(refreshed);
      }
    } catch (err) {
      setError("Failed to send message");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-soft-gradient flex flex-col items-center py-8 px-4">
      <div className="text-center mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Your Conversations</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time, secure, and always in sync.</p>
      </div>
      {notification && (
        <p className="bg-purple-100 text-purple-700 text-sm px-4 py-1.5 rounded-full mb-3 shadow-sm">
          {notification}
        </p>
      )}
      {error && <p className="bg-rose-50 text-rose-600 text-sm px-4 py-1.5 rounded-full mb-3">{error}</p>}
      <ChatWindow
        currentUsername={username}
        currentUserId={userId}
        communityConversation={communityConversation}
        directMessages={directMessages}
        selectedChat={selectedChat}
        onSelectCommunity={handleSelectCommunity}
        onSelectUser={handleSelectUser}
        messages={activeMessages}
        onSend={handleSend}
        isConnected={isConnected}
        typingUsers={activeTypingUsers}
        isOtherUserOnline={isOtherUserOnline}
        activeConversationId={selectedChat?.conversationId || null}
      />
    </div>
  );
};

export default ChatPage;
