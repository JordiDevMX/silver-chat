export type TabKey = "chats" | "updates" | "communities" | "calls";

export interface Chat {
  id: string;
  name: string;
  avatar: string; // initials or URL
  lastMessage: string;
  time: string;
  unread: number;
  status: Msg["status"];
  isOnline?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  isGroup?: boolean;
  isVerified?: boolean;
  isBlocked?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
  isDraft?: boolean;
  isScheduled?: boolean;
  isRestricted?: boolean;
  fromSelf?: boolean;
}

export interface Msg {
  id: string;
  text: string;
  time: string;
  fromSelf: boolean;
  status?: "sent" | "delivered" | "read" | "failed" | "pending" | "scheduled" | "draft" | "deleted";
}
