import type { ReactNode } from "react";
import type { TabKey } from "@/types/chat";
import {
  ResponsiveShell,
} from "@/components/layout/ResponsiveShell";

interface LayoutProps {
  children: ReactNode;
  activeTab: TabKey;
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
 * The `onTabChange` callback has been removed: tab switching is now driven
 * by URL search params (`/?tab=<key>`). `MobileTabBar` and `DesktopNavRail`
 * self-navigate via TanStack Router `<Link>`, so neither this shell nor its
 * callers need to thread a change handler anymore. `activeTab` is still
 * accepted (read from `Route.useSearch()` on the home route) for highlight
 * state and content selection.
 */
export function Layout(props: LayoutProps) {
  const {
    children,
    activeTab,
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
      mobileTabs={{ active: activeTab }}
      desktopRail={{ active: activeTab, onOpenSettings }}
      FAB={FAB}
    >
      {children}
    </ResponsiveShell>
  );
}