import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { ChatList } from "@/components/chat/ChatList";
import { NewChatFAB } from "@/components/chat/NewChatFAB";
import { Updates } from "@/components/updates/Updates";
import { mockChats } from "@/data/mockChats";
import type { TabKey } from "@/types/chat";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "SilverChat — Futuristic messaging",
      },
      {
        name: "description",
        content: "A sleek, silver-and-neon messaging experience.",
      },
      {
        property: "og:title",
        content: "SilverChat",
      },
      {
        property: "og:description",
        content: "A sleek, silver-and-neon messaging experience.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [activeTab, setActiveTab] = useState<TabKey>("chats");
  const [search, setSearch] = useState("");

  const totalUnread = mockChats.reduce((sum, c) => sum + c.unread, 0);

  const filteredChats = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mockChats;
    return mockChats.filter(
      (c) => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      badges={{ chats: totalUnread, calls: 2 }}
      search={search}
      onSearchChange={setSearch}
    >
      {activeTab === "chats" && <ChatList chats={filteredChats} />}
      {/* {activeTab !== "chats" && ( */}
      {activeTab === "updates" && <Updates />}
      {activeTab !== "chats" && activeTab !== "updates" && (
        <div className="px-6 py-16 text-center text-sm text-muted-foreground">
          <p className="capitalize text-foreground font-medium mb-1">{activeTab}</p>
          <p>Coming soon.</p>
        </div>
      )}
      {activeTab === "chats" && <NewChatFAB />}
    </Layout>
  );
}
