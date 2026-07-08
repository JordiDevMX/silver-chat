import type { Attachment, MessageStatus } from "@/types/chat";
import { useTranslation } from "react-i18next";
import { FileText, Image as ImageIcon, Play, Download } from "lucide-react";

interface AttachmentPreviewProps {
  attachment: Attachment;
  fromSelf: boolean;
  time: string;
  status: MessageStatus;
}

const DEFAULT_HUE =
  "linear-gradient(135deg, oklch(0.55 0.18 280 / 0.6), oklch(0.4 0.15 230 / 0.4))";

function TimeChip({
  fromSelf,
  time,
  status,
}: {
  fromSelf: boolean;
  time: string;
  status: MessageStatus;
}) {
  const cls = fromSelf ? "text-primary-foreground/80" : "text-muted-foreground";
  return (
    <span className={["text-[10px] inline-flex items-center gap-1", cls].join(" ")}>
      {time}
      {fromSelf &&
      (status === "read" || status === "delivered" || status === "sent" || status === "pending") ? (
        <span className="opacity-80">
          {status === "read"
            ? "✓✓"
            : status === "delivered"
              ? "✓✓"
              : status === "pending"
                ? "…"
                : "✓"}
        </span>
      ) : null}
    </span>
  );
}

export function AttachmentPreview({ attachment, fromSelf, time, status }: AttachmentPreviewProps) {
  const { t } = useTranslation();
  // Sticker: borderless, no bubble — large emoji with neon glow.
  if (attachment.kind === "sticker") {
    return (
      <div className="flex flex-col items-end max-w-[200px]">
        <div
          className="text-7xl leading-none drop-shadow-[0_0_24px_oklch(0.7_0.2_300/0.55)]"
          aria-label={attachment.name}
        >
          {attachment.emoji ?? "👻"}
        </div>
        <div className="mt-1">
          <TimeChip fromSelf={fromSelf} time={time} status={status} />
        </div>
      </div>
    );
  }

  // PDF: compact document card with icon, name, size, and download glyph.
  if (attachment.kind === "pdf") {
    return (
      <div
        className={[
          "flex items-center gap-3 max-w-[78%] rounded-2xl px-3.5 py-2.5 border text-sm shadow-silver",
          fromSelf
            ? "bg-bubble-self text-primary-foreground border-transparent shadow-glow rounded-br-md"
            : "bg-bubble-other text-foreground border-border/60 rounded-bl-md",
        ].join(" ")}
      >
        <div className="h-10 w-10 rounded-xl bg-red-500/15 grid place-items-center shrink-0 border border-red-500/30">
          <FileText className="h-5 w-5 text-red-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{attachment.name}</p>
          <p
            className={[
              "text-[10px] mt-0.5",
              fromSelf ? "text-primary-foreground/70" : "text-muted-foreground",
            ].join(" ")}
          >
            {attachment.size ? `${attachment.size} · ` : ""}{t("chat.pdfDocument")}
          </p>
        </div>
        <Download
          className={[
            "h-4 w-4 shrink-0",
            fromSelf ? "text-primary-foreground/70" : "text-muted-foreground",
          ].join(" ")}
        />
        <TimeChip fromSelf={fromSelf} time={time} status={status} />
      </div>
    );
  }

  // Image / Video: rounded glassmorphic thumbnail card with footer.
  const isVideo = attachment.kind === "video";
  const aspect = isVideo ? "aspect-video" : "aspect-[4/3]";
  const widthClass = isVideo ? "w-72" : "w-64";

  return (
    <div
      className={[
        "max-w-[78%] rounded-2xl overflow-hidden border shadow-silver",
        fromSelf ? "border-transparent shadow-glow" : "border-border/60",
      ].join(" ")}
    >
      <div
        className={`${widthClass} ${aspect} relative grid place-items-center`}
        style={{ background: attachment.hue ?? DEFAULT_HUE }}
        role="img"
        aria-label={attachment.name}
      >
        {isVideo ? (
          <>
            <div className="h-12 w-12 rounded-full bg-black/40 backdrop-blur-md grid place-items-center ring-1 ring-inset ring-white/30">
              <Play className="h-5 w-5 text-white fill-white" />
            </div>
            {attachment.duration ? (
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur text-white text-[10px] font-medium">
                {attachment.duration}
              </span>
            ) : null}
          </>
        ) : (
          <ImageIcon className="h-7 w-7 text-foreground/30" strokeWidth={1.5} />
        )}
      </div>
      <div
        className={[
          "px-3 py-1.5 flex items-center justify-between gap-2",
          fromSelf
            ? "bg-gradient-to-br from-neon/30 to-neon-magenta/20 text-primary-foreground"
            : "bg-card/60 text-foreground",
        ].join(" ")}
      >
        <p className="text-xs truncate min-w-0">{attachment.name}</p>
        <TimeChip fromSelf={fromSelf} time={time} status={status} />
      </div>
    </div>
  );
}
