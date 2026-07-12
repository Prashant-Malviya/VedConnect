import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType } from "../types/auth.types";
import { signupRequest, loginRequest, fetchCurrentUser } from "../services/auth.api";
import { setAuthToken } from "../services/api";

// This is the one place we reach for Context in this app - auth state is
// needed by the Navbar, ProtectedRoute, and the chat page all at once, so
// prop-drilling it down would be worse than a small, focused context.

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_KEY = "chat-token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On app load, if a token was saved from a previous session, verify it's
    // still valid by calling /auth/me before trusting it.
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

  const login = async (email: string, password: string) => {
    const { token: newToken, user: loggedInUser } = await loginRequest(email, password);
    localStorage.setItem(TOKEN_KEY, newToken);
    setAuthToken(newToken);
    setToken(newToken);
    setUser(loggedInUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    await signupRequest(name, email, password);
    // Per the spec, signup does NOT log the user in - they're redirected to
    // the Login page afterwards.
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
