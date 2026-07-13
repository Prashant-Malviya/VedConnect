import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth.types";
import { OnlineUser } from "../types/chat.types";
import * as conversationRepository from "../repositories/conversation.repository";

// Every conversation is a Socket.io room named after its conversation _id -
// broadcasting to a room (never io.emit() to everyone) is what keeps
// private chats private.
let io: Server;

const socketToUser = new Map<string, OnlineUser>(); // socketId -> user
const userToSockets = new Map<string, Set<string>>(); // userId -> open socket ids

const getOnlineUsersList = (): OnlineUser[] => {
  const seen = new Set<string>();
  const list: OnlineUser[] = [];
  socketToUser.forEach((user) => {
    if (!seen.has(user.userId)) {
      seen.add(user.userId);
      list.push(user);
    }
  });
  return list;
};

export const initSocket = (server: HTTPServer, clientUrl: string): Server => {
  io = new Server(server, {
    cors: {
      origin: clientUrl,
      methods: ["GET", "POST"],
    },
  });

  // Every connection must present a valid JWT before "connection" fires.
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Authentication required"));
      }
      const secret = process.env.JWT_SECRET || "dev_secret";
      const decoded = jwt.verify(token, secret) as JwtPayload;
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user as JwtPayload;

    socketToUser.set(socket.id, { userId: user.id, username: user.name });
    if (!userToSockets.has(user.id)) {
      userToSockets.set(user.id, new Set());
    }
    userToSockets.get(user.id)!.add(socket.id);

    // Auto-join every conversation this user belongs to.
    conversationRepository.findConversationsForUser(user.id).then((conversations) => {
      conversations.forEach((conversation) => socket.join(conversation._id.toString()));
    });

    io.emit("onlineUsers", getOnlineUsersList());
    socket.broadcast.emit("notification", { message: `${user.name} joined the chat` });

    socket.on("joinConversation", (conversationId: string) => {
      if (typeof conversationId === "string") socket.join(conversationId);
    });

    socket.on("leaveConversation", (conversationId: string) => {
      if (typeof conversationId === "string") socket.leave(conversationId);
    });

    socket.on("typing", ({ conversationId }: { conversationId: string }) => {
      if (!conversationId) return;
      socket.to(conversationId).emit("userTyping", { username: user.name, conversationId });
    });

    socket.on("stopTyping", ({ conversationId }: { conversationId: string }) => {
      if (!conversationId) return;
      socket.to(conversationId).emit("userStopTyping", { username: user.name, conversationId });
    });

    socket.on("disconnect", () => {
      socketToUser.delete(socket.id);
      const sockets = userToSockets.get(user.id);
      sockets?.delete(socket.id);
      if (sockets && sockets.size === 0) {
        userToSockets.delete(user.id);
      }
      io.emit("onlineUsers", getOnlineUsersList());
      socket.broadcast.emit("notification", { message: `${user.name} left the chat` });
    });
  });

  return io;
};

// Lets controllers emit events without creating their own socket.io instance.
export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized yet");
  }
  return io;
};

// Ensures every open socket for this user is in the conversation's room -
// needed right after a brand-new private conversation is created.
export const joinUserToConversationRoom = (userId: string, conversationId: string) => {
  const socketIds = userToSockets.get(userId);
  if (!socketIds) return;
  socketIds.forEach((socketId) => {
    io.sockets.sockets.get(socketId)?.join(conversationId);
  });
};

// Is another participant of this conversation online right now?
export const isAnyoneElseOnlineInConversation = (
  participantIds: string[],
  excludeUserId: string
): boolean => {
  return participantIds.some((id) => id !== excludeUserId && userToSockets.has(id));
};
