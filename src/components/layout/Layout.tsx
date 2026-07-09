import type { ReactNode } from "react";
import type { TabKey } from "@/types/chat";
import {
  ResponsiveShell,
} from "@/components/layout/ResponsiveShell";

interface LayoutProps {
  children: ReactNode;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  FAB?: ReactNode;
  onOpenSettings?: () => void;
}

/**
 * Public façade preserved from the original `Layout` API so existing routes
 * keep working unchanged. The implementation now delegates to the new
 * `ResponsiveShell` — a single source of truth for breakpoint behaviour,
 * which is driven by the `useIsMobile` hook.
 *
 * The previous `badges` prop has been removed: notification counters now
 * flow through the TanStack Router context (see `useNotifications`) and
 * are read directly by `MobileTabBar` / `DesktopNavRail`, so neither this
 * shell nor its callers need to thread them anymore.
 */
export function Layout(props: LayoutProps) {
  const {
    children,
    activeTab,
    onTabChange,
    search,
    onSearchChange,
    searchPlaceholder,
    FAB,
    onOpenSettings,
  } = props;

  return (
    <ResponsiveShell
      header={{
        search,
        onSearchChange,
        placeholder: searchPlaceholder,
        onOpenSettings,
      }}
      mobileTabs={{ active: activeTab, onChange: onTabChange }}
      desktopRail={{ active: activeTab, onChange: onTabChange, onOpenSettings }}
      FAB={FAB}
    >
      {children}
    </ResponsiveShell>
  );
}