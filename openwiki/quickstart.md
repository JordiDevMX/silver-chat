# SilverChat — OpenWiki Quickstart

SilverChat is a **frontend-only progressive web app (PWA)** that simulates a modern messaging experience with a sleek silver-and-neon glassmorphism design. Built with TanStack Start (React 19) in SPA mode, it runs entirely on mock data — there is no backend server, database, or API.

The app replicates the structure of a WhatsApp/Telegram-style messenger: chats, calls, communities, stories/updates, settings, theming, and PWA install — all driven by in-memory mock datasets and React context state.

## Tech Stack

| Area | Technology |
|---|---|
| Framework | TanStack Start (SPA mode) + TanStack Router (file-based) |
| Data layer | TanStack React Query (cache), mock data modules |
| UI primitives | Radix UI + shadcn/ui-style wrappers, lucide-react icons |
| Styling | Tailwind CSS v4, custom CSS token system, OKLCH colors |
| Build | Vite 8, `vite-plugin-pwa` |
| Language | TypeScript (strict mode) |
| Package manager | pnpm (enforced) |
| Deploy | Netlify (static `dist/client`, SPA fallback) |

## Getting Started

```bash
pnpm install          # install dependencies (pnpm is enforced)
pnpm run dev          # start dev server on port 3000
pnpm run build        # production build → dist/client
pnpm run preview      # preview production build locally
pnpm run test         # run vitest (configured, no test files yet)
pnpm run lint         # eslint
pnpm run format       # prettier + eslint --fix
pnpm run generate-routes  # regenerate route tree (after adding routes)
```

## Project Structure

```
src/
├── routes/              File-based routes (TanStack Router)
│   ├── __root.tsx       Root shell: providers, theme, PWA, toaster
│   ├── index.tsx        Home — tabs: chats, updates, communities, calls
│   ├── chat.$id.tsx     Conversation view (per chat)
│   ├── communities.$communityId.channels.$channelId.tsx
│   └── about.tsx        About page
├── components/
│   ├── chat/            Chat domain (conversation, list, messages, avatar)
│   ├── calls/           Call domain (list, overlay)
│   ├── communities/     Communities list + new community dialog
│   ├── updates/         Stories and discover channels
│   ├── layout/           Responsive shell, headers, nav, FAB, PWA button
│   ├── settings/         Settings sheet + rows
│   └── ui/              shadcn/ui components (Radix-based)
├── hooks/               useTheme, useCallSession, useChatMessages, PWA, mobile
├── data/                Mock datasets (chats, messages, calls, communities, etc.)
├── types/               TypeScript interfaces for all domain models
├── lib/                 Utilities (avatar, format, cn, error handling)
├── constants/           Icon/gradient maps for chat & call statuses
└── styles.css           Theme token system (silver palette, 6 accent themes)
```

## Key Concepts

- **All data is mock data** — no API calls, no persistence. Mock datasets live in `src/data/` and are consumed directly by routes and components.
- **TanStack React Query** is used for message caching and optimistic sends, but the "server" is a setTimeout-based mock (`useChatMessages`).
- **Theme system** supports light/dark/auto modes plus 6 accent color themes, driven entirely by CSS custom properties — no CSS-in-JS.
- **PWA support** includes a module-level install-event capture store, a install button, web manifest, and vite-plugin-pwa workbox caching.
- **Responsive design** uses two breakpoint hooks (`useIsMobile` at `md`, `useIsDesktop` at `lg`) to switch between bottom tab bar (mobile/tablet) and vertical nav rail (desktop).

## Documentation Sections

- [Architecture & Routing](architecture.md) — SPA setup, router, root shell, build/deploy, project structure
- [Layout & Responsive System](layout.md) — ResponsiveShell, breakpoints, nav components, headers, FAB
- [Chat Domain](chat.md) — Conversation, list, messages, composer, avatars, message hooks
- [Calls Domain](calls.md) — Call list, overlay, session context, call types and icons
- [Data Models](data-models.md) — TypeScript types, mock data, message status lifecycle
- [Theme & PWA](theme-pwa.md) — Theme system, accent colors, CSS tokens, PWA install flow

## Where to Start When Modifying

| You want to... | Start here |
|---|---|
| Add a new route | `src/routes/` + run `pnpm run generate-routes` |
| Change layout breakpoints | `src/hooks/use-mobile.tsx` + `src/components/layout/ResponsiveShell.tsx` |
| Add a chat feature | `src/components/chat/` + `src/hooks/useChatMessages.ts` |
| Add a call feature | `src/components/calls/` + `src/hooks/useCallSession.tsx` |
| Change theme colors | `src/styles.css` + `src/hooks/useTheme.tsx` |
| Add mock data | `src/data/` + corresponding `src/types/` interface |
| Add a UI component | `src/components/ui/` (shadcn/ui pattern) |