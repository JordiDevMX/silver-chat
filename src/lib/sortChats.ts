import type { Chat } from "@/types/chat";

/**
 * Deterministic two-tier sort for the chat list.
 *
 *  Tier 1 — Pinned priority: any chat where `isPinned === true` bubbles
 *  to the absolute top, rendering ahead of all non-pinned chats.
 *
 *  Tier 2 — Chronological: within each pinned tier, chats are ordered
 *  by their `timestamp` field (epoch-ms of the latest message) in
 *  descending order, so the most recent activity stays on top.
 *
 *  The function is non-mutating — it returns a new sorted array,
 *  leaving the input order intact.
 */
export function sortChats(chats: readonly Chat[]): Chat[] {
  return chats.slice().sort((a, b) => {
    const aPinned = a.isPinned === true;
    const bPinned = b.isPinned === true;
    if (aPinned !== bPinned) return aPinned ? -1 : 1;
    const aTs = a.timestamp ?? 0;
    const bTs = b.timestamp ?? 0;
    return bTs - aTs;
  });
}