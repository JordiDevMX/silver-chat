import { Check, CheckCheck, CheckLine, Clock, AlertCircle } from "lucide-react";
import { type Chat } from "@/types/chat";

type MessageStatus = NonNullable<Chat["status"]>;

// We use Record<MessageStatus, React.ReactNode> to map each message status to its corresponding icon component. The icons are imported from the lucide-react library and are styled with Tailwind CSS classes for consistent sizing and color.
export const MESSAGE_STATUS_ICONS: Record<MessageStatus, React.ReactNode> = {
  sent: <Check className="h-4 w-5 text-primary-foreground" />,
  delivered: <CheckCheck className="h-4 w-5 text-primary-foreground" />,
  read: <CheckLine className="h-4 w-5 text-primary" />,
  pending: <Clock className="h-4 w-5 text-muted-foreground" />,
  failed: <AlertCircle className="h-4 w-5 text-destructive" />,
  draft: undefined,
  deleted: undefined,
};
