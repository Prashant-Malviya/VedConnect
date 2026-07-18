// Provider-agnostic-ish wrapper around RTCPeerConnection. Nothing outside
// this file constructs an RTCPeerConnection directly - CallContext only
// calls these methods, which keeps the browser WebRTC API isolated in one
// place (same reasoning as AIProvider on the backend: swap/extend without
// touching callers).

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export interface PeerConnectionHandlers {
  onRemoteStream: (stream: MediaStream) => void;
  onIceCandidate: (candidate: RTCIceCandidate) => void;
  onConnectionStateChange: (state: RTCPeerConnectionState) => void;
}

export class WebRTCPeer {
  private pc: RTCPeerConnection;
  private localStream: MediaStream | null = null;

  constructor(private handlers: PeerConnectionHandlers) {
    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    this.pc.onicecandidate = (event) => {
      if (event.candidate) this.handlers.onIceCandidate(event.candidate);
    };

    this.pc.ontrack = (event) => {
      this.handlers.onRemoteStream(event.streams[0]);
    };

    this.pc.onconnectionstatechange = () => {
      this.handlers.onConnectionStateChange(this.pc.connectionState);
    };
  }

  async attachLocalAudio(): Promise<MediaStream> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    this.localStream = stream;
    stream.getTracks().forEach((track) => this.pc.addTrack(track, stream));
    return stream;
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(remoteOffer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    await this.pc.setRemoteDescription(new RTCSessionDescription(remoteOffer));
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    return answer;
  }

  async acceptAnswer(remoteAnswer: RTCSessionDescriptionInit): Promise<void> {
    await this.pc.setRemoteDescription(new RTCSessionDescription(remoteAnswer));
  }

  async addRemoteIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    try {
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      // Candidates that arrive before the remote description is set are
      // expected sometimes with slow signaling - safe to drop, not fatal.
      console.warn("Failed to add ICE candidate:", error);
    }
  }

  setMuted(muted: boolean): void {
    this.localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !muted;
    });
  }

  close(): void {
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.pc.getSenders().forEach((sender) => sender.track?.stop());
    this.pc.close();
  }
}
