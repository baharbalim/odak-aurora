import { motion } from "framer-motion";
import type { SessionMode } from "../interfaces/Pomodoro";

interface TimerRingProps {
  mode: SessionMode;
  secondsLeft: number;
  progress: number;
  isRunning: boolean;
  activeTaskTitle?: string | null;
}

const modeAccent: Record<SessionMode, string> = {
  focus: "#ff8a5b",
  shortBreak: "#5eead4",
  longBreak: "#a78bfa",
};

const modeLabel: Record<SessionMode, string> = {
  focus: "Odak Zamanı",
  shortBreak: "Kısa Mola",
  longBreak: "Uzun Mola",
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function TimerRing({ mode, secondsLeft, progress, isRunning, activeTaskTitle }: TimerRingProps) {
  const accent = modeAccent[mode];
  const radius = 128;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
      <div
        className={`absolute inset-4 rounded-full blur-2xl transition-opacity duration-700 ${isRunning ? "animate-breathe" : ""}`}
        style={{ backgroundColor: accent, opacity: 0.18 }}
      />
      <svg viewBox="0 0 280 280" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="140" cy="140" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <motion.circle
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke={accent}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "linear" }}
          style={{ filter: `drop-shadow(0 0 8px ${accent}88)` }}
        />
      </svg>

      <div className="relative z-10 flex flex-col items-center gap-2 rounded-full bg-night-950/30 px-6 py-6 text-center backdrop-blur-sm">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.3em]"
          style={{ color: accent }}
        >
          {modeLabel[mode]}
        </span>
        <span className="font-display text-6xl font-semibold tabular-nums text-mist-100 sm:text-7xl">
          {formatTime(secondsLeft)}
        </span>
        <span className="font-mono text-[11px] text-mist-500">{isRunning ? "çalışıyor" : "duraklatıldı"}</span>
        {activeTaskTitle && mode === "focus" && (
          <span className="mt-1 max-w-[180px] truncate text-xs text-mist-400">🍅 {activeTaskTitle}</span>
        )}
      </div>
    </div>
  );
}
