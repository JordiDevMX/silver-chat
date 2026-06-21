import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { ChatList } from "@/components/chat/ChatList";
import { Updates } from "@/components/updates/Updates";
import { Communities } from "@/components/communities/Communities";
import { Calls, CallsFAB } from "@/components/calls/Calls";
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
  const [activeTab, setActiveTab] = useState<TabKey>("chats");
  const [communitiesOpen, setCommunitiesOpen] = useState(false);
  const [search, setSearch] = useState("");

  const totalUnread = mockChats.reduce((sum, c) => sum + c.unread, 0);

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

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={(t) => {
        setActiveTab(t);
        setCommunitiesOpen(false);
      }}
      badges={{ chats: totalUnread, calls: 2 }}
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder={
        activeTab === "calls" ? "Search calls by name or email..." : "Search conversations…"
      }
      FAB={activeTab === "calls" ? <CallsFAB /> : activeTab === "chats" ? <ChatFAB /> : null}
    >
      {activeTab === "chats" && <ChatList chats={filteredChats} />}
      {activeTab === "updates" && <Updates />}
      {activeTab === "communities" && !communitiesOpen && <Communities onOpen={() => void 0} />}
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
  );
}
