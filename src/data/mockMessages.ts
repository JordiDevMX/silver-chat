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
      text: "Nomas no vayas a trollear",
      time: "09:42",
      date: daysAgo(0, 9, 42),
      fromSelf: false,
      status: "delivered",
    },
    {
      id: "m4",
      text: "Pides mucho we 😡",
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
      text: "What's your freaking problem?",
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
      text: "No ma..., ¿quién se murió en el dragón? Teníamos smite listo, era free.",
      time: "08:45 PM",
      date: daysAgo(0, 20, 45),
      fromSelf: false,
      status: "delivered",
      isOnline: false,
    },
    {
      id: "msg_d6",
      senderName: "Jordi",
      text: "callense!",
      time: "08:46 PM",
      date: daysAgo(0, 20, 46),
      fromSelf: true,
      status: "delivered",
      isOnline: true,
    },
    {
      id: "msg_d7",
      senderName: "Blast",
      text: "mas malo que el cigarro",
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

  // ── Scenario audit threads (one rich payload per chat) ──────────────────
  // Each scenario owns a dedicated thread so it can be audited in isolation.
  // Rendering routes through `attachment` / `callLog` keys on the Msg type
  // (see src/types/chat.ts) handled by MessageBubble + AttachmentPreview +
  // CallLogPreview.

  // A — Missed incoming call
  "17": [
    {
      id: "log_a",
      text: "Missed voice call",
      time: "9:24 AM",
      date: daysAgo(0, 9, 24),
      fromSelf: false,
      status: "delivered",
      callLog: {
        type: "voice",
        direction: "incoming",
        status: "missed",
      },
    },
  ],

  // B — Unanswered outgoing call  [status synced with call_b1 = "rejected"]
  "18": [
    {
      id: "log_b",
      text: "No answer",
      time: "8:31 AM",
      date: daysAgo(0, 8, 31),
      fromSelf: true,
      status: "delivered",
      callLog: {
        type: "voice",
        direction: "outgoing",
        status: "rejected",
      },
    },
  ],

  // C — Answered incoming call
  "19": [
    {
      id: "log_c",
      text: "Voice call · 14:22 mins",
      time: "9:02 AM",
      date: daysAgo(0, 9, 2),
      fromSelf: false,
      status: "delivered",
      callLog: {
        type: "voice",
        direction: "incoming",
        status: "answered",
        duration: "14:22 mins",
      },
    },
  ],

  // C-video — Answered incoming video  [synced with call_c2 = "incoming"]
  "20": [
    {
      id: "log_c2",
      text: "Video call · 22:07 mins",
      time: "11:48 AM",
      date: daysAgo(1, 11, 48),
      fromSelf: false,
      status: "delivered",
      callLog: {
        type: "video",
        direction: "incoming",
        status: "answered",
        duration: "22:07 mins",
      },
    },
  ],

  // E — PDF document (received)
  "21": [
    {
      id: "att_pdf",
      text: "Q3_Financial_Report.pdf",
      time: "10:42",
      date: daysAgo(0, 10, 42),
      fromSelf: false,
      status: "delivered",
      attachment: {
        kind: "pdf",
        name: "Q3_Financial_Report.pdf",
        size: "2.4 MB",
      },
    },
  ],

  // F — Image attachment (received)
  "22": [
    {
      id: "att_img",
      text: "setup_hacker_den.png",
      time: "10:55",
      date: daysAgo(0, 10, 55),
      fromSelf: false,
      status: "delivered",
      attachment: {
        kind: "image",
        name: "setup_hacker_den.png",
        size: "1.8 MB",
        width: 1920,
        height: 1080,
        hue: "linear-gradient(135deg, oklch(0.6 0.18 280), oklch(0.4 0.12 200))",
      },
    },
  ],

  // G — Video attachment (sent)
  "23": [
    {
      id: "att_vid",
      text: "cinematic_demo.mp4",
      time: "11:02",
      date: daysAgo(0, 11, 2),
      fromSelf: true,
      status: "read",
      attachment: {
        kind: "video",
        name: "cinematic_demo.mp4",
        size: "14.6 MB",
        duration: "0:42",
        hue: "linear-gradient(135deg, oklch(0.45 0.12 240), oklch(0.3 0.08 280))",
      },
    },
  ],

  // H — Sticker (sent)
  "24": [
    {
      id: "att_stk",
      text: "Phantom sticker",
      time: "11:18",
      date: daysAgo(0, 11, 18),
      fromSelf: true,
      status: "delivered",
      attachment: {
        kind: "sticker",
        name: "sticker", // The name by default of any sticker will always be "sticker"
        emoji: "👻",
      },
    },
  ],

  // I — Missed incoming video  [synced with call_video_missed]
  "25": [
    {
      id: "log_25",
      text: "Missed video call",
      time: "3:47 PM",
      date: daysAgo(0, 15, 47),
      fromSelf: false,
      status: "delivered",
      callLog: {
        type: "video",
        direction: "incoming",
        status: "missed",
      },
    },
  ],

  // J — Answered incoming video  [synced with call_video_answered]
  "26": [
    {
      id: "log_26",
      text: "Video call · 08:34 mins",
      time: "11:08 AM",
      date: daysAgo(0, 11, 8),
      fromSelf: false,
      status: "delivered",
      callLog: {
        type: "video",
        direction: "incoming",
        status: "answered",
        duration: "08:34 mins",
      },
    },
  ],

  // K — Unanswered outgoing video (rejected)  [synced with call_video_unanswered]
  "27": [
    {
      id: "log_27",
      text: "Call rejected",
      time: "4:22 PM",
      date: daysAgo(0, 16, 22),
      fromSelf: true,
      status: "delivered",
      callLog: {
        type: "video",
        direction: "outgoing",
        status: "rejected",
      },
    },
  ],

  // ── 6 orphaned scenarios synced from mockCalls.ts ──────────────────────
  // Orphan A — Missed incoming voice  [renamed Orion Labs → Orion Stratos]
  "28": [
    {
      id: "log_28",
      text: "Missed voice call",
      time: "11:24 AM",
      date: daysAgo(0, 11, 24),
      fromSelf: false,
      status: "delivered",
      callLog: {
        type: "voice",
        direction: "incoming",
        status: "missed",
      },
    },
  ],

  // Orphan D — Answered outgoing video  [renamed Nova Vega → Vega Solis]
  "29": [
    {
      id: "log_29",
      text: "Video call · 05:08 mins",
      time: "10:14 AM",
      date: daysAgo(0, 10, 14),
      fromSelf: true,
      status: "read",
      callLog: {
        type: "video",
        direction: "outgoing",
        status: "answered",
        duration: "05:08 mins",
      },
    },
  ],

  // Orphan A2 — Missed incoming voice (unknown caller)
  "30": [
    {
      id: "log_30",
      text: "Missed voice call",
      time: "4:31 PM",
      date: daysAgo(1, 16, 31),
      fromSelf: false,
      status: "delivered",
      callLog: {
        type: "voice",
        direction: "incoming",
        status: "missed",
      },
    },
  ],

  // Orphan D2 — Answered outgoing voice  [renamed Kairo Sato → Kairo Nexus]
  "31": [
    {
      id: "log_31",
      text: "Voice call · 08:13 mins",
      time: "2:17 PM",
      date: daysAgo(1, 14, 17),
      fromSelf: true,
      status: "read",
      callLog: {
        type: "voice",
        direction: "outgoing",
        status: "answered",
        duration: "08:13 mins",
      },
    },
  ],

  // Orphan B2 — Unanswered outgoing voice  [renamed Vault 0x9 → Vault Helix]
  "32": [
    {
      id: "log_32",
      text: "No answer",
      time: "9:40 AM",
      date: daysAgo(2, 9, 40),
      fromSelf: true,
      status: "delivered",
      callLog: {
        type: "voice",
        direction: "outgoing",
        status: "missed",
      },
    },
  ],

  // Orphan A3 — Missed incoming video  [renamed Echo Network → Echo Cascade]
  "33": [
    {
      id: "log_33",
      text: "Missed video call",
      time: "1:05 PM",
      date: daysAgo(2, 13, 5),
      fromSelf: false,
      status: "delivered",
      callLog: {
        type: "video",
        direction: "incoming",
        status: "missed",
      },
    },
  ],

  // ── Community channel threads ─────────────────────────────────────────
  // Keyed by SubChannel.id so the drill-down route can reuse getMessages().
  // The `date` fields use daysAgo() so the chat view's date separators
  // (groupByDate in the route) render naturally.

  // co1-a — Asambleas Populares AMG · Announcements
  "co1-a": [
    {
      id: "co1-a-1",
      senderName: "Mariana (admin)",
      text: "Reminder: general assembly this Friday at 19:00. Please confirm attendance in the coordination channel.",
      time: "10:22",
      date: daysAgo(0, 10, 22),
      fromSelf: false,
      status: "delivered",
      isOnline: true,
    },
    {
      id: "co1-a-2",
      senderName: "Tomás (mod)",
      text: "Agenda is finalized — minutes from last session are pinned in the general coordination channel.",
      time: "10:34",
      date: daysAgo(0, 10, 34),
      fromSelf: false,
      status: "delivered",
      isOnline: true,
    },
  ],

  // co1-g1 — Asambleas Populares AMG · Coordinación general
  "co1-g1": [
    {
      id: "co1-g1-1",
      senderName: "Mariana",
      text: "Agenda updated for the next session — I moved the logistics block to the top.",
      time: "09:48",
      date: daysAgo(0, 9, 48),
      fromSelf: false,
      status: "delivered",
      isOnline: true,
    },
    {
      id: "co1-g1-2",
      senderName: "You",
      text: "Perfect, I'll send the final list of attendees tomorrow morning.",
      time: "09:52",
      date: daysAgo(0, 9, 52),
      fromSelf: true,
      status: "read",
    },
    {
      id: "co1-g1-3",
      senderName: "Sofía",
      text: "Can we add a 10-minute slot for the press summary at the end?",
      time: "10:05",
      date: daysAgo(0, 10, 5),
      fromSelf: false,
      status: "delivered",
      isOnline: false,
    },
  ],

  // co2-a — Silver Mesh Builders · Announcements
  "co2-a": [
    {
      id: "co2-a-1",
      senderName: "Nyx (admin)",
      text: "v2.1 deployed across all silver nodes ⚡ — glass tokens now cascade through every theme.",
      time: "08:05",
      date: daysAgo(0, 8, 5),
      fromSelf: false,
      status: "delivered",
      isOnline: true,
    },
    {
      id: "co2-a-2",
      senderName: "Nyx (admin)",
      text: "Heads up: maintenance window tonight 23:00–23:30 UTC. Read-only during the swap.",
      time: "08:11",
      date: daysAgo(0, 8, 11),
      fromSelf: false,
      status: "delivered",
      isOnline: true,
    },
  ],

  // co2-g1 — Silver Mesh Builders · Design crit
  "co2-g1": [
    {
      id: "co2-g1-1",
      senderName: "Echo",
      text: "Pushed new glass tokens, take a look — `bg-primary/20` + `backdrop-blur-md` is the combo.",
      time: "09:14",
      date: daysAgo(1, 9, 14),
      fromSelf: false,
      status: "delivered",
      isOnline: true,
    },
    {
      id: "co2-g1-2",
      senderName: "You",
      text: "The neon glow on the self bubble is gorgeous. Can we push the opacity to 25 in dark mode?",
      time: "09:22",
      date: daysAgo(1, 9, 22),
      fromSelf: true,
      status: "read",
    },
    {
      id: "co2-g1-3",
      senderName: "Vega",
      text: "Agreed, 20 reads a little thin. Bumping to 25 in the next pass.",
      time: "09:30",
      date: daysAgo(1, 9, 30),
      fromSelf: false,
      status: "delivered",
      isOnline: false,
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
