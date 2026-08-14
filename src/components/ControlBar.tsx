import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import type { SessionMode } from "../interfaces/Pomodoro";

interface ControlBarProps {
  isRunning: boolean;
  mode: SessionMode;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

const modeAccent: Record<SessionMode, string> = {
  focus: "#ff8a5b",
  shortBreak: "#5eead4",
  longBreak: "#a78bfa",
};

export function ControlBar({ isRunning, mode, onStart, onPause, onReset, onSkip }: ControlBarProps) {
  const accent = modeAccent[mode];

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onReset}
        aria-label="Sıfırla"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-surface/60 text-mist-400 transition hover:text-mist-100"
      >
        <RotateCcw size={18} />
      </button>

      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={isRunning ? onPause : onStart}
        className="flex h-16 w-16 items-center justify-center rounded-full text-night-950 shadow-lg transition"
        style={{ backgroundColor: accent, boxShadow: `0 10px 30px -8px ${accent}99` }}
      >
        {isRunning ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" className="ml-0.5" />}
      </motion.button>

      <button
        onClick={onSkip}
        aria-label="Sonraki oturuma geç"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-surface/60 text-mist-400 transition hover:text-mist-100"
      >
        <SkipForward size={18} />
      </button>
    </div>
  );
}

export function KeyboardHint() {
  return (
    <p className="font-mono text-[10px] text-mist-700">
      <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">boşluk</kbd> ile başlat / duraklat
    </p>
  );
}
