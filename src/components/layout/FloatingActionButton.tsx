import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  /** Primary icon. Required. */
  icon: LucideIcon;
  /** Optional small badge icon overlaid in the top-right (e.g. a `Plus`). */
  badgeIcon?: LucideIcon;
  /** Accessible label for the button. */
  label: string;
  /** Click handler. Omit for purely decorative FABs. */
  onClick?: () => void;
  /** Layout overrides — positioning, z-index, extra transitions. */
  className?: string;
}

/**
 * Shared floating action button.
 *
 * Centralises the glassmorphic gradient + glow + scale micro-interaction
 * used by the chat and calls FABs. The icon (and optional badge) plus the
 * click behaviour are injected by the caller, while positioning and
 * z-index are left to the caller via `className`.
 */
export function FloatingActionButton({
  icon: Icon,
  badgeIcon: BadgeIcon,
  label,
  onClick,
  className,
}: FloatingActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "h-14 w-14 rounded-2xl bg-gradient-neon text-primary-foreground",
        "grid place-items-center shadow-glow",
        "ring-1 ring-inset ring-white/20",
        "hover:scale-105 active:scale-95 transition-transform",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {BadgeIcon ? (
        <span className="relative">
          <Icon className="h-6 w-6" />
          <BadgeIcon
            className="absolute -top-1.5 -right-2 h-3.5 w-3.5"
            strokeWidth={3}
          />
        </span>
      ) : (
        <Icon className="h-6 w-6" />
      )}
    </button>
  );
}
