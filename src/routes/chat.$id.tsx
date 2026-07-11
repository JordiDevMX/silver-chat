import { useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { mockChats, togglePin } from "@/data/mockChats";
import { getMessages } from "@/data/mockMessages";
import { messagesQueryKey } from "@/hooks/useChatMessages";
import { ChatRouteShell } from "@/components/chat/ChatRouteShell";
import { ChatLayout } from "@/components/chat/ChatLayout";
import type { ChatLayoutType } from "@/components/chat/ChatLayout";
import { SettingsSheet } from "@/components/settings/SettingsSheet";
import { sortChats } from "@/lib/sortChats";
import type { Chat } from "@/types/chat";

export const Route = createFileRoute("/chat/$id")({
  head: ({ params }) => {
    const chat = mockChats.find((c) => c.id === params.id);
    const title = chat ? `${chat.name} — SilverChat` : "SilverChat";
    return {
      meta: [
        { title },
        {
          name: "description",
          content: "Encrypted conversation on SilverChat.",
        },
      ],
    };
  },
  loader: ({ params, context }) => {
    const chat = mockChats.find((c) => c.id === params.id);
    if (!chat) throw notFound();
    context.queryClient.setQueryData(messagesQueryKey(params.id), getMessages(params.id));
    return { chat };
  },
  component: ChatView,
});

interface ChatViewProps {
  chat: Chat;
}

// Sort once at module level — the chat list in the sidebar is static
// at this route (no search filter here yet), so the sort doesn't need
// to re-compute on every render.
const sortedChats = sortChats(mockChats);

function ChatView() {
  const { chat }: ChatViewProps = Route.useLoaderData();
  const { t } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const layoutType: ChatLayoutType = chat.isGroup ? "group" : "dm";

  return (
    <>
      <ChatRouteShell
        activeChat={chat}
        chats={sortedChats}
        search=""
        onSearchChange={() => {
          // search is local to /chat/$id; the header for the list lives inside
          // ChatRouteShell's default sidebar, so we accept the value but discard
          // it for now (future: local search filter).
        }}
        activeTab="chats"
        onOpenSettings={() => setSettingsOpen(true)}
        conversation={
          <ChatLayout
            type={layoutType}
            id={chat.id}
            name={chat.name}
            avatarUrl={chat.avatarUrl}
            isOnline={chat.isOnline}
            isPinned={chat.isPinned}
            isMuted={chat.isMuted}
            participants={chat.participants}
            onPinToggle={() => togglePin(chat.id)}
          />
        }
        aside={
          <div className="flex h-full flex-col">
            <div className="border-b border-border/60 bg-gradient-silver/60 px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {t("meta.conversationDetails")}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 text-sm text-muted-foreground">
              <p>{t("meta.comingSoonAside")}</p>
            </div>
          </div>
        }
      />
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}