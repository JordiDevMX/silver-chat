export type CallType = "voice" | "video";
export type CallDirection = "incoming" | "outgoing";
export type CallStatus = "missed" | "answered" | "rejected" | "ongoing";

export interface Call {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  subtitle?: string; // For displaying text when receiving a call from someone who the user doesn't know. Example: "Unknown — possible spam"
  isUnknown?: boolean; // For activating styles realted to "unknown contact incoming call"
  type: CallType;
  direction: CallDirection;
  status: CallStatus;
  time: string;
  duration?: string; // For example: "call lasted 12:45 mins"
}
