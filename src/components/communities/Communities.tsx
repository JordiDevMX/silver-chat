import { Users, Plus, Megaphone, BellOff, ChevronRight } from "lucide-react";
import { communities, type Community, type SubChannel } from "@/data/mockCommunities";

interface CommunitiesProps {
  onOpen: () => void;
}

function NewCommunityRow({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/60 active:bg-accent transition-colors duration-150 cursor-pointer text-left"
    >
      <div className="relative size-12 shrink-0 rounded-2xl bg-gradient-silver border border-border grid place-items-center shadow-silver">
        <Users className="size-5 text-foreground/80" />
        <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-[var(--neon)] text-primary-foreground grid place-items-center border-2 border-background shadow-glow">
          <Plus className="size-3" strokeWidth={3} />
        </span>
      </div>
      <span className="font-semibold text-foreground">New community</span>
    </button>
  );
}

function ChannelRow({ channel, onClick }: { channel: SubChannel; onClick: () => void }) {
  const isAnn = channel.type === "announcements";
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 pl-6 pr-4 py-2.5 hover:bg-accent/60 active:bg-accent transition-colors duration-150 cursor-pointer text-left"
    >
      {isAnn ? (
        <div className="size-10 shrink-0 rounded-xl bg-gradient-silver border border-border grid place-items-center">
          <Megaphone className="size-4 text-[var(--neon)]" />
        </div>
      ) : (
        <div
          className="size-10 shrink-0 rounded-full border border-border"
          style={{ background: channel.avatarGradient }}
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{channel.name}</p>
        <p className="text-xs text-muted-foreground truncate">{channel.lastMessage}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-[11px] text-muted-foreground">{channel.time}</span>
        {channel.muted && <BellOff className="size-3.5 text-muted-foreground" />}
      </div>
    </button>
  );
}

function CommunityBlock({ community, onOpen }: { community: Community; onOpen: () => void }) {
  return (
    <div className="border-b border-border/60 last:border-0">
      <button
        type="button"
        onClick={onOpen}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/60 active:bg-accent transition-colors duration-150 cursor-pointer text-left"
      >
        <div
          className="size-12 shrink-0 rounded-2xl border border-border shadow-silver"
          style={{ background: community.avatarGradient }}
        />
        <span className="font-semibold text-foreground truncate">{community.name}</span>
      </button>

      <div className="flex flex-col pb-2">
        {community.channels.map((ch) => (
          <ChannelRow key={ch.id} channel={ch} onClick={onOpen} />
        ))}
        <button
          type="button"
          onClick={onOpen}
          className="w-full flex items-center justify-between pl-6 pr-4 py-2.5 text-sm hover:bg-accent/60 active:bg-accent transition-colors duration-150 cursor-pointer text-left"
        >
          <span className="text-muted-foreground">View all</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

export function Communities({ onOpen }: CommunitiesProps) {
  return (
    <div className="pb-24">
      <h1 className="px-4 pt-4 pb-2 text-2xl font-semibold tracking-tight text-foreground">
        Communities
      </h1>

      <NewCommunityRow onClick={onOpen} />

      <div className="mt-2">
        {communities.map((c) => (
          <CommunityBlock key={c.id} community={c} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
