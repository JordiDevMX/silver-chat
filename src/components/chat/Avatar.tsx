import { useState } from "react";
import type { User } from "@/types/chat";
import { getInitials } from "@/lib/avatar";
import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  user: Pick<User, "name" | "avatarUrl">;
  size?: AvatarSize;
  /**
   * Background-image override for the initials fallback. Used by the
   * calls page to apply status-driven gradients (missed/answered/etc.).
   * Ignored when the image variant renders.
   */
  gradient?: string;
  /** Optional online-status dot, anchored bottom-right. */
  showStatus?: boolean;
  statusOnline?: boolean;
  /** Extra classes for the outer wrapper (e.g. caller-specific ring/shadow). */
  className?: string;
  /** Extra classes for the inner circle (e.g. the calls page's white ring). */
  innerClassName?: string;
}

const SIZE_MAP: Record<AvatarSize, { box: string; text: string }> = {
  xs: { box: "h-8 w-8", text: "text-xs" },
  sm: { box: "h-9 w-9", text: "text-xs" },
  md: { box: "h-11 w-11", text: "text-sm" },
  lg: { box: "h-12 w-12", text: "text-sm" },
  xl: { box: "h-16 w-16", text: "text-base" },
};

const STATUS_DOT: Record<AvatarSize, string> = {
  xs: "h-2 w-2 ring-1",
  sm: "h-2.5 w-2.5 ring-2",
  md: "h-2.5 w-2.5 ring-2",
  lg: "h-3 w-3 ring-2",
  xl: "h-3.5 w-3.5 ring-2",
};

/**
 * Avatar with smart image / initials fallback.
 *
 *  - If `user.avatarUrl` is set, render an `<img>` covering a 1:1 box.
 *  - If the image fails to load (`onError`), flip to the initials
 *    variant and never retry this session. State is local to the
 *    component, so a single broken image never affects the rest of
 *    the list.
 *  - If `avatarUrl` is absent, render the initials fallback directly.
 *
 * Renders as a 1:1 circle. The optional `gradient` prop swaps the
 * default silver background for a caller-supplied background-image
 * (used by the calls page for status-driven gradients).
 */
export function Avatar({
  user,
  size = "md",
  gradient,
  showStatus = false,
  statusOnline = false,
  className,
  innerClassName,
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const { box, text } = SIZE_MAP[size];
  const initials = getInitials(user.name);
  const showImage = user.avatarUrl !== undefined && !failed;

  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className={cn(
          box,
          "rounded-full overflow-hidden grid place-items-center font-semibold",
          showImage
            ? "bg-card/30 border border-border"
            : gradient
              ? "text-primary-foreground shadow-silver"
              : "bg-gradient-silver border border-border text-foreground/80 shadow-silver",
          innerClassName,
        )}
        style={!showImage && gradient ? { backgroundImage: gradient } : undefined}
      >
        {showImage ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <span
            className={cn(
              text,
              gradient && "drop-shadow-sm",
            )}
            aria-hidden
          >
            {initials}
          </span>
        )}
      </div>
      {showStatus ? (
        <span
          aria-hidden
          className={cn(
            "absolute bottom-0 right-0 rounded-full",
            statusOnline
              ? "bg-neon shadow-glow"
              : "bg-muted-foreground/40",
            STATUS_DOT[size],
            statusOnline ? "ring-background" : "ring-card",
          )}
        />
      ) : null}
    </div>
  );
}
