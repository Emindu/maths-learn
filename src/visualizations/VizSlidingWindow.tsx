import React, { useEffect, useMemo, useRef, useState } from 'react';

// ── Shared char-box renderer ────────────────────────────────────────────────

type CharState = 'idle' | 'window' | 'best';

const CharBox: React.FC<{ char: string; state: CharState; index: number }> = ({ char, state, index }) => {
  const bg =
    state === 'window' ? 'var(--color-primary)' :
    state === 'best' ? '#22c55e' :
    'var(--color-surface)';
  const color = state === 'idle' ? 'var(--color-text)' : '#ffffff';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <div
        style={{
          width: '34px',
          height: '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          border: `1px solid ${state === 'idle' ? 'var(--color-border)' : 'transparent'}`,
          background: bg,
          color,
          fontWeight: 600,
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.95rem',
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        {char}
      </div>
      <div style={{ fontSize: '0.62rem', color: 'var(--color-text-secondary)' }}>{index}</div>
    </div>
  );
};

const Controls: React.FC<{
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

const useAutoPlay = (playing: boolean, speed: number, atEnd: boolean, advance: () => void, stop: () => void) => {
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

// ── Dynamic window demo: Longest Substring Without Repeating Characters ────

interface DynamicStep {
  j: number;
  i: number;
  prevI: number;
  windowChars: string;
  windowLength: number;
  isNewMax: boolean;
  maxLength: number;
  bestStart: number;
  bestEnd: number;
}

function simulateLongestUniqueSubstring(s: string): DynamicStep[] {
  const steps: DynamicStep[] = [];
  let i = 0;
  const seen = new Set<string>();
  let maxLength = 0;
  let bestStart = 0;
  let bestEnd = -1;

  for (let j = 0; j < s.length; j++) {
    const prevI = i;
    while (seen.has(s[j])) {
      seen.delete(s[i]);
      i++;
    }
    seen.add(s[j]);
    const windowLength = j - i + 1;
    let isNewMax = false;
    if (windowLength > maxLength) {
      maxLength = windowLength;
      bestStart = i;
      bestEnd = j;
      isNewMax = true;
    }
    steps.push({ j, i, prevI, windowChars: s.slice(i, j + 1), windowLength, isNewMax, maxLength, bestStart, bestEnd });
  }
  return steps;
}

export const VizSlidingWindowDynamic: React.FC = () => {
  const [input, setInput] = useState('abcabcbb');
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);

  const cleaned = input.length > 0 ? input : ' ';
  const steps = useMemo(() => simulateLongestUniqueSubstring(cleaned), [cleaned]);

  useEffect(() => setStepIdx(0), [cleaned]);

  const atEnd = stepIdx >= steps.length - 1;
  useAutoPlay(playing, speed, atEnd, () => setStepIdx((p) => Math.min(p + 1, steps.length - 1)), () => setPlaying(false));

  const step = steps[Math.min(stepIdx, steps.length - 1)];

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 24px' }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: 'var(--space-8)' }}>
        Dynamic window · Longest Substring Without Repeating Characters
      </div>

      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
        Input string
        <input
          type="text"
          value={input}
          maxLength={16}
          onChange={(e) => setInput(e.target.value.replace(/\s/g, ''))}
          style={{
            display: 'block',
            marginTop: '4px',
            width: '200px',
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-mono, monospace)',
          }}
        />
      </label>

      {step ? (
        <>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: 'var(--space-16) 0' }}>
            {cleaned.split('').map((c, idx) => {
              let state: CharState = 'idle';
              if (idx >= step.i && idx <= step.j) state = 'window';
              else if (idx >= step.bestStart && idx <= step.bestEnd) state = 'best';
              return <CharBox key={idx} char={c} state={state} index={idx} />;
            })}
          </div>

          <Controls
            playing={playing}
            onPlayPause={() => setPlaying((p) => !p)}
            onStepBack={() => { setPlaying(false); setStepIdx((p) => Math.max(0, p - 1)); }}
            onStepForward={() => { setPlaying(false); setStepIdx((p) => Math.min(steps.length - 1, p + 1)); }}
            onReset={() => { setPlaying(false); setStepIdx(0); }}
            canStepBack={stepIdx > 0}
            canStepForward={stepIdx < steps.length - 1}
            speed={speed}
            onSpeedChange={setSpeed}
            stepLabel={`j = ${stepIdx} / ${steps.length - 1}`}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            <StatTile label="Window [i, j]" value={`[${step.i}, ${step.j}]`} />
            <StatTile label="Window contents" value={`"${step.windowChars}"`} />
            <StatTile label="Window length" value={String(step.windowLength)} />
            <StatTile label="Longest so far" value={`${step.maxLength} ("${cleaned.slice(step.bestStart, step.bestEnd + 1)}")`} accent={step.isNewMax} />
          </div>

          <div style={{ marginTop: 'var(--space-10)', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
            {step.i > step.prevI
              ? `s[${step.j}] = '${cleaned[step.j]}' was already in the window, so i shrank from ${step.prevI} to ${step.i}.`
              : `s[${step.j}] = '${cleaned[step.j]}' is new to the window, so j expanded to ${step.j}.`}
          </div>
        </>
      ) : (
        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Type a string above to begin.</div>
      )}
    </div>
  );
};

