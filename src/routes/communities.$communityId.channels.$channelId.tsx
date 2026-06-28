import { Fragment, useEffect, useMemo, useRef } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MoreVertical, Users, Megaphone, Pin } from "lucide-react";
import { communities } from "@/data/mockCommunities";
import { getMessages } from "@/data/mockMessages";
import type { Msg } from "@/types/chat";
import type { Community, SubChannel } from "@/types/community";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { useChatMessages, messagesQueryKey } from "@/hooks/useChatMessages";
import { formatMessageDate, isSameDay } from "@/lib/format";

export const Route = createFileRoute("/communities/$communityId/channels/$channelId")({
  head: ({ params }) => {
    const community = communities.find((c) => c.id === params.communityId);
    const channel = community?.channels.find((ch) => ch.id === params.channelId);
    const title = channel
      ? `${channel.name} — ${community?.name ?? "Community"} · SilverChat`
      : "Community · SilverChat";
    return {
      meta: [
        { title },
        {
          name: "description",
          content: channel
            ? `${channel.name} channel in ${community?.name ?? "community"} on SilverChat.`
            : "Community channel on SilverChat.",
        },
      ],
    };
  },
  loader: ({ params, context }) => {
    const community = communities.find((c) => c.id === params.communityId);
    if (!community) throw notFound();
    const channel = community.channels.find((ch) => ch.id === params.channelId);
    if (!channel) throw notFound();
    // Prefetch the channel's message thread into the react-query cache so
    // the first paint after navigation has data ready — same pattern as
    // routes/chat.$id.tsx.
    context.queryClient.setQueryData(
      messagesQueryKey(params.channelId),
      getMessages(params.channelId),
    );
    return { community, channel };
  },
  component: ChannelView,
});

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

interface ChannelViewProps {
  community: Community;
  channel: SubChannel;
}

function ChannelView() {
  const { community, channel }: ChannelViewProps = Route.useLoaderData();
  const { messages, isLoading, send, isSending } = useChatMessages(channel.id);
  const endRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => groupByDate(messages), [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [groups]);

  const isAnn = channel.type === "announcements";

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
              {isAnn ? (
                <div className="h-10 w-10 rounded-full bg-gradient-silver border border-border grid place-items-center shadow-silver">
                  <Megaphone className="h-4 w-4 text-[var(--neon)]" />
                </div>
              ) : (
                <div
                  className="h-10 w-10 rounded-full border border-border"
                  style={{ background: channel.avatarGradient }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0 ml-1">
              <h2 className="text-sm font-semibold truncate flex items-center gap-1.5">
                {channel.name}
                {isAnn ? <Pin className="h-3 w-3 text-muted-foreground" /> : null}
              </h2>
              <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                <Users className="h-3 w-3 shrink-0" />
                <span className="truncate">{community.name}</span>
              </p>
            </div>
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
          aria-label={`Messages in ${channel.name}`}
          aria-live="polite"
          aria-relevant="additions"
          className="flex-1 overflow-y-auto px-3 py-4 space-y-2 bg-[radial-gradient(circle_at_top,hsl(var(--silver-light)/0.4),transparent_60%)]"
        >
          {isLoading ? (
            <div className="h-full grid place-items-center text-xs text-muted-foreground">
              Loading channel…
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-card/70 border border-border rounded-full px-3 py-0.5">
                  {isAnn ? "Announcements" : community.name}
                </span>
              </div>
              {groups.map((group) => (
                <Fragment key={group.key}>
                  <DateSeparator label={group.label} />
                  {group.messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </Fragment>
              ))}
              <div ref={endRef} />
            </>
          )}
        </main>

        {/* Announcements are read-only in the mock model — composer is
            disabled but kept mounted so the layout never reflows. */}
        <ChatComposer onSend={send} disabled={isSending || isAnn} />
      </div>
    </div>
  );
}
