import { Fragment, useEffect, useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Phone, Video, Users, Megaphone, Pin } from "lucide-react";
import type { Chat, Msg, User, TabKey } from "@/types/chat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatHeaderMenu } from "@/components/chat/ChatHeaderMenu";
import { UserInfoPopover } from "@/components/chat/UserInfoPopover";
import { MemberHoverCard, findMember } from "@/components/chat/MemberHoverCard";
import { Avatar } from "@/components/chat/Avatar";
import { getChatUser } from "@/lib/avatar";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatMessageDate, isSameDay } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * The kind of conversation a {@link ChatLayout} instance is presenting.
 *
 *  - `dm`       : 1:1 direct message (used by `/chat/$id` for non-groups).
 *  - `group`    : multi-participant group chat (used by `/chat/$id` when
 *                 `chat.isGroup` is true). Reuses the DM shell but enables
 *                 sender labels + member hover cards in the thread.
 *  - `community`: a community-level feed. Reserved for future use —
 *                 structurally identical to `group`.
 *  - `channel`  : a community sub-channel (announcements or chat group).
 *                 Used by `/communities/$communityId/channels/$channelId`.
 *                 Renders the parent community name as the header subtitle
 *                 and hides the call buttons (channels aren't callable).
 */
export type ChatLayoutType = "dm" | "group" | "community" | "channel";

interface ChatLayoutProps {
  /** Conversation variant — drives header context + sender labels. */
  type: ChatLayoutType;
  /** Identifier passed to {@link useChatMessages} for message resolution. */
  id: string;

  // ── Header identity ──────────────────────────────────────────────────
  /** Primary title shown in the header (chat name or channel name). */
  name: string;
  /** Avatar image URL (DM / group). Ignored when `type === "channel"`. */
  avatarUrl?: string;
  /** Background gradient for the channel/group avatar fallback. */
  avatarGradient?: string;
  /** Whether the DM counterpart is currently online. DM header only. */
  isOnline?: boolean;
  /** Pinned-into-header flag passed through to `ChatHeaderMenu`. */
  isPinned?: boolean;
  /** Muted flag mirrored into the synthesized header-menu `Chat`. */
  isMuted?: boolean;
  /** GROUP-only: participant roster used by `MemberHoverCard` lookups. */
  participants?: User[];

  // ── Channel-only context ─────────────────────────────────────────────
  /** For `type === "channel"`: channel kind. `announcements` is read-only. */
  channelType?: "announcements" | "group";
  /** For `type === "channel"`: the parent community name (subtitle row). */
  parentName?: string;
  /** For `type === "channel"`: the parent community id (reserved for
   *  future deep-linking / breadcrumb navigation; currently unused). */
  parentId?: string;

  // ── Navigation ───────────────────────────────────────────────────────
  /** Mobile back-button target. Defaults to `/?tab=chats` for DM/group,
   *  `/?tab=communities` for community/channel. */
  backTo?: { to: string; tab: TabKey };

  // ── Slot overrides (rarely needed) ────────────────────────────────────
  /** Extra header actions rendered before the `ChatHeaderMenu`. */
  headerActions?: React.ReactNode;
  /** Optional aside content — currently unused; reserved for future
   *  right-rail panels (pinned messages, shared media). */
  aside?: React.ReactNode;
  /**
   * Called when the user toggles the pin state via the header's ⋯ menu.
   * The parent uses this to mutate the in-memory chat store so the list
   * re-sorts on the next render. DM/group only — channels don't support
   * pinning.
   */
  onPinToggle?: () => void;
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
    if (groups.length > 0 && isSameDay(last.date, message.date)) {
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

/**
 * Unified conversation presentation engine shared by every active-chat
 * surface in SilverChat: direct messages, groups, communities, and
 * community sub-channels.
 *
 * ## Structural contract (inviolable)
 *
 * The component renders a strict vertical stack:
 *
 *   <div flex flex-col h-full w-full>
 *     <header> … pinned flat at the top, full column width … </header>
 *     <main>   … fluid scrollable center (flex-1 min-h-0 overflow-y-auto) …</main>
 *     <ChatComposer/> … anchored at the bottom, full column width …
 *   </div>
 *
 * Header, message timeline, and input bar each span the *full width* of
 * their containing column. There is no horizontal fragmentation, no
 * max-width clamp, no centered "phone frame", and no floating margins —
 * regardless of the `sm` / `md` / `lg` breakpoint. The containing column
 * (provided by `ChatRouteShell` / `ResponsiveSplit`) sets the width; this
 * component simply fills it vertically.
 *
 * ## Why this exists
 *
 * Previously the DM view (`ConversationPane`) and the community channel
 * view (`routes/communities.$communityId.channels.$channelId.tsx`)
 * duplicated the entire header + date-grouped message thread + composer
 * implementation, and the channel view additionally trapped itself inside
 * a `max-w-md` "phone clamp" that floated adrift on tablet/desktop
 * viewports (header crammed upper-left, bubbles centered with huge
 * margins, composer isolated bottom-right). `ChatLayout` collapses both
 * into a single DRY engine whose layout contract is enforced once.
 *
 * ## Data resolution
 *
 * Message fetching + optimistic send are owned by this component via
 * {@link useChatMessages(id)}, so route loaders only need to prefetch the
 * thread into the react-query cache (exactly the pattern already used by
 * `/chat/$id` and the community channel route). The `id` prop is the
 * single source of truth for the cache key.
 */
export function ChatLayout({
  type,
  id,
  name,
  avatarUrl,
  avatarGradient,
  isOnline,
  isPinned,
  isMuted,
  participants,
  channelType,
  parentName,
  parentId: _parentId,
  backTo,
  headerActions,
  aside: _aside,
  onPinToggle,
}: ChatLayoutProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { messages, isLoading, send, isSending } = useChatMessages(id);
  const endRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => groupByDate(messages), [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [groups]);

  const isChannel = type === "channel";
  const isAnnouncements = isChannel && channelType === "announcements";
  const isGroupThread = type === "group" || type === "community";
  const showCallButtons = type === "dm";

  // The DM/group avatar is a real <Avatar>. Channels render a compact
  // circular tile (megaphone for announcements, gradient swatch otherwise)
  // because a channel has no "user" in the rota sense.
  const channelTile = isChannel ? (
    isAnnouncements ? (
      <div className="h-10 w-10 rounded-full bg-gradient-silver border border-border grid place-items-center shadow-silver shrink-0">
        <Megaphone className="h-4 w-4 text-[var(--neon)]" />
      </div>
    ) : (
      <div
        className="h-10 w-10 rounded-full border border-border shrink-0"
        style={{ background: avatarGradient }}
      />
    )
  ) : null;

  // Synthesize a Chat for the header menu + UserInfoPopover so we can reuse
  // those components unchanged. The header menu only reads name/flags.
  const headerChat: Chat = {
    id,
    name,
    avatarUrl,
    avatarGradient,
    lastMessage: "",
    time: "",
    unread: 0,
    isOnline,
    isPinned,
    isMuted,
    isGroup: isGroupThread || channelType === "group",
    participants,
  };

  const backTarget =
    backTo ?? { to: "/", tab: isChannel ? "communities" : "chats" };

  const subtitle = isChannel ? (
    <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
      <Users className="h-3 w-3 shrink-0" />
      <span className="truncate">{parentName ?? ""}</span>
    </p>
  ) : (
    <p className="text-[11px] text-muted-foreground truncate">
      {isOnline ? (
        <span className="text-neon">{t("chat.online")}</span>
      ) : (
        t("chat.disconnected")
      )}
    </p>
  );

  // The small badge pinned at the top of the message list: the E2E pill for
  // DM/group conversations, or an announcements / community label for a
  // channel thread.
  const listIntroLabel = isChannel
    ? isAnnouncements
      ? t("communities.announcements")
      : parentName ?? ""
    : t("chat.e2eBadge");

  const composerDisabled = isSending || isAnnouncements;

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background">
      {/* HEADER ─────────────────────────────────────────────────────────
          Always pinned flat at the top, spans the full column width. */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-gradient-silver backdrop-blur-xl shadow-silver">
        <div className="flex items-center gap-2 px-2 py-3">
          {isMobile ? (
            <Link
              to={backTarget.to}
              search={{ tab: backTarget.tab }}
              aria-label={t("chat.back")}
              className="h-9 w-9 grid place-items-center rounded-full hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          ) : null}

          {isChannel ? (
            <div className="relative shrink-0">{channelTile}</div>
          ) : (
            <UserInfoPopover chat={headerChat}>
              <div className="relative shrink-0 cursor-pointer">
                <Avatar
                  user={getChatUser(headerChat)}
                  size="md"
                  innerClassName="h-10 w-10"
                />
                {isOnline ? (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-neon ring-2 ring-background shadow-glow" />
                ) : null}
              </div>
            </UserInfoPopover>
          )}

          <div className="flex-1 min-w-0 ml-1">
            <h2 className="text-sm font-semibold truncate flex items-center gap-1.5">
              {name}
              {isAnnouncements ? (
                <Pin className="h-3 w-3 text-muted-foreground" />
              ) : null}
            </h2>
            {subtitle}
          </div>

          {headerActions}

          {showCallButtons ? (
            <>
              <button
                type="button"
                aria-label={t("chat.videoCall")}
                className="h-9 w-9 grid place-items-center rounded-full hover:bg-accent transition-colors"
              >
                <Video className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={t("chat.voiceCall")}
                className="h-9 w-9 grid place-items-center rounded-full hover:bg-accent transition-colors"
              >
                <Phone className="h-4 w-4" />
              </button>
            </>
          ) : null}

          <ChatHeaderMenu chat={headerChat} onPinToggle={onPinToggle} />
        </div>
      </header>

      {/* MESSAGE TIMELINE ───────────────────────────────────────────────
          Fluid scrollable center. `flex-1 min-h-0` is what keeps the
          header pinned and the composer anchored: this region absorbs all
          remaining vertical space and scrolls internally. */}
      <main
        aria-label={t("chat.messagesWith", { name })}
        aria-live="polite"
        aria-relevant="additions"
        className={cn(
          "flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-2",
          "bg-[radial-gradient(circle_at_top,hsl(var(--silver-light)/0.4),transparent_60%)]",
        )}
      >
        {isLoading ? (
          <div className="h-full grid place-items-center text-xs text-muted-foreground">
            {isChannel
              ? t("communities.loadingChannel")
              : t("chat.loadingConversation")}
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-card/70 border border-border rounded-full px-3 py-0.5">
                {listIntroLabel}
              </span>
            </div>
            {groups.map((group) => (
              <Fragment key={group.key}>
                <DateSeparator label={group.label} />
                {group.messages.map((message, index) => {
                  const hasPrevious = index > 0;
                  const previous = hasPrevious
                    ? group.messages[index - 1]
                    : null;
                  const showSender =
                    isGroupThread &&
                    !message.fromSelf &&
                    message.senderName !== undefined &&
                    (previous === null ||
                      previous.fromSelf ||
                      previous.senderName !== message.senderName);
                  return (
                    <div key={message.id} className="space-y-0.5">
                      {showSender ? (
                        <MemberHoverCard
                          member={
                            findMember(participants, message.senderName) ?? {
                              id: message.senderName ?? "unknown",
                              name: message.senderName ?? "Unknown",
                              role: "member",
                            }
                          }
                        >
                          <span className="block px-1 text-[11px] font-semibold tracking-tight text-neon cursor-default">
                            {message.senderName}
                          </span>
                        </MemberHoverCard>
                      ) : null}
                      <MessageBubble message={message} showSender={false} />
                    </div>
                  );
                })}
              </Fragment>
            ))}
            <div ref={endRef} />
          </>
        )}
      </main>

      {/* INPUT BAR ──────────────────────────────────────────────────────
          Anchored at the bottom, spanning the full column width. The
          `<form>` uses `sticky bottom-0` so it stays flush with the
          column edge even while the timeline scrolls above it.
          Announcements channels are read-only — the composer is disabled
          but kept mounted so the layout never reflows. */}
      <ChatComposer onSend={send} disabled={composerDisabled} />
    </div>
  );
}