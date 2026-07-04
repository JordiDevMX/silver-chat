import { useState } from "react";
import { CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { cn } from "@/lib/utils";

const BENEFITS = [
  "One-tap launch from your home screen",
  "Fullscreen glassmorphism — no browser chrome",
  "Works offline once installed",
] as const;

/**
 * PWA install affordance.
 *
 * Renders an icon button (matching `ThemeToggle`'s visual rhythm) immediately
 * after the theme toggle. Stays hidden until the browser signals
 * installability, and stays hidden on platforms that don't support
 * `beforeinstallprompt` (iOS Safari). On click, opens a brand-consistent
 * glassmorphic confirmation modal — no native `alert()` — and surfaces the
 * outcome through `sonner` toasts that match the app's existing UI system.
 */
export function InstallPwaButton() {
  const { canInstall, promptInstall } = usePwaInstall();
  const [open, setOpen] = useState(false);

  if (!canInstall) return null;

  const handleInstall = async () => {
    setOpen(false);
    const outcome = await promptInstall();
    if (outcome === "accepted") {
      toast.success("SilverChat installed", {
        description: "Open it from your home screen.",
      });
    } else if (outcome === "error") {
      toast.error("Couldn't start the installer", {
        description: "Try again from your browser's install menu.",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        aria-label="Install SilverChat"
        title="Install SilverChat"
        onClick={() => setOpen(true)}
        className={cn(
          "h-9 px-4 inline-flex items-center justify-center rounded-full",
          "bg-card/70 border border-neon/60",
          "text-foreground text-sm font-semibold tracking-tight",
          "shadow-glow",
          "hover:bg-gradient-neon hover:text-primary-foreground hover:border-neon",
          "hover:shadow-[0_0_24px_-2px_var(--neon)] hover:scale-[1.04] active:scale-[0.97]",
          "transition-all duration-200 ease-out cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
        )}
      >
        Install
      </button>

      <AlertDialogContent
        className={cn(
          "w-[min(22rem,calc(100vw-2rem))] sm:max-w-none gap-0",
          "rounded-2xl border border-white/10 bg-card/80 backdrop-blur-2xl shadow-silver",
          "p-0 overflow-hidden",
        )}
      >
        <div className="px-5 pt-6 pb-3">
          <div className="relative mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-neon shadow-glow grid place-items-center">
            <Download className="h-6 w-6 text-primary-foreground" strokeWidth={2.2} />
            <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/30" />
          </div>

          <AlertDialogHeader className="space-y-1.5 text-center sm:text-center">
            <AlertDialogTitle className="text-base font-semibold tracking-tight">
              Install SilverChat
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Add SilverChat to your home screen for an immersive, always-on experience.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <ul className="mt-4 space-y-2">
            {BENEFITS.map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-xs text-foreground/80">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neon" strokeWidth={2.4} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <AlertDialogFooter className="px-5 pb-5 pt-1 flex-row gap-2 sm:justify-center">
          <AlertDialogCancel
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "flex-1 h-9 rounded-xl border-white/10 bg-white/5 hover:bg-white/10",
            )}
          >
            Not now
          </AlertDialogCancel>
          <Button
            type="button"
            onClick={handleInstall}
            className="flex-1 h-9 rounded-xl shadow-glow"
          >
            <Download className="h-3.5 w-3.5" />
            Install
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
