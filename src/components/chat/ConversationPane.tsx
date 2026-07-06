import { Fragment, useEffect, useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Phone, Video, MessagesSquare, Sparkles } from "lucide-react";
import type { Chat, Msg } from "@/types/chat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatHeaderMenu } from "@/components/chat/ChatHeaderMenu";
import { UserInfoPopover } from "@/components/chat/UserInfoPopover";
import { MemberHoverCard, findMember } from "@/components/chat/MemberHoverCard";
import { Avatar } from "@/components/chat/Avatar";
import { getChatUser } from "@/lib/avatar";
import { useChatMessages } from "@/hooks/useChatMessages";
import { formatMessageDate, isSameDay } from "@/lib/format";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ConversationPaneProps {
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
 * Renders the active conversation thread.
 *
 *  - Mobile: includes a sticky back button (we are the only view).
 *  - Desktop: back button is omitted (the chat list is still on the left).
 *
 * When no chat is selected (chat === null) the desktop layout shows a
 * dedicated empty state with brand hero, instead of a blank pane.
 */
export function ConversationPane({ chat }: ConversationPaneProps) {
  const isMobile = useIsMobile();
  const { messages, isLoading, send, isSending } = useChatMessages(chat.id);
  const endRef = useRef<HTMLDivElement>(null);
  const isGroup = chat.isGroup === true;
  const groups = useMemo(() => groupByDate(messages), [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [groups]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background">
      <header
        className={cn(
          "sticky top-0 z-30 border-b border-border/60 bg-gradient-silver backdrop-blur-xl shadow-silver",
        )}
      >
        <div className="flex items-center gap-2 px-2 py-3">
          {isMobile ? (
            <Link
              to="/"
              aria-label="Back"
              className="h-9 w-9 grid place-items-center rounded-full hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          ) : null}

          <UserInfoPopover chat={chat}>
            <div className="relative shrink-0 cursor-pointer">
              <Avatar user={getChatUser(chat)} size="md" innerClassName="h-10 w-10" />
              {chat.isOnline ? (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-neon ring-2 ring-background shadow-glow" />
              ) : null}
            </div>
          </UserInfoPopover>

          <div className="flex-1 min-w-0 ml-1">
            <h2 className="text-sm font-semibold truncate">{chat.name}</h2>
            <p className="text-[11px] text-muted-foreground truncate">
              {chat.isOnline ? <span className="text-neon">online</span> : "Disconnected"}
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

          <ChatHeaderMenu chat={chat} />
        </div>
      </header>

      <main
        aria-label={`Messages with ${chat.name}`}
        aria-live="polite"
        aria-relevant="additions"
        className={cn(
          "flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-2",
          "bg-[radial-gradient(circle_at_top,hsl(var(--silver-light)/0.4),transparent_60%)]",
        )}
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
                  const hasPrevious = index > 0;
                  const previous = hasPrevious ? group.messages[index - 1] : null;
                  const showSender =
                    isGroup &&
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
                            findMember(chat.participants, message.senderName) ?? {
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

      <ChatComposer onSend={send} disabled={isSending} />
    </div>
  );
}

export function ConversationEmptyState() {
  return (
    <div className="hidden md:flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,hsl(var(--silver-light)/0.5),transparent_60%)]">
      <div className="max-w-md text-center px-8">
        <div className="relative mx-auto h-16 w-16 rounded-2xl bg-gradient-neon shadow-glow grid place-items-center mb-5">
          <MessagesSquare className="h-7 w-7 text-primary-foreground" />
          <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-card border border-border grid place-items-center text-neon shadow-silver">
            <Sparkles className="h-3 w-3" />
          </span>
        </div>
        <h2 className="text-xl font-semibold tracking-tight">Pick a conversation</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Select a chat on the left to start messaging. End-to-end encryption keeps every
          conversation private.
        </p>
        <ul className="mt-5 grid grid-cols-1 gap-2 text-left text-xs text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-glow" />
            Encrypted threads with delivery &amp; read receipts
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-glow" />
            Rich attachments — images, videos, files and stickers
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-glow" />
            Voice &amp; video calls over the silver mesh
          </li>
        </ul>
      </div>
    </div>
  );
}
