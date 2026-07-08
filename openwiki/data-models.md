# Data Models

SilverChat is entirely mock-data driven. There is no backend, database, or API — all data is hardcoded TypeScript objects in `src/data/` consumed directly by components and route loaders. Understanding the type system is essential for any feature work.

## Type Definitions (`src/types/`)

### Chat (`src/types/chat.ts`)

The core chat type and its supporting types:

```ts
type TabKey = "chats" | "updates" | "communities" | "calls";
type MessageStatus = "sent" | "delivered" | "read" | "failed" | "pending" | "draft" | "deleted";
```

#### `User`

The canonical user/participant model. Represents any person — DM counterpart, group participant, or call peer.

```ts
interface User {
  id: string;
  name: string;
  avatarUrl?: string;    // When absent, Avatar falls back to initials
  role?: "admin" | "moderator" | "member";
}
```

`GroupUser` is a **deprecated** back-compat alias for `User` (kept for migration). New code should use `User` directly.

#### `Chat`

```ts
interface Chat {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarGradient?: string;     // Background gradient for initials fallback
  lastMessage: string;
  time: string;
  unread: number;
  status?: MessageStatus;
  isOnline?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  isVerified?: boolean;
  isBlocked?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
  fromSelf?: boolean;          // Last message sent by current user
  isGroup?: boolean;
  participants?: User[];
  lastMessageSender?: string;   // Group prefix: "Sender:" in preview
}
```

#### `Msg` — Message

A message carries **at most one** rich variant (`attachment` or `callLog`). Plain `text` is always present as fallback.

```ts
interface Msg {
  id: string;
  text: string;
  time: string;
  date: Date;
  fromSelf: boolean;
  senderName?: string;          // For group messages
  status: MessageStatus;
  isOnline?: boolean;
  attachment?: Attachment;       // Mutually exclusive with callLog
  callLog?: CallLogMessage;     // Mutually exclusive with attachment
}
```

#### `Attachment`

```ts
type AttachmentKind = "pdf" | "image" | "video" | "sticker";

interface Attachment {
  kind: AttachmentKind;
  name: string;
  size?: string;
  width?: number;
  height?: number;
  duration?: string;   // For videos
  emoji?: string;      // For stickers
  hue?: string;
}
```

#### `CallLogMessage`

Embedded in chat messages to represent a call that was placed/received within the conversation:

```ts
interface CallLogMessage {
  type: CallType;       // "voice" | "video"
  direction: CallDirection; // "incoming" | "outgoing"
  status: CallStatus;   // "missed" | "answered" | "rejected" | "ongoing"
  duration?: string;
}
```

### Call (`src/types/call.ts`)

```ts
type CallType = "voice" | "video";
type CallDirection = "incoming" | "outgoing";
type CallStatus = "missed" | "answered" | "rejected" | "ongoing";

interface Call {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
  subtitle?: string;     // e.g. "Unknown — possible spam"
  isUnknown?: boolean;
  type: CallType;
  direction: CallDirection;
  status: CallStatus;
  time: string;
  duration?: string;
}
```

### Community (`src/types/community.ts`)

```ts
interface SubChannel {
  id: string;
  name: string;
  type: "announcements" | "group";
  lastMessage: string;
  time: string;
  muted?: boolean;
  avatarGradient?: string;
}

interface Community {
  id: string;
  name: string;
  avatarGradient: string;
  channels: SubChannel[];
  hiddenCount: number;
}
```

### Channel (`src/types/channel.ts`)

Two types for the Updates/Discover tab:

```ts
interface Channel {
  id: string;
  name: string;
  verified?: boolean;
  avatarGradient: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface DiscoverChannel {
  id: string;
  name: string;
  verified?: boolean;
  avatarGradient: string;
  followers: string;
  description: string;
}
```

### Story (`src/types/story.ts`)

```ts
interface Story {
  id: string;
  author: string;
  avatarGradient: string;
  preview: string;       // CSS gradient for card background
  caption: string;
  time: string;
  viewed: boolean;
  isMuted?: boolean;
  fromSelf?: boolean;
}
```

## Mock Data (`src/data/`)

| File | Export | Type | Used by |
|---|---|---|---|
| `mockChats.ts` | `rawChats`, `mockChats` | `Chat[]` | Home chat list, conversation route loader |
| `mockMessages.ts` | `mockMessages`, `getMessages()` | `Record<string, Msg[]>` + helper | `useChatMessages`, route loaders |
| `mockCalls.ts` | `mockCalls` | `Call[]` | Home calls tab, `CallsFAB` |
| `mockCommunities.ts` | `communities` | `Community[]` | Communities tab, channel route loader |
| `mockChannels.ts` | `followedChannels`, `discoverChannels` | `Channel[]`, `DiscoverChannel[]` | Updates tab |
| `mockStories.ts` | `myStory`, `friendStories` | `Story \| null`, `Story[]` | Updates tab |

### `getMessages(chatId)` (`src/data/mockMessages.ts`)

The lookup function for message threads. Returns `mockMessages[chatId]` or a default welcome message if the key doesn't exist:

```ts
export function getMessages(chatId: string): Msg[] {
  return mockMessages[chatId] ?? [{ id: "m1", text: "Welcome to the encrypted channel.", ... }];
}
```

Both the chat route and community channel route use this in their loaders, prefetching into the React Query cache via `context.queryClient.setQueryData(messagesQueryKey(id), getMessages(id))`.

### Mock data patterns

- **Dates** in `mockMessages.ts` use a `daysAgo(days, hour, minute)` helper to generate relative `Date` objects.
- **Avatars**: Most chats have no `avatarUrl` (falling back to initials). Chat id "1" uses a real mock image (`sungJinwooAvatar`). Chat id "3" has a deliberately broken `avatarUrl` to exercise the `Avatar` component's `onError` fallback.
- **Message status scenarios**: The mock data intentionally exercises all `MessageStatus` values (sent, delivered, read, failed, pending, draft, deleted) across different chats.
- **Call log messages**: Chats 17–33 in `mockMessages.ts` contain call-log scenario threads that correspond to entries in `mockCalls.ts`.

## When Changing Data Models

- **Adding a type field**: Update the interface in `src/types/`, add mock data in `src/data/`, and update any component that reads or renders the field.
- **Adding a new domain type**: Create `src/types/<domain>.ts`, add mock data in `src/data/mock<Domain>.ts`, and wire it into a route or component.
- **Replacing mock data with a real API**: The `getMessages()` function and the mock exports are the integration points. Replace them with fetch functions returning the same types, then use TanStack React Query's `queryFn` to call them instead of `setQueryData` in loaders.
- **Message status lifecycle**: The `MessageStatus` union drives both icon rendering (`MESSAGE_STATUS_ICONS` in `src/constants/chatIcons.tsx`) and preview text (`renderMessagePreview`). Any new status must be added to both places.