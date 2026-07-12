import axios from "axios";
import { User } from "../types/auth.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface LoginResponseData {
  token: string;
  user: User;
}

export const signupRequest = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  const response = await axios.post<ApiResponse<User>>(`${API_URL}/auth/signup`, {
    name,
    email,
    password,
  });
  return response.data.data;
};

export const loginRequest = async (
  email: string,
  password: string
): Promise<LoginResponseData> => {
  const response = await axios.post<ApiResponse<LoginResponseData>>(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data.data;
};

export const fetchCurrentUser = async (token: string): Promise<User> => {
  const response = await axios.get<ApiResponse<User>>(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};
