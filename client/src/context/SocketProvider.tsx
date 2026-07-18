import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { socket } from "../sockets/socket";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ isConnected: false });

// Connection lifecycle used to live inside ChatPage, which meant an
// incoming call could only ring while the user happened to be on the chat
// screen. Moving it here (mounted once, at the app root, alongside
// AuthProvider) means the socket - and therefore calls - stay live on
// every page for as long as the user is logged in.
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      socket.disconnect();
      return;
    }

    socket.auth = { token };
    socket.connect();

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, [token]);

  return <SocketContext.Provider value={{ isConnected }}>{children}</SocketContext.Provider>;
};

export const useSocketConnection = () => useContext(SocketContext);
