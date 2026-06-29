import type { ReactNode } from "react";
import type { TabKey } from "@/types/chat";
import {
  ResponsiveShell,
} from "@/components/layout/ResponsiveShell";

interface LayoutProps {
  children: ReactNode;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  badges?: Partial<Record<TabKey, number>>;
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
 */
export function Layout(props: LayoutProps) {
  const {
    children,
    activeTab,
    onTabChange,
    badges,
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
      mobileTabs={{ active: activeTab, onChange: onTabChange, badges }}
      desktopRail={{ active: activeTab, onChange: onTabChange, badges, onOpenSettings }}
      FAB={FAB}
    >
      {children}
    </ResponsiveShell>
  );
}
