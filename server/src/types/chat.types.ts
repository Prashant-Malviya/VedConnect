// A lightweight snapshot of who is currently connected, sent to clients
// whenever someone joins or leaves.
export interface OnlineUser {
  userId: string;
  username: string;
}
