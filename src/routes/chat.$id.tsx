import { Fragment, useEffect, useMemo, useRef } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";
import { mockChats } from "@/data/mockChats";
import { getMessages } from "@/data/mockMessages";
import type { Chat, Msg } from "@/types/chat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { useChatMessages, messagesQueryKey } from "@/hooks/useChatMessages";
import { formatMessageDate, isSameDay } from "@/lib/format";

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

interface DateGroup {
  key: string;
  date: Date;
  label: string;
  messages: Msg[];
}

function groupByDate(messages: Msg[]): DateGroup[] {
  const groups: DateGroup[] = [];
  for (const message of messages) {
    const last = groups[groups.length - 1];
    if (last && isSameDay(last.date, message.date)) {
      last.messages.push(message);
    } else {
      groups.push({
        key: message.date.toISOString(),
        date: message.date,
        label: formatMessageDate(message.date),
        messages: [message],
      });
    }
  }
  return groups;
}

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex justify-center my-2" role="presentation">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-card/70 border border-border rounded-full px-3 py-0.5">
        {label}
      </span>
    </div>
  );
}

function ChatView() {
  const { chat }: ChatViewProps = Route.useLoaderData();
  const { messages, isLoading, send, isSending } = useChatMessages(chat.id);
  const endRef = useRef<HTMLDivElement>(null);
  const isGroup = chat.isGroup === true;

  const groups = useMemo(() => groupByDate(messages), [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [groups]);

  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center">
      <div className="relative w-full max-w-md min-h-screen flex flex-col bg-background shadow-silver">
        <header className="sticky top-0 z-30 bg-gradient-silver border-b border-border/60 backdrop-blur-xl shadow-silver">
          <div className="flex items-center gap-2 px-2 py-3">
            <Link
              to="/"
              aria-label="Back"
              className="h-9 w-9 grid place-items-center rounded-full hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="relative shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-silver border border-border grid place-items-center text-xs font-semibold text-foreground/80 shadow-silver">
                {chat.avatar}
              </div>
              {chat.isOnline && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-neon ring-2 ring-background shadow-glow" />
              )}
            </div>
            <div className="flex-1 min-w-0 ml-1">
              <h2 className="text-sm font-semibold truncate">{chat.name}</h2>
              <p className="text-[11px] text-muted-foreground truncate">
                {chat.isOnline ? <span className="text-neon">online</span> : "last seen recently"}
              </p>
            </div>
            <button
              type="button"
              aria-label="Video call"
              className="h-9 w-9 grid place-items-center rounded-full hover:bg-accent transition-colors"
            >
              <Video className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Voice call"
              className="h-9 w-9 grid place-items-center rounded-full hover:bg-accent transition-colors"
            >
              <Phone className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="More"
              className="h-9 w-9 grid place-items-center rounded-full hover:bg-accent transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main
          aria-label={`Messages with ${chat.name}`}
          aria-live="polite"
          aria-relevant="additions"
          className="flex-1 overflow-y-auto px-3 py-4 space-y-2 bg-[radial-gradient(circle_at_top,hsl(var(--silver-light)/0.4),transparent_60%)]"
        >
          {isLoading ? (
            <div className="h-full grid place-items-center text-xs text-muted-foreground">
              Loading conversation…
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-card/70 border border-border rounded-full px-3 py-0.5">
                  End-to-end encrypted
                </span>
              </div>
              {groups.map((group) => (
                <Fragment key={group.key}>
                  <DateSeparator label={group.label} />
                  {group.messages.map((message, index) => {
                    const previous = group.messages[index - 1];
                    const showSender =
                      isGroup &&
                      !message.fromSelf &&
                      message.senderName !== undefined &&
                      (previous === undefined ||
                        previous.fromSelf ||
                        previous.senderName !== message.senderName);
                    return (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        showSender={showSender}
                      />
                    );
                  })}
                </Fragment>
              ))}
              <div ref={endRef} />
            </>
          )}
        </main>

        <ChatComposer onSend={send} disabled={isSending} />
      </div>
    </div>
  );
}
