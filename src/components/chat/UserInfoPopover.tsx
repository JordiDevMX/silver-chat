import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { BadgeCheck, ShieldCheck, Lock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/chat/Avatar";
import { getChatUser } from "@/lib/avatar";
import type { Chat } from "@/types/chat";

interface UserInfoPopoverProps {
  chat: Chat;
  /** The trigger element — typically the chat header avatar wrapper. */
  children: ReactNode;
}

/**
 * Click-to-open card surfacing richer user info than the cramped header
 * avatar can show: display name, handle, presence, and crypto status.
 * Uses the popover primitive so it stays open on click and closes on
 * outside-press / Escape.
 */
export function UserInfoPopover({ chat, children }: UserInfoPopoverProps) {
  const { t } = useTranslation();
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-80 p-0 overflow-hidden"
      >
        {/* Banner strip — picks up the community/chat accent via --neon */}
        <div
          className="h-16 w-full"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--neon) 35%, transparent), color-mix(in oklab, var(--neon-magenta) 25%, transparent))",
          }}
          aria-hidden
        />
        <div className="px-4 pb-4 -mt-8">
          <div className="flex items-end gap-3">
            <Avatar
              user={getChatUser(chat)}
              size="xl"
              innerClassName="h-16 w-16 border-2 border-popover"
            />
            <div className="flex-1 min-w-0 pb-4">
              <h3 className="text-sm font-semibold text-foreground truncate flex items-center gap-1.5">
                <span className="truncate">{chat.name}</span>
                {chat.isVerified ? (
                  <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                ) : null}
              </h3>
              <p className="text-[11px] text-muted-foreground truncate">
                {chat.isOnline ? (
                  <span className="text-neon font-medium">{t("chat.onlineNow")}</span>
                ) : (
                  t("chat.disconnected")
                )}
              </p>
            </div>
          </div>

          <Separator className="my-3" />

          <dl className="space-y-2 text-xs">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">{t("chat.handle")}</dt>
              <dd className="text-foreground/90 font-medium truncate">
                @{chat.name.toLowerCase().replace(/\s+/g, "_")}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">{t("chat.status")}</dt>
              <dd className="flex items-center gap-1.5 text-foreground/90 font-medium">
                <ShieldCheck className="h-3 w-3 text-neon" />
                {t("chat.verified")}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">{t("chat.encryption")}</dt>
              <dd className="flex items-center gap-1.5 text-foreground/90 font-medium">
                <Lock className="h-3 w-3 text-neon" />
                {t("chat.endToEnd")}
              </dd>
            </div>
          </dl>
        </div>
      </PopoverContent>
    </Popover>
  );
}
