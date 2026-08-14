import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { HistoryEntry } from "../interfaces/Pomodoro";

const STORAGE_KEY = "odak-aurora:gecmis";

const todayKey = () => new Date().toISOString().slice(0, 10);

export function useSessionHistory() {
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(STORAGE_KEY, []);

  const recordFocusSession = useCallback(
    (minutes: number) => {
      const key = todayKey();
      setHistory((prev) => {
        const existing = prev.find((h) => h.date === key);
        if (existing) {
          return prev.map((h) => (h.date === key ? { ...h, count: h.count + 1, focusMinutes: h.focusMinutes + minutes } : h));
        }
        return [...prev, { date: key, count: 1, focusMinutes: minutes }];
      });
    },
    [setHistory]
  );

  // Son 7 günü (bugün dahil) sıralı biçimde döndürür
  const last7Days: HistoryEntry[] = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const found = history.find((h) => h.date === key);
    return found ?? { date: key, count: 0, focusMinutes: 0 };
  });

  const todayCount = history.find((h) => h.date === todayKey())?.count ?? 0;

  return { history, last7Days, todayCount, recordFocusSession };
}
