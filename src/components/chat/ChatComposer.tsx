import { useState, type FormEvent } from "react";
import { Plus, Send, Smile } from "lucide-react";

interface ChatComposerProps {
  onSend: (text: string) => void;
}

export function ChatComposer({ onSend }: ChatComposerProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    onSend(value);
    setText("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 bg-gradient-silver border-t border-border/60 backdrop-blur-xl px-3 py-2.5 flex items-end gap-2"
    >
      <button
        type="button"
        aria-label="Attach"
        className="h-10 w-10 grid place-items-center rounded-full bg-card/70 border border-border hover:bg-accent transition-colors shrink-0"
      >
        <Plus className="h-4 w-4" />
      </button>

      <label className="flex-1 flex items-end gap-2 bg-card/80 border border-border rounded-2xl pl-3 pr-2 py-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition">
        <Smile className="h-4 w-4 text-muted-foreground shrink-0 mb-2" />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent);
            }
          }}
          rows={1}
          placeholder="Message…"
          className="flex-1 resize-none bg-transparent outline-hidden text-sm placeholder:text-muted-foreground max-h-32 py-1.5"
        />
      </label>

      <button
        type="submit"
        aria-label="Send"
        disabled={!text.trim()}
        className="h-10 w-10 grid place-items-center rounded-full bg-gradient-neon text-primary-foreground shadow-glow shrink-0 disabled:opacity-40 disabled:shadow-none transition-all hover:-translate-y-0.5"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
