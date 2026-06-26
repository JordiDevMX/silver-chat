import { Phone, Video, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CallDirection, CallType, CallStatus } from "@/types/call";

export const CALL_DIRECTION_ICONS: Record<CallDirection, (statusClass: string) => React.ReactNode> =
  {
    incoming: (statusClass) => <ArrowDownLeft className={`h-3 w-3 ${statusClass}`} />,
    outgoing: (statusClass) => <ArrowUpRight className={`h-3 w-3 ${statusClass}`} />,
  };

export const CALL_STATUS_COLORS: Record<CallStatus, string> = {
  missed: "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]",
  rejected: "text-red-400/80",
  ongoing: "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]",
  answered: "text-primary drop-shadow-[0_0_8px_rgba(0,149,255,0.4)]",
};

export const CALL_TYPE_ICONS: Record<CallType, LucideIcon> = {
  voice: Phone,
  video: Video,
};
