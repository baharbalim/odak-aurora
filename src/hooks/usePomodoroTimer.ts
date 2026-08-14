import { useCallback, useEffect, useRef, useState } from "react";
import type { PomodoroSettings, SessionMode } from "../interfaces/Pomodoro";

const modeDuration = (mode: SessionMode, s: PomodoroSettings) => {
  if (mode === "focus") return s.focusMinutes * 60;
  if (mode === "shortBreak") return s.shortBreakMinutes * 60;
  return s.longBreakMinutes * 60;
};

export function usePomodoroTimer(settings: PomodoroSettings, onSessionComplete: (finishedMode: SessionMode) => void) {
  const [mode, setMode] = useState<SessionMode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(() => modeDuration("focus", settings));
  const [isRunning, setIsRunning] = useState(false);
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(modeDuration(mode, settings));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.focusMinutes, settings.shortBreakMinutes, settings.longBreakMinutes, mode]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft !== 0 || !isRunning) return;

    const finishedMode = mode;
    onSessionComplete(finishedMode);

    let nextMode: SessionMode;
    if (finishedMode === "focus") {
      const nextCount = completedFocusSessions + 1;
      setCompletedFocusSessions(nextCount);
      nextMode = nextCount % settings.sessionsUntilLongBreak === 0 ? "longBreak" : "shortBreak";
    } else {
      nextMode = "focus";
    }
    setMode(nextMode);
    setSecondsLeft(modeDuration(nextMode, settings));
    setIsRunning(settings.autoStartNext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const toggle = useCallback(() => setIsRunning((r) => !r), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(modeDuration(mode, settings));
  }, [mode, settings]);

  const skip = useCallback(() => {
    setIsRunning(false);
    if (mode === "focus") {
      const nextCount = completedFocusSessions + 1;
      setCompletedFocusSessions(nextCount);
      const nextMode: SessionMode = nextCount % settings.sessionsUntilLongBreak === 0 ? "longBreak" : "shortBreak";
      setMode(nextMode);
      setSecondsLeft(modeDuration(nextMode, settings));
    } else {
      setMode("focus");
      setSecondsLeft(modeDuration("focus", settings));
    }
  }, [mode, completedFocusSessions, settings]);

  const switchMode = useCallback(
    (next: SessionMode) => {
      setIsRunning(false);
      setMode(next);
      setSecondsLeft(modeDuration(next, settings));
    },
    [settings]
  );

  const totalSeconds = modeDuration(mode, settings);
  const progress = totalSeconds === 0 ? 0 : 1 - secondsLeft / totalSeconds;

  return {
    mode,
    secondsLeft,
    isRunning,
    completedFocusSessions,
    progress,
    totalSeconds,
    start,
    pause,
    toggle,
    reset,
    skip,
    switchMode,
  };
}
