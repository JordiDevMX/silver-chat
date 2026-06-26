export interface SubChannel {
  id: string;
  name: string;
  type: "announcements" | "group";
  lastMessage: string;
  time: string;
  muted?: boolean;
  avatarGradient?: string;
}

export interface Community {
  id: string;
  name: string;
  avatarGradient: string;
  channels: SubChannel[];
  hiddenCount: number;
}
