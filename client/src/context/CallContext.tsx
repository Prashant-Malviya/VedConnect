import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode, RefObject } from "react";
import { socket } from "../sockets/socket";
import { WebRTCPeer } from "../services/webrtc";
import { SpeechToTextService } from "../services/voice/SpeechToTextService";
import { ActiveCall, CallParticipant, CallEndReason, VoiceTranscriptEntry } from "../types/call.types";
import { useAuth } from "./AuthContext";

interface CallContextType {
  activeCall: ActiveCall | null;
  lastEndReason: CallEndReason | null;
  startCall: (participant: CallParticipant) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  cancelCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  remoteAudioRef: RefObject<HTMLAudioElement>;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

interface IncomingCallPayload {
  callId: string;
  caller: CallParticipant;
}

const MAX_TRANSCRIPT_ENTRIES = 200; // mirrors the server's TranscriptService cap

// This is the only place in the app that owns a WebRTCPeer instance and
// drives the offer/answer/ice-candidate exchange - components only ever
// read `activeCall` and call the action functions below. Mounted once at
// the app root (see App.tsx) so an incoming call can ring no matter what
// page the user is currently on.
export const CallProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [lastEndReason, setLastEndReason] = useState<CallEndReason | null>(null);

  const peerRef = useRef<WebRTCPeer | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const vedAudioRef = useRef<HTMLAudioElement | null>(null);
  const sttRef = useRef<SpeechToTextService | null>(null);
  // Buffers the offer's SDP for a not-yet-accepted incoming call, since the
  // "offer" socket event can arrive before the callee has pressed Accept.
  const pendingOfferRef = useRef<{ callId: string; sdp: RTCSessionDescriptionInit } | null>(null);

  const stopVoiceAI = useCallback(() => {
    sttRef.current?.stop();
    sttRef.current = null;
    if (vedAudioRef.current) {
      vedAudioRef.current.pause();
      vedAudioRef.current.src = "";
    }
  }, []);

  const cleanupPeer = useCallback(() => {
    peerRef.current?.close();
    peerRef.current = null;
    pendingOfferRef.current = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
    stopVoiceAI();
  }, [stopVoiceAI]);

  const resetCall = useCallback(
    (reason: CallEndReason | null) => {
      cleanupPeer();
      setActiveCall(null);
      setLastEndReason(reason);
      if (reason) setTimeout(() => setLastEndReason(null), 4000); // lets the UI show a brief "Call rejected" toast, then clear
    },
    [cleanupPeer]
  );

  // Starts each participant's own local speech recognition once the call
  // is actually connected - see SpeechToTextService.ts for why this runs
  // client-side rather than on the server. Recognized utterances are sent
  // to the server as plain text; the server never receives call audio.
  const startVoiceAI = useCallback((callId: string) => {
    if (sttRef.current) return; // already running for this call
    const stt = new SpeechToTextService({
      onFinalResult: (text) => {
        socket.emit("voice-transcript", { callId, text });
      },
    });
    stt.start();
    sttRef.current = stt;
  }, []);

