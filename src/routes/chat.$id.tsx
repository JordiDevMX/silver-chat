import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";
import { mockChats } from "@/data/mockChats";
import { getMessages } from "@/data/mockMessages";
import type { Msg } from "@/types/chat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatComposer } from "@/components/chat/ChatComposer";

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
  loader: ({ params }) => {
    const chat = mockChats.find((c) => c.id === params.id);
    if (!chat) throw notFound();
    return { chat };
  },
  component: ChatView,
});

function ChatView() {
  const { chat } = Route.useLoaderData();
  const initial = useMemo(() => getMessages(chat.id), [chat.id]);
  const [messages, setMessages] = useState<Msg[]>(initial);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  function handleSend(text: string) {
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${prev.length + 1}-${now.getTime()}`,
        text,
        time,
        fromSelf: true,
        status: "sent",
      },
    ]);
  }

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
              {chat.online && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-neon ring-2 ring-background shadow-glow" />
              )}
            </div>
            <div className="flex-1 min-w-0 ml-1">
              <h2 className="text-sm font-semibold truncate">{chat.name}</h2>
              <p className="text-[11px] text-muted-foreground truncate">
                {chat.online ? <span className="text-neon">online</span> : "last seen recently"}
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

        <main className="flex-1 overflow-y-auto px-3 py-4 space-y-2 bg-[radial-gradient(circle_at_top,hsl(var(--silver-light)/0.4),transparent_60%)]">
          <div className="flex justify-center">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-card/70 border border-border rounded-full px-3 py-0.5">
              End-to-end encrypted
            </span>
          </div>
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          <div ref={endRef} />
        </main>

        <ChatComposer onSend={handleSend} />
      </div>
    </div>
  );
}
