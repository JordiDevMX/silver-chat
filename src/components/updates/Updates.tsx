import { useMemo, useState } from "react";
import {
  Plus,
  Camera,
  Compass,
  BadgeCheck,
  EyeOff,
  ChevronDown,
  Megaphone,
  BellOff,
  Pin,
} from "lucide-react";
import { myStory, friendStories, type Story } from "@/data/mockStories";
import {
  followedChannels,
  discoverChannels,
  type Channel,
  type DiscoverChannel,
} from "@/data/mockChannels";
import { Button } from "@/components/ui/button";

function StoryCard({
  story,
  isMine = false,
  isMuted = false,
}: {
  story: Story;
  isMine?: boolean;
  isMuted?: boolean;
}) {
  const ringClass =
    isMine || story.viewed ? "ring-2 ring-border" : "ring-2 ring-[var(--neon)] shadow-glow";

  return (
    <button
      type="button"
      className="relative shrink-0 w-28 h-44 rounded-2xl overflow-hidden text-left shadow-silver group hover:brightness-110 active:scale-95 transition-all cursor-pointer"
      style={{ background: story.preview }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:bg-white/5 transition-colors" />
      <div className={`absolute top-2 left-2 size-10 rounded-full p-[2px] ${ringClass}`}>
        <div
          className="size-full rounded-full border-2 border-black/30 grid place-items-center"
          style={{ background: story.avatarGradient }}
        >
          {isMine && (
            <span className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-[var(--neon)] text-primary-foreground grid place-items-center border-2 border-background">
              <Plus className="size-2.5" strokeWidth={3} />
            </span>
          )}
        </div>
      </div>
      <p className="absolute bottom-2 left-2 right-2 text-xs font-medium text-white truncate">
        {isMine ? "My status" : story.author.split(" ")[0]}
      </p>
    </button>
  );
}

function AddStoryCard() {
  return (
    <button
      type="button"
      className="relative shrink-0 w-28 h-44 rounded-2xl overflow-hidden text-left border border-dashed border-border bg-muted/40 grid place-items-center hover:bg-accent/60 active:bg-accent transition-all cursor-pointer"
    >
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <div className="size-10 rounded-full bg-[var(--neon)] text-primary-foreground grid place-items-center shadow-glow">
          <Camera className="size-5" />
        </div>
        <span className="text-xs font-medium">Add story</span>
      </div>
    </button>
  );
}

function MutedCard({
  count,
  expanded,
  onToggle,
}: {
  count: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative shrink-0 w-28 h-44 rounded-2xl overflow-hidden text-left bg-gradient-silver border border-border grid place-items-center hover:bg-accent/60 active:bg-accent transition-all cursor-pointer"
    >
      <div className="flex flex-col items-center gap-2 text-muted-foreground px-2 text-center">
        <div className="size-10 rounded-full bg-muted grid place-items-center">
          <EyeOff className="size-5" />
        </div>
        <span className="text-xs font-medium text-foreground">Muted</span>
        <span className="text-[10px]">{count} hidden</span>
        <ChevronDown className={`size-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </div>
    </button>
  );
}

function ChannelRow({ channel }: { channel: Channel }) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/60 active:bg-accent transition-colors text-left"
    >
      <div
        className="size-12 shrink-0 rounded-full border border-border"
        style={{ background: channel.avatarGradient }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <p className="font-medium text-foreground truncate">{channel.name}</p>
          {channel.verified && <BadgeCheck className="size-4 text-[var(--neon)] shrink-0" />}
        </div>
        <p className="text-xs text-muted-foreground truncate">{channel.lastMessage}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span
          className={`text-xs ${channel.unread ? "text-[var(--neon)] font-medium" : "text-muted-foreground"}`}
        >
          {channel.time}
        </span>
        {channel.unread > 0 && (
          <span className="min-w-5 h-5 px-1.5 rounded-full bg-[var(--neon)] text-primary-foreground text-[10px] font-semibold grid place-items-center shadow-glow">
            {channel.unread}
          </span>
        )}
      </div>
    </button>
  );
}

function DiscoverRow({ channel }: { channel: DiscoverChannel }) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/60 active:bg-accent transition-colors duration-150 text-left cursor-pointer"
    >
      <div
        className="size-12 shrink-0 rounded-full border border-border"
        style={{ background: channel.avatarGradient }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <p className="font-medium text-foreground truncate">{channel.name}</p>
          {channel.verified && <BadgeCheck className="size-4 text-[var(--neon)] shrink-0" />}
        </div>
        <p className="text-[11px] text-muted-foreground">{channel.followers}</p>
        <p className="text-xs text-muted-foreground truncate">{channel.description}</p>
      </div>
      <Button
        size="sm"
        className="shrink-0 rounded-full bg-[var(--neon)] hover:bg-[var(--neon)]/90 text-primary-foreground shadow-glow cursor-pointer"
      >
        Follow
      </Button>
    </button>
  );
}

interface UpdatesProps {
  search: string;
}

export function Updates({ search = "" }: UpdatesProps) {
  const [showMuted, setShowMuted] = useState(false);
  const query = search.trim().toLowerCase();
  const isSearching = query.length > 0;

  const { visible, muted } = useMemo(() => {
    const m = friendStories.filter((s) => s.muted);
    // visible: unviewed first, then viewed (viewed shifted to the end)
    const v = friendStories
      .filter((s) => !s.muted)
      .slice()
      .sort((a, b) => Number(a.viewed) - Number(b.viewed));
    return { visible: v, muted: m };
  }, []);

  if (isSearching) {
    const filteredStories = friendStories.filter((s) => s.author.toLowerCase().includes(query));
    const filteredChannels = followedChannels.filter((c) => c.name.toLowerCase().includes(query));

    return (
      <div className="pb-24">
        {/* Stories results */}
        <section className="pt-4">
          <h2 className="px-6 mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Stories
          </h2>
          {filteredStories.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto px-4 pb-3 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
              {filteredStories.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          ) : (
            <p className="px-6 py-6 text-center text-sm text-muted-foreground">No stories found</p>
          )}
        </section>

        {/* Channels results — always rendered */}
        <section className="mt-4">
          <h2 className="px-6 mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Followed channels
          </h2>
          {filteredChannels.length > 0 ? (
            <div className="flex flex-col">
              {filteredChannels.map((c) => (
                <ChannelRow key={c.id} channel={c} />
              ))}
            </div>
          ) : (
            <p className="px-6 py-6 text-center text-sm text-muted-foreground">
              Can&apos;t find the channel you&apos;re looking for? Find more in the{" "}
              <button
                type="button"
                className="text-[var(--neon)] hover:underline active:opacity-80 transition-colors cursor-pointer font-medium"
              >
                channel directory
              </button>
              .
            </p>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Stories — single horizontal scroll list */}
      <section className="pt-4">
        <h2 className="px-6 mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Status
        </h2>
        <div className="flex gap-3 overflow-x-auto px-4 pb-3 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <AddStoryCard />
          {myStory && <StoryCard story={myStory} isMine />}
          {visible.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
          {muted.length > 0 && (
            <MutedCard
              count={muted.length}
              expanded={showMuted}
              onToggle={() => setShowMuted((v) => !v)}
            />
          )}
        </div>

        {showMuted && muted.length > 0 && (
          <div className="mx-4 mt-1 rounded-2xl bg-muted/40 border border-border p-2">
            <p className="px-2 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
              Muted updates
            </p>
            <div className="flex gap-3 overflow-x-auto px-1 pb-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
              {muted.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Followed channels */}
      <section className="mt-6">
        <h2 className="px-6 mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Channels
        </h2>
        <div className="flex flex-col">
          {followedChannels.map((c) => (
            <ChannelRow key={c.id} channel={c} />
          ))}
        </div>
      </section>

      {/* Discover channels */}
      <section className="mt-6">
        <h2 className="px-6 mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Find channels to follow
        </h2>
        <div className="flex flex-col">
          {discoverChannels.map((c) => (
            <DiscoverRow key={c.id} channel={c} />
          ))}
        </div>

        <div className="px-4 mt-4 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="rounded-full border-border bg-card/60 backdrop-blur shadow-silver hover:bg-accent/60 active:bg-accent transition-colors"
          >
            <Compass className="size-4" />
            Explore more
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-[var(--neon)]/40 text-[var(--neon)] bg-card/60 backdrop-blur hover:bg-accent/60 active:bg-accent transition-colors"
          >
            <Megaphone className="size-4" />
            Create channel
          </Button>
        </div>
      </section>
    </div>
  );
}
