export type CallDirection = "incoming" | "outgoing" | "missed";
export type CallType = "voice" | "video";

export interface CallLog {
  id: string;
  name: string;
  subtitle?: string;
  isUnknown?: boolean;
  avatar: string;
  avatarGradient?: string;
  email?: string;
  direction: CallDirection;
  type: CallType;
  time: string;
}

export const mockCalls: CallLog[] = [
  {
    id: "1",
    name: "Nova Vega",
    avatar: "NV",
    avatarGradient: "linear-gradient(135deg, oklch(0.7 0.18 250), oklch(0.55 0.22 270))",
    email: "nova.vega@example.com",
    direction: "outgoing",
    type: "video",
    time: "Today, 10:14 AM",
  },
  {
    id: "2",
    name: "Lyra Chen",
    avatar: "LC",
    avatarGradient: "linear-gradient(135deg, oklch(0.75 0.16 220), oklch(0.6 0.2 250))",
    email: "lyra.chen@example.com",
    direction: "incoming",
    type: "voice",
    time: "Today, 9:02 AM",
  },
  {
    id: "3",
    name: "Orion Labs",
    avatar: "OL",
    avatarGradient: "linear-gradient(135deg, oklch(0.7 0.15 200), oklch(0.55 0.18 230))",
    email: "contact@orionlabs.io",
    direction: "missed",
    type: "voice",
    time: "Yesterday, 8:08 PM",
  },
  {
    id: "4",
    name: "+1 (415) 555-0142",
    subtitle: "Unknown — possible spam",
    isUnknown: true,
    avatar: "?",
    avatarGradient: "linear-gradient(135deg, oklch(0.8 0.01 250), oklch(0.65 0.015 250))",
    direction: "missed",
    type: "voice",
    time: "Yesterday, 4:31 PM",
  },
  {
    id: "5",
    name: "Kairo Sato",
    avatar: "KS",
    avatarGradient: "linear-gradient(135deg, oklch(0.72 0.18 260), oklch(0.58 0.2 280))",
    email: "kairo.sato@example.com",
    direction: "outgoing",
    type: "voice",
    time: "Yesterday, 2:17 PM",
  },
  {
    id: "6",
    name: "Atlas Crew",
    avatar: "AC",
    avatarGradient: "linear-gradient(135deg, oklch(0.7 0.14 210), oklch(0.55 0.18 240))",
    email: "crew@atlas.co",
    direction: "incoming",
    type: "video",
    time: "Monday, 11:48 AM",
  },
  {
    id: "7",
    name: "Rin Akiyama",
    avatar: "RA",
    avatarGradient: "linear-gradient(135deg, oklch(0.75 0.15 230), oklch(0.6 0.2 260))",
    email: "rin.akiyama@example.com",
    direction: "outgoing",
    type: "voice",
    time: "Sunday, 7:22 PM",
  },
  {
    id: "8",
    name: "Echo Network",
    avatar: "EN",
    avatarGradient: "linear-gradient(135deg, oklch(0.7 0.12 200), oklch(0.5 0.16 240))",
    email: "hello@echonetwork.app",
    direction: "missed",
    type: "video",
    time: "Sunday, 1:05 PM",
  },
  {
    id: "9",
    name: "Vault 0x9",
    avatar: "V9",
    avatarGradient: "linear-gradient(135deg, oklch(0.68 0.16 270), oklch(0.5 0.2 290))",
    email: "vault0x9@proton.me",
    direction: "incoming",
    type: "voice",
    time: "Saturday, 9:40 AM",
  },
];
