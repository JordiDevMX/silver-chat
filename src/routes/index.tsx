import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout/Layout";
import { ChatList } from "@/components/chat/ChatList";
import { Updates } from "@/components/updates/Updates";
import { Communities } from "@/components/communities/Communities";
import { Calls, CallsFAB } from "@/components/calls/Calls";
import { CallOverlay } from "@/components/calls/CallOverlay";
import { CallSessionProvider } from "@/hooks/useCallSession";
import { SettingsSheet } from "@/components/settings/SettingsSheet";
import { mockChats } from "@/data/mockChats";
import { mockCalls } from "@/data/mockCalls";
import type { TabKey } from "@/types/chat";
import { ChatFAB } from "#/components/chat/ChatListItem";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SilverChat — Futuristic messaging" },
      { name: "description", content: "A sleek, silver-and-neon messaging experience." },
      { property: "og:title", content: "SilverChat" },
      { property: "og:description", content: "A sleek, silver-and-neon messaging experience." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("chats");
  const [communitiesOpen, setCommunitiesOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const filteredChats = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mockChats;
    return mockChats.filter(
      (c) => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q),
    );
  }, [search]);

  const filteredCalls = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mockCalls;
    return mockCalls.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.email && c.email.toLowerCase().includes(q)),
    );
  }, [search]);

  const searchPlaceholder =
    activeTab === "calls"
      ? t("search.calls")
      : activeTab === "updates"
        ? t("search.updates")
        : activeTab === "communities"
          ? t("search.communities")
          : t("search.conversations");

  return (
    <CallSessionProvider>
      <Layout
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setCommunitiesOpen(false);
        }}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={searchPlaceholder}
        FAB={activeTab === "calls" ? <CallsFAB /> : activeTab === "chats" ? <ChatFAB /> : null}
        onOpenSettings={() => setSettingsOpen(true)}
      >
        {activeTab === "chats" && <ChatList chats={filteredChats} />}
        {activeTab === "updates" && <Updates search={search} />}
        {activeTab === "communities" && !communitiesOpen && (
          <Communities search={search} onOpen={() => void 0} />
        )}
        {/* Open communities chats logic (works for everything else)
        {activeTab === "communities" && !communitiesOpen && (
          <Communities onOpen={() => setCommunitiesOpen(true)} />
        )}

        {/* {activeTab === "communities" && communitiesOpen && (
          <div className="px-6 py-16 text-center text-sm text-muted-foreground">
            <p className="capitalize text-foreground font-medium mb-1">{activeTab}</p>
            <p>Coming soon.</p>
          </div>
        )} */}
        {activeTab === "calls" && <Calls calls={filteredCalls} />}
      </Layout>
      <CallOverlay />
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </CallSessionProvider>
  );
}
