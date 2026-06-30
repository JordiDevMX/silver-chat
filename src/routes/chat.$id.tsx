import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { mockChats } from "@/data/mockChats";
import { getMessages } from "@/data/mockMessages";
import { messagesQueryKey } from "@/hooks/useChatMessages";
import { ChatRouteShell } from "@/components/chat/ChatRouteShell";
import { ConversationPane } from "@/components/chat/ConversationPane";
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

function ChatView() {
  const { chat }: ChatViewProps = Route.useLoaderData();
  const navigate = useNavigate();

  return (
    <ChatRouteShell
      activeChat={chat}
      chats={mockChats}
      search=""
      onSearchChange={() => {
        // search is local to /chat/$id; the header for the list lives inside
        // ChatRouteShell, so we accept the value but discard it for now
        // (future: local search filter).
      }}
      activeTab="chats"
      onTabChange={(tab) => {
        if (tab !== "chats") {
          void navigate({ to: "/" });
        }
      }}
      conversation={<ConversationPane chat={chat} />}
      aside={
        <div className="flex h-full flex-col">
          <div className="border-b border-border/60 bg-gradient-silver/60 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Conversation details
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 text-sm text-muted-foreground">
            <p>
              Right rail is reserved for pinned messages, shared media, and member lists. Use ⋯ menu
              to open full context -- Coming Soon --
            </p>
          </div>
        </div>
      }
    />
  );
}
