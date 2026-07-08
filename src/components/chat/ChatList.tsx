import { useTranslation } from "react-i18next";
import type { Chat } from "@/types/chat";
import { ChatListItem } from "./ChatListItem";

interface ChatListProps {
  chats: Chat[];
}

export function ChatList({ chats }: ChatListProps) {
  const { t } = useTranslation();
  if (chats.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-sm text-muted-foreground">
        <p className="capitalize text-foreground font-medium mb-1">{t("chat.noChatsFound")}</p>
        <p>{t("chat.noChatsFoundDesc")}</p>
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
