// Shared building blocks for the "Programming Interview Patterns" visualizations.
// Keeps every pattern's step-through demo visually consistent (boxes, controls,
// stat tiles) instead of each one reinventing the same play/pause/step machinery.

import React, { useEffect, useRef } from 'react';

export type BoxState = 'idle' | 'window' | 'best' | 'good' | 'bad' | 'pointer-a' | 'pointer-b';

const BOX_COLORS: Record<BoxState, { bg: string; color: string }> = {
  idle: { bg: 'var(--color-surface)', color: 'var(--color-text)' },
  window: { bg: 'var(--color-primary)', color: '#ffffff' },
  best: { bg: '#22c55e', color: '#ffffff' },
  good: { bg: '#22c55e', color: '#ffffff' },
  bad: { bg: '#ef4444', color: '#ffffff' },
  'pointer-a': { bg: 'var(--color-primary)', color: '#ffffff' },
  'pointer-b': { bg: '#f59e0b', color: '#ffffff' },
};

export const Box: React.FC<{ label: string; state: BoxState; index?: number | string; size?: number }> = ({ label, state, index, size = 34 }) => {
  const { bg, color } = BOX_COLORS[state];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          border: `1px solid ${state === 'idle' ? 'var(--color-border)' : 'transparent'}`,
          background: bg,
          color,
          fontWeight: 600,
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: size >= 34 ? '0.95rem' : '0.8rem',
          transition: 'background 0.15s, color 0.15s',
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      {index !== undefined && <div style={{ fontSize: '0.62rem', color: 'var(--color-text-secondary)' }}>{index}</div>}
    </div>
  );
};

export const StatTile: React.FC<{ label: string; value: string; accent?: boolean; warn?: boolean }> = ({ label, value, accent, warn }) => (
  <div style={{ background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px 12px' }}>
    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>{label}</div>
    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: warn ? '#ef4444' : accent ? '#22c55e' : 'var(--color-text)', fontFamily: 'var(--font-mono, monospace)' }}>{value}</div>
  </div>
);

export const StatGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
    {children}
  </div>
);

export const VizCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 24px' }}>
    <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: 'var(--space-8)' }}>
      {title}
    </div>
    {children}
  </div>
);

export const TextInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; maxLength?: number; width?: number }> = ({ label, value, onChange, maxLength = 16, width = 200 }) => (
  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
    {label}
    <input
      type="text"
      value={value}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      style={{
        display: 'block',
        marginTop: '4px',
        width: `${width}px`,
        padding: '6px 10px',
        borderRadius: '6px',
        border: '1px solid var(--color-border)',
        background: 'var(--color-background)',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-mono, monospace)',
      }}
    />
  </label>
);

export const Controls: React.FC<{
  playing: boolean;
  onPlayPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  canStepBack: boolean;
  canStepForward: boolean;
  speed: number;
  onSpeedChange: (v: number) => void;
  stepLabel: string;
}> = ({ playing, onPlayPause, onStepBack, onStepForward, onReset, canStepBack, canStepForward, speed, onSpeedChange, stepLabel }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', flexWrap: 'wrap', margin: 'var(--space-12) 0' }}>
    <button className="btn btn--outline btn--sm" onClick={onReset}>Reset</button>
    <button className="btn btn--outline btn--sm" onClick={onStepBack} disabled={!canStepBack}>◀ Step</button>
    <button className="btn btn--primary btn--sm" onClick={onPlayPause}>{playing ? 'Pause' : 'Play'}</button>
    <button className="btn btn--outline btn--sm" onClick={onStepForward} disabled={!canStepForward}>Step ▶</button>
    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginLeft: 'var(--space-8)' }}>
      Speed
      <input
        type="range"
        min={200}
        max={1500}
        step={100}
        value={1700 - speed}
        onChange={(e) => onSpeedChange(1700 - parseInt(e.target.value, 10))}
        style={{ width: '90px' }}
      />
    </label>
    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginLeft: 'auto' }}>{stepLabel}</span>
  </div>
);

export const useAutoPlay = (playing: boolean, speed: number, atEnd: boolean, advance: () => void, stop: () => void) => {
  const savedAdvance = useRef(advance);
  savedAdvance.current = advance;
  useEffect(() => {
    if (!playing || atEnd) {
      if (atEnd) stop();
      return;
    }
    const id = setInterval(() => savedAdvance.current(), speed);
    return () => clearInterval(id);
  }, [playing, speed, atEnd, stop]);
};

/** Standard step-player state, reused by every pattern's stepped demo. */
export function useStepPlayer(stepCount: number) {
  const [stepIdx, setStepIdxRaw] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState(700);

  const setStepIdx = (updater: (p: number) => number) => setStepIdxRaw((p) => Math.max(0, Math.min(stepCount - 1, updater(p))));

  const atEnd = stepCount === 0 || stepIdx >= stepCount - 1;
  useAutoPlay(playing, speed, atEnd, () => setStepIdx((p) => p + 1), () => setPlaying(false));

  return {
    stepIdx: Math.min(stepIdx, Math.max(stepCount - 1, 0)),
    playing,
    speed,
    setSpeed,
    reset: () => { setPlaying(false); setStepIdxRaw(0); },
    stepBack: () => { setPlaying(false); setStepIdx((p) => p - 1); },
    stepForward: () => { setPlaying(false); setStepIdx((p) => p + 1); },
    togglePlay: () => setPlaying((p) => !p),
    canStepBack: stepIdx > 0,
    canStepForward: stepIdx < stepCount - 1,
  };
}
