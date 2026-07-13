import { useTranslation } from "react-i18next";
import type { ChatFilter } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ChatFilterBarProps {
  /** Currently active filter — drives which pill gets the accent fill. */
  active: ChatFilter;
  /** Called with the new filter key when the user taps a pill. */
  onChange: (next: ChatFilter) => void;
}

const FILTER_ORDER: ChatFilter[] = ["all", "favorites", "unread", "groups"];

/**
 * Horizontal, scrollable filter pill bar rendered above the chat list on
 * the home **Chats** tab only. Sits visually between the search input
 * (owned by `AppHeader`) and the scrollable conversation list.
 *
 * Visual language mirrors the active-state tokens used by `MobileTabBar`
 * and `DesktopNavRail`: the active pill takes the neon gradient fill +
 * glow shadow; inactive pills are subtle frosted cards that lift on
 * hover. Horizontally scrollable so the row never clips on narrow
 * viewports, with the scrollbar hidden (same utility pattern as the
 * `Updates` stories rail).
 *
 * Purely presentational — filtering + sorting live in the route's
 * `useMemo` pipeline (`applyChatFilter` → `sortChats`).
 */
export function ChatFilterBar({ active, onChange }: ChatFilterBarProps) {
  const { t } = useTranslation();
  return (
    <div
      role="tablist"
      aria-label={t("chat.filter.label")}
      className={cn(
        "flex items-center gap-2 overflow-x-auto px-4 py-2",
        "[&::-webkit-scrollbar]:hidden [scrollbar-width:none]",
      )}
    >
      {FILTER_ORDER.map((filter) => {
        const isActive = active === filter;
        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
              "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "active:scale-95",
              isActive
                ? "bg-gradient-neon text-primary-foreground shadow-glow border border-transparent"
                : "bg-card/60 border border-border text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {t(`chat.filter.${filter}`)}
          </button>
        );
      })}
    </div>
  );
}