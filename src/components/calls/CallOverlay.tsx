import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { CALL_STATUS_GRADIENTS } from "@/constants/callIcons";
import { useCallSession, formatCallDuration } from "@/hooks/useCallSession";
import type { CallPhase } from "@/hooks/useCallSession";
import { Avatar } from "@/components/chat/Avatar";
import { cn } from "@/lib/utils";

function statusText(
  phase: CallPhase,
  isVideo: boolean,
  t: ReturnType<typeof useTranslation>["t"],
): string {
  switch (phase) {
    case "connecting":
      return isVideo ? t("calls.connectingVideo") : t("calls.connecting");
    case "ongoing":
      return isVideo ? t("calls.ongoingVideo") : t("calls.ongoingVoice");
    case "ended":
      return t("calls.ended");
    default:
      return "";
  }
}

interface ControlButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  Icon: LucideIcon;
  variant: "neutral" | "end";
}

function ControlButton({ label, active, onClick, Icon, variant }: ControlButtonProps) {
  const isEnd = variant === "end";
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isEnd ? undefined : active}
      onClick={onClick}
      className={cn(
        "h-14 w-14 grid place-items-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95",
        isEnd
          ? "bg-red-500 text-white shadow-[0_8px_24px_-4px_rgba(239,68,68,0.55)] hover:bg-red-600"
          : active
            ? "bg-card/90 text-foreground border border-border shadow-silver hover:bg-card"
            : "bg-neon text-primary-foreground shadow-glow hover:bg-neon/90",
      )}
    >
      <Icon className="h-6 w-6" strokeWidth={2.2} />
    </button>
  );
}

export function CallOverlay() {
  const { t } = useTranslation();
  const { call, phase, seconds, isMuted, isVideoEnabled, end, toggleMute, toggleVideo } =
    useCallSession();

  const open = phase !== "idle";
  const isVideoCall = call?.type === "video";
  const showVideo = isVideoEnabled && phase === "ongoing";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) end();
      }}
    >
      <DialogPortal>
        <DialogOverlay className="bg-black/70 backdrop-blur-xl" />
        <DialogPrimitive.Content
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-[min(28rem,calc(100vw-2rem))] max-w-none translate-x-[-50%] translate-y-[-50%] gap-0 border border-white/10 bg-card/70 backdrop-blur-2xl shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6)] p-8 sm:rounded-3xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "duration-200",
          )}
        >
          {call ? (
            <div
              data-testid="call-overlay"
              data-phase={phase}
              className="flex flex-col items-center gap-6"
            >
              <div
                aria-hidden="true"
                className={cn(
                  "relative h-28 w-28 rounded-full",
                  phase === "connecting" && "animate-pulse",
                )}
              >
                <Avatar
                  user={{ name: call.name, avatarUrl: call.avatarUrl }}
                  size="xl"
                  gradient={CALL_STATUS_GRADIENTS.ongoing}
                  innerClassName="h-28 w-28 text-3xl ring-1 ring-inset ring-white/30"
                />
                <span
                  className={cn(
                    "absolute inset-0 rounded-full ring-2 ring-neon/60 pointer-events-none",
                    phase === "ongoing" ? "animate-ping" : "hidden",
                  )}
                />
              </div>

              <div className="text-center space-y-1">
                <DialogPrimitive.Title className="text-xl font-semibold tracking-tight text-foreground">
                  {call.name}
                </DialogPrimitive.Title>
                {call.subtitle ? (
                  <DialogPrimitive.Description className="text-xs text-muted-foreground">
                    {call.subtitle}
                  </DialogPrimitive.Description>
                ) : (
                  <DialogPrimitive.Description className="sr-only">
                    {t("calls.activeCallWith", { name: call.name })}
                  </DialogPrimitive.Description>
                )}
                <p aria-live="polite" className="text-sm text-muted-foreground">
                  {statusText(phase, isVideoCall, t)}
                </p>
                <p
                  aria-live="off"
                  className={cn(
                    "text-2xl font-mono tabular-nums tracking-tight",
                    phase === "ongoing" ? "text-foreground" : "text-muted-foreground/60",
                  )}
                >
                  {phase === "ongoing" || phase === "ended" ? formatCallDuration(seconds) : "00:00"}
                </p>
              </div>

              {showVideo ? (
                <div
                  aria-hidden="true"
                  className="w-full aspect-video rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 grid place-items-center"
                >
                  <Video className="h-10 w-10 text-muted-foreground/40" strokeWidth={1.4} />
                </div>
              ) : null}

              <div className="flex items-center gap-4 pt-2" role="group" aria-label={t("calls.callControls")}>
                <ControlButton
                  label={isMuted ? t("calls.unmuteMic") : t("calls.muteMic")}
                  active={!isMuted}
                  onClick={toggleMute}
                  Icon={isMuted ? MicOff : Mic}
                  variant="neutral"
                />

                <ControlButton
                  label={isVideoEnabled ? t("calls.turnCameraOff") : t("calls.turnCameraOn")}
                  active={isVideoEnabled}
                  onClick={toggleVideo}
                  Icon={isVideoEnabled ? Video : VideoOff}
                  variant="neutral"
                />

                <ControlButton
                  label={t("calls.endCall")}
                  active={false}
                  onClick={end}
                  Icon={PhoneOff}
                  variant="end"
                />
              </div>
            </div>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
