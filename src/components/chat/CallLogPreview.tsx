import type { CallLogMessage } from "@/types/chat";
import { useTheme } from "@/hooks/useTheme";
import { CALL_DIRECTION_ICONS, CALL_STATUS_COLORS, CALL_TYPE_ICONS } from "@/constants/callIcons";

interface CallLogPreviewProps {
  callLog: CallLogMessage;
  fromSelf: boolean;
  time: string;
}

function statusLabel(callLog: CallLogMessage): string {
  if (callLog.status === "missed") {
    return callLog.direction === "incoming" ? "Missed voice call" : "No answer";
  }
  if (callLog.status === "rejected") {
    return callLog.direction === "incoming" ? "Declined" : "Call rejected";
  }
  if (callLog.status === "ongoing") {
    return "Ongoing call";
  }
  return callLog.type === "video" ? "Video call" : "Voice call";
}

export function CallLogPreview({ callLog, fromSelf, time }: CallLogPreviewProps) {
  const TypeIcon = CALL_TYPE_ICONS[callLog.type];
  const statusColor = CALL_STATUS_COLORS[callLog.status];
  const directionIcon = CALL_DIRECTION_ICONS[callLog.direction](statusColor);
  const label = statusLabel(callLog);
  const { resolved } = useTheme();
  const isDark = resolved === "dark";

  // For self bubbles, force a high-contrast color so the TypeIcon doesn't
  // blend into the accent-colored bubble (chameleon effect). The semantic
  // status color (red/green/neon) is reserved for incoming logs that sit
  // on the neutral grey --bubble-other background.
  //
  // --primary-foreground inverts between light (near-white) and dark
  // (near-black), so we branch on `isDark` to always land on the token
  // that is high-contrast against the current bubble background.
  const iconColor = fromSelf
    ? isDark
      ? "text-foreground"
      : "text-primary-foreground"
    : statusColor;

  // Self-bubble styling mirrors MessageBubble so text + call-log bubbles
  // stay visually consistent. In dark mode we drop the solid neon fill for
  // a glassmorphic accent that still picks up the theme's --neon glow.
  const selfBubbleClass = isDark
    ? "bg-primary/20 text-foreground border-primary/40 backdrop-blur-md shadow-glow rounded-br-md"
    : "bg-bubble-self text-primary-foreground border-transparent shadow-glow rounded-br-md";

  const metaText = fromSelf
    ? isDark
      ? "text-foreground/60"
      : "text-primary-foreground/70"
    : "text-muted-foreground";

  return (
    <div
      className={`flex items-center gap-3 max-w-[78%] rounded-2xl px-3.5 py-2 border text-sm shadow-silver ${
        fromSelf
          ? selfBubbleClass
          : "bg-bubble-other text-foreground border-border/60 rounded-bl-md"
      }`}
      role="group"
      aria-label={`${label}${callLog.duration ? `, ${callLog.duration}` : ""}`}
    >
      {directionIcon}
      <TypeIcon className={`h-4 w-4 shrink-0 ${iconColor}`} />
      <span className="truncate">{label}</span>
      {callLog.duration ? (
        <span className={`text-xs shrink-0 ${metaText}`}>• {callLog.duration}</span>
      ) : null}
      <span className={`text-[10px] shrink-0 ml-auto ${metaText}`}>{time}</span>
    </div>
  );
}
