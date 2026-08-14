import { Bell, Settings2, X } from "lucide-react";
import type { PomodoroSettings } from "../interfaces/Pomodoro";

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  settings: PomodoroSettings;
  onChange: (settings: PomodoroSettings) => void;
}

const durationFields: { key: keyof PomodoroSettings; label: string; min: number; max: number }[] = [
  { key: "focusMinutes", label: "Odak (dakika)", min: 5, max: 90 },
  { key: "shortBreakMinutes", label: "Kısa mola (dakika)", min: 1, max: 30 },
  { key: "longBreakMinutes", label: "Uzun mola (dakika)", min: 5, max: 60 },
  { key: "sessionsUntilLongBreak", label: "Uzun molaya kadar oturum", min: 2, max: 8 },
];

export function SettingsDrawer({ open, onClose, settings, onChange }: SettingsDrawerProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-night-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm border-l border-white/10 bg-night-900/95 p-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 size={18} className="text-focus-400" />
            <h2 className="font-display text-lg font-semibold text-mist-100">Ayarlar</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-mist-500 transition hover:bg-white/10 hover:text-mist-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-mist-500">Süreler</h3>
            <div className="grid grid-cols-2 gap-3">
              {durationFields.map((f) => (
                <label key={f.key} className="flex flex-col gap-1">
                  <span className="text-[11px] text-mist-500">{f.label}</span>
                  <input
                    type="number"
                    min={f.min}
                    max={f.max}
                    value={settings[f.key] as number}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        [f.key]: Math.min(f.max, Math.max(f.min, Number(e.target.value) || f.min)),
                      })
                    }
                    className="rounded-lg border border-white/10 bg-night-950 px-2.5 py-1.5 font-mono text-sm text-mist-100 outline-none focus:border-focus-500"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/8" />

          <label className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-mist-200">Sonraki oturumu otomatik başlat</p>
              <p className="text-[11px] text-mist-600">Mola bitince odak, odak bitince mola kendiliğinden başlar</p>
            </div>
            <button
              onClick={() => onChange({ ...settings, autoStartNext: !settings.autoStartNext })}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${settings.autoStartNext ? "bg-focus-500" : "bg-white/15"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  settings.autoStartNext ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </label>

          <div className="h-px bg-white/8" />

          <div>
            <div className="mb-2 flex items-center gap-2">
              <Bell size={14} className="text-mist-500" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-mist-500">Bitiş zili sesi</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={settings.alarmVolume}
              onChange={(e) => onChange({ ...settings, alarmVolume: Number(e.target.value) })}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-focus-500"
            />
          </div>
        </div>
      </aside>
    </>
  );
}
