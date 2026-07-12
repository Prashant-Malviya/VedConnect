import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth.types";
import { OnlineUser } from "../types/chat.types";
import * as conversationRepository from "../repositories/conversation.repository";

// Socket.io setup lives in its own module. It ONLY handles connection,
// disconnection, presence, room membership, and broadcasting - no business
// logic (that stays in services/controllers). Every conversation (Community
// or a private chat) is a Socket.io room named after its conversation _id,
// which is what keeps private messages private: we broadcast to a room,
// never io.emit() to everyone.

let io: Server;

// socketId -> the user connected on that socket.
const socketToUser = new Map<string, OnlineUser>();
// userId -> every socket that user currently has open (a user can have
// several tabs/devices open at once).
const userToSockets = new Map<string, Set<string>>();

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

  // Socket-level auth: every connection must present a valid JWT, the same
  // one issued at login. This runs once, before "connection" fires.
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

    // Auto-join every conversation (Community + every private chat) this
    // user already belongs to, so messages reach them immediately without
    // the frontend having to explicitly join each room on load.
    conversationRepository.findConversationsForUser(user.id).then((conversations) => {
      conversations.forEach((conversation) => socket.join(conversation._id.toString()));
    });

    io.emit("onlineUsers", getOnlineUsersList());
    socket.broadcast.emit("notification", { message: `${user.name} joined the chat` });

    // Explicit join/leave - mainly useful the moment a brand-new private
    // conversation is created while the user's socket is already open.
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

// Lets controllers emit events (e.g. after saving a new message) without
// each of them creating their own socket.io instance.
export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized yet");
  }
  return io;
};

// Makes sure every open socket for this user is in the given conversation's
// room. Called right after a message is sent, so both a brand-new private
// conversation and an existing one always reach every connected tab.
export const joinUserToConversationRoom = (userId: string, conversationId: string) => {
  const socketIds = userToSockets.get(userId);
  if (!socketIds) return;
  socketIds.forEach((socketId) => {
    io.sockets.sockets.get(socketId)?.join(conversationId);
  });
};

// Used by the message controller to decide whether a freshly-sent message
// can immediately be marked "delivered" (i.e. is another participant of
// this conversation online right now).
export const isAnyoneElseOnlineInConversation = (
  participantIds: string[],
  excludeUserId: string
): boolean => {
  return participantIds.some((id) => id !== excludeUserId && userToSockets.has(id));
};
