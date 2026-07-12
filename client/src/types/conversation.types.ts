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
  participants: string[];
  otherUser: ConversationUser | null;
  lastMessage: LastMessagePreview | null;
  updatedAt: string;
}

// One row in the "Direct Messages" list: a registered user, paired with
// their existing conversation if one exists yet (null means "never
// messaged - clicking them starts a brand-new chat").
export interface DirectMessageEntry {
  user: ConversationUser;
  conversation: Conversation | null;
  isOnline: boolean;
}

// What's currently open in the chat window. A private chat can be selected
// before any conversation exists in the DB yet (conversationId is null
// until the first message is sent).
export type SelectedChat =
  | { kind: "community"; conversationId: string }
  | { kind: "private"; user: ConversationUser; conversationId: string | null };
