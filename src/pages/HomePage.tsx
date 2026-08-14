import { useEffect, useState } from "react";
import { AuroraBackground } from "../components/AuroraBackground";
import { ControlBar, KeyboardHint } from "../components/ControlBar";
import { ModeTabs } from "../components/ModeTabs";
import { SessionStats } from "../components/SessionStats";
import { SettingsDrawer } from "../components/SettingsDrawer";
import { SoundPanel } from "../components/SoundPanel";
import { TaskList } from "../components/TaskList";
import { TimerRing } from "../components/TimerRing";
import { VisualPanel } from "../components/VisualPanel";
import { WeeklyStats } from "../components/WeeklyStats";
import { useAmbientSound } from "../hooks/useAmbientSound";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { useSessionHistory } from "../hooks/useSessionHistory";
import { useTasks } from "../hooks/useTasks";
import type {
  CustomTrack,
  PomodoroSettings,
  SoundTrack,
  VisualTheme,
  VisualThemeOption,
} from "../interfaces/Pomodoro";
import { Settings2 } from "lucide-react";

const defaultSettings: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsUntilLongBreak: 4,
  autoStartNext: false,
  alarmVolume: 0.5,
};

const soundTracks: SoundTrack[] = [
  { id: "yagmur", label: "Yağmur", description: "İnce ve sürekli yağmur patırtısı" },
  { id: "okyanus", label: "Okyanus", description: "Yavaş, şişen dalga sesi" },
  { id: "orman", label: "Orman", description: "Yaprak hışırtısı ve esinti" },
  { id: "kahverengi", label: "Kahverengi", description: "Derin, yumuşak gürültü" },
  { id: "beyaz", label: "Beyaz", description: "Klasik beyaz gürültü" },
];

const visualThemes: VisualThemeOption[] = [
  { id: "aurora", label: "Kuzey Işığı", colors: ["#ff8a5b", "#5eead4", "#a78bfa"] },
  { id: "derinDeniz", label: "Derin Deniz", colors: ["#2f6f8f", "#1c5b78", "#0e2f40"] },
  { id: "gunBatimi", label: "Gün Batımı", colors: ["#ff7a59", "#ff4f81", "#ffb35e"] },
  { id: "orman", label: "Orman", colors: ["#3f7d5a", "#2f6b4f", "#173225"] },
];

const MODE_TITLE_PREFIX: Record<string, string> = {
  focus: "🍅",
  shortBreak: "☕",
  longBreak: "🌙",
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function HomePage() {
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>("odak-aurora:ayarlar", defaultSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [visualTheme, setVisualTheme] = useLocalStorage<VisualTheme>("odak-aurora:tema", "aurora");
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [customTracks, setCustomTracks] = useState<CustomTrack[]>([]);

  const sound = useAmbientSound();
  const { tasks, activeTask, activeTaskId, setActiveTaskId, addTask, deleteTask, toggleDone, incrementPomodoro } = useTasks();
  const { last7Days, recordFocusSession } = useSessionHistory();

  const handleSessionComplete = (finishedMode: string) => {
    sound.playChime(settings.alarmVolume);
    if (finishedMode === "focus") {
      incrementPomodoro(activeTaskId);
      recordFocusSession(settings.focusMinutes);
    }
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(finishedMode === "focus" ? "Odak süresi bitti — mola zamanı!" : "Mola bitti — odaklanma zamanı!");
    }
  };

  const timer = usePomodoroTimer(settings, handleSessionComplete);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Sekme başlığında canlı geri sayım
  useEffect(() => {
    document.title = `${formatTime(timer.secondsLeft)} ${MODE_TITLE_PREFIX[timer.mode]} — Odak Aurora`;
    return () => {
      document.title = "Odak Aurora";
    };
  }, [timer.secondsLeft, timer.mode]);

  // Klavye kısayolu: boşluk = başlat/duraklat
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && (e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
        e.preventDefault();
        timer.toggle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [timer]);

  return (
    <div className="relative min-h-screen w-full text-mist-100">
      <AuroraBackground mode={timer.mode} isRunning={timer.isRunning} theme={visualTheme} customUrl={customBgUrl} />

      <button
        onClick={() => setShowSettings(true)}
        className="fixed right-5 top-5 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface/70 text-mist-400 backdrop-blur-md transition hover:text-mist-100"
        aria-label="Ayarları aç"
      >
        <Settings2 size={17} />
      </button>

      <SettingsDrawer open={showSettings} onClose={() => setShowSettings(false)} settings={settings} onChange={setSettings} />

      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center px-5 py-12 sm:py-16">
        <header className="mb-8 flex w-full flex-col items-center gap-3 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-mist-500">Odak Aurora</span>
          <h1 className="font-display text-2xl font-semibold text-mist-100 sm:text-3xl">
            Nefes alan bir odak seansı
          </h1>
          <p className="max-w-sm text-sm text-mist-400">
            Zamanlayıcı çalışırken arka plan canlı olarak dalgalanır, sesler tarayıcında gerçek zamanlı üretilir.
          </p>
        </header>

        <ModeTabs mode={timer.mode} onSwitch={timer.switchMode} />

        <div className="my-8">
          <TimerRing
            mode={timer.mode}
            secondsLeft={timer.secondsLeft}
            progress={timer.progress}
            isRunning={timer.isRunning}
            activeTaskTitle={activeTask?.title}
          />
        </div>

        <ControlBar isRunning={timer.isRunning} mode={timer.mode} onStart={timer.start} onPause={timer.pause} onReset={timer.reset} onSkip={timer.skip} />

        <div className="mt-4">
          <KeyboardHint />
        </div>

        <div className="mt-4">
          <SessionStats completedFocusSessions={timer.completedFocusSessions} sessionsUntilLongBreak={settings.sessionsUntilLongBreak} />
        </div>

        <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
          <TaskList
            tasks={tasks}
            activeTaskId={activeTaskId}
            onSelect={setActiveTaskId}
            onAdd={addTask}
            onToggleDone={toggleDone}
            onDelete={deleteTask}
          />
          <WeeklyStats last7Days={last7Days} />
        </div>

        <div className="mt-4 flex w-full flex-col gap-4">
          <SoundPanel
            tracks={soundTracks}
            activeTrack={sound.activeTrack}
            volume={sound.volume}
            customTracks={customTracks}
            onPlay={sound.playNoise}
            onPlayCustom={(t) => sound.playCustom(t.url)}
            onStop={sound.stop}
            onVolumeChange={sound.setVolume}
            onAddCustomTrack={(t) => setCustomTracks((prev) => [...prev, t])}
          />

          <VisualPanel
            themes={visualThemes}
            activeTheme={visualTheme}
            customUrl={customBgUrl}
            onSelectTheme={setVisualTheme}
            onSetCustomUrl={setCustomBgUrl}
          />
        </div>

        <footer className="mt-14 text-center font-mono text-[11px] text-mist-700">
          React · TypeScript · Tailwind CSS · Web Audio API · Canvas — verileriniz yalnızca tarayıcınızda kalır
        </footer>
      </div>
    </div>
  );
}
