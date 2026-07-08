import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Crown, Shield, UserRound, Clock } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar } from "@/components/chat/Avatar";
import type { User } from "@/types/chat";

interface MemberHoverCardProps {
  member: User;
  /** The trigger element — typically the sender-name span above a bubble. */
  children: ReactNode;
}

const ROLE_BADGE: Record<
  NonNullable<User["role"]>,
  { icon: typeof Crown; tint: string; key: "chat.admin" | "chat.moderator" | "chat.member" }
> = {
  admin: { icon: Crown, tint: "text-amber-400", key: "chat.admin" },
  moderator: { icon: Shield, tint: "text-sky-400", key: "chat.moderator" },
  member: { icon: UserRound, tint: "text-muted-foreground", key: "chat.member" },
};

/**
 * Hover-to-preview card for a group member. Uses the hover-card primitive
 * so it opens after a short delay and closes when the pointer leaves —
 * the canonical pattern for social-network member previews.
 */
export function MemberHoverCard({ member, children }: MemberHoverCardProps) {
  const { t } = useTranslation();
  const badge = ROLE_BADGE[member.role ?? "member"];
  const BadgeIcon = badge.icon;
  return (
    <HoverCard openDelay={300} closeDelay={150}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent side="top" align="start" className="w-72">
        <div className="flex items-center gap-3">
          <Avatar user={member} size="lg" innerClassName="h-12 w-12" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground truncate flex items-center gap-1.5">
              <span className="truncate">{member.name}</span>
            </h4>
            <p className={`text-[11px] flex items-center gap-1 ${badge.tint}`}>
              <BadgeIcon className="h-3 w-3" />
              {t(badge.key)}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border/60 space-y-1.5 text-[11px] text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {t("chat.memberSince")}
          </p>
          <p>{t("chat.memberHint")}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

/** Returns the User with the given name from a participants list, or null. */
export function findMember(
  participants: User[] | undefined,
  name: string | undefined,
): User | null {
  if (!participants || !name) return null;
  return participants.find((p) => p.name === name) ?? null;
}
