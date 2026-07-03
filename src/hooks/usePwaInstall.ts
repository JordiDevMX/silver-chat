import { useCallback, useEffect, useState } from "react";

/**
 * Minimal, spec-compliant shape of the `BeforeInstallPromptEvent` fired by
 * Chromium-based browsers. The DOM lib does not yet expose these members.
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt: () => Promise<void>;
}

export type InstallOutcome = "accepted" | "dismissed" | "unavailable" | "error";

export interface PwaInstallApi {
  /** True when the browser has signalled installability AND the app is not yet installed. */
  canInstall: boolean;
  /** True when the app is already running in standalone / added-to-home-screen mode. */
  isInstalled: boolean;
  /** Triggers the native install flow. Resolves with the user outcome. */
  promptInstall: () => Promise<InstallOutcome>;
}

function readIsStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

/**
 * Captures the browser's `beforeinstallprompt` event and exposes a typed
 * installer. The button stays hidden until the browser actually signals
 * installability, and stays hidden on platforms that don't support the API
 * (notably iOS Safari, which only installs via Share → Add to Home Screen).
 */
export function usePwaInstall(): PwaInstallApi {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Resolve on mount only — avoids SSR hydration mismatch.
    setIsInstalled(readIsStandalone());

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    const mql = window.matchMedia("(display-mode: standalone)");
    const onDisplayModeChange = () => {
      if (mql.matches) setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    mql.addEventListener("change", onDisplayModeChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
      mql.removeEventListener("change", onDisplayModeChange);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<InstallOutcome> => {
    if (!deferredPrompt) return "unavailable";
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
        return "accepted";
      }
      return "dismissed";
    } catch {
      setDeferredPrompt(null);
      return "error";
    }
  }, [deferredPrompt]);

  return {
    canInstall: deferredPrompt !== null && !isInstalled,
    isInstalled,
    promptInstall,
  };
}
