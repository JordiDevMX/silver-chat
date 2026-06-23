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
  avatar: string; // initials or URL
  isOnline?: boolean;
  role?: "admin" | "moderator" | "member";
}
export interface Chat {
  id: string;
  name: string;
  avatar: string; // initials or URL
  lastMessage: string;
  time: string;
  unread: number;
  status?: Msg["status"];
  isOnline?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  isVerified?: boolean;
  isBlocked?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
  fromSelf?: boolean;

  // Chat Groups Props
  isGroup?: boolean;
  participants?: GroupUser[];
  lastMessageSender?: string; // name of the last message sender in group chats
}

export interface Msg {
  id: string;
  text: string;
  time: string;
  fromSelf: boolean;
  senderName?: string;
  status: MessageStatus;
}
