import type { Msg } from "@/types/chat";

function daysAgo(days: number, hour: number, minute: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

export const mockMessages: Record<string, Msg[]> = {
  "1": [
    {
      id: "m1",
      text: "Sale un lol?",
      time: "09:30",
      date: daysAgo(0, 9, 30),
      fromSelf: false,
      status: "delivered",
    },
    {
      id: "m2",
      text: "Va va va, pero voy top y tu vas jg",
      time: "09:35",
      date: daysAgo(0, 9, 35),
      fromSelf: true,
      status: "read",
    },
    {
      id: "m3",
      text: "Nomas no vayas a trollear kbron",
      time: "09:42",
      date: daysAgo(0, 9, 42),
      fromSelf: false,
      status: "delivered",
    },
    {
      id: "m4",
      text: "Pides mucho we alv 😡",
      time: "09:43",
      date: daysAgo(0, 9, 43),
      fromSelf: true,
      status: "delivered",
    },
  ],
  "2": [
    {
      id: "m1",
      text: "Deploy successful on the silver mesh.",
      time: "09:15",
      date: daysAgo(0, 9, 15),
      fromSelf: false,
      status: "delivered",
    },
    {
      id: "m2",
      text: "Nice. Latency?",
      time: "09:16",
      date: daysAgo(0, 9, 16),
      fromSelf: true,
      status: "read",
    },
    {
      id: "m3",
      text: "12ms p99 ⚡",
      time: "09:17",
      date: daysAgo(0, 9, 17),
      fromSelf: false,
      status: "delivered",
    },
  ],
  "3": [
    {
      id: "m1",
      text: "Let's sync at 3 — neon brief?",
      time: "08:50",
      date: daysAgo(1, 8, 50),
      fromSelf: false,
      status: "delivered",
    },
    {
      id: "m2",
      text: "I'll se you there!",
      time: "08:58",
      date: daysAgo(1, 8, 58),
      fromSelf: false,
      status: "delivered",
    },
    {
      id: "m3",
      text: "I'm about to arrive.",
      time: "02:50",
      date: daysAgo(0, 2, 50),
      fromSelf: false,
      status: "delivered",
    },
    {
      id: "m4",
      text: "Where are you?",
      time: "03:10",
      date: daysAgo(0, 3, 10),
      fromSelf: false,
      status: "delivered",
    },
    {
      id: "m5",
      text: "What's your fucking problem?",
      time: "03:20",
      date: daysAgo(0, 3, 20),
      fromSelf: false,
      status: "delivered",
    },
  ],
  group_1: [
    {
      id: "msg_d1",
      senderName: "Blast",
      text: "Wey ya entren al Discord, ya vamos a pickear.",
      time: "08:15 PM",
      date: daysAgo(0, 20, 15),
      fromSelf: false,
      status: "delivered",
      isOnline: true,
    },
    {
      id: "msg_d2",
      senderName: "Wilbert",
      text: "Agántenme 5 mins que se está actualizando esta madre del Vanguard.",
      time: "08:16 PM",
      date: daysAgo(0, 20, 16),
      fromSelf: false,
      status: "delivered",
      isOnline: false,
    },
    {
      id: "msg_d3",
      senderName: "Gustambo",
      text: "Avisen para abrir directo, hoy se carrea o se desinstala.",
      time: "08:18 PM",
      date: daysAgo(0, 20, 18),
      fromSelf: false,
      status: "delivered",
      isOnline: false,
    },
    {
      id: "msg_d4",
      senderName: "Roy",
      text: "F, nos tocó contra un Smurf de nivel 30 que trae como 90% de winrate con Yasuo.",
      time: "08:42 PM",
      date: daysAgo(0, 20, 42),
      fromSelf: false,
      status: "delivered",
      isOnline: false,
    },
    {
      id: "msg_d5",
      senderName: "+52 33 1234 5678",
      text: "No mames, ¿quién se murió en el dragón? Teníamos smite listo, era free.",
      time: "08:45 PM",
      date: daysAgo(0, 20, 45),
      fromSelf: false,
      status: "delivered",
      isOnline: false,
    },
    {
      id: "msg_d6",
      senderName: "Jordi",
      text: "vayanse alv todos",
      time: "08:46 PM",
      date: daysAgo(0, 20, 46),
      fromSelf: true,
      status: "delivered",
      isOnline: true,
    },
    {
      id: "msg_d7",
      senderName: "Blast",
      text: "manco de mierda",
      time: "08:46 PM",
      date: daysAgo(0, 20, 46),
      fromSelf: false,
      status: "delivered",
      isOnline: true,
    },
  ],
  "14": [
    {
      id: "m1",
      text: "There's nothing you can do to stop them. So, stop daydreaming.",
      time: "09:30",
      date: daysAgo(0, 9, 30),
      fromSelf: false,
      status: "delivered",
    },
    {
      id: "m2",
      text: "I don't want to be a part of your world.",
      time: "09:35",
      date: daysAgo(0, 9, 35),
      fromSelf: true,
      status: "read",
    },
    {
      id: "m3",
      text: "You can't stop the future. You can't rewind the past. The only way to deal with this is... accept it is what it is",
      time: "09:42",
      date: daysAgo(0, 9, 42),
      fromSelf: false,
      status: "delivered",
    },
    {
      id: "m4",
      text: "It's hard... you know, ",
      time: "09:43",
      date: daysAgo(0, 9, 43),
      fromSelf: true,
      status: "draft",
    },
  ],

  // ── Rich media attachment scenarios ─────────────────────────────────────
  // The canonical Msg interface is text-only (see src/types/chat.ts), so each
  // attachment is encoded as a single emoji-prefixed text payload. This keeps
  // the active MessageBubble / ChatListItem renderers untouched while letting
  // us visualize the four media states end-to-end.
  "16": [
    // Scenario E — PDF document (received)
    {
      id: "att_pdf",
      text: "📄 Q3_Financial_Report.pdf",
      time: "10:42",
      date: daysAgo(0, 10, 42),
      fromSelf: false,
      status: "delivered",
    },
    // Scenario F — Image attachment (received)
    {
      id: "att_img",
      text: "🖼️ setup_hacker_den.png",
      time: "10:55",
      date: daysAgo(0, 10, 55),
      fromSelf: false,
      status: "delivered",
    },
    // Scenario G — Video attachment (sent)
    {
      id: "att_vid",
      text: "🎥 cinematic_demo.mp4",
      time: "11:02",
      date: daysAgo(0, 11, 2),
      fromSelf: true,
      status: "read",
    },
    // Scenario H — Sticker (sent)
    {
      id: "att_stk",
      text: "👻 [Sticker]",
      time: "11:18",
      date: daysAgo(0, 11, 18),
      fromSelf: true,
      status: "delivered",
    },
  ],
};

export function getMessages(chatId: string): Msg[] {
  return (
    mockMessages[chatId] ?? [
      {
        id: "m1",
        text: "Welcome to the encrypted channel.",
        time: "—",
        date: new Date(),
        fromSelf: false,
        status: "delivered",
      },
    ]
  );
}
