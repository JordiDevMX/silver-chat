import type { Message } from "@/types/chat";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const self = message.fromSelf;
  return (
    <div className={`flex ${self ? "justify-end" : "justify-start"}`}>
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
              <CheckCheck className="h-3 w-3 text-white" />
            ) : message.status === "delivered" ? (
              <CheckCheck className="h-3 w-3" />
            ) : (
              <Check className="h-3 w-3" />
            ))}
        </div>
      </div>
    </div>
  );
}
