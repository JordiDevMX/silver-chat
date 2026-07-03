/**
 * Module-level PWA install store with early event capture.
 *
 * The `beforeinstallprompt` event is often fired by the browser *before*
 * React mounts and runs its effects. To avoid losing it, this module
 * registers the `window` listeners at import time (top-level side effect)
 * and exposes a singleton store. The React hook (`usePwaInstall`) reads
 * from this store via `useSyncExternalStore`.
 *
 * Side-effect imported from the app root to guarantee the earliest
 * possible listener registration.
 */

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt: () => Promise<void>;
}

export type InstallOutcome = "accepted" | "dismissed" | "unavailable" | "error";

export interface InstallSnapshot {
  readonly canInstall: boolean;
  readonly isInstalled: boolean;
}

const SERVER_SNAPSHOT: InstallSnapshot = { canInstall: false, isInstalled: false };

function readIsStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

// ── Module-level mutable state ─────────────────────────────────────────
let deferredPrompt: BeforeInstallPromptEvent | null = null;
let isInstalled = false;
let snapshot: InstallSnapshot = SERVER_SNAPSHOT;
const subscribers = new Set<() => void>();

function recomputeAndNotify(): void {
  const canInstall = deferredPrompt !== null && !isInstalled;
  if (canInstall === snapshot.canInstall && isInstalled === snapshot.isInstalled) return;
  snapshot = { canInstall, isInstalled };
  for (const cb of subscribers) cb();
}

// ── Early capture: register listeners at import time ───────────────────
if (typeof window !== "undefined") {
  isInstalled = readIsStandalone();
  snapshot = { canInstall: false, isInstalled };

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    recomputeAndNotify();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    isInstalled = true;
    recomputeAndNotify();
  });

  const mql = window.matchMedia("(display-mode: standalone)");
  mql.addEventListener("change", () => {
    if (mql.matches) {
      isInstalled = true;
      recomputeAndNotify();
    }
  });
}

export const pwaInstallStore = {
  subscribe(cb: () => void): () => void {
    subscribers.add(cb);
    return () => {
      subscribers.delete(cb);
    };
  },
  getSnapshot(): InstallSnapshot {
    return snapshot;
  },
  getServerSnapshot(): InstallSnapshot {
    return SERVER_SNAPSHOT;
  },
  async promptInstall(): Promise<InstallOutcome> {
    if (!deferredPrompt) return "unavailable";
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      const wasAccepted = choice.outcome === "accepted";
      deferredPrompt = null;
      if (wasAccepted) isInstalled = true;
      recomputeAndNotify();
      return wasAccepted ? "accepted" : "dismissed";
    } catch {
      deferredPrompt = null;
      recomputeAndNotify();
      return "error";
    }
  },
};
