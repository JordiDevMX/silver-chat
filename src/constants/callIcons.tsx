import type { LucideIcon } from "lucide-react";
import { Phone, Video, ArrowUpRight, ArrowDownLeft } from "lucide-react";
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
  answered: "text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.45)]",
};

// Both keys are exhaustively typed against CallType, so the lookup in
// CallLogPreview / CallRow can never resolve to undefined.
export const CALL_TYPE_ICONS: Record<CallType, LucideIcon> = {
  voice: Phone,
  video: Video,
};

export const CALL_STATUS_GRADIENTS: Record<CallStatus, string> = {
  answered: "var(--gradient-neon)",
  missed: "linear-gradient(135deg, oklch(0.62 0.23 25), oklch(0.45 0.2 30))",
  rejected: "linear-gradient(135deg, oklch(0.55 0.18 25), oklch(0.4 0.15 30))",
  ongoing: "linear-gradient(135deg, oklch(0.7 0.2 145), oklch(0.5 0.22 160))",
};
