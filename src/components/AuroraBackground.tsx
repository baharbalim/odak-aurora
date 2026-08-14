import { useEffect, useRef } from "react";
import type { SessionMode, VisualTheme } from "../interfaces/Pomodoro";

interface AuroraBackgroundProps {
  mode: SessionMode;
  isRunning: boolean;
  theme: VisualTheme;
  customUrl: string | null;
}

const themePalettes: Record<VisualTheme, Record<SessionMode, [string, string, string]>> = {
  aurora: {
    focus: ["#ff8a5b", "#f2703a", "#ffb08a"],
    shortBreak: ["#5eead4", "#38c9b4", "#a7f3e8"],
    longBreak: ["#a78bfa", "#8a6af0", "#c9b8ff"],
  },
  derinDeniz: {
    focus: ["#ff8a5b", "#2f6f8f", "#1c3f57"],
    shortBreak: ["#3fd0d4", "#1c5b78", "#0e2f40"],
    longBreak: ["#7aa7ff", "#2c4a8f", "#152452"],
  },
  gunBatimi: {
    focus: ["#ff7a59", "#ff4f81", "#ffb35e"],
    shortBreak: ["#ff9d73", "#ff6f91", "#ffd166"],
    longBreak: ["#c26fd9", "#ff6f91", "#7c5cff"],
  },
  orman: {
    focus: ["#ff8a5b", "#3f7d5a", "#1e3d2c"],
    shortBreak: ["#5eead4", "#2f6b4f", "#173225"],
    longBreak: ["#8bd4a7", "#2f6b4f", "#173225"],
  },
};

export function AuroraBackground({ mode, isRunning, theme, customUrl }: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = themePalettes[theme][mode];
    const speed = isRunning ? 0.006 : 0.002;

    const draw = () => {
      tRef.current += speed;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "#0b0f19");
      bg.addColorStop(1, "#131a2b");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "screen";
      colors.forEach((color, i) => {
        const t = tRef.current + i * 2.1;
        const x = width * (0.25 + 0.25 * i) + Math.sin(t) * width * 0.18;
        const y = height * 0.35 + Math.cos(t * 0.8) * height * 0.22;
        const r = Math.max(width, height) * (0.32 + 0.05 * Math.sin(t * 1.3));
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, color + "55");
        grad.addColorStop(1, color + "00");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });
      ctx.globalCompositeOperation = "source-over";

      frameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [mode, isRunning, theme]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {customUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${customUrl})` }}
        >
          <div className="absolute inset-0 bg-night-950/55" />
        </div>
      ) : (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,15,25,0.55)_100%)]" />
    </div>
  );
}
