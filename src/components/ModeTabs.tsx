import type { SessionMode } from "../interfaces/Pomodoro";

interface ModeTabsProps {
  mode: SessionMode;
  onSwitch: (mode: SessionMode) => void;
}

const tabs: { id: SessionMode; label: string }[] = [
  { id: "focus", label: "Odak" },
  { id: "shortBreak", label: "Kısa Mola" },
  { id: "longBreak", label: "Uzun Mola" },
];

export function ModeTabs({ mode, onSwitch }: ModeTabsProps) {
  return (
    <div className="flex gap-1 rounded-full border border-white/10 bg-surface/60 p-1 backdrop-blur-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSwitch(tab.id)}
          className={`rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wide transition-all duration-300 ${
            mode === tab.id ? "bg-white/10 text-mist-100 shadow-inner" : "text-mist-500 hover:text-mist-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
