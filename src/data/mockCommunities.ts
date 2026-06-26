import type { Community } from "@/types/community";

export const communities: Community[] = [
  {
    id: "co1",
    name: "Asambleas Populares AMG",
    avatarGradient: "linear-gradient(135deg, oklch(0.7 0.18 250), oklch(0.5 0.2 280))",
    hiddenCount: 6,
    channels: [
      {
        id: "co1-a",
        name: "Announcements",
        type: "announcements",
        lastMessage: "Reunión general este viernes a las 19:00 ✦",
        time: "10:22",
      },
      {
        id: "co1-g1",
        name: "Coordinación general",
        type: "group",
        lastMessage: "Mariana: agenda actualizada para la próxima sesión",
        time: "09:48",
        avatarGradient: "linear-gradient(135deg, oklch(0.75 0.16 200), oklch(0.55 0.2 230))",
      },
      {
        id: "co1-g2",
        name: "Logística y traslados",
        type: "group",
        lastMessage: "Tomás: confirmen quienes van en la camioneta",
        time: "Yesterday",
        muted: true,
        avatarGradient: "linear-gradient(135deg, oklch(0.78 0.14 70), oklch(0.6 0.18 50))",
      },
    ],
  },
  {
    id: "co2",
    name: "Silver Mesh Builders",
    avatarGradient: "linear-gradient(135deg, oklch(0.72 0.02 250), oklch(0.45 0.04 260))",
    hiddenCount: 3,
    channels: [
      {
        id: "co2-a",
        name: "Announcements",
        type: "announcements",
        lastMessage: "v2.1 deployed across all silver nodes ⚡",
        time: "08:05",
      },
      {
        id: "co2-g1",
        name: "Design crit",
        type: "group",
        lastMessage: "Echo: pushed new glass tokens, take a look",
        time: "Mon",
        avatarGradient: "linear-gradient(135deg, oklch(0.75 0.16 320), oklch(0.55 0.2 290))",
      },
    ],
  },
];
