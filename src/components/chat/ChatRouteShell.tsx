import type { ReactNode } from "react";
import { useState } from "react";
import { useIsDesktop } from "@/hooks/use-mobile";
import { ResponsiveSplit } from "@/components/layout/ResponsiveShell";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { DesktopNavRail } from "@/components/layout/DesktopNavRail";
import { PaneHeader } from "@/components/layout/PaneHeader";
import { ChatListPane } from "@/components/chat/ChatListPane";
import type { Chat, TabKey } from "@/types/chat";

interface ChatRouteShellProps {
  /** The currently active conversation (if any). */
  activeChat?: Chat;
  /** Source list of all chats for the desktop sidebar. */
  chats: Chat[];
  /** Search input value & handler. */
  search: string;
  onSearchChange: (value: string) => void;
  /** Top-level tab bar state. */
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onOpenSettings?: () => void;
  /** The conversation pane (rendered in the right slot). */
  conversation: ReactNode;
  /** Optional aside (members, context). Shown on xl+. */
  aside?: ReactNode;
}

/**
 * Responsive shell for the `/chat/$id` route.
 *
 * Breakpoints:
 *  - <  lg (<1024px)  : Single full-viewport column. Bottom tab bar mounted
 *                       (covers mobile + tablet). Tapping any tab routes
 *                       back to `/`.
 *  - >= lg (>=1024px) : Two-column layout (vertical nav rail + main content
 *                       area) edge-to-edge, no rounded surface, no shadow,
 *                       no inset margins.
 *  - >= xl (>=1280px) : Optional right aside (members, context) joins the
 *                       split — `ResponsiveSplit` reveals it.
 *
 * Notification badges are intentionally NOT accepted as a prop anymore —
 * `MobileTabBar` and `DesktopNavRail` read them directly from the global
 * router context (`useNotifications`), so this shell no longer has to (and
 * historically didn't, which is why badges vanished on this route). The
 * counters therefore stay perfectly persistent and synchronized as the user
 * navigates between the home list and an active conversation.
 */
export function ChatRouteShell({
  activeChat,
  chats,
  search,
  onSearchChange,
  activeTab,
  onTabChange,
  onOpenSettings,
  conversation,
  aside,
}: ChatRouteShellProps) {
  const isDesktop = useIsDesktop();
  const [mobileOpen] = useState(false);

  return (
    <div className="h-svh w-full overflow-hidden bg-background text-foreground flex justify-center">
      <div
        className={[
          "relative flex h-full w-full flex-col bg-background",
          // >= md: edge-to-edge two-column layout — no rounded surface, no
          // shadow, no inset margins, no max-width clamp. The conversation
          // pane stretches to fill the available width.
          "md:flex-row",
        ].join(" ")}
      >
        {isDesktop ? (
          <DesktopNavRail
            active={activeTab}
            onChange={onTabChange}
            onOpenSettings={onOpenSettings}
          />
        ) : null}

        <div
          className={[
            "relative flex min-w-0 flex-1 flex-col overflow-hidden",
          ].join(" ")}
        >
          <ResponsiveSplit
            className="flex-1 min-h-0"
            sidebar={
              <div className="flex h-full min-h-0 w-full flex-col">
                <PaneHeader
                  search={search}
                  onSearchChange={onSearchChange}
                  onOpenSettings={onOpenSettings}
                />
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <ChatListPane chats={chats} activeId={activeChat?.id} />
                </div>
              </div>
            }
            main={conversation}
            aside={aside}
          />

          {/* Mobile/tablet bottom tab bar — mounted as a child of the main
              column so it always sits at the bottom of the content stack,
              regardless of whether the outer wrapper is `flex-col` (mobile)
              or `flex-row` (tablet). Badges self-source from the router
              context, so they render identically here and on the home view. */}
          {!isDesktop ? (
            <MobileTabBar active={activeTab} onChange={onTabChange} />
          ) : null}
        </div>

        {/* Reserved for future mobile slide-over of the chat list. */}
        <span data-mobile-list-open={mobileOpen} className="hidden" aria-hidden />
      </div>
    </div>
  );
}
