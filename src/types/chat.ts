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

export interface Msg {
  id: string;
  text: string;
  time: string;
  date: Date;
  fromSelf: boolean;
  senderName?: string;
  status: MessageStatus;
  isOnline?: boolean;
}
