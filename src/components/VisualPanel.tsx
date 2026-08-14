import { Image, X } from "lucide-react";
import { useRef } from "react";
import type { VisualTheme, VisualThemeOption } from "../interfaces/Pomodoro";

interface VisualPanelProps {
  themes: VisualThemeOption[];
  activeTheme: VisualTheme;
  customUrl: string | null;
  onSelectTheme: (theme: VisualTheme) => void;
  onSetCustomUrl: (url: string | null) => void;
}

export function VisualPanel({ themes, activeTheme, customUrl, onSelectTheme, onSetCustomUrl }: VisualPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onSetCustomUrl(url);
    e.target.value = "";
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-surface/70 p-5 shadow-glass backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist-500">Canlı Görsel Sahne</h3>
        {customUrl && (
          <button
            onClick={() => onSetCustomUrl(null)}
            className="flex items-center gap-1 text-[11px] text-mist-400 transition hover:text-mist-100"
          >
            <X size={13} /> Kaldır
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              onSetCustomUrl(null);
              onSelectTheme(t.id);
            }}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] transition-all ${
              activeTheme === t.id && !customUrl
                ? "border-white/25 bg-white/10 text-mist-100"
                : "border-white/8 text-mist-400 hover:border-white/20 hover:text-mist-200"
            }`}
          >
            <span className="flex -space-x-1">
              {t.colors.map((c) => (
                <span key={c} className="h-3 w-3 rounded-full ring-1 ring-night-950" style={{ backgroundColor: c }} />
              ))}
            </span>
            {t.label}
          </button>
        ))}

        <button
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition ${
            customUrl ? "border-focus-500/50 bg-focus-500/10 text-focus-400" : "border-dashed border-white/15 text-mist-400 hover:text-mist-200"
          }`}
        >
          <Image size={13} /> Kendi fotoğrafını ekle
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
    </div>
  );
}
