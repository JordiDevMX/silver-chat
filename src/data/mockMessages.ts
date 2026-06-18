import type { Message } from "@/types/chat";

export const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "m1", text: "Hey, are you online?", time: "09:30", fromSelf: false },
    { id: "m2", text: "Yes — booting up the silver mesh now.", time: "09:31", fromSelf: true, status: "read" },
    { id: "m3", text: "Sent you the encrypted file ✦", time: "09:42", fromSelf: false },
    { id: "m4", text: "Got it. Decrypting...", time: "09:43", fromSelf: true, status: "delivered" },
  ],
  "2": [
    { id: "m1", text: "Deploy successful on the silver mesh.", time: "09:15", fromSelf: false },
    { id: "m2", text: "Nice. Latency?", time: "09:16", fromSelf: true, status: "read" },
    { id: "m3", text: "12ms p99 ⚡", time: "09:17", fromSelf: false },
  ],
  "3": [
    { id: "m1", text: "Let's sync at 3 — neon brief?", time: "08:50", fromSelf: false },
    { id: "m2", text: "Works. I'll bring mockups.", time: "08:52", fromSelf: true, status: "read" },
  ],
};

export function getMessages(chatId: string): Message[] {
  return mockMessages[chatId] ?? [
    { id: "m1", text: "Welcome to the encrypted channel.", time: "—", fromSelf: false },
  ];
}
