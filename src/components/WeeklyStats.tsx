import type { HistoryEntry } from "../interfaces/Pomodoro";

interface WeeklyStatsProps {
  last7Days: HistoryEntry[];
}

const dayLabels = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];

export function WeeklyStats({ last7Days }: WeeklyStatsProps) {
  const max = Math.max(1, ...last7Days.map((d) => d.count));
  const totalThisWeek = last7Days.reduce((sum, d) => sum + d.count, 0);
  const totalMinutes = last7Days.reduce((sum, d) => sum + d.focusMinutes, 0);

  return (
    <div className="rounded-2xl border border-white/8 bg-surface/70 p-5 shadow-glass backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist-500">Son 7 Gün</h3>
        <span className="font-mono text-[11px] text-mist-500">
          {totalThisWeek} 🍅 · {Math.round(totalMinutes / 60 * 10) / 10} sa
        </span>
      </div>
      <div className="flex h-24 items-end justify-between gap-2">
        {last7Days.map((day, i) => {
          const dayOfWeek = (new Date(day.date).getDay() + 6) % 7; // Pazartesi=0
          const heightPct = Math.max(6, (day.count / max) * 100);
          const isToday = i === last7Days.length - 1;
          return (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-16 w-full items-end">
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    isToday ? "bg-focus-500" : day.count > 0 ? "bg-short-400/70" : "bg-white/8"
                  }`}
                  style={{ height: `${heightPct}%` }}
                  title={`${day.count} pomodoro`}
                />
              </div>
              <span className={`font-mono text-[10px] ${isToday ? "text-focus-400" : "text-mist-700"}`}>
                {dayLabels[dayOfWeek]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
