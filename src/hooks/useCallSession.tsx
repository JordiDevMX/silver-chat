import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Call } from "@/types/call";

export type CallPhase = "idle" | "connecting" | "ongoing" | "ended";

interface CallSessionState {
  call: Call | null;
  phase: CallPhase;
  seconds: number;
  isMuted: boolean;
  isVideoEnabled: boolean;
}

interface CallSessionValue extends CallSessionState {
  start: (call: Call) => void;
  end: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
}

const CONNECTING_MS = 1800;
const ENDED_MS = 1400;

const initialState: CallSessionState = {
  call: null,
  phase: "idle",
  seconds: 0,
  isMuted: false,
  isVideoEnabled: true,
};

const CallSessionContext = createContext<CallSessionValue | null>(null);

export function CallSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CallSessionState>(initialState);
  const timers = useRef<{
    connect?: ReturnType<typeof setTimeout>;
    end?: ReturnType<typeof setTimeout>;
    tick?: ReturnType<typeof setInterval>;
  }>({});

  const clearTimers = useCallback(() => {
    if (timers.current.connect) clearTimeout(timers.current.connect);
    if (timers.current.end) clearTimeout(timers.current.end);
    if (timers.current.tick) clearInterval(timers.current.tick);
    timers.current = {};
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const start = useCallback(
    (call: Call) => {
      clearTimers();
      setState({
        call,
        phase: "connecting",
        seconds: 0,
        isMuted: false,
        isVideoEnabled: call.type === "video",
      });
      timers.current.connect = setTimeout(() => {
        setState((s) => (s.call?.id === call.id ? { ...s, phase: "ongoing" } : s));
      }, CONNECTING_MS);
    },
    [clearTimers],
  );

  const end = useCallback(() => {
    setState((s) => {
      if (s.phase === "idle" || s.phase === "ended") return s;
      return { ...s, phase: "ended" };
    });
    clearTimers();
    timers.current.end = setTimeout(() => {
      setState(initialState);
    }, ENDED_MS);
  }, [clearTimers]);

  const toggleMute = useCallback(() => {
    setState((s) => ({ ...s, isMuted: !s.isMuted }));
  }, []);

  const toggleVideo = useCallback(() => {
    setState((s) => ({ ...s, isVideoEnabled: !s.isVideoEnabled }));
  }, []);

  useEffect(() => {
    if (state.phase !== "ongoing") return;
    timers.current.tick = setInterval(() => {
      setState((s) => (s.phase === "ongoing" ? { ...s, seconds: s.seconds + 1 } : s));
    }, 1000);
    return () => {
      if (timers.current.tick) clearInterval(timers.current.tick);
    };
  }, [state.phase]);

  const value = useMemo<CallSessionValue>(
    () => ({ ...state, start, end, toggleMute, toggleVideo }),
    [state, start, end, toggleMute, toggleVideo],
  );

  return <CallSessionContext.Provider value={value}>{children}</CallSessionContext.Provider>;
}

export function useCallSession(): CallSessionValue {
  const ctx = useContext(CallSessionContext);
  if (!ctx) {
    throw new Error("useCallSession must be used inside <CallSessionProvider>");
  }
  return ctx;
}

export function formatCallDuration(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}
