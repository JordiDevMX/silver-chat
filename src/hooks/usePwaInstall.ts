import { useSyncExternalStore } from "react";
import { pwaInstallStore } from "@/hooks/pwaInstallStore";
import type { InstallOutcome } from "@/hooks/pwaInstallStore";

export type { InstallOutcome } from "@/hooks/pwaInstallStore";

export interface PwaInstallApi {
  /** True when the browser has signalled installability AND the app is not yet installed. */
  canInstall: boolean;
  /** True when the app is already running in standalone / added-to-home-screen mode. */
  isInstalled: boolean;
  /** Triggers the native install flow. Resolves with the user outcome. */
  promptInstall: () => Promise<InstallOutcome>;
}

/**
 * React adapter for the module-level PWA install store.
 *
 * Uses `useSyncExternalStore` so the snapshot is read on every render
 * (which catches the event captured at module-init time even if no
 * subscriber was attached yet) and so SSR/hydration is handled
 * automatically via `getServerSnapshot` (the prerendered HTML matches
 * the first client render, then a re-render surfaces the captured state).
 */
export function usePwaInstall(): PwaInstallApi {
  const snap = useSyncExternalStore(
    pwaInstallStore.subscribe,
    pwaInstallStore.getSnapshot,
    pwaInstallStore.getServerSnapshot,
  );
  return {
    canInstall: snap.canInstall,
    isInstalled: snap.isInstalled,
    promptInstall: pwaInstallStore.promptInstall,
  };
}
