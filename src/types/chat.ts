import type { CallType, CallDirection, CallStatus } from "./call";

export type TabKey = "chats" | "updates" | "communities" | "calls";
export type MessageStatus =
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "pending"
  | "draft"
  | "deleted";

export interface GroupUser {
  id: string;
  name: string;
  avatar: string;
  role?: "admin" | "moderator" | "member";
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  avatarGradient?: string;
  lastMessage: string;
  time: string;
  unread: number;
  status?: MessageStatus;
  isOnline?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  isVerified?: boolean;
  isBlocked?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
  fromSelf?: boolean;
  isGroup?: boolean;
  participants?: GroupUser[];
  lastMessageSender?: string;
}

// ── Rich content variants for message bubbles ─────────────────────────────
// A Msg carries AT MOST ONE rich variant. `attachment` and `callLog` are
// mutually exclusive with each other and with meaningful `text` content
// (text is kept as a fallback for screen readers and the chat-list preview).
export type AttachmentKind = "pdf" | "image" | "video" | "sticker";

export interface Attachment {
  kind: AttachmentKind;
  name: string;
  size?: string;
  width?: number;
  height?: number;
  duration?: string;
  emoji?: string;
  hue?: string;
}

export interface CallLogMessage {
  type: CallType;
  direction: CallDirection;
  status: CallStatus;
  duration?: string;
}

export interface Msg {
  id: string;
  text: string;
  time: string;
  date: Date;
  fromSelf: boolean;
  senderName?: string;
  status: MessageStatus;
  isOnline?: boolean;
  attachment?: Attachment;
  callLog?: CallLogMessage;
}
