import type { Chat } from "@/types/chat";
import { Link } from "@tanstack/react-router";
import { MessageSquarePlus } from "lucide-react";
import {
  Pin,
  BellOff,
  Users,
  BadgeCheck,
  Ban,
  Archive,
  Star,
  FileText,
  CalendarClock,
  Shield,
  Check,
  CheckCheck,
  CheckLine,
  Clock,
  AlertCircle,
} from "lucide-react";

const MESSAGE_STATUS_ICONS: Record<string, React.ReactNode> = {
  sent: <Check className="h-4 w-5 text-primary-foreground" />,
  delivered: <CheckCheck className="h-4 w-5 text-primary-foreground" />,
  read: <CheckLine className="h-4 w-5 text-primary" />,
  pending: <Clock className="h-4 w-5 text-muted-foreground" />,
  failed: <AlertCircle className="h-4 w-5 text-destructive" />,
};

export function ChatFAB() {
  return (
    <button
      type="button"
      aria-label="Start new chat"
      className="absolute bottom-24 right-5 h-14 w-14 rounded-2xl bg-gradient-neon text-primary-foreground grid place-items-center shadow-glow hover:scale-105 active:scale-95 transition-transform ring-1 ring-inset ring-white/20"
    >
      <MessageSquarePlus className="h-6 w-6" />
    </button>
  );
}

interface ChatListItemProps {
  chat: Chat;
}

export function ChatListItem({ chat }: ChatListItemProps) {
  return (
    <Link
      to="/chat/$id"
      params={{ id: chat.id }}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/60 active:bg-accent transition-colors text-left"
    >
      <div className="relative shrink-0">
        <div className="h-12 w-12 rounded-full bg-gradient-silver border border-border grid place-items-center text-sm font-semibold text-foreground/80 shadow-silver">
          {chat.avatar}
        </div>
        {chat.isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-neon ring-2 ring-background shadow-glow" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h3 className="flex-1 truncate text-sm font-semibold text-foreground">
            <span className="truncate">{chat.name}</span>
            <span className="ml-2 inline-flex items-center gap-1 text-muted-foreground">
              {chat.isVerified && <BadgeCheck className="h-3 w-3 text-primary" />}
              {chat.isGroup && <Users className="h-3 w-3" />}
              {chat.isMuted && <BellOff className="h-3 w-3" />}
              {chat.isBlocked && <Ban className="h-3 w-3 text-red-600" />}
              {chat.isArchived && <Archive className="h-3 w-3" />}
              {chat.isFavorite && <Star className="h-3 w-3" />}
              {chat.isDraft && <FileText className="h-3 w-3" />}
              {chat.isScheduled && <CalendarClock className="h-3 w-3" />}
              {chat.isRestricted && <Shield className="h-3 w-3" />}
              {chat.isPinned && <Pin className="h-3 w-3 text-primary" />}
            </span>
          </h3>
          <span
            className={`text-[11px] font-medium ${chat.unread > 0 ? "text-neon" : "text-muted-foreground"} flex items-center gap-1`}
          >
            {chat.time}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="flex-1 truncate text-xs text-muted-foreground">{chat.lastMessage}</p>
          {chat.fromSelf && chat.status && MESSAGE_STATUS_ICONS[chat.status]}
          {chat.unread > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-neon text-primary-foreground text-[10px] font-bold grid place-items-center shadow-glow">
              {chat.unread > 99 ? "99+" : chat.unread}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
