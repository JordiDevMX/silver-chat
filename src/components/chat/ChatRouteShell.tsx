import type { ReactNode } from "react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
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
  badges?: Partial<Record<TabKey, number>>;
  onOpenSettings?: () => void;
  /** The conversation pane (rendered in the right slot). */
  conversation: ReactNode;
  /** Optional aside (members, context). Shown on xl+. */
  aside?: ReactNode;
}

/**
 * Responsive shell for the `/chat/$id` route.
 *
 *  - Mobile (< md): the conversation fills the screen. The mobile tab bar
 *    is mounted at the bottom. Tapping any tab routes back to `/`.
 *  - Tablet+ (md – xl): two columns — chat list + active conversation.
 *    The desktop left rail is rendered.
 *  - Desktop (>= xl): three columns — chat list + conversation + aside.
 */
export function ChatRouteShell({
  activeChat,
  chats,
  search,
  onSearchChange,
  activeTab,
  onTabChange,
  badges,
  onOpenSettings,
  conversation,
  aside,
}: ChatRouteShellProps) {
  const isMobile = useIsMobile();
  const [mobileOpen] = useState(false);

  return (
    <div className="h-svh w-full overflow-hidden bg-background text-foreground flex justify-center">
      <div
        className={[
          "relative flex h-full w-full flex-col bg-background",
          // Tablet: centered phone-like surface.
          "md:rounded-3xl md:my-3 md:max-w-[min(100vw-1.5rem,28rem)] md:border md:border-border/60 md:shadow-silver",
          // Desktop: full-bleed inside a soft container with rounded corners.
          "lg:rounded-3xl lg:max-w-none lg:mx-3 lg:my-3 lg:flex-row",
        ].join(" ")}
      >
        {!isMobile ? (
          <DesktopNavRail
            active={activeTab}
            onChange={onTabChange}
            badges={badges}
            onOpenSettings={onOpenSettings}
          />
        ) : null}

        <div
          className={[
            "relative flex min-w-0 flex-1 flex-col overflow-hidden",
            "lg:rounded-l-3xl",
          ].join(" ")}
        >
          <ResponsiveSplit
            sidebar={
              <div className="flex h-full min-h-0 w-full flex-col">
                <PaneHeader
                  search={search}
                  onSearchChange={onSearchChange}
                  placeholder="Search conversations…"
                />
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <ChatListPane chats={chats} activeId={activeChat?.id} />
                </div>
              </div>
            }
            main={conversation}
            aside={aside}
          />
        </div>

        {/* Mobile bottom tab bar — only when no chat is open OR the user is
            navigating back to the list. We render it always on mobile so the
            user can jump tabs at any time. */}
        {isMobile ? (
          <MobileTabBar active={activeTab} onChange={onTabChange} badges={badges} />
        ) : null}

        {/* Reserved for future mobile slide-over of the chat list. */}
        <span data-mobile-list-open={mobileOpen} className="hidden" aria-hidden />
      </div>
    </div>
  );
}
