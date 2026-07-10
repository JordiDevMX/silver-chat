import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { communities } from "@/data/mockCommunities";
import { getMessages } from "@/data/mockMessages";
import { messagesQueryKey } from "@/hooks/useChatMessages";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { ChatRouteShell } from "@/components/chat/ChatRouteShell";
import { PaneHeader } from "@/components/layout/PaneHeader";
import { SettingsSheet } from "@/components/settings/SettingsSheet";
import type { Community, SubChannel } from "@/types/community";

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

interface ChannelViewProps {
  community: Community;
  channel: SubChannel;
}

function ChannelView() {
  const { community, channel }: ChannelViewProps = Route.useLoaderData();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Sidebar for the channel route: a compact pane header (scoped to the
  // community) + the channel list of the parent community. Rendered only
  // on md+ inside `ChatRouteShell`'s `ResponsiveSplit`; hidden on mobile,
  // where the back arrow in `ChatLayout`'s header drives navigation.
  const channelSidebar = (
    <div className="flex h-full min-h-0 w-full flex-col">
      <PaneHeader
        search=""
        onSearchChange={() => {}}
        placeholder={community.name}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ul className="flex flex-col">
          {community.channels.map((ch) => {
            const isAnn = ch.type === "announcements";
            const isActive = ch.id === channel.id;
            return (
              <li key={ch.id}>
                <Link
                  to="/communities/$communityId/channels/$channelId"
                  params={{ communityId: community.id, channelId: ch.id }}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    "w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left" +
                    (isActive
                      ? " bg-accent/70"
                      : " hover:bg-accent/60 active:bg-accent")
                  }
                >
                  {isAnn ? (
                    <div className="size-10 shrink-0 rounded-xl bg-gradient-silver border border-border grid place-items-center">
                      <Megaphone className="size-4 text-[var(--neon)]" />
                    </div>
                  ) : (
                    <div
                      className="size-10 shrink-0 rounded-full border border-border"
                      style={{ background: ch.avatarGradient }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {ch.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {ch.lastMessage}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <ChatRouteShell
        activeTab="communities"
        chats={[]}
        search=""
        onSearchChange={() => {}}
        onOpenSettings={() => setSettingsOpen(true)}
        sidebar={channelSidebar}
        conversation={
          <ChatLayout
            type="channel"
            id={channel.id}
            name={channel.name}
            avatarGradient={channel.avatarGradient}
            channelType={channel.type}
            parentName={community.name}
            parentId={community.id}
            isMuted={channel.muted}
          />
        }
      />
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}