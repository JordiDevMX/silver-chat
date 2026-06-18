import type { Chat } from "@/types/chat";
import { Link } from "@tanstack/react-router";
import { Pin } from "lucide-react";

interface ChatListItemProps {
  chat: Chat;
}

export function ChatListItem({
  chat,
}: ChatListItemProps) {
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
        {chat.online && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-neon ring-2 ring-background shadow-glow" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h3 className="flex-1 truncate text-sm font-semibold text-foreground">
            {chat.name}
          </h3>
          <span
            className={`text-[11px] font-medium ${chat.unread > 0 ? "text-neon" : "text-muted-foreground"}`}
          >
            {chat.time}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="flex-1 truncate text-xs text-muted-foreground">
            {chat.lastMessage}
          </p>
          {chat.pinned && (
            <Pin className="h-3 w-3 text-muted-foreground" />
          )}
          {chat.unread > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-neon text-primary-foreground text-[10px] font-bold grid place-items-center shadow-glow">
              {chat.unread > 99
                ? "99+"
                : chat.unread}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
