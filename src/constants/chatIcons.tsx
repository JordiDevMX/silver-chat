import { Check, CheckCheck, CheckLine, Clock, AlertCircle } from "lucide-react";
import { type MessageStatus, type Chat } from "@/types/chat";

// We use Record<MessageStatus, React.ReactNode> to map each message status to its corresponding icon component. The icons are imported from the lucide-react library and are styled with Tailwind CSS classes for consistent sizing and color.
export const MESSAGE_STATUS_ICONS: Partial<Record<MessageStatus, React.ReactNode>> = {
  sent: <Check className="h-4 w-5 text-muted-foreground" />,
  delivered: <CheckCheck className="h-4 w-5 text-muted-foreground" />,
  read: <CheckLine className="h-4 w-5 text-primary" />,
  pending: <Clock className="h-4 w-5 text-muted-foreground" />,
  failed: <AlertCircle className="h-4 w-5 text-destructive" />,
};

/**
 * 2. Helper supremo para renderizar el texto de la lista general de chats.
 * Mantiene la prioridad exacta: Grupo (Tú/Remitente) -> Borrador -> Mensaje Eliminado/Normal
 */
export function renderMessagePreview(chat: Chat): React.ReactNode {
  const isDeleted = chat.status === "deleted";
  const isDraft = chat.status === "draft";

  return (
    <>
      {/* Prefijo de Grupo: Identifica si dice "You:" o el nombre del compa */}
      {chat.isGroup && (
        <span className="text-foreground/80 font-medium mr-1">
          {chat.fromSelf ? "You:" : chat.lastMessageSender ? `${chat.lastMessageSender}:` : ""}
        </span>
      )}

      {/* Prefijo de Borrador */}
      {isDraft && <span className="text-foreground/80 font-medium mr-1">Draft:</span>}

      {/* Cuerpo principal del mensaje */}
      {isDeleted ? (
        <span className="italic text-foreground/80 font-medium">Message deleted</span>
      ) : (
        chat.lastMessage
      )}
    </>
  );
}
