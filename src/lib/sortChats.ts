import type { Chat, ChatFilter } from "@/types/chat";

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

/**
 * Apply a {@link ChatFilter} predicate to a chat array. Non-mutating.
 *
 *  - `favorites` : `isFavorite === true`
 *  - `unread`    : `unread > 0`
 *  - `groups`    : `isGroup === true`
 *  - `all`       : identity (no filtering)
 *
 * Intended to run BEFORE `sortChats` so the pinned-priority + chronological
 * sort still applies within the narrowed slice. Missing `isFavorite` /
 * `isGroup` coerce to `false`; `unread` defaults to `0` per the Chat type.
 */
export function applyChatFilter(chats: readonly Chat[], filter: ChatFilter): Chat[] {
  switch (filter) {
    case "favorites":
      return chats.filter((c) => c.isFavorite === true);
    case "unread":
      return chats.filter((c) => c.unread > 0);
    case "groups":
      return chats.filter((c) => c.isGroup === true);
    case "all":
    default:
      return chats.slice();
  }
}