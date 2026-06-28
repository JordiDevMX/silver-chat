import type { Msg } from "@/types/chat";
import { Check, CheckCheck, CheckLine } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { AttachmentPreview } from "./AttachmentPreview";
import { CallLogPreview } from "./CallLogPreview";

interface MessageBubbleProps {
  message: Msg;
  showSender?: boolean;
}

function StatusGlyph({ status, self }: { status: Msg["status"]; self: boolean }) {
  if (!self) return null;
  if (status === "read") return <CheckLine className="h-3 w-3" />;
  if (status === "delivered") return <CheckCheck className="h-3 w-3" />;
  if (status === "pending") return <Check className="h-3 w-3 opacity-70" />;
  return <Check className="h-3 w-3" />;
}

export function MessageBubble({ message, showSender = false }: MessageBubbleProps) {
  const self = message.fromSelf;
  const { resolved } = useTheme();
  const isDark = resolved === "dark";

  // ── Unified silver-glass design language ──────────────────────────────
  // Every bubble state uses translucent fill + matching border + backdrop
  // blur, so they read as a single family of objects regardless of sender.
  //
  // Self  → "Accent Glass"  (translucent primary + neon-glow halo)
  //   Light: 15% primary fill, 30% border — a subtle neon tint on the page
  //   Dark:  20% primary fill, 40% border — a richer neon wash on the page
  //   Both use shadow-glow so the accent halo tracks --neon across all 6
  //   themes (Blue/Purple/Red/Orange/Yellow/Green) without hardcoded color.
  //
  // Other → "Silver Glass"   (neutral frosted card + soft depth shadow)
  //   Light: silver-light/50 fill + silver/40 border — frosted white card
  //   Dark:  white/5 fill + white/10 border — whisper of frost on dark page
  //   Both use shadow-silver for soft depth instead of competing with glow.
  const selfBubbleClass = isDark
    ? "bg-primary/20 text-foreground border-primary/40 backdrop-blur-md shadow-glow rounded-br-md"
    : "bg-primary/15 text-foreground border-primary/30 backdrop-blur-md shadow-glow rounded-br-md";

  const otherBubbleClass = isDark
    ? "bg-white/5 text-foreground border-white/10 backdrop-blur-md shadow-silver rounded-bl-md"
    : "bg-silver-light/50 text-foreground border-silver/40 backdrop-blur-md shadow-silver rounded-bl-md";

  const selfTimeClass = isDark ? "text-foreground/60" : "text-foreground/55";

  return (
    <div className={`flex flex-col ${self ? "items-end" : "items-start"}`}>
      {showSender && message.senderName ? (
        <span
          className={`mb-0.5 px-1 text-[11px] font-semibold tracking-tight ${
            self ? "text-muted-foreground" : "text-neon"
          }`}
        >
          {message.senderName}
        </span>
      ) : null}

      {message.callLog ? (
        <CallLogPreview callLog={message.callLog} fromSelf={self} time={message.time} />
      ) : message.attachment ? (
        <AttachmentPreview
          attachment={message.attachment}
          fromSelf={self}
          time={message.time}
          status={message.status}
        />
      ) : (
        <div
          className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm border ${
            self ? selfBubbleClass : otherBubbleClass
          }`}
        >
          <p className="whitespace-pre-wrap break-words leading-snug">{message.text}</p>
          <div
            className={`mt-1 flex items-center gap-1 justify-end text-[10px] ${
              self ? selfTimeClass : "text-muted-foreground"
            }`}
          >
            <span>{message.time}</span>
            <StatusGlyph status={message.status} self={self} />
          </div>
        </div>
      )}
    </div>
  );
}
