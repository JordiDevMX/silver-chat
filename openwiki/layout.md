# Layout & Responsive System

SilverChat uses a breakpoint-driven layout system with two distinct navigation modes: a **bottom tab bar** for mobile and tablet, and a **vertical nav rail** for desktop. The system is built around two hooks and a set of composable shell components.

## Breakpoint Hooks (`src/hooks/use-mobile.tsx`)

| Hook | Breakpoint | Returns `true` when |
|---|---|---|
| `useIsMobile()` | `max-width: 767px` (Tailwind `md`) | viewport is below `md` |
| `useIsDesktop()` | `min-width: 1024px` (Tailwind `lg`) | viewport is at or above `lg` |

These are the **single sources of truth** for responsive toggling. No component re-implements its own media query listener.

The gap between `md` (768px) and `lg` (1024px) means tablets fall into the "mobile" navigation mode (bottom tab bar), which is intentional — the desktop rail only activates at `lg+`.

## Shell Components

### `Layout` (`src/components/layout/Layout.tsx`)

A **façade** that preserves the original Layout API while delegating to `ResponsiveShell`. Routes like `index.tsx` use this as the main wrapper. It accepts `activeTab`, `badges`, `search`, `onSearchChange`, `FAB`, and `onOpenSettings`, forwarding them to the shell.

### `ResponsiveShell` (`src/components/layout/ResponsiveShell.tsx`)

The top-level application shell for the home view. It composes:

- **`DesktopNavRail`** — shown when `useIsDesktop()` is true (lg+)
- **`AppHeader`** — always rendered, sticky to top of main column
- **`<main>`** — scrollable content area with bottom padding on mobile for the tab bar
- **`FAB`** — optional floating action button, positioned bottom-right
- **`MobileTabBar`** — shown when `!useIsDesktop()` (below lg)

Layout behavior:
- **< lg**: Single full-viewport column. Bottom tab bar mounted. Edge-to-edge, no rounded surface.
- **>= lg**: Two-column — nav rail (68px) on left, main content fills remaining width. No bottom bar.

### `ResponsiveSplit` (same file)

A two/three-pane layout used by chat and community channel routes:

- **< md**: Only `main` is shown. `sidebar` and `aside` are unmounted.
- **>= md**: `sidebar` (320px) + `main` side-by-side.
- **>= xl**: `sidebar` + `main` + optional `aside` (288px, right rail).

Used by `ChatRouteShell` to show the chat list sidebar alongside the conversation pane on desktop.

### `ChatRouteShell` (`src/components/chat/ChatRouteShell.tsx`)

Route-specific shell for `/chat/$id`. Combines `DesktopNavRail` + `ResponsiveSplit` + `MobileTabBar`. The sidebar contains `PaneHeader` + `ChatListPane`; the main slot receives the `ConversationPane`. An optional `aside` is reserved for future right-rail features (pinned messages, shared media — currently "Coming Soon").

## Header Components

### `AppHeader` (`src/components/layout/AppHeader.tsx`)

Cross-breakpoint header with two modes:

1. **Home mode** (no `title`/`back`): Brand mark (SilverChat logo), search bar, `ThemeToggle`, `SettingsButton`, `InstallPwaButton`. Sticky to top.
2. **Detail mode** (has `title` and/or `back`): Back arrow + screen title. Brand row hidden. Used by conversation views on mobile.

### `PaneHeader` (`src/components/layout/PaneHeader.tsx`)

A compact header for the sidebar pane in split layouts. Contains search input + settings button.

### `SettingsButton` (`src/components/layout/SettingsButton.tsx`)

A small reusable button component that opens the settings sheet. Replaced individual button implementations in `AppHeader`, `Header`, and `PaneHeader` for consistency (commit `694cf89`).

## Navigation Components

### `MobileTabBar` (`src/components/layout/MobileTabBar.tsx`)

Bottom navigation bar with 4 tabs: **Chats**, **Updates**, **Communities**, **Calls**. Each tab shows a lucide icon and optional unread badge. The active tab gets a neon gradient pill background. Shown below `lg` (also hides via `lg:hidden` class).

### `DesktopNavRail` (`src/components/layout/DesktopNavRail.tsx`)

Left vertical navigation rail for `lg+`. Mirrors the exact tab set from `MobileTabBar` with the same active-state styling. Includes a brand mark at top, hover tooltips for each item, and a sign-out icon at the bottom (currently non-functional). Width is 68px.

The tab sets in `MobileTabBar` and `DesktopNavRail` are deliberately identical so users get the same mental model across viewports.

## FAB (Floating Action Button)

### `FloatingActionButton` (`src/components/layout/FloatingActionButton.tsx`)

A reusable circular FAB with an icon, optional badge icon, label, and click handler. Used by:
- `CallsFAB` in `Calls.tsx` — triggers a new call via `useCallSession().start()`
- `ChatFAB` in `ChatListItem.tsx` — triggers a new chat

Positioned via `absolute` classes passed in `className`.

## Tab System

The four tabs are defined by the `TabKey` type (`src/types/chat.ts`):

```ts
export type TabKey = "chats" | "updates" | "communities" | "calls";
```

On the home route (`index.tsx`), tab state is local `useState`. Tab content is conditionally rendered: `ChatList`, `Updates`, `Communities`, or `Calls`. On the chat detail route, tapping a non-chats tab navigates back to `/`.

## When Changing Layout

- **Adding a tab**: Update `TabKey` in `src/types/chat.ts`, add the tab to `TABS` in `MobileTabBar.tsx` and `RAIL_ITEMS` in `DesktopNavRail.tsx`, then add conditional content rendering in `src/routes/index.tsx`.
- **Changing breakpoints**: Edit the media queries in `use-mobile.tsx`. Note the `md`/`lg` gap is intentional — don't collapse them without considering the nav mode switch.
- **Adding a new shell**: Study `ChatRouteShell` as the pattern for route-specific shells that compose `DesktopNavRail` + `ResponsiveSplit` + `MobileTabBar`.