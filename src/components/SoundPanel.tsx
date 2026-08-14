import { CloudRain, Music2, Trees, Upload, Volume2, VolumeX, Waves, Wind } from "lucide-react";
import { useRef } from "react";
import type { CustomTrack, NoiseType, SoundTrack } from "../interfaces/Pomodoro";

interface SoundPanelProps {
  tracks: SoundTrack[];
  activeTrack: NoiseType | "custom" | null;
  volume: number;
  customTracks: CustomTrack[];
  onPlay: (type: NoiseType) => void;
  onPlayCustom: (track: CustomTrack) => void;
  onStop: () => void;
  onVolumeChange: (v: number) => void;
  onAddCustomTrack: (track: CustomTrack) => void;
}

const icons: Record<NoiseType, React.ReactNode> = {
  beyaz: <Wind size={17} />,
  kahverengi: <Music2 size={17} />,
  yagmur: <CloudRain size={17} />,
  okyanus: <Waves size={17} />,
  orman: <Trees size={17} />,
};

export function SoundPanel({
  tracks,
  activeTrack,
  volume,
  customTracks,
  onPlay,
  onPlayCustom,
  onStop,
  onVolumeChange,
  onAddCustomTrack,
}: SoundPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onAddCustomTrack({ id: crypto.randomUUID(), name: file.name.replace(/\.[^/.]+$/, ""), url });
    e.target.value = "";
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-surface/70 p-5 shadow-glass backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist-500">Canlı Ortam Sesi</h3>
        <button
          onClick={onStop}
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] transition ${
            activeTrack ? "text-mist-300 hover:text-mist-100" : "text-mist-700"
          }`}
          disabled={!activeTrack}
        >
          <VolumeX size={13} /> Sustur
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {tracks.map((t) => (
          <button
            key={t.id}
            onClick={() => onPlay(t.id)}
            title={t.description}
            className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[11px] transition-all ${
              activeTrack === t.id
                ? "border-focus-500/50 bg-focus-500/10 text-focus-400"
                : "border-white/8 text-mist-400 hover:border-white/20 hover:text-mist-200"
            }`}
          >
            {icons[t.id]}
            {t.label}
          </button>
        ))}
      </div>

      {customTracks.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {customTracks.map((t) => (
            <button
              key={t.id}
              onClick={() => onPlayCustom(t)}
              className={`truncate rounded-full border px-3 py-1 text-[11px] transition ${
                activeTrack === "custom" ? "border-focus-500/50 bg-focus-500/10 text-focus-400" : "border-white/8 text-mist-400 hover:text-mist-200"
              }`}
            >
              ♪ {t.name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <Volume2 size={15} className="shrink-0 text-mist-500" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-focus-500"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-mist-400 transition hover:border-white/25 hover:text-mist-200"
        >
          <Upload size={13} /> Ekle
        </button>
        <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFile} className="hidden" />
      </div>
    </div>
  );
}
