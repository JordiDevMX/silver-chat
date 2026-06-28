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

  // Unified glass design — mirrors MessageBubble.tsx so text + call-log
  // bubbles feel like siblings. Self uses accent glass + neon glow; sender
  // uses silver glass + soft depth. Translucent fills mean theme-adaptive
  // text-foreground is always the highest-contrast text/icon color.
  const selfBubbleClass = isDark
    ? "bg-primary/20 text-foreground border-primary/40 backdrop-blur-md shadow-glow rounded-br-md"
    : "bg-primary/15 text-foreground border-primary/30 backdrop-blur-md shadow-glow rounded-br-md";

  const otherBubbleClass = isDark
    ? "bg-white/5 text-foreground border-white/10 backdrop-blur-md shadow-silver rounded-bl-md"
    : "bg-silver-light/50 text-foreground border-silver/40 backdrop-blur-md shadow-silver rounded-bl-md";

  // TypeIcon color: self → text-foreground (theme-adaptive, always high-
  // contrast on glass). Sender → semantic status color (red/green/neon)
  // that reads cleanly on the neutral silver background and signals the
  // call outcome.
  const iconColor = fromSelf ? "text-foreground" : statusColor;

  const metaText = fromSelf
    ? isDark
      ? "text-foreground/60"
      : "text-foreground/55"
    : "text-muted-foreground";

  return (
    <div
      className={`flex items-center gap-3 max-w-[78%] rounded-2xl px-3.5 py-2 border text-sm ${
        fromSelf ? selfBubbleClass : otherBubbleClass
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
