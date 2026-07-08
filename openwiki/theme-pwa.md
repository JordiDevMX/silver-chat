# Theme & PWA

## Theme System

SilverChat implements a custom theme system built entirely on CSS custom properties (no CSS-in-JS). It supports three mode states and six accent color themes, all controlled via `data-theme` attributes and `.theme-*` classes on the `<html>` element.

### Theme Modes

```ts
type ThemeMode = "light" | "dark" | "auto";
```

- **`light`** — Forces light theme. Sets `data-theme="light"` on `<html>`.
- **`dark`** — Forces dark theme. Sets `data-theme="dark"` on `<html>`.
- **`auto`** — Follows the OS `prefers-color-scheme` media query. Removes `data-theme` attribute so CSS falls through to the `@media (prefers-color-scheme: dark)` override.

### Accent Colors

```ts
const ACCENT_IDS = ["blue", "purple", "red", "orange", "yellow", "green"] as const;
```

Each accent is applied by adding a `.theme-<accent>` class to `<html>`. The default (no class) is Neon Blue.

| Accent ID | Label | Vibe |
|---|---|---|
| `blue` | Neon Blue | Default — electric blue → cyan |
| `purple` | Cyber Purple | Deep violet → magenta |
| `red` | Crimson Red | Vivid red → hot pink |
| `orange` | Plasma Orange | Warm orange → amber |
| `yellow` | Neon Yellow | Bright yellow → lime |
| `green` | Radioactive Green | Emerald → teal |

### `useTheme` hook (`src/hooks/useTheme.tsx`)

The `ThemeProvider` wraps the app in `__root.tsx`. It exposes:

```ts
const { mode, resolved, setMode, cycle, accent, setAccent } = useTheme();
```

- **`mode`** — Current stored mode (`"light" | "dark" | "auto"`)
- **`resolved`** — The actually-active theme (`"light" | "dark"`), resolving `"auto"` against the media query
- **`setMode(mode)`** — Persists to `localStorage` key `"theme"`, applies to DOM
- **`cycle()`** — Cycles through `light → dark → auto`
- **`setAccent(accent)`** — Persists to `localStorage` key `"accent"`, applies `.theme-<accent>` class

State is read from `localStorage` on mount via `useEffect`. The `auto` mode also subscribes to `matchMedia` changes and updates `resolved` reactively.

### No-flash script (`__root.tsx`)

An inline `<script>` in `<head>` runs before React hydrates to prevent theme flash:

```js
// Reads localStorage 'theme' and 'accent', applies data-theme and .theme-* class
// Falls back to 'auto' mode and 'blue' accent if invalid/unset
```

This ensures the correct theme is visible on first paint, matching the hydrated React state.

### CSS Token System (`src/styles.css`)

The token system has three layers:

#### 1. Silver palette (theme-agnostic)

```css
--silver-light: oklch(0.97 0.005 250);
--silver: oklch(0.9 0.008 250);
--silver-dark: oklch(0.78 0.012 250);
```

These cool metallic grays are the same in light and dark mode (overridden in dark).

#### 2. Accent tokens (theme-specific)

Four tokens cascade through the entire UI:
- `--neon` — Primary accent color
- `--neon-glow` — Brighter variant for glows
- `--neon-magenta` — Endpoint for gradients
- `--neon-lime` — Highlight color (flipped for contrast in some themes)

```css
--primary: var(--neon);
--ring: var(--neon);
--gradient-neon: linear-gradient(135deg, var(--neon) 0%, var(--neon-magenta) 100%);
--shadow-glow: 0 0 24px -4px color-mix(in oklab, var(--neon) 55%, transparent), ...;
```

#### 3. Semantic tokens

Standard shadcn/ui semantic tokens (`--background`, `--foreground`, `--card`, `--border`, etc.) are defined separately for `:root` (light) and `:root[data-theme="dark"]` (dark).

### Custom utility classes

- `bg-gradient-silver` — Signature silver metallic gradient
- `bg-gradient-neon` — Accent gradient (neon → magenta)
- `shadow-silver` — Soft depth shadow
- `shadow-glow` — Neon glow halo (tracks accent color)

### ThemeToggle (`src/components/layout/ThemeToggle.tsx`)

A small icon button that calls `useTheme().cycle()`, cycling through light → dark → auto.

## PWA Support

### Overview

SilverChat is a installable PWA with:
- A web manifest (`public/manifest.json`)
- A service worker (via `vite-plugin-pwa` in `vite.config.ts`)
- A module-level install-event capture store
- An install button component

