# Chat Domain

The chat domain is the largest feature area in SilverChat. It covers the conversation list, message threading, message composition, rich content (attachments, call logs), avatars, and the supporting hooks and utilities.

## Overview

Chat functionality lives across two routes:
- **Home** (`/`) — the chat list tab, rendered by `ChatList` + `ChatListPane`
- **Conversation** (`/chat/$id`) — a specific chat thread, rendered by `ConversationPane` inside `ChatRouteShell`

Community channels (`/communities/$communityId/channels/$channelId`) reuse the same message rendering and composition components, so behavior is shared.

## Key Components

### `ConversationPane` (`src/components/chat/ConversationPane.tsx`)

The main conversation thread view. Responsibilities:
- Renders a sticky header with avatar, chat name, call/video buttons, and `ChatHeaderMenu`
- Groups messages by date using `groupByDate()` with `DateSeparator` dividers
- Renders `MessageBubble` for each message
- Auto-scrolls to bottom on new messages via `endRef`
- Includes `ChatComposer` at the bottom for sending messages
- Uses `useChatMessages(chat.id)` for data and send functionality
- Shows `UserInfoPopover` on avatar click and `MemberHoverCard` for group member mentions
- Mobile: shows a back arrow linking to `/`; desktop: back arrow omitted (list is visible in sidebar)

### `ChatListPane` (`src/components/chat/ChatListPane.tsx`)

Renders the scrollable list of chat conversations. Each `ChatRow` links to `/chat/$id` and shows:
- `Avatar` with online status indicator
- Chat name with status icons (verified, muted, blocked, archived, favorite, pinned, group)
- Message preview via `renderMessagePreview()` from `src/constants/chatIcons.tsx`
- Timestamp and unread badge (or message status icon for self-sent messages)
- Active highlight when `chat.id === activeId`

### `MessageBubble` (`src/components/chat/MessageBubble.tsx`)

Renders a single message with a unified "silver-glass" design language:
- **Self messages** — "Accent Glass": translucent primary fill + neon glow halo, tracks the active accent theme
- **Other messages** — "Silver Glass": neutral frosted card + soft depth shadow
- Renders `CallLogPreview` if `message.callLog` is set, `AttachmentPreview` if `message.attachment` is set, otherwise a text bubble
- Shows status glyphs (check, double-check, read indicator) for self-sent messages
- Shows sender name for group messages when `showSender` is true

### `ChatComposer` (`src/components/chat/ChatComposer.tsx`)

Input area for composing and sending messages. Calls `useChatMessages().send(text)`. Trims empty input.

### `AttachmentPreview` (`src/components/chat/AttachmentPreview.tsx`)

Renders attachment-type messages (PDF, image, video, sticker) inside the message thread. Uses the `Attachment` type from `src/types/chat.ts`.

### `CallLogPreview` (`src/components/chat/CallLogPreview.tsx`)

Renders call-log messages inside the thread (missed call, answered call, etc.) as compact cards showing call type, direction, status, and duration. Uses constants from `src/constants/callIcons.tsx`.

### `Avatar` (`src/components/chat/Avatar.tsx`)

Smart avatar component with image/initials fallback:
- If `user.avatarUrl` is set, renders an `<img>` covering a 1:1 circle
- On image error (`onError`), flips to initials variant and never retries that session
- If no `avatarUrl`, renders initials directly
- Optional `gradient` prop for status-driven backgrounds (used by calls page)
- Optional online-status dot (`showStatus` / `statusOnline`)
- Five sizes: `xs`, `sm`, `md`, `lg`, `xl`

### `ChatRouteShell` (`src/components/chat/ChatRouteShell.tsx`)

Route-specific responsive shell for `/chat/$id`. Wraps the conversation in `DesktopNavRail` + `ResponsiveSplit` + `MobileTabBar`. See [Layout & Responsive System](layout.md).

### Supporting Components

| Component | File | Purpose |
|---|---|---|
| `ChatHeaderMenu` | `ChatHeaderMenu.tsx` | ⋯ context menu in conversation header (mute, block, delete, etc.) |
| `UserInfoPopover` | `UserInfoPopover.tsx` | Popover showing user details on avatar click |
| `MemberHoverCard` | `MemberHoverCard.tsx` | Hover card for group member mentions; includes `findMember` helper |
| `DeleteChatDialog` | `DeleteChatDialog.tsx` | Confirmation dialog for deleting a chat |
| `ChatListItem` | `ChatListItem.tsx` | Chat list row + `ChatFAB` export for home tab |

## Hooks

### `useChatMessages` (`src/hooks/useChatMessages.ts`)

The message data hook for conversation threads. Combines:
- **TanStack React Query** for cached message fetching (`messagesQueryKey(chatId)`)
- **`useMutation`** for sending messages (simulated 450ms latency via `setTimeout`)
- **`useOptimistic`** + **`useTransition`** for optimistic updates — a pending message appears immediately, then is replaced when the mutation resolves

```ts
const { messages, isLoading, isSending, send } = useChatMessages(chatId);
```

The `send(text)` function:
1. Trims input; aborts if empty
2. Creates an optimistic message with `status: "pending"` and a temp ID
3. Adds it optimistically via `useOptimistic`
4. Fires the mutation (simulated network delay)
5. On success, appends the real message to the query cache
6. On error, shows a toast via sonner

Route loaders prefetch messages into the cache so the first paint has data ready (see [Architecture](architecture.md)).

## Utilities

### `src/lib/avatar.ts`

- **`getInitials(name)`** — Derives 1–2 character initials from a display name (splits on whitespace, takes first char of each word, caps at 2). Falls back to `"?"` for empty names.
- **`getChatUser(chat)`** — Synthesizes a `User` from a `Chat` object (the single source of truth for "who is the avatar for").
- **`getChatAvatar(chat)`** — Thin wrapper over `getChatUser`, for call sites passing `chat` directly.

### `src/lib/format.ts`

- **`formatMessageDate(date)`** — "Today", "Yesterday", weekday, or full date
- **`formatMessageTime(date)`** — `HH:MM` locale time
- **`isSameDay(a, b)`** — Used for message date grouping

### `src/constants/chatIcons.tsx`

- **`MESSAGE_STATUS_ICONS`** — Maps each `MessageStatus` to a lucide icon (check, double-check, read, clock, alert)
- **`renderMessagePreview(chat)`** — Renders the chat list preview text with group prefix ("You:" / "Sender:"), draft prefix, and deleted message styling

## Message Rich Content

The `Msg` type (`src/types/chat.ts`) carries **at most one** rich variant:
- `attachment` — an `Attachment` (pdf/image/video/sticker)
- `callLog` — a `CallLogMessage` (voice/video, incoming/outgoing, status + duration)
- Plain `text` — always present as fallback for screen readers and chat-list previews

`MessageBubble` checks `callLog` first, then `attachment`, then falls back to text. See [Data Models](data-models.md) for the full type definitions.

## When Changing Chat

- **Adding a message type**: Add a field to `Msg` in `src/types/chat.ts`, add a rendering branch in `MessageBubble.tsx`, add mock data in `src/data/mockMessages.ts`.
- **Changing optimistic send behavior**: Edit `useChatMessages.ts` — the `send` function and `SIMULATED_LATENCY_MS` constant.
- **Changing avatar logic**: `src/lib/avatar.ts` is the single derivation point. The `Avatar` component (`src/components/chat/Avatar.tsx`) handles rendering.
- **Adding context menu actions**: Extend `ChatHeaderMenu.tsx` and wire the action to state or a mutation.