import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// autoConnect is false on purpose: the backend now requires a valid JWT to
// even establish a socket connection, so we only connect once we have one
// (see ChatPage, which sets socket.auth and calls socket.connect()).
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
});