  const createPeer = useCallback(
    (callId: string): WebRTCPeer => {
      const peer = new WebRTCPeer({
        onRemoteStream: (stream) => {
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = stream;
            remoteAudioRef.current.play().catch(() => {});
          }
        },
        onIceCandidate: (candidate) => {
          socket.emit("ice-candidate", { callId, candidate });
        },
        onConnectionStateChange: (state) => {
          if (state === "connected") {
            setActiveCall((prev) =>
              prev ? { ...prev, uiState: "ongoing", startedAt: prev.startedAt || new Date() } : prev
            );
            startVoiceAI(callId);
          }
          if (state === "failed" || state === "closed") {
            // The other side's browser/network dropped the peer connection -
            // signal our own end-call so both sides and the DB agree it ended.
            socket.emit("end-call", { callId });
          }
        },
      });
      peerRef.current = peer;
      return peer;
    },
    [startVoiceAI]
  );

  const startCall = useCallback(
    (participant: CallParticipant) => {
      if (activeCall) return; // already in a call - 1:1 calling only
      setActiveCall({
        callId: "", // filled in once "call-ringing" comes back
        otherParticipant: participant,
        direction: "outgoing",
        uiState: "outgoing-ringing",
        startedAt: null,
        isMuted: false,
        transcript: [],
        isVedThinking: false,
        isVedSpeaking: false,
      });
      socket.emit("call-user", { receiverId: participant.id });
    },
    [activeCall]
  );

  const acceptCall = useCallback(async () => {
    if (!activeCall || activeCall.direction !== "incoming") return;

    try {
      const peer = createPeer(activeCall.callId);
      await peer.attachLocalAudio();

      socket.emit("accept-call", { callId: activeCall.callId });
      setActiveCall((prev) => (prev ? { ...prev, uiState: "connecting" } : prev));

      // The offer may have already arrived while the call was ringing.
      const pending = pendingOfferRef.current;
      if (pending && pending.callId === activeCall.callId) {
        const answer = await peer.createAnswer(pending.sdp);
        socket.emit("answer", { callId: activeCall.callId, sdp: answer });
        pendingOfferRef.current = null;
      }
    } catch (error) {
      console.error("Failed to accept call (mic permission denied?):", error);
      socket.emit("reject-call", { callId: activeCall.callId });
      resetCall("ended");
    }
  }, [activeCall, createPeer, resetCall]);

  const rejectCall = useCallback(() => {
    if (!activeCall) return;
    socket.emit("reject-call", { callId: activeCall.callId });
    resetCall(null);
  }, [activeCall, resetCall]);

  const cancelCall = useCallback(() => {
    if (!activeCall || !activeCall.callId) return;
    socket.emit("cancel-call", { callId: activeCall.callId });
    resetCall(null);
  }, [activeCall, resetCall]);

  const endCall = useCallback(() => {
    if (!activeCall) return;
    socket.emit("end-call", { callId: activeCall.callId });
    resetCall(null);
  }, [activeCall, resetCall]);

  const toggleMute = useCallback(() => {
    setActiveCall((prev) => {
      if (!prev) return prev;
      const nextMuted = !prev.isMuted;
      peerRef.current?.setMuted(nextMuted);
      return { ...prev, isMuted: nextMuted };
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const handleCallRinging = ({ callId }: { callId: string; receiverId: string }) => {
      setActiveCall((prev) => (prev && prev.direction === "outgoing" ? { ...prev, callId } : prev));
    };

    const handleIncomingCall = ({ callId, caller }: IncomingCallPayload) => {
      setActiveCall((prev) => {
        if (prev) {
          // Already on/starting a call - let the caller's UI resolve to "busy" via the server.
          return prev;
        }
        return {
          callId,
          otherParticipant: caller,
          direction: "incoming",
          uiState: "incoming-ringing",
          startedAt: null,
          isMuted: false,
          transcript: [],
          isVedThinking: false,
          isVedSpeaking: false,
        };
      });
    };

    const handleCallAccepted = async ({ callId }: { callId: string }) => {
      setActiveCall((prev) => (prev ? { ...prev, uiState: "connecting" } : prev));
      try {
        const peer = createPeer(callId);
        await peer.attachLocalAudio();
        const offer = await peer.createOffer();
        socket.emit("offer", { callId, sdp: offer });
      } catch (error) {
        console.error("Failed to start media after acceptance:", error);
        socket.emit("end-call", { callId });
        resetCall("ended");
      }
    };

    const handleOffer = async ({ callId, sdp }: { callId: string; sdp: RTCSessionDescriptionInit }) => {
      const peer = peerRef.current;
      if (!peer) {
        // We haven't pressed Accept yet - stash it for acceptCall() to consume.
        pendingOfferRef.current = { callId, sdp };
        return;
      }
      const answer = await peer.createAnswer(sdp);
      socket.emit("answer", { callId, sdp: answer });
    };

    const handleAnswer = async ({ sdp }: { callId: string; sdp: RTCSessionDescriptionInit }) => {
      await peerRef.current?.acceptAnswer(sdp);
    };

    const handleIceCandidate = async ({ candidate }: { callId: string; candidate: RTCIceCandidateInit }) => {
      await peerRef.current?.addRemoteIceCandidate(candidate);
    };

    const handleCallEnded = ({ reason }: { callId: string; reason: CallEndReason }) => {
      resetCall(reason);
    };

    const handleCallBusy = () => resetCall("busy");
    const handleUserOffline = () => resetCall("offline");

    // --- Voice AI (Ved participating in the live call) ---
    const handleVoiceTranscript = (entry: VoiceTranscriptEntry) => {
      setActiveCall((prev) => {
        if (!prev || prev.callId !== entry.callId) return prev;
        const transcript = [...prev.transcript, entry].slice(-MAX_TRANSCRIPT_ENTRIES);
        return { ...prev, transcript };
      });
    };

    const handleAiThinkingVoice = ({ callId }: { callId: string }) => {
      setActiveCall((prev) => (prev && prev.callId === callId ? { ...prev, isVedThinking: true } : prev));
    };

    const handleAiStoppedThinkingVoice = ({ callId }: { callId: string }) => {
      setActiveCall((prev) => (prev && prev.callId === callId ? { ...prev, isVedThinking: false } : prev));
    };

    const handleAiSpeakingVoice = ({
      callId,
      audioBase64,
      audioMimeType,
    }: {
      callId: string;
      text: string;
      audioBase64: string | null;
      audioMimeType: string | null;
    }) => {
      setActiveCall((prev) => (prev && prev.callId === callId ? { ...prev, isVedSpeaking: true } : prev));

      // No audio (TTS unavailable/failed) - the reply still lands in the
      // transcript via voice-transcript-broadcast, so just clear the
      // "speaking" indicator shortly after; the UI falls back to text.
      if (!audioBase64) {
        setTimeout(() => {
          setActiveCall((prev) => (prev && prev.callId === callId ? { ...prev, isVedSpeaking: false } : prev));
        }, 1500);
        return;
      }

      if (!vedAudioRef.current) vedAudioRef.current = new Audio();
      const audio = vedAudioRef.current;
      audio.src = `data:${audioMimeType || "audio/mpeg"};base64,${audioBase64}`;
      audio.onended = () => {
        setActiveCall((prev) => (prev && prev.callId === callId ? { ...prev, isVedSpeaking: false } : prev));
      };
      audio.onerror = () => {
        // Playback failed client-side - same graceful fallback as no-audio above.
        setActiveCall((prev) => (prev && prev.callId === callId ? { ...prev, isVedSpeaking: false } : prev));
      };
      audio.play().catch(() => {
        setActiveCall((prev) => (prev && prev.callId === callId ? { ...prev, isVedSpeaking: false } : prev));
      });
    };

    socket.on("call-ringing", handleCallRinging);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("call-ended", handleCallEnded);
    socket.on("call-busy", handleCallBusy);
    socket.on("user-offline", handleUserOffline);
    socket.on("voice-transcript-broadcast", handleVoiceTranscript);
    socket.on("ai-thinking-voice", handleAiThinkingVoice);
    socket.on("ai-stopped-thinking-voice", handleAiStoppedThinkingVoice);
    socket.on("ai-speaking-voice", handleAiSpeakingVoice);

    return () => {
      socket.off("call-ringing", handleCallRinging);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("call-ended", handleCallEnded);
      socket.off("call-busy", handleCallBusy);
      socket.off("user-offline", handleUserOffline);
      socket.off("voice-transcript-broadcast", handleVoiceTranscript);
      socket.off("ai-thinking-voice", handleAiThinkingVoice);
      socket.off("ai-stopped-thinking-voice", handleAiStoppedThinkingVoice);
      socket.off("ai-speaking-voice", handleAiSpeakingVoice);
    };
  }, [user, createPeer, resetCall]);

  return (
    <CallContext.Provider
      value={{ activeCall, lastEndReason, startCall, acceptCall, rejectCall, cancelCall, endCall, toggleMute, remoteAudioRef }}
    >
      {children}
      <audio ref={remoteAudioRef} autoPlay className="hidden" />
    </CallContext.Provider>
  );
};

export const useCall = (): CallContextType => {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error("useCall must be used within a CallProvider");
  return ctx;
};
