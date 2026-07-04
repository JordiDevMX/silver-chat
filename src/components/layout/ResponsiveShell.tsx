import type { ReactNode } from "react";
import { useIsMobile, useIsDesktop } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { AppHeaderSearchProps } from "@/components/layout/AppHeader";
import { AppHeader } from "@/components/layout/AppHeader";
import type { MobileTabBarProps } from "@/components/layout/MobileTabBar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import type { DesktopNavRailProps } from "@/components/layout/DesktopNavRail";
import { DesktopNavRail } from "@/components/layout/DesktopNavRail";

interface ResponsiveShellProps {
  children: ReactNode;

  /** Header props (search, title, etc.) — shared across breakpoints. */
  header: AppHeaderSearchProps & {
    onOpenSettings?: () => void;
  };

  /** Mobile bottom tab bar (hidden ≥ md). */
  mobileTabs: MobileTabBarProps;

  /** Desktop left rail — visible ≥ lg, hidden on smaller screens. */
  desktopRail: DesktopNavRailProps;

  /** Optional floating action button. Visible on every breakpoint. */
  FAB?: ReactNode;

  /** Additional className for the inner viewport wrapper. */
  className?: string;
}

/**
 * Top-level responsive application shell.
 *
 * Breakpoints:
 *  - <  lg (<1024px)  : Single full-viewport column. Bottom tab bar mounted
 *                       (covers mobile + tablet).
 *  - >= lg (>=1024px) : Two-column desktop layout, full-width edge-to-edge.
 *                       Vertical nav rail on the left, no bottom tab bar.
 *      [Nav rail 64px] [Main content fills remaining width]
 *
 * The `useIsMobile` and `useIsDesktop` hooks are the single sources of truth
 * for the responsive toggles — no parallel resize listeners or duplicated
 * media queries live in this file.
 */
export function ResponsiveShell({
  children,
  header,
  mobileTabs,
  desktopRail,
  FAB,
  className,
}: ResponsiveShellProps) {
  const isDesktop = useIsDesktop();

  return (
    <div
      className={cn(
        "h-svh w-full overflow-hidden bg-background text-foreground",
        "flex justify-center",
        className,
      )}
    >
      {/*
        Outer container behaviour:
        - Mobile  : stretches edge-to-edge, no rounded surface, no shadow.
        - >= md   : full-width edge-to-edge two-column desktop layout — no
                    rounded surface, no border, no shadow, no inset margins.
      */}
      <div
        className={cn(
          "relative flex h-full w-full flex-col bg-background",
          "md:flex-row",
        )}
      >
        {/*
          Left rail: shown on lg+, identical to the tab icons used in the
          mobile bar so the user gets the same mental model in both modes.
        */}
        {isDesktop ? <DesktopNavRail {...desktopRail} /> : null}

        {/*
          Main column: a single scrollable surface that contains header,
          content, and (on mobile) the bottom tab bar. On lg it grows to
          fill the remaining width.
        */}
        <div
          className={cn(
            "relative flex min-w-0 flex-1 flex-col overflow-hidden",
          )}
        >
          <AppHeader {...header} />
          <main
            id="main"
            className={cn(
              "relative flex-1 overflow-y-auto",
              "pb-24 lg:pb-0", // mobile + tablet: leave room for bottom tab bar
            )}
          >
            {children}
          </main>
          {FAB ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-20 lg:bottom-6 z-30 flex justify-end px-5">
              <div className="pointer-events-auto">{FAB}</div>
            </div>
          ) : null}
          {!isDesktop ? <MobileTabBar {...mobileTabs} /> : null}
        </div>
      </div>
    </div>
  );
}

interface ResponsiveSplitProps {
  /** Sidebar content (chat list, channel list, etc.). Hidden on mobile. */
  sidebar: ReactNode;
  /** Primary content (conversation thread, etc.). Always visible. */
  main: ReactNode;
  /** Optional right rail (members, context). Shown only on xl+. */
  aside?: ReactNode;
  /** Additional className for the root flex container. */
  className?: string;
}

/**
 * Two/three-pane layout for chat screens.
 *
 *  - <  md   : only `main` is shown; `sidebar` and `aside` are unmounted.
 *  - >= md   : `sidebar` + `main` sit side-by-side. The main column
 *               stretches to fill the remaining width.
 *  - >= xl   : `sidebar` + `main` + `aside` (if provided).
 */
export function ResponsiveSplit({ sidebar, main, aside, className }: ResponsiveSplitProps) {
  const isMobile = useIsMobile();

  return (
    <div className={cn("flex h-full w-full", className)}>
      {!isMobile ? (
        <div className="hidden h-full w-80 shrink-0 flex-col border-r border-border/60 bg-card/30 backdrop-blur-xl md:flex">
          {sidebar}
        </div>
      ) : null}
      <div className="flex h-full min-w-0 flex-1 flex-col">{main}</div>
      {!isMobile && aside ? (
        <div className="hidden h-full w-72 shrink-0 flex-col border-l border-border/60 bg-card/30 backdrop-blur-xl xl:flex">
          {aside}
        </div>
      ) : null}
    </div>
  );
}
