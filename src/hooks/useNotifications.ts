import { useRouter } from "@tanstack/react-router";
import type { RouterContext, Notifications } from "@/router";
import type { TabKey } from "@/types/chat";

/**
 * Reads the globally-computed notification counters from the TanStack
 * Router context. The values are calculated once in `getRouter()` (see
 * `src/router.tsx`) from the canonical mock datasets and stored on
 * `router.options.context.notifications`, so every consumer — the home
 * list, the `/chat/$id` route's own `MobileTabBar`, the desktop nav rail —
 * observes the exact same numbers without prop drilling or per-route
 * recompute.
 *
 * Use {@link useNavBadges} when you need the `Record<TabKey, number>`
 * shape consumed by the tab UI; use this hook directly when you need the
 * raw counters (e.g. document titles, settings rows).
 */
export function useNotifications(): Notifications {
  return useRouter().options.context.notifications;
}

/**
 * Convenience wrapper that maps the two notification counters onto the
 * four-slot `TabKey` badge shape used by `MobileTabBar` and
 * `DesktopNavRail`. `updates` and `communities` are intentionally `0`;
 * only the counters with real mock data backing them are surfaced.
 */
export function useNavBadges(): Record<TabKey, number> {
  const { chatsUnreadCount, callsMissedCount } = useNotifications();
  return {
    chats: chatsUnreadCount,
    updates: 0,
    communities: 0,
    calls: callsMissedCount,
  };
}

export type { RouterContext, Notifications };