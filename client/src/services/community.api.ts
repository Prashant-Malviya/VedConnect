import axios from "axios";
import { Community, CommunityMember } from "../types/community.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const fetchMyCommunities = async (): Promise<Community[]> => {
  const response = await axios.get<ApiResponse<Community[]>>(`${API_URL}/communities`, {
    params: { mine: "true" },
  });
  return response.data.data;
};

export const searchCommunities = async (query: string): Promise<Community[]> => {
  const response = await axios.get<ApiResponse<Community[]>>(`${API_URL}/communities`, {
    params: { q: query },
  });
  return response.data.data;
};

interface CreateCommunityParams {
  name: string;
  description?: string;
  image?: string;
  isPrivate?: boolean;
}

export const createCommunity = async (params: CreateCommunityParams): Promise<Community> => {
  const response = await axios.post<ApiResponse<Community>>(`${API_URL}/communities`, params);
  return response.data.data;
};

export const updateCommunity = async (
  id: string,
  params: Partial<CreateCommunityParams>
): Promise<Community> => {
  const response = await axios.patch<ApiResponse<Community>>(`${API_URL}/communities/${id}`, params);
  return response.data.data;
};

export const deleteCommunity = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/communities/${id}`);
};

export const joinCommunity = async (id: string): Promise<Community> => {
  const response = await axios.post<ApiResponse<Community>>(`${API_URL}/communities/${id}/join`);
  return response.data.data;
};

export const leaveCommunity = async (id: string): Promise<void> => {
  await axios.post(`${API_URL}/communities/${id}/leave`);
};

export const inviteMember = async (id: string, userId: string): Promise<void> => {
  await axios.post(`${API_URL}/communities/${id}/invite`, { userId });
};

export const fetchCommunityMembers = async (id: string): Promise<CommunityMember[]> => {
  const response = await axios.get<ApiResponse<CommunityMember[]>>(`${API_URL}/communities/${id}/members`);
  return response.data.data;
};
