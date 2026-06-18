import { MessageSquarePlus } from "lucide-react";

export function NewChatFAB() {
  return (
    <button
      type="button"
      aria-label="Start new chat"
      className="absolute bottom-24 right-5 h-14 w-14 rounded-2xl bg-gradient-neon text-primary-foreground grid place-items-center shadow-glow hover:scale-105 active:scale-95 transition-transform ring-1 ring-inset ring-white/20"
    >
      <MessageSquarePlus className="h-6 w-6" />
    </button>
  );
}
