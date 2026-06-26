import { PhoneCall, Plus } from "lucide-react";
import type { Call } from "@/types/call";
import { CALL_DIRECTION_ICONS, CALL_STATUS_COLORS, CALL_TYPE_ICONS } from "@/constants/callIcons";

function CallRow({ call }: { call: Call }) {
  const TypeIcon = CALL_TYPE_ICONS[call.type];
  const statusColor = CALL_STATUS_COLORS[call.status];

  const directionIcon = CALL_DIRECTION_ICONS[call.direction](statusColor);

  return (
    <div
      role="button"
      tabIndex={0}
      className="group flex items-center gap-3 px-4 py-3 hover:bg-accent/60 active:bg-accent transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative h-12 w-12 rounded-full grid place-items-center bg-gradient-neon text-sm font-semibold text-primary-foreground ring-1 ring-inset ring-white/30 shadow-silver shrink-0">
        <span className="drop-shadow-sm">{call.avatar}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold truncate ${call.status === "missed" ? "text-destructive" : "text-foreground"}`}
        >
          {call.name}
        </p>
        {call.subtitle ? (
          <p className="text-xs text-muted-foreground truncate mb-0.5">{call.subtitle}</p>
        ) : null}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {directionIcon}
          <span className="truncate">{call.time}</span>
          {call.duration ? <span>• {call.duration}</span> : null}
        </div>
      </div>

      <button
        type="button"
        aria-label={call.type === "video" ? `Video call ${call.name}` : `Call ${call.name}`}
        onClick={(e) => e.stopPropagation()}
        className="h-9 w-9 grid place-items-center rounded-full text-neon hover:bg-accent hover:text-neon-glow active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <TypeIcon className="h-5 w-5" strokeWidth={2.2} />
      </button>
    </div>
  );
}

export function CallsFAB() {
  return (
    <button
      type="button"
      aria-label="Start new call"
      className="absolute bottom-24 right-5 z-40 h-14 w-14 rounded-2xl bg-gradient-neon text-primary-foreground grid place-items-center shadow-glow hover:scale-105 active:scale-95 active:brightness-90 transition-all ring-1 ring-inset ring-white/20"
    >
      <span className="relative">
        <PhoneCall className="h-6 w-6" />
        <Plus className="absolute -top-1.5 -right-2 h-3.5 w-3.5" strokeWidth={3} />
      </span>
    </button>
  );
}

export function Calls({ calls }: { calls: Call[] }) {
  if (calls.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-sm text-muted-foreground">
        <p className="capitalize text-foreground font-medium mb-1">No calls found</p>
        <p>Make sure either the email or name is well written</p>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <div className="px-4 pt-3 pb-2">
        <h2 className="text-2xl font-semibold tracking-tight">Calls</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Recent voice and video activity</p>
      </div>

      <div className="px-2">
        <p className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          Recent
        </p>
        <ul className="rounded-2xl bg-card/60 border border-border/60 backdrop-blur-xl shadow-silver overflow-hidden divide-y divide-border/50">
          {calls.map((call) => (
            <li key={call.id}>
              <CallRow call={call} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
