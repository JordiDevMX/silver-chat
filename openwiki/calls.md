# Calls Domain

The calls domain provides a simulated voice/video call experience. Like the rest of SilverChat, there is no real WebRTC or telephony backend — calls are entirely simulated through React context state and timer-driven phase transitions.

## Call List

### `Calls` (`src/components/calls/Calls.tsx`)

Renders the call history list on the home "Calls" tab. Each `CallRow` displays:
- `Avatar` with a status-driven gradient background (missed → red, answered → neon, etc.)
- Caller name (color-coded by status), optional subtitle (e.g. "Unknown — possible spam")
- Direction icon (incoming `ArrowDownLeft` / outgoing `ArrowUpRight`) with status color
- Call type icon (voice `Phone` / video `Video`)
- Timestamp and optional duration

Clicking any row triggers `useCallSession().start(call)` to open the call overlay.

### `CallsFAB` (same file)

A `FloatingActionButton` that starts a new call using `mockCalls[0]` as a fallback. Shown on the home view when the "calls" tab is active.

## Call Overlay

### `CallOverlay` (`src/components/calls/CallOverlay.tsx`)

A modal `Dialog` (Radix) that appears over the entire app when a call is active. Shows:
- Animated avatar with pulse/ping effects based on call phase
- Caller name and subtitle
- Status text ("Calling…", "Video call", "Call ended")
- Live duration counter (`formatCallDuration`)
- Control buttons: mute/unmute, video on/off, end call
- Escape and outside-click are prevented so users must explicitly end the call

The overlay reads all state from `useCallSession()` and is always mounted (on the home route), becoming visible when `phase !== "idle"`.

## Call Session Hook

### `useCallSession` (`src/hooks/useCallSession.tsx`)

A React context that manages the entire simulated call lifecycle.

#### Call phases

```
idle → connecting → ongoing → ended → idle
```

| Phase | Duration/Behavior |
|---|---|
| `idle` | No active call. Overlay hidden. |
| `connecting` | 1800ms (`CONNECTING_MS`). Avatar pulses. No timer tick. |
| `ongoing` | 1-second interval ticks increment `seconds`. Avatar pings. |
| `ended` | 1400ms (`ENDED_MS`). Shows "Call ended" then resets to `idle`. |

#### API

```ts
const { call, phase, seconds, isMuted, isVideoEnabled, start, end, toggleMute, toggleVideo } = useCallSession();
```

- **`start(call)`** — Resets state, sets phase to `connecting`, starts the connecting timer. Video is enabled if `call.type === "video"`.
- **`end()`** — Sets phase to `ended`, clears timers, starts the ended timer to reset.
- **`toggleMute()`** / **`toggleVideo()`** — Toggle local state flags.
- **`formatCallDuration(seconds)`** — Exported helper that formats seconds as `MM:SS`.

The context is provided by `CallSessionProvider`, which wraps the home route in `index.tsx`.

## Call Types & Icons

### `Call` type (`src/types/call.ts`)

```ts
interface Call {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
  subtitle?: string;      // e.g. "Unknown — possible spam"
  isUnknown?: boolean;
  type: CallType;         // "voice" | "video"
  direction: CallDirection; // "incoming" | "outgoing"
  status: CallStatus;    // "missed" | "answered" | "rejected" | "ongoing"
  time: string;
  duration?: string;      // e.g. "call lasted 12:45 mins"
}
```

### Icon/gradient maps (`src/constants/callIcons.tsx`)

| Constant | Type | Purpose |
|---|---|---|
| `CALL_TYPE_ICONS` | `Record<CallType, LucideIcon>` | Phone / Video icons |
| `CALL_DIRECTION_ICONS` | `Record<CallDirection, (cls) => JSX>` | Incoming/outgoing arrows |
| `CALL_STATUS_COLORS` | `Record<CallStatus, string>` | Tailwind text classes per status |
| `CALL_STATUS_GRADIENTS` | `Record<CallStatus, string>` | Avatar background gradients per status |

Status rendering rules:
- **missed** → red text + red gradient avatar
- **rejected** → muted red text + muted red gradient avatar
- **answered** → primary (neon) text + neon gradient avatar
- **ongoing** → green text + green gradient avatar

All maps are exhaustively typed against the union types, so the lookup can never resolve to `undefined`.

## Mock Call Data (`src/data/mockCalls.ts`)

Contains canonical call scenarios:
- **A** — Missed incoming (voice, no duration)
- **B** — Unanswered outgoing (voice, rejected)
- **C** — Answered incoming (voice + video, with duration)
- **D** — Answered outgoing (video, with duration)

Each entry includes an `email` field (used for the calls-tab search filter) and optional `avatarUrl`. Some entries use a real mock image (`sungJinwooAvatar`); others fall back to initials.

The mock data comments note that call entries are linked to chat threads in `mockChats.ts` (ids 17–33) and message threads in `mockMessages.ts` — call log messages in chat threads reference the same scenarios for consistency.

## When Changing Calls

- **Adding a call phase**: Add to the `CallPhase` union in `useCallSession.tsx`, handle it in `CallOverlay.tsx` (status text, avatar animation, controls).
- **Adding a call status**: Update `CallStatus` in `src/types/call.ts`, add entries to all four maps in `src/constants/callIcons.tsx` (exhaustive typing ensures compile-time safety).
- **Real WebRTC integration**: Replace the timer-driven state in `useCallSession.tsx` with real peer connection state. The overlay and controls API would remain the same.
- **Adding call history persistence**: Currently calls are mock-only. Any persistence layer would integrate with the `mockCalls` array or a future React Query cache.