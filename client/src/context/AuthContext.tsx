import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { User, AuthContextType } from "../types/auth.types";
import { signupRequest, loginRequest, fetchCurrentUser } from "../services/auth.api";
import { setAuthToken } from "../services/api";

// Auth state is needed by the Navbar, ProtectedRoute, and ChatPage at once,
// so a small Context is the cleanest option here.
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_KEY = "chat-token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verify a saved token is still valid before trusting it.
    const restoreSession = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        setAuthToken(savedToken);
        const currentUser = await fetchCurrentUser(savedToken);
        setToken(savedToken);
        setUser(currentUser);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // If a token we've already stored gets rejected (expired, or the server
  // restarted with a different JWT_SECRET), every future request would
  // otherwise keep failing silently. Catching 401s here logs the user out
  // once, cleanly, and ProtectedRoute sends them back to /login.
  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const isUnauthorized = axios.isAxiosError(error) && error.response?.status === 401;
        const hasStoredToken = Boolean(localStorage.getItem(TOKEN_KEY));

        if (isUnauthorized && hasStoredToken) {
          localStorage.removeItem(TOKEN_KEY);
          setAuthToken(null);
          setToken(null);
          setUser(null);
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptorId);
  }, []);

  const login = async (email: string, password: string) => {
    const { token: newToken, user: loggedInUser } = await loginRequest(email, password);
    localStorage.setItem(TOKEN_KEY, newToken);
    setAuthToken(newToken);
    setToken(newToken);
    setUser(loggedInUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    await signupRequest(name, email, password); // signup doesn't log in - redirect to Login
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
