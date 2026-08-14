import { useCallback, useEffect, useRef, useState } from "react";
import type { NoiseType } from "../interfaces/Pomodoro";

function createNoiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
  const bufferSize = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

interface ActiveGraph {
  source: AudioBufferSourceNode;
  nodes: AudioNode[];
  gain: GainNode;
  lfo?: OscillatorNode;
}

/**
 * Hiçbir ses dosyası indirmeden, tarayıcıda gerçek zamanlı (canlı) olarak
 * beyaz/kahverengi gürültü, yağmur, okyanus dalgası ve orman esintisi
 * sentezleyen hook. Ayrıca kullanıcının kendi ses dosyasını ekleyip
 * çalabilmesini destekler.
 */
export function useAmbientSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const graphRef = useRef<ActiveGraph | null>(null);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);
  const customSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const customGainRef = useRef<GainNode | null>(null);

  const [activeTrack, setActiveTrack] = useState<NoiseType | "custom" | null>(null);
  const [volume, setVolumeState] = useState(0.35);

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  };

  const stopGraph = useCallback(() => {
    const g = graphRef.current;
    if (g) {
      try {
        g.source.stop();
      } catch {
        /* zaten durmuş olabilir */
      }
      g.lfo?.stop();
      graphRef.current = null;
    }
    if (customAudioRef.current) {
      customAudioRef.current.pause();
    }
  }, []);

  const buildNoiseGraph = useCallback((type: NoiseType) => {
    const ctx = getCtx();
    const buffer = createNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gain = ctx.createGain();
    gain.gain.value = volume;

    const nodes: AudioNode[] = [];
    let lfo: OscillatorNode | undefined;
    let lastNode: AudioNode = source;

    if (type === "beyaz") {
      // ham gürültü, filtre yok
    } else if (type === "kahverengi") {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 350;
      lastNode.connect(lp);
      lastNode = lp;
      nodes.push(lp);
      const boost = ctx.createGain();
      boost.gain.value = 3.2;
      lastNode.connect(boost);
      lastNode = boost;
      nodes.push(boost);
    } else if (type === "yagmur") {
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 1200;
      lastNode.connect(hp);
      lastNode = hp;
      nodes.push(hp);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 6500;
      lastNode.connect(lp);
      lastNode = lp;
      nodes.push(lp);
      // yağmur patırtısı için hafif titreşim (LFO)
      lfo = ctx.createOscillator();
      lfo.frequency.value = 5.5;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.15;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();
    } else if (type === "okyanus") {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 900;
      lastNode.connect(lp);
      lastNode = lp;
      nodes.push(lp);
      // yavaş dalga şişmesi
      lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = volume * 0.5;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();
    } else if (type === "orman") {
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 2200;
      bp.Q.value = 0.6;
      lastNode.connect(bp);
      lastNode = bp;
      nodes.push(bp);
      lfo = ctx.createOscillator();
      lfo.frequency.value = 0.3;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.08;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();
    }

    lastNode.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    graphRef.current = { source, nodes, gain, lfo };
  }, [volume]);

  const playNoise = useCallback(
    (type: NoiseType) => {
      const ctx = getCtx();
      if (ctx.state === "suspended") ctx.resume();
      stopGraph();
      buildNoiseGraph(type);
      setActiveTrack(type);
    },
    [buildNoiseGraph, stopGraph]
  );

  const playCustom = useCallback(
    (url: string) => {
      const ctx = getCtx();
      if (ctx.state === "suspended") ctx.resume();
      stopGraph();

      if (!customAudioRef.current) {
        const audio = new Audio();
        audio.loop = true;
        audio.crossOrigin = "anonymous";
        customAudioRef.current = audio;
      }
      const audio = customAudioRef.current;
      audio.src = url;

      if (!customSourceRef.current) {
        customSourceRef.current = ctx.createMediaElementSource(audio);
        customGainRef.current = ctx.createGain();
        customSourceRef.current.connect(customGainRef.current);
        customGainRef.current.connect(ctx.destination);
      }
      if (customGainRef.current) customGainRef.current.gain.value = volume;

      audio.currentTime = 0;
      audio.play().catch(() => {});
      setActiveTrack("custom");
    },
    [stopGraph, volume]
  );

  const stop = useCallback(() => {
    stopGraph();
    setActiveTrack(null);
  }, [stopGraph]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (graphRef.current) graphRef.current.gain.gain.value = v;
    if (customGainRef.current) customGainRef.current.gain.value = v;
  }, []);

  /** Oturum bitince çalan yumuşak, çok katmanlı bir zil sesi — hiçbir dosya kullanmadan sentezlenir. */
  const playChime = useCallback((volume = 0.5) => {
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5 - E5 - G5 (majör akor)

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      const start = now + i * 0.12;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * 0.35, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 1.7);
    });
  }, []);

  useEffect(() => {
    return () => {
      stopGraph();
      ctxRef.current?.close().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { activeTrack, volume, playNoise, playCustom, stop, setVolume, playChime };
}
