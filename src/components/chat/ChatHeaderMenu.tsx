import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  BellOff,
  Bell,
  Search,
  Info,
  Pin,
  Trash2,
  MoreVertical,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteChatDialog } from "./DeleteChatDialog";
import type { Chat } from "@/types/chat";

interface ChatHeaderMenuProps {
  chat: Chat;
  /**
   * If provided, a "Leave group" item is rendered for group chats. The
   * callback is fired after confirmation; the parent handles routing.
   */
  onLeave?: () => void;
}

/**
 * The "⋯" dropdown in the chat header. Promotes the dropdown-menu
 * primitive into active use: mute toggle, search, pin/archive shortcuts,
 * a destructive Delete item that opens the DeleteChatDialog, and an
 * optional Leave item for group chats.
 *
 * State (muted, delete dialog open) is local to the component so the
 * parent route stays simple.
 */
export function ChatHeaderMenu({ chat, onLeave }: ChatHeaderMenuProps) {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(chat.isMuted === true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isGroup = chat.isGroup === true;

  function handleDelete() {
    // Frontend-only mock: surface a toast and route home. A real backend
    // would issue a DELETE + clear the local cache.
    toast.success("Chat deleted", {
      description: `Conversation with ${chat.name} was removed from your device.`,
    });
    navigate({ to: "/" });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Chat options"
          className="h-9 w-9 grid place-items-center rounded-full hover:bg-accent transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-accent"
        >
          <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{chat.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setMuted((m) => {
                const next = !m;
                toast.success(next ? "Notifications muted" : "Notifications unmuted");
                return next;
              });
            }}
          >
            {muted ? (
              <>
                <Bell className="h-4 w-4" />
                Unmute notifications
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4" />
                Mute notifications
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => toast.info("Search coming soon")}
          >
            <Search className="h-4 w-4" />
            Search in chat
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => toast.success("View info", { description: "Profile panel coming soon" })}
          >
            <Info className="h-4 w-4" />
            View info
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => toast.success(chat.isPinned ? "Unpinned" : "Pinned to top")}
          >
            <Pin className="h-4 w-4" />
            {chat.isPinned ? "Unpin from top" : "Pin to top"}
          </DropdownMenuItem>

          {isGroup && onLeave ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  toast.info("Use Delete to leave this group", {
                    description: "Group exit flow ships in a future release.",
                  });
                }}
                className="text-amber-500 focus:text-amber-500"
              >
                <LogOut className="h-4 w-4" />
                Leave group
              </DropdownMenuItem>
            </>
          ) : null}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setDeleteOpen(true);
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteChatDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        chatName={chat.name}
        onConfirm={handleDelete}
      />
    </>
  );
}
