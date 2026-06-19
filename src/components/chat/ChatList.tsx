import type { Chat, Msg } from "@/types/chat";
import { ChatListItem } from "./ChatListItem";

interface ChatListProps {
  chats: Chat[];
}

export function ChatList({ chats }: ChatListProps) {
  if (chats.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-sm text-muted-foreground">
        No conversations found.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border/60">
      {chats.map((chat) => (
        <li key={chat.id}>
          <ChatListItem chat={chat} />
        </li>
      ))}
    </ul>
  );
}
