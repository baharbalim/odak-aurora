interface SessionStatsProps {
  completedFocusSessions: number;
  sessionsUntilLongBreak: number;
}

export function SessionStats({ completedFocusSessions, sessionsUntilLongBreak }: SessionStatsProps) {
  const dotsInCycle = completedFocusSessions % sessionsUntilLongBreak;

  return (
    <div className="flex items-center gap-3 font-mono text-xs text-mist-500">
      <span>Bugün tamamlanan: {completedFocusSessions}</span>
      <div className="flex gap-1.5">
        {Array.from({ length: sessionsUntilLongBreak }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
              i < dotsInCycle || (dotsInCycle === 0 && completedFocusSessions > 0 && i < sessionsUntilLongBreak)
                ? "bg-focus-500"
                : "bg-white/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
