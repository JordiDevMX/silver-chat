import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Users, Plus, Megaphone, BellOff, ChevronRight } from "lucide-react";
import { communities } from "@/data/mockCommunities";
import type { Community, SubChannel } from "@/types/community";
import { NewCommunityDialog } from "./NewCommunityDialog";
import type { NewCommunityFormValues } from "./NewCommunityDialog";
import { cn } from "@/lib/utils";

interface CommunitiesProps {
  onOpen?: () => void;
  search?: string;
}

function NewCommunityRow({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
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
      <span className="font-semibold text-foreground">{t("communities.newCommunity")}</span>
    </button>
  );
}

function ChannelRow({ channel, communityId }: { channel: SubChannel; communityId: string }) {
  const isAnn = channel.type === "announcements";
  return (
    <Link
      to="/communities/$communityId/channels/$channelId"
      params={{ communityId, channelId: channel.id }}
      className="w-full flex items-center gap-3 pl-6 pr-4 py-2.5 hover:bg-accent/60 active:bg-accent transition-colors duration-150 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
    </Link>
  );
}

function CommunityBlock({ community }: { community: Community }) {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        // < md: inline list-separated block (legacy phone-style stack)
        "border-b border-border/60 last:border-0",
        // md+: free-floating glass card in a fluid multi-column grid
        "md:rounded-2xl md:border md:border-border/60 md:bg-card/40 md:backdrop-blur-xl md:shadow-silver md:overflow-hidden md:last:border",
      )}
    >
      <div className="w-full flex items-center gap-3 px-4 py-3">
        <div
          className="size-12 shrink-0 rounded-2xl border border-border shadow-silver"
          style={{ background: community.avatarGradient }}
        />
        <span className="font-semibold text-foreground truncate">{community.name}</span>
      </div>

      <div className="flex flex-col pb-2">
        {community.channels.map((ch) => (
          <ChannelRow key={ch.id} channel={ch} communityId={community.id} />
        ))}
        <div className="w-full flex items-center justify-between pl-6 pr-4 py-2.5 text-sm text-muted-foreground">
          <span>{t("communities.viewAll")}</span>
          <ChevronRight className="size-4" />
        </div>
      </div>
    </div>
  );
}

export function Communities({ onOpen: _onOpen, search = "" }: CommunitiesProps) {
  const { t } = useTranslation();
  const query = search.trim().toLowerCase();
  const filtered = query
    ? communities.filter((c) => c.name.toLowerCase().includes(query))
    : communities;

  const isSearching = query.length > 0;
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleCreate(values: NewCommunityFormValues) {
    // Frontend-only mock: no real backend. Log the validated payload so
    // the wiring is observable in dev, and surface a non-blocking note
    // that persistence is intentionally deferred.
    if (typeof console !== "undefined") {
      console.info("[NewCommunityDialog] create:", values);
    }
  }

  return (
    <div className="pb-24 md:pb-6">
      {!isSearching && (
        <h1 className="px-4 md:px-6 pt-4 pb-2 text-2xl font-semibold tracking-tight text-foreground">
          {t("communities.heading")}
        </h1>
      )}

      {/*
        Fluid presentation: < md is a single-column stack (legacy phone-style
        list); md+ becomes a responsive multi-column grid that fills the
        available width edge-to-edge, then expands to three columns on xl.
        `NewCommunityRow` is rendered as the first grid cell on md+ so the
        primary CTA stays anchored within the wide layout instead of being
        stranded as a narrow full-width row above the grid.
      */}
      <div
        className={cn(
          "mt-2 md:px-4",
          "md:grid md:grid-cols-2 md:gap-4",
          "xl:grid-cols-3",
        )}
      >
        {!isSearching && (
          <div
            className={cn(
              "border-b border-border/60 last:border-0",
              "md:rounded-2xl md:border md:border-dashed md:border-border md:bg-card/20 md:backdrop-blur-xl md:overflow-hidden md:last:border",
            )}
          >
            <NewCommunityRow onClick={() => setDialogOpen(true)} />
          </div>
        )}

        {filtered.length > 0 ? (
          filtered.map((c) => <CommunityBlock key={c.id} community={c} />)
        ) : (
          <div
            className={cn(
              "px-6 py-12 text-center",
              "md:col-span-full md:col-start-1 md:rounded-2xl md:border md:border-dashed md:border-border md:bg-card/20 md:backdrop-blur-xl",
            )}
          >
            <p className="text-sm text-muted-foreground mb-3">
              {t("communities.noCommunitiesFound")}
            </p>
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--neon)] hover:underline transition-colors cursor-pointer"
            >
              <Plus className="size-4" />
              {t("communities.createNewCommunity")}
            </button>
          </div>
        )}
      </div>

      <NewCommunityDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreate={handleCreate} />
    </div>
  );
}
