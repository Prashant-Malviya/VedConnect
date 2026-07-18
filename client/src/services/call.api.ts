import axios from "axios";
import { CallHistoryEntry } from "../types/call.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const fetchCallHistory = async (): Promise<CallHistoryEntry[]> => {
  const response = await axios.get<ApiResponse<CallHistoryEntry[]>>(`${API_URL}/calls`);
  return response.data.data;
};
