import { Check, CheckCheck, CheckLine, Clock, AlertCircle } from "lucide-react";
import type { MessageStatus, Chat } from "@/types/chat";

// We use Record<MessageStatus, React.ReactNode> to map each message status to its corresponding icon component. The icons are imported from the lucide-react library and are styled with Tailwind CSS classes for consistent sizing and color.
export const MESSAGE_STATUS_ICONS: Partial<Record<MessageStatus, React.ReactNode>> = {
  sent: <Check className="h-4 w-5 text-muted-foreground" />,
  delivered: <CheckCheck className="h-4 w-5 text-muted-foreground" />,
  read: <CheckLine className="h-4 w-5 text-primary" />,
  pending: <Clock className="h-4 w-5 text-muted-foreground" />,
  failed: <AlertCircle className="h-4 w-5 text-destructive" />,
};

/**
 * Major Helper to render text on chatlist
 * Keeps the same priority: Group (You/Sender) -> Draft -> Deleted Msg/Normal
 */
export function renderMessagePreview(chat: Chat): React.ReactNode {
  const isDeleted = chat.status === "deleted";
  const isDraft = chat.status === "draft";

  return (
    <>
      {/* Group Prefix: Tells the diff between "you" & "sender" */}
      {chat.isGroup && (
        <span className="text-foreground/80 font-medium mr-1">
          {chat.fromSelf ? "You:" : chat.lastMessageSender ? `${chat.lastMessageSender}:` : ""}
        </span>
      )}

      {/* Draft Prefix */}
      {isDraft && <span className="text-primary/80 font-medium mr-1">Draft:</span>}

      {/* Main msg's body */}
      {isDeleted ? (
        <span className="italic text-foreground/80 font-medium">Message deleted</span>
      ) : (
        chat.lastMessage
      )}
    </>
  );
}
