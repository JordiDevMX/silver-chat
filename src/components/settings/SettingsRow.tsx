import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type RowTag = "button" | "div" | "label";

interface SettingsRowProps {
  Icon: LucideIcon;
  label: string;
  subtitle?: string;
  right?: ReactNode;
  onClick?: () => void;
  /**
   * The element used to render the row.
   * - `"button"` (default when `onClick` is set) — interactive action row
   * - `"div"` (default when no `onClick`) — static / presentational row
   * - `"label"` — wraps a form control (e.g. `<Switch>`); required when the
   *   `right` slot contains a `<button>` so we never produce nested buttons.
   */
  as?: RowTag;
  danger?: boolean;
  badge?: string;
}

export function SettingsRow({
  Icon,
  label,
  subtitle,
  right,
  onClick,
  as,
  danger = false,
  badge,
}: SettingsRowProps) {
  const tag: RowTag = as ?? (onClick ? "button" : "div");
  const interactive = tag !== "div";

  const sharedProps = {
    onClick,
    className: cn(
      "group flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors",
      interactive && "hover:bg-accent/60 active:bg-accent cursor-pointer",
      tag === "button" && "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      tag === "label" && "focus-within:ring-2 focus-within:ring-ring rounded-none",
      danger ? "text-red-400" : "text-foreground",
    ),
  } as const;

  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "h-8 w-8 grid place-items-center rounded-lg shrink-0 border",
          danger
            ? "bg-red-500/10 border-red-500/25 text-red-400"
            : "bg-gradient-silver border-white/10 text-neon",
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={2.2} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{label}</span>
          {badge ? (
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wider rounded-full px-1.5 py-0.5",
                danger ? "bg-red-500/15 text-red-300" : "bg-neon/15 text-neon",
              )}
            >
              {badge}
            </span>
          ) : null}
        </span>
        {subtitle ? (
          <span className="block text-xs text-muted-foreground truncate">{subtitle}</span>
        ) : null}
      </span>
      {right ??
        (onClick && !danger ? (
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5" />
        ) : null)}
    </>
  );

  if (tag === "button") {
    return (
      <button type="button" {...sharedProps}>
        {content}
      </button>
    );
  }
  if (tag === "label") {
    return <label {...sharedProps}>{content}</label>;
  }
  return <div {...sharedProps}>{content}</div>;
}
