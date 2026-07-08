# OpenWiki Plan — SilverChat

## Repo identity
SilverChat is a **frontend-only PWA messaging app** built with TanStack Start (React 19) in SPA mode, Vite 8, Tailwind CSS v4, and a large Radix UI + shadcn/ui component kit. All data is mock data — there is no backend. Deployed as a static SPA to Netlify.

## Tech stack
- **Framework**: TanStack Start (SPA mode) + TanStack Router (file-based) + TanStack React Query
- **Build**: Vite 8 with `vite-plugin-pwa`, Tailwind CSS v4 (`@tailwindcss/vite`)
- **UI**: Radix UI primitives, shadcn/ui-style wrappers (`src/components/ui/`), lucide-react icons, vaul (drawer), sonner (toasts), recharts
- **Language**: TypeScript (strict), React 19
- **Package manager**: pnpm (enforced via `preinstall` only-allow)
- **Deploy**: Netlify (static `dist/client`, SPA fallback to `_shell.html`)

## Routes (file-based, generated tree)
- `/` → `src/routes/index.tsx` — Home with tabs: chats, updates, communities, calls
- `/chat/$id` → `src/routes/chat.$id.tsx` — Conversation view
- `/communities/$communityId/channels/$channelId` → `src/routes/communities.$communityId.channels.$channelId.tsx` — Community channel view
- `/about` → `src/routes/about.tsx` — About page
- `__root.tsx` → Root shell: ThemeProvider, QueryClientProvider, PWA store import, Toaster, no-flash theme script

## Major domains / sections for wiki
1. **Architecture & Routing** — TanStack Start SPA, router setup, root shell, route loaders, query client integration
2. **Layout & Responsive System** — ResponsiveShell, ResponsiveSplit, AppHeader, MobileTabBar, DesktopNavRail, useIsMobile/useIsDesktop hooks, Layout facade
3. **Chat Domain** — ConversationPane, ChatListPane, ChatComposer, MessageBubble, AttachmentPreview, CallLogPreview, ChatHeaderMenu, UserInfoPopover, MemberHoverCard, DeleteChatDialog, ChatRouteShell, useChatMessages hook, Avatar, avatar utils
4. **Calls Domain** — Calls list, CallRow, CallOverlay, useCallSession context, callIcons constants, call types
5. **Data & Types** — All mock data files, all type definitions, getMessages function, message status model
6. **Theming & PWA** — useTheme (light/dark/auto + 6 accent colors), styles.css token system, pwaInstallStore, usePwaInstall, InstallPwaButton, manifest.json, vite-plugin-pwa config
7. **Settings** — SettingsSheet, SettingsRow, accent picker, theme integration

## Wiki pages to create
1. `openwiki/quickstart.md` — Overview, tech stack, getting started, links to all sections
2. `openwiki/architecture.md` — SPA architecture, routing, root shell, build/deploy, project structure
3. `openwiki/layout.md` — Responsive layout system, breakpoints, shell components, nav components
4. `openwiki/chat.md` — Chat domain: conversation, list, messages, composer, avatars, hooks
5. `openwiki/calls.md` — Calls domain: list, overlay, session context, call types
6. `openwiki/data-models.md` — Types, mock data, message model, status model
7. `openwiki/theme-pwa.md` — Theme system, accent colors, CSS tokens, PWA install, manifest

That's 7 pages, within the 8-page limit.

## Source evidence
- Architecture: `src/router.tsx`, `src/routes/__root.tsx`, `src/start.ts`, `src/server.ts`, `vite.config.ts`, `netlify.toml`, `src/routeTree.gen.ts`
- Layout: `src/components/layout/ResponsiveShell.tsx`, `Layout.tsx`, `AppHeader.tsx`, `MobileTabBar.tsx`, `DesktopNavRail.tsx`, `src/hooks/use-mobile.tsx`
- Chat: `src/components/chat/ConversationPane.tsx`, `ChatListPane.tsx`, `ChatComposer.tsx`, `MessageBubble.tsx`, `AttachmentPreview.tsx`, `CallLogPreview.tsx`, `ChatHeaderMenu.tsx`, `UserInfoPopover.tsx`, `MemberHoverCard.tsx`, `DeleteChatDialog.tsx`, `ChatRouteShell.tsx`, `Avatar.tsx`, `src/hooks/useChatMessages.ts`, `src/lib/avatar.ts`, `src/lib/format.ts`
- Calls: `src/components/calls/Calls.tsx`, `CallOverlay.tsx`, `src/hooks/useCallSession.tsx`, `src/constants/callIcons.tsx`, `src/types/call.ts`
- Data: `src/data/mockChats.ts`, `mockMessages.ts`, `mockCalls.ts`, `mockCommunities.ts`, `mockChannels.ts`, `mockStories.ts`, `src/types/chat.ts`, `call.ts`, `channel.ts`, `community.ts`, `story.ts`
- Theme/PWA: `src/hooks/useTheme.tsx`, `src/hooks/pwaInstallStore.ts`, `src/hooks/usePwaInstall.ts`, `src/styles.css`, `src/components/layout/InstallPwaButton.tsx`, `public/manifest.json`
- Settings: `src/components/settings/SettingsSheet.tsx`, `SettingsRow.tsx`

## Notes / open questions
- No tests exist (vitest configured but no test files)
- No README, no AGENTS.md, no CLAUDE.md
- `.github/copilot-instructions.md` has "Caveman Mode" style rules
- `src/components/pwa/` dir is empty (components were placed in layout)
- UI components in `src/components/ui/` are standard shadcn/ui — not worth documenting individually
- `skills-lock.json` and `.agents/skills/` exist but seem to be tooling metadata