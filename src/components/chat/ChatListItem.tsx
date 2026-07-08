import type { Chat } from "@/types/chat";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  MessageSquarePlus,
  Pin,
  BellOff,
  BadgeCheck,
  Ban,
  Archive,
  Star,
  UsersRound,
} from "lucide-react";

import { MESSAGE_STATUS_ICONS, renderMessagePreview } from "@/constants/chatIcons";
import { FloatingActionButton } from "@/components/layout/FloatingActionButton";
import { Avatar } from "@/components/chat/Avatar";
import { getChatUser } from "@/lib/avatar";

export function ChatFAB() {
  const { t } = useTranslation();
  return (
    <FloatingActionButton
      icon={MessageSquarePlus}
      label={t("chat.startNewChat")}
      className="absolute bottom-6 right-4 z-50"
    />
  );
}

interface ChatListItemProps {
  chat: Chat;
}

export function ChatListItem({ chat }: ChatListItemProps) {
  const { t } = useTranslation();
  return (
    <Link
      to="/chat/$id"
      params={{ id: chat.id }}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/60 active:bg-accent transition-colors text-left"
    >
      <Avatar
        user={getChatUser(chat)}
        size="lg"
        showStatus
        statusOnline={chat.isOnline === true}
        innerClassName="h-12 w-12"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h3 className="flex-1 truncate text-sm font-semibold text-foreground">
            <span className="truncate">{chat.name}</span>
            <span className="ml-2 inline-flex items-center gap-1 text-muted-foreground">
              {chat.isVerified && <BadgeCheck className="h-3 w-3 text-primary" />}
              {chat.isMuted && <BellOff className="h-3 w-3" />}
              {chat.isBlocked && <Ban className="h-3 w-3 text-red-600" />}
              {chat.isArchived && <Archive className="h-3 w-3" />}
              {chat.isFavorite && <Star className="h-3 w-3 text-yellow-500" />}
              {chat.isPinned && <Pin className="h-3 w-3 text-primary" />}
              {chat.isGroup && <UsersRound className="h-3 w-3" />}
            </span>
          </h3>
          <span
            className={`text-[11px] font-medium ${chat.unread > 0 ? "text-neon" : "text-muted-foreground"} flex items-center gap-1`}
          >
            {chat.time}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="flex-1 truncate text-xs text-muted-foreground">
            {renderMessagePreview(chat, t)}
          </p>

          {chat.unread ? (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-neon text-primary-foreground text-[10px] font-bold grid place-items-center shadow-glow">
              {chat.unread}
            </span>
          ) : (
            chat.status && MESSAGE_STATUS_ICONS[chat.status]
          )}
        </div>
      </div>
    </Link>
  );
}
