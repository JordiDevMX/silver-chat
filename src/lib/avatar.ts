import type { Chat, User } from "@/types/chat";

/**
 * Derive 1–2 character initials from a display name.
 *
 * Rules:
 *  - Splits on whitespace, takes the first character of each word.
 *  - Caps at 2 characters (so "Mira Kovach" → "MK", "Jordi" → "J").
 *  - Falls back to "?" for empty/whitespace-only names.
 *  - Normalises to uppercase; non-letter leading characters are preserved
 *    as-is (e.g. "+52 33…" → "#" is kept for legacy mock data).
 */
export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0].slice(0, 1) + parts[1].slice(0, 1)).toUpperCase();
}

/**
 * Resolve the "primary" user a chat list row represents.
 *
 *  - For a 1:1 chat, we synthesise a User from the chat name (no separate
 *    participants list in the current mock data).
 *  - For a group chat, we synthesise a User from the group name (which
 *    yields a stable group abbreviation via `getInitials`).
 *
 * This is the only place that decides "who is the avatar for?" — every
 * surface in the app goes through this helper, so the derivation rule
 * has a single source of truth.
 */
export function getChatUser(chat: Chat): User {
  return {
    id: chat.id,
    name: chat.name,
    avatarUrl: chat.avatarUrl,
  };
}

/**
 * Resolve the avatar-relevant fields for a chat.
 *
 * Returns a shape compatible with `<Avatar user={…} />`. Today it's a
 * thin wrapper over `getChatUser`, kept separate so call sites that
 * pass `chat` directly to the component don't need to know about the
 * user derivation.
 */
export function getChatAvatar(chat: Chat): User {
  return getChatUser(chat);
}
