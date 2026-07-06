export type CallType = "voice" | "video";
export type CallDirection = "incoming" | "outgoing";
export type CallStatus = "missed" | "answered" | "rejected" | "ongoing";

/**
 * Optional profile picture for the call peer. When absent, the
 * `<Avatar />` component derives initials from `name`.
 */
export interface Call {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
  subtitle?: string; // For displaying text when receiving a call from someone who the user doesn't know. Example: "Unknown — possible spam"
  isUnknown?: boolean; // For activating styles realted to "unknown contact incoming call"
  type: CallType;
  direction: CallDirection;
  status: CallStatus;
  time: string;
  duration?: string; // For example: "call lasted 12:45 mins"
}
