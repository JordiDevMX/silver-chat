import type { Channel, DiscoverChannel } from "@/types/channel";

export const followedChannels: Channel[] = [
  {
    id: "c1",
    name: "TechCrunch",
    verified: true,
    avatarGradient: "linear-gradient(135deg, oklch(0.7 0.18 145), oklch(0.5 0.2 160))",
    lastMessage: "OpenAI launches new agentic SDK — here's what changes",
    time: "08:42",
    unread: 3,
  },
  {
    id: "c2",
    name: "NASA",
    verified: true,
    avatarGradient: "linear-gradient(135deg, oklch(0.55 0.2 25), oklch(0.4 0.18 15))",
    lastMessage: "Live: Artemis II crew briefing in 30 minutes 🚀",
    time: "07:15",
    unread: 1,
  },
  {
    id: "c3",
    name: "Design Weekly",
    avatarGradient: "linear-gradient(135deg, oklch(0.75 0.16 320), oklch(0.55 0.2 290))",
    lastMessage: "12 portfolio sites breaking the grid this month",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: "c4",
    name: "Lovable",
    verified: true,
    avatarGradient: "linear-gradient(135deg, oklch(0.7 0.22 250), oklch(0.55 0.22 280))",
    lastMessage: "New: server functions are live for every project",
    time: "Mon",
    unread: 8,
  },
];

export const discoverChannels: DiscoverChannel[] = [
  {
    id: "d1",
    name: "The Verge",
    verified: true,
    avatarGradient: "linear-gradient(135deg, oklch(0.6 0.2 300), oklch(0.4 0.22 320))",
    followers: "12.4M followers",
    description: "Tech, science & culture, every day.",
  },
  {
    id: "d2",
    name: "F1 Insider",
    avatarGradient: "linear-gradient(135deg, oklch(0.55 0.22 25), oklch(0.4 0.2 15))",
    followers: "3.1M followers",
    description: "Race recaps, paddock rumors, telemetry deep-dives.",
  },
  {
    id: "d3",
    name: "Bon Appétit",
    verified: true,
    avatarGradient: "linear-gradient(135deg, oklch(0.78 0.16 70), oklch(0.6 0.18 50))",
    followers: "5.8M followers",
    description: "Recipes worth cooking tonight.",
  },
  {
    id: "d4",
    name: "Indie Hackers",
    avatarGradient: "linear-gradient(135deg, oklch(0.7 0.14 180), oklch(0.5 0.16 200))",
    followers: "890K followers",
    description: "Founders sharing revenue, lessons and launches.",
  },
];
