import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Search, Globe2, Plus, Compass } from "lucide-react";
import Avatar from "./Avatar";
import { ConversationUser, Conversation, DirectMessageEntry, SelectedChat } from "../types/conversation.types";
import { Community } from "../types/community.types";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  currentUsername: string;
  communities: Community[];
  directMessages: DirectMessageEntry[];
  selectedChat: SelectedChat | null;
  onSelectCommunity: (community: Community) => void;
  onSelectUser: (user: ConversationUser, conversation: Conversation | null) => void;
  onCreateCommunity: () => void;
  onBrowseCommunities: () => void;
  isMobile?: boolean;
}

const formatPreviewTime = (isoDate: string): string =>
  new Date(isoDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const Sidebar = ({
  currentUsername,
  communities,
  directMessages,
  selectedChat,
  onSelectCommunity,
  onSelectUser,
  onCreateCommunity,
  onBrowseCommunities,
  isMobile = false,
}: SidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const filteredDirectMessages = directMessages.filter((entry) =>
    entry.user.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div
      className={`flex-col bg-white/80 backdrop-blur rounded-3xl shadow-soft border border-purple-100/60 p-5 ${
        isMobile ? "flex w-full mb-4 md:hidden" : "hidden md:flex w-72 shrink-0 mr-5 h-[80vh]"
      }`}
    >
      <div className="rounded-2xl bg-soft-gradient p-4">
        <p className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider mb-3">You</p>
        <div className="flex items-center gap-3">
          <Avatar username={currentUsername} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{currentUsername}</p>
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Online
            </span>
          </div>
        </div>
      </div>

      <div className="relative mt-5">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          aria-label="Search users"
          className="w-full border border-purple-200 bg-lavender-50 rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto mt-4 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">Communities</p>
            <div className="flex items-center gap-1">
              <button
                onClick={onBrowseCommunities}
                aria-label="Discover communities"
                title="Discover communities"
                className="p-1 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
              >
                <Compass className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onCreateCommunity}
                aria-label="Create community"
                title="Create community"
                className="p-1 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="space-y-1">
            {communities.map((community) => {
              const isActive = selectedChat?.kind === "community" && selectedChat.communityId === community.id;
              return (
                <button
                  key={community.id}
                  onClick={() => onSelectCommunity(community)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    isActive ? "bg-purple-100" : "hover:bg-purple-50"
                  }`}
                >
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white shrink-0">
                    <Globe2 className="w-4 h-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-800 truncate">{community.name}</span>
                    <span className="block text-xs text-slate-400 truncate">
                      {community.memberCount} member{community.memberCount === 1 ? "" : "s"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider mb-2">
            Direct Messages
          </p>
          <div className="space-y-1">
            {filteredDirectMessages.length === 0 && (
              <p className="text-sm text-slate-400 px-3">No users found</p>
            )}
            {filteredDirectMessages.map(({ user, conversation, isOnline }) => {
              const isActive = selectedChat?.kind === "private" && selectedChat.user.id === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => onSelectUser(user, conversation)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    isActive ? "bg-purple-100" : "hover:bg-purple-50"
                  }`}
                >
                  <span className="relative shrink-0">
                    <Avatar username={user.name} size="sm" />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                        isOnline ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-slate-800 truncate">{user.name}</span>
                      {conversation?.lastMessage && (
                        <span className="text-[11px] text-slate-400 shrink-0">
                          {formatPreviewTime(conversation.lastMessage.createdAt)}
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-slate-400 truncate">
                      {conversation?.lastMessage?.text || (isOnline ? "Online" : "No messages yet")}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-px bg-purple-100 my-5" />

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl py-2.5 transition-colors"
      >
        <LogOut className="w-4 h-4" aria-hidden="true" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