### PWA Install Store (`src/hooks/pwaInstallStore.ts`)

The `beforeinstallprompt` event is often fired by the browser **before** React mounts. To avoid losing it, this module registers `window` listeners at **import time** (top-level side effect) and exposes a singleton store:

```ts
const pwaInstallStore = {
  subscribe(cb): () => void;
  getSnapshot(): InstallSnapshot;       // { canInstall, isInstalled }
  getServerSnapshot(): InstallSnapshot; // { canInstall: false, isInstalled: false }
  promptInstall(): Promise<InstallOutcome>;
};
```

The store tracks:
- `deferredPrompt` — the captured `BeforeInstallPromptEvent`
- `isInstalled` — true when running in standalone mode (`display-mode: standalone` or iOS `navigator.standalone`)

This module is imported as a side-effect in `__root.tsx` to ensure earliest possible listener registration.

### `usePwaInstall` hook (`src/hooks/usePwaInstall.ts`)

React adapter for the module-level store, using `useSyncExternalStore`:

```ts
const { canInstall, isInstalled, promptInstall } = usePwaInstall();
```

- `canInstall` — true when the browser signaled installability AND the app is not yet installed
- `isInstalled` — true when running in standalone/added-to-home-screen mode
- `promptInstall()` — triggers the native install flow, resolves with `"accepted" | "dismissed" | "unavailable" | "error"`

`getServerSnapshot` returns a static false snapshot so SSR/prerender matches the first client render.

### `InstallPwaButton` (`src/components/layout/InstallPwaButton.tsx`)

Renders an "Install" text button (was a download icon, changed to plain text in commit `c2df2ac` for clarity). Only visible when `canInstall` is true. Calls `promptInstall()` on click.

### Vite PWA Config (`vite.config.ts`)

```ts
VitePWA({
  registerType: "autoUpdate",
  includeAssets: ["favicon.ico", "robots.txt"],
  workbox: {
    navigateFallback: "/",
    globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest,jpg}"],
  },
  manifest: false,  // manifest.json is hand-edited, not generated
})
```

`manifest: false` means the manifest is the hand-edited `public/manifest.json` rather than a generated one.

### Web Manifest (`public/manifest.json`)

Key fields:
- `name`: "SilverChat - decentralized glassmorphism messenger"
- `display`: `"standalone"` with `display_override` for `window-controls-overlay`
- `theme_color`: `#0096ff`, `background_color`: `#e3e4e4`
- `protocol_handlers`: `web+silverchat://` protocol → `/?deeplink=%s`
- Icons: SVG (any size), apple-touch-icon (180px), maskable PNGs (192px, 512px)
- Screenshots for desktop and mobile install prompts

## Settings Sheet

### `SettingsSheet` (`src/components/settings/SettingsSheet.tsx`)

A slide-in sheet (`vaul`-based drawer) containing:
- **Accent color picker** — Pills with gradient previews for each of the 6 accents, wired to `useTheme().setAccent()`
- **Theme mode toggle** — Light/dark/auto
- **Privacy settings** — Profile visibility, status privacy (type definitions for `ProfileVisibility`, `StatusPrivacy`)
- **Language selector** — Currently only English and Español are active (`LANGUAGES`)
- **Notification toggles**, **data/storage info**, **about** sections — all UI-only, no backend

### `SettingsRow` (`src/components/settings/SettingsRow.tsx`)

A reusable row component with icon, label, description, and optional trailing element (switch, chevron, etc.).

## When Changing Theme/PWA

- **Adding an accent color**: Add the ID to `ACCENT_IDS` in `useTheme.tsx`, add a `:root.theme-<id>` block with `--neon`/`--neon-glow`/`--neon-magenta`/`--neon-lime` in `styles.css`, add an entry to `ACCENT_OPTIONS` in `SettingsSheet.tsx`. Include light and dark variants if needed.
- **Changing the no-flash script**: The inline script in `__root.tsx` must stay in sync with `applyTheme`/`applyAccent` logic in `useTheme.tsx`.
- **PWA install behavior**: All install state flows through `pwaInstallStore`. The `InstallPwaButton` is the only UI surface. The `beforeinstallprompt` listener registration must remain at module-init time (side-effect import in `__root.tsx`).
- **Manifest changes**: Edit `public/manifest.json` directly (it's not generated by vite-plugin-pwa). The `?v=3` cache-busting query in `__root.tsx` links tag may need bumping.