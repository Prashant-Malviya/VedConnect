import { useEffect } from "react";
import { toast } from "react-toastify";
import { useCall } from "../../context/CallContext";
import IncomingCallModal from "./IncomingCallModal";
import CallScreen from "./CallScreen";
import { CallEndReason } from "../../types/call.types";

const REASON_MESSAGES: Record<CallEndReason, string> = {
  missed: "Call not answered",
  rejected: "Call declined",
  cancelled: "Call cancelled",
  ended: "Call ended",
  busy: "User is on another call",
  offline: "User is offline",
  disconnected: "Call disconnected",
};

// Mounted once in App.tsx, outside the router, so it renders over whatever
// page the user is on - an incoming call shouldn't require being on the
// chat screen.
const CallOverlay = () => {
  const { activeCall, lastEndReason, acceptCall, rejectCall, cancelCall, endCall, toggleMute } = useCall();

  useEffect(() => {
    if (!lastEndReason) return;
    // "ended" is the normal/expected outcome of a call - no need to toast it.
    if (lastEndReason === "ended") return;
    toast.info(REASON_MESSAGES[lastEndReason]);
  }, [lastEndReason]);

  if (!activeCall) return null;

  if (activeCall.uiState === "incoming-ringing") {
    return <IncomingCallModal call={activeCall} onAccept={acceptCall} onReject={rejectCall} />;
  }

  return <CallScreen call={activeCall} onCancel={cancelCall} onEnd={endCall} onToggleMute={toggleMute} />;
};

export default CallOverlay;
