export type SessionMode = "focus" | "shortBreak" | "longBreak";

export interface PomodoroSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsUntilLongBreak: number;
  autoStartNext: boolean;
  alarmVolume: number;
}

export type NoiseType = "beyaz" | "kahverengi" | "yagmur" | "okyanus" | "orman";

export interface SoundTrack {
  id: NoiseType;
  label: string;
  description: string;
}

export interface CustomTrack {
  id: string;
  name: string;
  url: string;
}

export type VisualTheme = "aurora" | "derinDeniz" | "gunBatimi" | "orman";

export interface VisualThemeOption {
  id: VisualTheme;
  label: string;
  colors: [string, string, string];
}

export interface Task {
  id: string;
  title: string;
  pomodoroCount: number;
  targetPomodoros: number;
  done: boolean;
  createdAt: number;
}

export interface HistoryEntry {
  date: string; // YYYY-MM-DD
  count: number;
  focusMinutes: number;
}
