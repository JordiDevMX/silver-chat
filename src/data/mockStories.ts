export interface Story {
  id: string;
  author: string;
  avatarGradient: string;
  preview: string;
  caption: string;
  time: string;
  viewed: boolean;
}

// My story (the current user)
export const myStory: Story | null = {
  id: "me-1",
  author: "My Story",
  avatarGradient: "linear-gradient(135deg, oklch(0.7 0.22 250), oklch(0.78 0.18 245))",
  preview: "linear-gradient(135deg, oklch(0.62 0.22 255), oklch(0.45 0.2 290))",
  caption: "Late-night code sprint ✨",
  time: "32 min ago",
  viewed: false,
};

// Friends' stories — recent updates (unviewed first)
export const recentStories: Story[] = [
  {
    id: "s1",
    author: "Aria Chen",
    avatarGradient: "linear-gradient(135deg, oklch(0.78 0.16 30), oklch(0.6 0.22 15))",
    preview: "linear-gradient(135deg, oklch(0.55 0.2 25), oklch(0.7 0.18 50))",
    caption: "Sunset over Lisbon 🌅",
    time: "12 min ago",
    viewed: false,
  },
  {
    id: "s2",
    author: "Marco Devlin",
    avatarGradient: "linear-gradient(135deg, oklch(0.7 0.18 160), oklch(0.5 0.2 180))",
    preview: "linear-gradient(135deg, oklch(0.45 0.18 170), oklch(0.65 0.16 200))",
    caption: "Coffee + Cuban jazz",
    time: "1 hr ago",
    viewed: false,
  },
  {
    id: "s3",
    author: "Priya Raman",
    avatarGradient: "linear-gradient(135deg, oklch(0.75 0.18 320), oklch(0.55 0.22 300))",
    preview: "linear-gradient(135deg, oklch(0.5 0.22 320), oklch(0.7 0.18 350))",
    caption: "Diwali lights, finally up 🪔",
    time: "2 hr ago",
    viewed: false,
  },
];

// Already-viewed friend stories
export const viewedStories: Story[] = [
  {
    id: "s4",
    author: "Theo Lindqvist",
    avatarGradient: "linear-gradient(135deg, oklch(0.7 0.06 250), oklch(0.5 0.04 250))",
    preview: "linear-gradient(135deg, oklch(0.55 0.05 240), oklch(0.75 0.04 220))",
    caption: "Trail run, 14 km done",
    time: "Yesterday",
    viewed: true,
  },
  {
    id: "s5",
    author: "Noor Hassan",
    avatarGradient: "linear-gradient(135deg, oklch(0.8 0.12 90), oklch(0.6 0.18 70))",
    preview: "linear-gradient(135deg, oklch(0.6 0.16 80), oklch(0.78 0.12 110))",
    caption: "New studio plant 🌿",
    time: "Yesterday",
    viewed: true,
  },
  {
    id: "s6",
    author: "Jules Okafor",
    avatarGradient: "linear-gradient(135deg, oklch(0.65 0.18 280), oklch(0.45 0.22 270))",
    preview: "linear-gradient(135deg, oklch(0.45 0.2 280), oklch(0.65 0.16 240))",
    caption: "Vinyl haul of the month",
    time: "2 days ago",
    viewed: true,
  },
];
