import { Socket } from "socket.io";
import * as callService from "../services/call.service";
import * as userRepository from "../repositories/user.repository";
import { CallEndReason } from "../types/call.types";
import { emitToUser, isUserOnline } from "./index";

// Pure signaling relay: this module never touches RTCPeerConnection/SDP
// content, it just forwards offer/answer/ice-candidate payloads verbatim
// between the two participants' sockets, and owns the ringing/accept/
// reject/cancel/end state machine around that relay via call.service.
//
// Registered once per connected socket (see sockets/index.ts), mirroring
// how typing/message events are already registered there.
export const registerCallHandlers = (socket: Socket, userId: string, userName: string): void => {
  const endAndNotifyBoth = async (callId: string, reason: CallEndReason, endedByUserId?: string) => {
    const session = await callService.endSession(callId, reason);
    if (!session) return;

    const payload = { callId, reason, endedBy: endedByUserId || null };
    emitToUser(session.callerId, "call-ended", payload);
    emitToUser(session.receiverId, "call-ended", payload);
  };

  // --- 1. Call initiation ---
  socket.on("call-user", async ({ receiverId }: { receiverId: string }) => {
    if (!receiverId || receiverId === userId) return;

    if (callService.isUserBusy(userId) || callService.isUserBusy(receiverId)) {
      callService.recordUnreachedCall(userId, receiverId, "busy").catch((err) => console.error(err));
      socket.emit("call-busy", { receiverId });
      return;
    }

    if (!isUserOnline(receiverId)) {
      callService.recordUnreachedCall(userId, receiverId, "offline").catch((err) => console.error(err));
      socket.emit("user-offline", { receiverId });
      return;
    }

    const receiver = await userRepository.findUserById(receiverId);
    const receiverName = receiver?.name || "";

    const session = callService.createRingingSession(userId, userName, receiverId, receiverName, (timedOutSession) => {
      endAndNotifyBoth(timedOutSession.callId, "missed").catch((err) => console.error(err));
    });

    emitToUser(userId, "call-ringing", { callId: session.callId, receiverId });
    emitToUser(receiverId, "incoming-call", {
      callId: session.callId,
      caller: { id: userId, name: userName },
    });
  });

  // --- 2. Accept / reject / cancel (pre-connection outcomes) ---
  socket.on("accept-call", ({ callId }: { callId: string }) => {
    const session = callService.markOngoing(callId);
    if (!session || session.receiverId !== userId) return;

    emitToUser(session.callerId, "call-accepted", { callId });
  });

  socket.on("reject-call", ({ callId }: { callId: string }) => {
    const session = callService.getSession(callId);
    if (!session || session.receiverId !== userId) return;
    endAndNotifyBoth(callId, "rejected", userId).catch((err) => console.error(err));
  });

  socket.on("cancel-call", ({ callId }: { callId: string }) => {
    const session = callService.getSession(callId);
    if (!session || session.callerId !== userId) return;
    endAndNotifyBoth(callId, "cancelled", userId).catch((err) => console.error(err));
  });

  // --- 3. Active-call termination ---
  socket.on("end-call", ({ callId }: { callId: string }) => {
    const session = callService.getSession(callId);
    if (!session) return;
    if (session.callerId !== userId && session.receiverId !== userId) return;
    endAndNotifyBoth(callId, "ended", userId).catch((err) => console.error(err));
  });

  // --- 4. WebRTC signaling relay (verbatim forwarding, no inspection) ---
  socket.on("offer", ({ callId, sdp }: { callId: string; sdp: unknown }) => {
    const session = callService.getSession(callId);
    if (!session) return;
    const targetId = session.callerId === userId ? session.receiverId : session.callerId;
    emitToUser(targetId, "offer", { callId, sdp });
  });

  socket.on("answer", ({ callId, sdp }: { callId: string; sdp: unknown }) => {
    const session = callService.getSession(callId);
    if (!session) return;
    const targetId = session.callerId === userId ? session.receiverId : session.callerId;
    emitToUser(targetId, "answer", { callId, sdp });
  });

  socket.on("ice-candidate", ({ callId, candidate }: { callId: string; candidate: unknown }) => {
    const session = callService.getSession(callId);
    if (!session) return;
    const targetId = session.callerId === userId ? session.receiverId : session.callerId;
    emitToUser(targetId, "ice-candidate", { callId, candidate });
  });

  // Note: per-socket disconnect cleanup isn't registered here. A user can
  // have multiple open tabs/sockets, and a call should only be torn down
  // once ALL of their sockets are gone - sockets/index.ts already tracks
  // that centrally and calls handleUserFullyOffline() below when it happens.
};

// Called by sockets/index.ts once a user has zero remaining open sockets -
// ends any call they were ringing/on, so the other side isn't left hanging.
export const handleUserFullyOffline = (userId: string): void => {
  const session = callService.getActiveSessionForUser(userId);
  if (!session) return;

  callService
    .endSession(session.callId, "disconnected")
    .then((endedSession) => {
      if (!endedSession) return;
      const otherUserId = endedSession.callerId === userId ? endedSession.receiverId : endedSession.callerId;
      emitToUser(otherUserId, "call-ended", { callId: session.callId, reason: "disconnected", endedBy: userId });
    })
    .catch((err) => console.error("Failed to end call on disconnect:", err));
};
