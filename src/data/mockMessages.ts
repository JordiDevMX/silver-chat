import type { Msg } from "@/types/chat";

export const mockMessages: Record<string, Msg[]> = {
  1: [
    { id: "m1", text: "Sale un lol?", time: "09:30", fromSelf: false },
    {
      id: "m2",
      text: "Va va va, pero voy top y tu vas jg",
      time: "09:35",
      fromSelf: true,
      status: "read",
    },
    { id: "m3", text: "Nomas no vayas a trollear kbron", time: "09:42", fromSelf: false },
    { id: "m4", text: "Pides mucho we alv 😡", time: "09:43", fromSelf: true, status: "delivered" },
  ],
  "2": [
    { id: "m1", text: "Deploy successful on the silver mesh.", time: "09:15", fromSelf: false },
    { id: "m2", text: "Nice. Latency?", time: "09:16", fromSelf: true, status: "read" },
    { id: "m3", text: "12ms p99 ⚡", time: "09:17", fromSelf: false },
  ],
  "3": [
    { id: "m1", text: "Let's sync at 3 — neon brief?", time: "08:50", fromSelf: false },
    { id: "m2", text: "I'll se you there!", time: "08:58", fromSelf: false },
    { id: "m3", text: "I'm about to arrive.", time: "02:50", fromSelf: false },
    { id: "m4", text: "Where are you?", time: "03:10", fromSelf: false },
    { id: "m5", text: "What's your fucking problem?", time: "03:20", fromSelf: false },
  ],
  group_1: [
    {
      id: "msg_d1",
      senderName: "Blast",
      text: "Wey ya entren al Discord, ya vamos a pickear.",
      time: "08:15 PM",
      fromSelf: false,
    },
    {
      id: "msg_d2",
      senderName: "Wilbert",
      text: "Agántenme 5 mins que se está actualizando esta madre del Vanguard.",
      time: "08:16 PM",
      fromSelf: false,
    },
    {
      id: "msg_d3",
      senderName: "Gustambo",
      text: "Avisen para abrir directo, hoy se carrea o se desinstala.",
      time: "08:18 PM",
      fromSelf: false,
    },
    {
      id: "msg_d4",
      senderName: "Roy",
      text: "F, nos tocó contra un Smurf de nivel 30 que trae como 90% de winrate con Yasuo.",
      time: "08:42 PM",
      fromSelf: false,
    },
    {
      id: "msg_d5",
      senderName: "+52 33 1234 5678",
      text: "No mames, ¿quién se murió en el dragón? Teníamos smite listo, era free.",
      time: "08:45 PM",
      fromSelf: false,
    },
    {
      id: "msg_d6",
      senderName: "Jordi",
      text: "vayanse alv todos",
      time: "08:46 PM",
      fromSelf: true,
    },
    {
      id: "msg_d7",
      senderName: "Blast",
      text: "manco de mierda",
      time: "08:46 PM",
      fromSelf: false,
    },
  ],
};

export function getMessages(chatId: string): Msg[] {
  return (
    mockMessages[chatId] ?? [
      { id: "m1", text: "Welcome to the encrypted channel.", time: "—", fromSelf: false },
    ]
  );
}
