import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { Chat } from "@/types/chat";
import { Pin, BellOff, BadgeCheck, Ban, Archive, Star, UsersRound } from "lucide-react";
import { MESSAGE_STATUS_ICONS, renderMessagePreview } from "@/constants/chatIcons";
import { Avatar } from "@/components/chat/Avatar";
import { getChatUser } from "@/lib/avatar";
import { cn } from "@/lib/utils";

interface ChatListPaneProps {
  chats: Chat[];
  /** ID of the currently active chat — rendered with an active highlight. */
  activeId?: string;
}

export function ChatListPane({ chats, activeId }: ChatListPaneProps) {
  const { t } = useTranslation();
  if (chats.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-sm text-muted-foreground">
        <p className="capitalize text-foreground font-medium mb-1">{t("chat.noChatsFound")}</p>
        <p>{t("chat.noChatsFoundDesc")}</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {chats.map((chat) => (
        <li key={chat.id}>
          <ChatRow chat={chat} active={chat.id === activeId} />
        </li>
      ))}
    </ul>
  );
}

interface ChatRowProps {
  chat: Chat;
  active: boolean;
}

function ChatRow({ chat, active }: ChatRowProps) {
  const { t } = useTranslation();
  return (
    <Link
      to="/chat/$id"
      params={{ id: chat.id }}
      aria-current={active ? "page" : undefined}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        active ? "bg-accent/70" : "hover:bg-accent/60 active:bg-accent",
      )}
    >
      <Avatar
        user={getChatUser(chat)}
        size="md"
        showStatus
        statusOnline={chat.isOnline === true}
        innerClassName="h-11 w-11"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h3 className="flex-1 truncate text-sm font-semibold text-foreground">
            <span className="truncate">{chat.name}</span>
            <span className="ml-1.5 inline-flex items-center gap-1 text-muted-foreground">
              {chat.isVerified ? <BadgeCheck className="h-3 w-3 text-primary" /> : null}
              {chat.isMuted ? <BellOff className="h-3 w-3" /> : null}
              {chat.isBlocked ? <Ban className="h-3 w-3 text-red-600" /> : null}
              {chat.isArchived ? <Archive className="h-3 w-3" /> : null}
              {chat.isFavorite ? <Star className="h-3 w-3 text-yellow-500" /> : null}
              {chat.isPinned ? <Pin className="h-3 w-3 text-primary" /> : null}
              {chat.isGroup ? <UsersRound className="h-3 w-3" /> : null}
            </span>
          </h3>
          <span
            className={cn(
              "text-[11px] font-medium tabular-nums",
              chat.unread > 0 ? "text-neon" : "text-muted-foreground",
            )}
          >
            {chat.time}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="flex-1 truncate text-xs text-muted-foreground">
            {renderMessagePreview(chat, t)}
          </p>
          {chat.unread ? (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-neon text-primary-foreground text-[10px] font-bold grid place-items-center shadow-glow">
              {chat.unread}
            </span>
          ) : chat.status && MESSAGE_STATUS_ICONS[chat.status] ? (
            MESSAGE_STATUS_ICONS[chat.status]
          ) : null}
        </div>
      </div>
    </Link>
  );
}
