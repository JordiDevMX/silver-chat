import type { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
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

  /** Optional floating action button (mobile only). */
  FAB?: ReactNode;

  /** Additional className for the inner viewport wrapper. */
  className?: string;
}

/**
 * Top-level responsive application shell.
 *
 * Breakpoints:
 *  - <  md (<768px)   : Single full-viewport column. Mobile bottom tab bar.
 *  - md – lg (768–1023): Single column on a centered "phone" surface.
 *  - >= lg (>=1024px) : Two-column layout.
 *      [Nav rail 64px] [Main content fills remaining width]
 *
 * The `useIsMobile` hook is the single source of truth for the mobile toggle —
 * no parallel resize listeners or duplicated media queries live in this file.
 */
export function ResponsiveShell({
  children,
  header,
  mobileTabs,
  desktopRail,
  FAB,
  className,
}: ResponsiveShellProps) {
  const isMobile = useIsMobile();

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
        - Tablet+ : the app becomes a centered surface with a subtle silver ring.
      */}
      <div
        className={cn(
          "relative flex h-full w-full flex-col bg-background",
          "md:rounded-3xl md:my-3 md:max-w-[min(100vw-1.5rem,28rem)] md:border md:border-border/60 md:shadow-silver",
          "lg:rounded-3xl lg:max-w-none lg:mx-3 lg:my-3",
          "lg:flex-row",
        )}
      >
        {/*
          Left rail: shown on lg+, identical to the tab icons used in the
          mobile bar so the user gets the same mental model in both modes.
        */}
        {!isMobile ? <DesktopNavRail {...desktopRail} /> : null}

        {/*
          Main column: a single scrollable surface that contains header,
          content, and (on mobile) the bottom tab bar. On lg it grows to
          fill the remaining width.
        */}
        <div
          className={cn(
            "relative flex min-w-0 flex-1 flex-col overflow-hidden",
            "lg:rounded-l-3xl lg:bg-gradient-silver/40",
          )}
        >
          <AppHeader {...header} />
          <main
            id="main"
            className={cn(
              "relative flex-1 overflow-y-auto",
              "pb-24 md:pb-0", // mobile: leave room for bottom tab bar
            )}
          >
            {children}
          </main>
          {FAB && isMobile ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-20 z-30 flex justify-end px-5">
              <div className="pointer-events-auto">{FAB}</div>
            </div>
          ) : null}
          {isMobile ? <MobileTabBar {...mobileTabs} /> : null}
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
}

/**
 * Two/three-pane layout for chat screens.
 *
 *  - <  md   : only `main` is shown; `sidebar` and `aside` are unmounted.
 *  - md – lg : `sidebar` + `main`.
 *  - >= xl   : `sidebar` + `main` + `aside` (if provided).
 */
export function ResponsiveSplit({ sidebar, main, aside }: ResponsiveSplitProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-full w-full">
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
