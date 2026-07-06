import type { Call } from "@/types/call";
import sungJinwooAvatar from "@/assets/images/avatars/mocks/sung-jinwoo.webp?url";

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
 *
 * Every entry below is linked to a chat thread in src/data/mockChats.ts
 * (ids 17–33) and to an active conversation in src/data/mockMessages.ts.
 * Five legacy entries (Orion Labs, Nova Vega, Kairo Sato, Vault 0x9, Echo
 * Network) were renamed to fresh handles so the sidebar has zero name
 * collisions with the pre-existing text chats (ids 2/5/6/8/9).
 */
export const mockCalls: Call[] = [
  // ── Scenario C — Answered Incoming (voice, long) ───────────────────────
  {
    id: "call_c1",
    name: "Lyra Chen",
    // Real profile image — surfaces the image variant in the calls list.
    avatarUrl: sungJinwooAvatar,
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
    name: "Orion Stratos",
    email: "orbit@orion-stratos.io",
    type: "voice",
    direction: "incoming",
    status: "missed",
    time: "Today, 11:24 AM",
  },

  // ── Scenario B — Unanswered Outgoing (voice, rejected) ─────────────────
  {
    id: "call_b1",
    name: "Rin Akiyama",
    email: "rin.akiyama@example.com",
    type: "voice",
    direction: "outgoing",
    status: "rejected",
    time: "Today, 8:31 AM",
  },

  // ── Scenario D — Answered Outgoing (video, short) ──────────────────────
  {
    id: "call_d1",
    name: "Vega Solis",
    email: "vega@stellar.mesh",
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
    subtitle: "Unknown — possible spam",
    isUnknown: true,
    type: "voice",
    direction: "incoming",
    status: "missed",
    time: "Yesterday, 4:31 PM",
  },
  {
    id: "call_d2",
    name: "Kairo Nexus",
    email: "kairo@nexus.relay",
    type: "voice",
    direction: "outgoing",
    status: "answered",
    time: "Yesterday, 2:17 PM",
    duration: "08:13 mins",
  },
  {
    id: "call_b2",
    name: "Vault Helix",
    email: "vault@helix.dark",
    type: "voice",
    direction: "outgoing",
    status: "missed",
    time: "Sunday, 9:40 AM",
  },
  {
    id: "call_a3",
    name: "Echo Cascade",
    email: "echo@cascade.sig",
    type: "video",
    direction: "incoming",
    status: "missed",
    time: "Sunday, 1:05 PM",
  },

  // ── 3 brand-new video call scenarios (fresh handles) ──────────────────
  {
    id: "call_video_missed",
    name: "Zara Vex",
    email: "zara.vex@quantum.net",
    type: "video",
    direction: "incoming",
    status: "missed",
    time: "Today, 3:47 PM",
  },
  {
    id: "call_video_answered",
    name: "Aria Cipher",
    email: "aria@neonmail.io",
    type: "video",
    direction: "incoming",
    status: "answered",
    time: "Today, 11:08 AM",
    duration: "08:34 mins",
  },
  {
    id: "call_video_unanswered",
    name: "Nyx Protocol",
    email: "nyx@protocol.dht",
    type: "video",
    direction: "outgoing",
    status: "rejected",
    time: "Today, 4:22 PM",
  },
];
