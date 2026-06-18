export type TabKey = "chats" | "updates" | "communities" | "calls";

export interface Chat {
  id: string;
  name: string;
  avatar: string; // initials or URL
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
  pinned?: boolean;
}

export interface Message {
  id: string;
  text: string;
  time: string;
  fromSelf: boolean;
  status?: "sent" | "delivered" | "read";
}
