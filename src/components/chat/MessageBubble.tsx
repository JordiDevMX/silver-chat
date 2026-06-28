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

  // Self-bubble styling: light mode keeps the vivid solid-neon "messenger"
  // look; dark mode switches to a glassmorphic accent — semi-transparent
  // primary fill + matching border + backdrop blur + the existing neon
  // shadow-glow halo. Tokens cascade correctly across all 6 themes because
  // --primary / --neon / --shadow-glow are already theme-aware.
  const selfBubbleClass = isDark
    ? "bg-primary/20 text-foreground border-primary/40 backdrop-blur-md shadow-glow rounded-br-md"
    : "bg-bubble-self text-primary-foreground border-transparent shadow-glow rounded-br-md";

  const selfTimeClass = isDark ? "text-foreground/60" : "text-primary-foreground/80";

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
          className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm shadow-silver border ${
            self
              ? selfBubbleClass
              : "bg-bubble-other text-foreground border-border/60 rounded-bl-md"
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
