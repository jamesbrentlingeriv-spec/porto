import { useRef, useCallback, useContext } from 'react';
import { SoundContext } from '../context/SoundContext';

/**
 * Web Audio API-based 8-bit sound effect generator.
 * No audio files needed — synthesizes retro sounds in real-time.
 * Respects SoundContext muted state and browser autoplay rules
 * (sounds are only created on user interaction callbacks).
 */

function createAudioContext(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    return null;
  }
}

function playSquareWave(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  volume: number = 0.08,
  type: OscillatorType = 'square'
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

interface SystemSounds {
  /** Short blip for boot sequence typing */
  bootBlip: () => void;
  /** Retro notification/ready beep for boot complete */
  bootBeep: () => void;
  /** Ascending two-tone for opening a window / double-click */
  openChime: () => void;
  /** Descending two-tone for closing or minimizing a window */
  closeChime: () => void;
  /** Short click for general UI interactions */
  uiClick: () => void;
}

export function useSystemSounds(): SystemSounds {
  const { muted } = useContext(SoundContext);
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (muted) return null;
    if (!ctxRef.current) {
      ctxRef.current = createAudioContext();
    }
    // Resume if suspended (browser autoplay policy)
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, [muted]);

  const bootBlip = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const freq = 400 + Math.random() * 400;
    playSquareWave(ctx, freq, 0.06, 0.05);
  }, [getCtx]);

  const bootBeep = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    playSquareWave(ctx, 523, 0.12, 0.07);
    setTimeout(() => playSquareWave(ctx, 784, 0.18, 0.07), 120);
  }, [getCtx]);

  const openChime = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    playSquareWave(ctx, 440, 0.08, 0.06);
    setTimeout(() => playSquareWave(ctx, 660, 0.12, 0.06), 80);
  }, [getCtx]);

  const closeChime = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    playSquareWave(ctx, 660, 0.08, 0.06);
    setTimeout(() => playSquareWave(ctx, 440, 0.12, 0.06), 80);
  }, [getCtx]);

  const uiClick = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    playSquareWave(ctx, 200, 0.03, 0.04);
  }, [getCtx]);

  return { bootBlip, bootBeep, openChime, closeChime, uiClick };
}