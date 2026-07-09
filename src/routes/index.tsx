import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { z } from "zod";
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
import { ChatFAB } from "#/components/chat/ChatListItem";

/**
 * Search-param schema for the home route (`/`).
 *
 * The active view switcher (Chats / Updates / Communities / Calls) is now
 * persisted in the URL via the `tab` query parameter rather than local
 * component state. This guarantees the selection survives cross-route
 * navigation (e.g. entering `/chat/$id` and tapping a nav tab routes back to
 * `/?tab=<key>` with the correct target, instead of hard-resetting to the
 * default "chats" view).
 *
 * `.default("chats")` makes the parameter **optional on input** (so bare `/`
 * and `<Link to="/" search={{}}>` both type-check and resolve to "chats") but
 * **always present on output**, so `Route.useSearch().tab` is a non-nullable
 * `TabKey` at every consumer.
 */
const tabSearchSchema = z.object({
  tab: z.enum(["chats", "updates", "communities", "calls"]).default("chats"),
});

export const Route = createFileRoute("/")({
  validateSearch: tabSearchSchema,
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
  // Single source of truth for the active view — read directly from the URL
  // search params (validated + defaulted to "chats" by `tabSearchSchema`).
  const { tab: activeTab } = Route.useSearch();
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
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={searchPlaceholder}
        FAB={activeTab === "calls" ? <CallsFAB /> : activeTab === "chats" ? <ChatFAB /> : null}
        onOpenSettings={() => setSettingsOpen(true)}
      >
        {activeTab === "chats" && <ChatList chats={filteredChats} />}
        {activeTab === "updates" && <Updates search={search} />}
        {activeTab === "communities" && (
          <Communities search={search} onOpen={() => void 0} />
        )}
        {activeTab === "calls" && <Calls calls={filteredCalls} />}
      </Layout>
      <CallOverlay />
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </CallSessionProvider>
  );
}