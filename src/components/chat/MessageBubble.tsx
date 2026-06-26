import type { Msg } from "@/types/chat";
import { Check, CheckCheck, CheckLine } from "lucide-react";

interface MessageBubbleProps {
  message: Msg;
  showSender?: boolean;
}

export function MessageBubble({ message, showSender = false }: MessageBubbleProps) {
  const self = message.fromSelf;
  return (
    <div className={`flex flex-col ${self ? "items-end" : "items-start"}`}>
      {showSender && message.senderName ? (
        <span
          className={[
            "mb-0.5 px-1 text-[11px] font-semibold tracking-tight",
            self ? "text-muted-foreground" : "text-neon",
          ].join(" ")}
        >
          {message.senderName}
        </span>
      ) : null}
      <div
        className={[
          "max-w-[78%] rounded-2xl px-3.5 py-2 text-sm shadow-silver border",
          self
            ? "bg-bubble-self text-primary-foreground border-transparent shadow-glow rounded-br-md"
            : "bg-bubble-other text-foreground border-border/60 rounded-bl-md",
        ].join(" ")}
      >
        <p className="whitespace-pre-wrap break-words leading-snug">{message.text}</p>
        <div
          className={[
            "mt-1 flex items-center gap-1 justify-end text-[10px]",
            self ? "text-primary-foreground/80" : "text-muted-foreground",
          ].join(" ")}
        >
          <span>{message.time}</span>
          {self &&
            (message.status === "read" ? (
              <CheckLine className="h-3 w-3 text-white" />
            ) : message.status === "delivered" ? (
              <CheckCheck className="h-3 w-3" />
            ) : message.status === "pending" ? (
              <Check className="h-3 w-3 opacity-70" />
            ) : (
              <Check className="h-3 w-3" />
            ))}
        </div>
      </div>
    </div>
  );
}
