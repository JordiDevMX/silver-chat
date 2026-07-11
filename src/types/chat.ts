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

/**
 * Canonical user / participant model.
 *
 * Replaces the older `GroupUser` type. A `User` represents any person in
 * the system — direct-message counterpart, group participant, or call
 * peer. The `role` field is optional because most surfaces don't care
 * about group permissions; only the member roster surfaces expose it.
 */
export interface User {
  id: string;
  name: string;
  /** Optional profile picture. When absent, surfaces fall back to initials. */
  avatarUrl?: string;
  role?: "admin" | "moderator" | "member";
}

/**
 * Back-compat re-export so existing imports of `GroupUser` keep working
 * during the migration. New code should use `User` directly.
 *
 * @deprecated Use `User` from `@/types/chat` instead.
 */
export type GroupUser = User;

export interface Chat {
  id: string;
  name: string;
  /**
   * Optional profile picture for the chat's "primary" entity — the
   * counterparty for a direct message, or a group avatar for a group.
   * When absent, the `<Avatar />` component derives initials from `name`.
   */
  avatarUrl?: string;
  /**
   * Background gradient applied behind the initials fallback. Call sites
   * that use a status-driven gradient (e.g. `Calls.tsx`) pass a different
   * gradient via the `<Avatar gradient />` prop, ignoring this field.
   */
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
  participants?: User[];
  lastMessageSender?: string;
  /**
   * Epoch-milliseconds of the latest message, used by `sortChats` for
   * chronological ordering within each pinned tier. Optional so the
   * migration is non-breaking — chats without a `timestamp` sort to
   * the bottom of their tier (treated as `0`).
   */
  timestamp?: number;
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
