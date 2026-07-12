import axios from "axios";
import { Message } from "../types/message.types";
import { Conversation } from "../types/conversation.types";
import { UserListItem } from "../types/user.types";

// Single place for all axios calls related to chat data. Components never
// call axios directly - they call these functions instead.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Called once by AuthContext whenever the token changes (login/logout/app
// load), so every subsequent axios call automatically carries the JWT.
export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

export const fetchUsers = async (): Promise<UserListItem[]> => {
  const response = await axios.get<ApiResponse<UserListItem[]>>(`${API_URL}/users`);
  return response.data.data;
};

export const fetchConversations = async (): Promise<Conversation[]> => {
  const response = await axios.get<ApiResponse<Conversation[]>>(`${API_URL}/conversations`);
  return response.data.data;
};

export const fetchConversationMessages = async (conversationId: string): Promise<Message[]> => {
  const response = await axios.get<ApiResponse<Message[]>>(
    `${API_URL}/conversations/${conversationId}/messages`
  );
  return response.data.data;
};

interface SendMessageParams {
  text: string;
  conversationId?: string;
  receiverId?: string;
}

// senderId/senderName are never sent from the client - the backend reads
// the sender's identity from the JWT instead, which is safer. Callers
// supply EITHER conversationId (an existing chat) or receiverId (the
// first message to someone new).
export const sendMessage = async (params: SendMessageParams): Promise<Message> => {
  const response = await axios.post<ApiResponse<Message>>(`${API_URL}/messages`, params);
  return response.data.data;
};
