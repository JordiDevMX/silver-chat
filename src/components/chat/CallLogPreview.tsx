import type { CallLogMessage } from "@/types/chat";
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

  const metaText = fromSelf ? "text-primary-foreground/70" : "text-muted-foreground";

  return (
    <div
      className={`flex items-center gap-3 max-w-[78%] rounded-2xl px-3.5 py-2 border text-sm shadow-silver ${
        fromSelf
          ? "bg-bubble-self text-primary-foreground border-transparent shadow-glow rounded-br-md"
          : "bg-bubble-other text-foreground border-border/60 rounded-bl-md"
      }`}
      role="group"
      aria-label={`${label}${callLog.duration ? `, ${callLog.duration}` : ""}`}
    >
      {directionIcon}
      <TypeIcon className={`h-4 w-4 shrink-0 ${statusColor}`} />
      <span className="truncate">{label}</span>
      {callLog.duration ? (
        <span className={`text-xs shrink-0 ${metaText}`}>• {callLog.duration}</span>
      ) : null}
      <span className="text-xs font-extralight">{time ? time : "error"}</span>
    </div>
  );
}
