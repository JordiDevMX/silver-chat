import type { Call } from "@/types/call";

/**
 * Telecom history scenarios (canonical Call type):
 *   A — Missed Incoming      direction: "incoming"  status: "missed"     (no duration)
 *   B — Unanswered Outgoing  direction: "outgoing"  status: "rejected" | "missed"
 *   C — Answered Incoming    direction: "incoming"  status: "answered"   (with duration)
 *   D — Answered Outgoing    direction: "outgoing"  status: "answered"   (with duration)
 *
 * Rendering rules (see src/components/calls/Calls.tsx + src/constants/callIcons.tsx):
 *   - "missed"   → text-red-500 + red gradient avatar
 *   - "rejected" → text-red-400/80 + muted-red gradient avatar
 *   - "answered" → text-primary + neon gradient avatar
 *   - duration is only shown when present on the entry
 */
export const mockCalls: Call[] = [
  // ── Scenario C — Answered Incoming (voice, long) ───────────────────────
  {
    id: "call_c1",
    name: "Lyra Chen",
    avatar: "LC",
    email: "lyra.chen@example.com",
    type: "voice",
    direction: "incoming",
    status: "answered",
    time: "Today, 9:02 AM",
    duration: "14:22 mins",
  },

  // ── Scenario A — Missed Incoming (voice) ───────────────────────────────
  {
    id: "call_a1",
    name: "Orion Labs",
    avatar: "OL",
    email: "contact@orionlabs.io",
    type: "voice",
    direction: "incoming",
    status: "missed",
    time: "Today, 11:24 AM",
  },

  // ── Scenario B — Unanswered Outgoing (voice, rejected) ─────────────────
  {
    id: "call_b1",
    name: "Rin Akiyama",
    avatar: "RA",
    email: "rin.akiyama@example.com",
    type: "voice",
    direction: "outgoing",
    status: "rejected",
    time: "Today, 8:31 AM",
  },

  // ── Scenario D — Answered Outgoing (video, short) ──────────────────────
  {
    id: "call_d1",
    name: "Nova Vega",
    avatar: "NV",
    email: "nova.vega@example.com",
    type: "video",
    direction: "outgoing",
    status: "answered",
    time: "Today, 10:14 AM",
    duration: "05:08 mins",
  },

  // ── Additional context entries (varied) ───────────────────────────────
  {
    id: "call_c2",
    name: "Atlas Crew",
    avatar: "AC",
    email: "crew@atlas.co",
    type: "video",
    direction: "incoming",
    status: "answered",
    time: "Monday, 11:48 AM",
    duration: "22:07 mins",
  },
  {
    id: "call_a2",
    name: "+1 (415) 555-0142",
    avatar: "?",
    subtitle: "Unknown — possible spam",
    isUnknown: true,
    type: "voice",
    direction: "incoming",
    status: "missed",
    time: "Yesterday, 4:31 PM",
  },
  {
    id: "call_d2",
    name: "Kairo Sato",
    avatar: "KS",
    email: "kairo.sato@example.com",
    type: "voice",
    direction: "outgoing",
    status: "answered",
    time: "Yesterday, 2:17 PM",
    duration: "08:13 mins",
  },
  {
    id: "call_b2",
    name: "Vault 0x9",
    avatar: "V9",
    email: "vault0x9@proton.me",
    type: "voice",
    direction: "outgoing",
    status: "missed",
    time: "Sunday, 9:40 AM",
  },
  {
    id: "call_a3",
    name: "Echo Network",
    avatar: "EN",
    email: "hello@echonetwork.app",
    type: "video",
    direction: "incoming",
    status: "missed",
    time: "Sunday, 1:05 PM",
  },
];
