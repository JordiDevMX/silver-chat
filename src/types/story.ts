export interface Story {
  id: string;
  author: string;
  avatarGradient: string;
  preview: string;
  caption: string;
  time: string;
  viewed: boolean;
  isMuted?: boolean;
  fromSelf?: boolean;
}