// ── Fixed window demo: Substrings of Size Three with Distinct Characters ───

interface FixedStep {
  start: number;
  end: number;
  windowChars: string;
  isValid: boolean;
  countSoFar: number;
}

function simulateFixedWindow(s: string, k: number): FixedStep[] {
  const steps: FixedStep[] = [];
  let count = 0;
  for (let i = 0; i + k <= s.length; i++) {
    const windowChars = s.slice(i, i + k);
    const isValid = new Set(windowChars.split('')).size === k;
    if (isValid) count++;
    steps.push({ start: i, end: i + k - 1, windowChars, isValid, countSoFar: count });
  }
  return steps;
}

export const VizSlidingWindowFixed: React.FC = () => {
  const [input, setInput] = useState('xyzzaz');
  const k = 3;
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);

  const cleaned = input.length >= k ? input : input.padEnd(k, ' ');
  const steps = useMemo(() => simulateFixedWindow(cleaned, k), [cleaned]);

  useEffect(() => setStepIdx(0), [cleaned]);

  const atEnd = steps.length === 0 || stepIdx >= steps.length - 1;
  useAutoPlay(playing, speed, atEnd, () => setStepIdx((p) => Math.min(p + 1, steps.length - 1)), () => setPlaying(false));

  const step = steps[Math.min(stepIdx, Math.max(steps.length - 1, 0))];

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 24px' }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: 'var(--space-8)' }}>
        Fixed window (k = 3) · Substrings of Size Three with Distinct Characters
      </div>

      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
        Input string
        <input
          type="text"
          value={input}
          maxLength={16}
          onChange={(e) => setInput(e.target.value.replace(/\s/g, ''))}
          style={{
            display: 'block',
            marginTop: '4px',
            width: '200px',
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-mono, monospace)',
          }}
        />
      </label>

      {step ? (
        <>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: 'var(--space-16) 0' }}>
            {cleaned.split('').map((c, idx) => {
              const state: CharState = idx >= step.start && idx <= step.end ? 'window' : 'idle';
              return <CharBox key={idx} char={c === ' ' ? '·' : c} state={state} index={idx} />;
            })}
          </div>

          <Controls
            playing={playing}
            onPlayPause={() => setPlaying((p) => !p)}
            onStepBack={() => { setPlaying(false); setStepIdx((p) => Math.max(0, p - 1)); }}
            onStepForward={() => { setPlaying(false); setStepIdx((p) => Math.min(steps.length - 1, p + 1)); }}
            onReset={() => { setPlaying(false); setStepIdx(0); }}
            canStepBack={stepIdx > 0}
            canStepForward={stepIdx < steps.length - 1}
            speed={speed}
            onSpeedChange={setSpeed}
            stepLabel={`window ${stepIdx + 1} / ${steps.length}`}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            <StatTile label="Window [i, j]" value={`[${step.start}, ${step.end}]`} />
            <StatTile label="Window contents" value={`"${step.windowChars}"`} />
            <StatTile label="All distinct?" value={step.isValid ? 'Yes ✓' : 'No ✗'} accent={step.isValid} />
            <StatTile label="Valid windows so far" value={String(step.countSoFar)} />
          </div>
        </>
      ) : (
        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Type at least {k} characters above to begin.</div>
      )}
    </div>
  );
};

const StatTile: React.FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
  <div style={{ background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px 12px' }}>
    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>{label}</div>
    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: accent ? '#22c55e' : 'var(--color-text)', fontFamily: 'var(--font-mono, monospace)' }}>{value}</div>
  </div>
);

export const VizSlidingWindow: React.FC = () => (
  <div>
    <VizSlidingWindowDynamic />
    <VizSlidingWindowFixed />
  </div>
);
