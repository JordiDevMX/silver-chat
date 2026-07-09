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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [muted, setMuted] = useState(chat.isMuted === true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isGroup = chat.isGroup === true;

  function handleDelete() {
    // Frontend-only mock: surface a toast and route home. A real backend
    // would issue a DELETE + clear the local cache.
    toast.success(t("chat.deletedToast"), {
      description: t("chat.deletedToastDesc", { name: chat.name }),
    });
    navigate({ to: "/", search: { tab: "chats" } });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={t("chat.chatOptions")}
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
              // Compute the next value from the current closure, then
              // call setMuted + toast as separate statements. Putting
              // the toast inside the setMuted updater fires it twice
              // because React 19 Strict Mode invokes functional
              // updaters twice in dev to surface impure functions.
              const next = !muted;
              setMuted(next);
              toast.success(next ? t("chat.mutedToast") : t("chat.unmutedToast"));
            }}
          >
            {muted ? (
              <>
                <Bell className="h-4 w-4" />
                {t("chat.unmuteNotifications")}
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4" />
                {t("chat.muteNotifications")}
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => toast.info(t("chat.searchComingSoon"))}
          >
            <Search className="h-4 w-4" />
            {t("chat.searchInChat")}
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() =>
              toast.success(t("chat.viewInfo"), { description: t("chat.viewInfoToastDesc") })
            }
          >
            <Info className="h-4 w-4" />
            {t("chat.viewInfo")}
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() =>
              toast.success(chat.isPinned ? t("chat.unpinnedToast") : t("chat.pinnedToast"))
            }
          >
            <Pin className="h-4 w-4" />
            {chat.isPinned ? t("chat.unpinFromTop") : t("chat.pinToTop")}
          </DropdownMenuItem>

          {isGroup && onLeave ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  toast.info(t("chat.leaveGroupToast"), {
                    description: t("chat.leaveGroupToastDesc"),
                  });
                }}
                className="text-amber-500 focus:text-amber-500"
              >
                <LogOut className="h-4 w-4" />
                {t("chat.leaveGroup")}
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
            {t("chat.deleteChat")}
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
