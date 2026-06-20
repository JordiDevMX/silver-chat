import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import type { TabKey } from "@/types/chat";

interface LayoutProps {
  children: ReactNode;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  badges?: Partial<Record<TabKey, number>>;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  floating?: ReactNode;
}

export function Layout({
  children,
  activeTab,
  onTabChange,
  badges,
  search,
  onSearchChange,
  searchPlaceholder,
  floating,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center">
      <div className="relative w-full max-w-md min-h-screen flex flex-col bg-background shadow-silver">
        <Header search={search} onSearchChange={onSearchChange} placeholder={searchPlaceholder} />
        <main className="flex-1 overflow-y-auto">{children}</main>
        {floating}
        <Footer active={activeTab} onChange={onTabChange} badges={badges} />
      </div>
    </div>
  );
}
