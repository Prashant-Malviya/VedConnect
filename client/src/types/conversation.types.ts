export interface ConversationUser {
  id: string;
  name: string;
  email: string;
}

export interface LastMessagePreview {
  text: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  type: "group" | "private";
  name: string;
  communityId: string | null;
  participants: string[];
  otherUser: ConversationUser | null;
  lastMessage: LastMessagePreview | null;
  updatedAt: string;
}

// A registered user paired with their conversation, if one exists yet.
export interface DirectMessageEntry {
  user: ConversationUser;
  conversation: Conversation | null;
  isOnline: boolean;
}

// conversationId is null for a private chat until the first message is sent.
export type SelectedChat =
  | { kind: "community"; conversationId: string; communityId: string; name: string; slug: string }
  | { kind: "private"; user: ConversationUser; conversationId: string | null };
