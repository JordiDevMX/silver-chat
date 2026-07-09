import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient } from "@tanstack/react-query";
import { mockChats } from "@/data/mockChats";
import { mockCalls } from "@/data/mockCalls";

/**
 * Globally-accessible notification counters.
 *
 * Computed once at router creation from the canonical mock datasets and
 * injected into the TanStack Router context, so every route (and every
 * shell component under it) reads the same source of truth via
 * `useRouter().context.notifications` — no prop drilling, no per-route
 * recompute, and no divergence between the home list view and the
 * `/chat/$id` route's own `MobileTabBar` instance.
 */
export interface Notifications {
  /** Sum of `Chat.unread` across every row in `mockChats`. */
  chatsUnreadCount: number;
  /** Number of entries in `mockCalls` whose `status === "missed"`. */
  callsMissedCount: number;
}

/**
 * Pure derivation from the mock datasets. Kept as a standalone function so
 * the calculation is unit-testable in isolation and stays decoupled from
 * router construction.
 */
export function computeNotifications(): Notifications {
  const chatsUnreadCount = mockChats.reduce((sum, chat) => sum + chat.unread, 0);
  const callsMissedCount = mockCalls.filter((call) => call.status === "missed").length;
  return { chatsUnreadCount, callsMissedCount };
}

/** Shape of the value stored on `router.context` and made available to
 *  every route via `Route.useRouteContext()` / `useRouter().context`. */
export interface RouterContext {
  queryClient: QueryClient;
  notifications: Notifications;
}

export const getRouter = () => {
  const queryClient = new QueryClient();
  const notifications = computeNotifications();

  const router = createRouter({
    routeTree,
    context: { queryClient, notifications },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}