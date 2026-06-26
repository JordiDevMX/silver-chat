export interface Channel {
  id: string;
  name: string;
  verified?: boolean;
  avatarGradient: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export interface DiscoverChannel {
  id: string;
  name: string;
  verified?: boolean;
  avatarGradient: string;
  followers: string;
  description: string;
}
