import React, { useMemo, useState } from 'react';
import { Controls, StatGrid, StatTile, VizCard, useStepPlayer } from './vizInterviewShared';

// ── Shared node-row renderer ────────────────────────────────────────────────

const NodeBox: React.FC<{
  val: number | string;
  isSlow: boolean;
  isFast: boolean;
  dim?: boolean;
}> = ({ val, isSlow, isFast, dim }) => {
  const both = isSlow && isFast;
  const bg = both ? '#8b5cf6' : isFast ? '#f59e0b' : isSlow ? 'var(--color-primary)' : 'var(--color-surface)';
  const color = both || isFast || isSlow ? '#ffffff' : 'var(--color-text)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: dim ? 0.4 : 1 }}>
      <div style={{ display: 'flex', gap: '3px', height: '14px' }}>
        {isSlow && <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--color-primary)' }}>S</span>}
        {isFast && <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#f59e0b' }}>F</span>}
      </div>
      <div
        style={{
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: `1px solid ${both || isFast || isSlow ? 'transparent' : 'var(--color-border)'}`,
          background: bg,
          color,
          fontWeight: 600,
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.9rem',
          transition: 'background 0.15s',
          flexShrink: 0,
        }}
      >
        {val}
      </div>
    </div>
  );
};

// ── Demo 1: Linked List Cycle detection ─────────────────────────────────────

const CYCLE_VALUES = [4, 1, 8, 3, 9, 2];

interface CycleStep {
  slow: number;
  fast: number;
  fastAtEnd: boolean;
  met: boolean;
}

function nextIndex(i: number, n: number, cycleStart: number | null): number {
  if (i < n - 1) return i + 1;
  return cycleStart !== null ? cycleStart : -1;
}

function simulateCycle(n: number, cycleStart: number | null): CycleStep[] {
  const steps: CycleStep[] = [];
  let slow = 0;
  let fast = 0;
  const maxSteps = 2 * n + 2;

  for (let iter = 0; iter < maxSteps; iter++) {
    const f1 = nextIndex(fast, n, cycleStart);
    if (f1 === -1) { steps.push({ slow, fast: -1, fastAtEnd: true, met: false }); return steps; }
    const f2 = nextIndex(f1, n, cycleStart);
    if (f2 === -1) { steps.push({ slow, fast: -1, fastAtEnd: true, met: false }); return steps; }
    fast = f2;
    slow = nextIndex(slow, n, cycleStart);
    const met = slow === fast;
    steps.push({ slow, fast, fastAtEnd: false, met });
    if (met) return steps;
  }
  return steps;
}

const CYCLE_PRESETS: { label: string; cycleStart: number | null }[] = [
  { label: 'No cycle', cycleStart: null },
  { label: 'Cycle → node 2', cycleStart: 2 },
  { label: 'Cycle → node 4', cycleStart: 4 },
];

export const VizFastSlowCycle: React.FC = () => {
  const [presetIdx, setPresetIdx] = useState(1);
  const preset = CYCLE_PRESETS[presetIdx];
  const n = CYCLE_VALUES.length;
  const steps = useMemo(() => simulateCycle(n, preset.cycleStart), [preset.cycleStart]);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];

  return (
    <VizCard title="Slow & fast pointers · Linked List Cycle">
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--space-12)' }}>
        {CYCLE_PRESETS.map((p, idx) => (
          <button
            key={p.label}
            className={idx === presetIdx ? 'btn btn--primary btn--sm' : 'btn btn--outline btn--sm'}
            onClick={() => { setPresetIdx(idx); player.reset(); }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {step ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', margin: 'var(--space-16) 0' }}>
            {CYCLE_VALUES.map((v, idx) => (
              <React.Fragment key={idx}>
                <NodeBox val={v} isSlow={step.slow === idx} isFast={step.fast === idx} />
                {idx < n - 1 && <span style={{ color: 'var(--color-text-secondary)' }}>→</span>}
              </React.Fragment>
            ))}
            <span style={{ color: 'var(--color-text-secondary)', marginLeft: '4px' }}>
              {preset.cycleStart === null ? '→ null' : `↩ back to node ${preset.cycleStart}`}
            </span>
          </div>

          <Controls
            playing={player.playing}
            onPlayPause={player.togglePlay}
            onStepBack={player.stepBack}
            onStepForward={player.stepForward}
            onReset={player.reset}
            canStepBack={player.canStepBack}
            canStepForward={player.canStepForward}
            speed={player.speed}
            onSpeedChange={player.setSpeed}
            stepLabel={`step ${player.stepIdx + 1} / ${steps.length}`}
          />

          <StatGrid>
            <StatTile label="slow index" value={String(step.slow)} />
            <StatTile label="fast index" value={step.fastAtEnd ? 'past end (null)' : String(step.fast)} warn={step.fastAtEnd} />
            <StatTile
              label="This step"
              value={step.met ? 'slow == fast !' : step.fastAtEnd ? 'fast hit null' : 'slow +1, fast +2'}
              accent={step.met}
              warn={step.fastAtEnd}
            />
            <StatTile
              label="Result"
              value={step.met ? 'Cycle detected ✓' : step.fastAtEnd ? 'No cycle ✗' : '—'}
              accent={step.met}
              warn={step.fastAtEnd}
            />
          </StatGrid>
        </>
      ) : null}
    </VizCard>
  );
};

// ── Demo 2: Remove Nth Node From End of List ────────────────────────────────

const REMOVE_VALUES = [1, 2, 3, 4, 5, 6, 7];

interface RemoveStep {
  phase: 'advance-fast' | 'advance-both' | 'done';
  slow: number; // -1 = dummy (before head)
  fast: number; // -1 = dummy
  removedIndex: number | null;
}

function simulateRemoveNth(len: number, n: number): RemoveStep[] {
  const steps: RemoveStep[] = [];
  let slow = -1;
  let fast = -1;

  for (let i = 0; i < n; i++) {
    fast += 1;
    steps.push({ phase: 'advance-fast', slow, fast, removedIndex: null });
  }

  while (fast < len - 1) {
    fast += 1;
    slow += 1;
    steps.push({ phase: 'advance-both', slow, fast, removedIndex: null });
  }

  steps.push({ phase: 'done', slow, fast, removedIndex: slow + 1 });
  return steps;
}

export const VizFastSlowRemoveNth: React.FC = () => {
  const [n, setN] = useState(2);
  const len = REMOVE_VALUES.length;
  const steps = useMemo(() => simulateRemoveNth(len, n), [n]);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];

  return (
    <VizCard title="Lead pointer by n, then move together · Remove Nth Node From End">
      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-12)' }}>
        n = {n}
        <input
          type="range"
          min={1}
          max={len}
          step={1}
          value={n}
          onChange={(e) => { setN(parseInt(e.target.value, 10)); player.reset(); }}
          style={{ display: 'block', width: '160px', marginTop: '4px' }}
        />
      </label>

      {step ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', margin: 'var(--space-16) 0' }}>
            <NodeBox val="⌀" isSlow={step.slow === -1} isFast={step.fast === -1} dim />
            <span style={{ color: 'var(--color-text-secondary)' }}>→</span>
            {REMOVE_VALUES.map((v, idx) => (
              <React.Fragment key={idx}>
                <NodeBox val={v} isSlow={step.slow === idx} isFast={step.fast === idx} dim={step.removedIndex === idx} />
                {idx < len - 1 && <span style={{ color: 'var(--color-text-secondary)' }}>→</span>}
              </React.Fragment>
            ))}
            <span style={{ color: 'var(--color-text-secondary)' }}>→ null</span>
          </div>

          <Controls
            playing={player.playing}
            onPlayPause={player.togglePlay}
            onStepBack={player.stepBack}
            onStepForward={player.stepForward}
            onReset={player.reset}
            canStepBack={player.canStepBack}
            canStepForward={player.canStepForward}
            speed={player.speed}
            onSpeedChange={player.setSpeed}
            stepLabel={`step ${player.stepIdx + 1} / ${steps.length}`}
          />

          <StatGrid>
            <StatTile label="Phase" value={step.phase === 'advance-fast' ? `Leading fast ${step.fast + 1}/${n}` : step.phase === 'advance-both' ? 'Moving both together' : 'Done'} />
            <StatTile label="slow, fast" value={`${step.slow}, ${step.fast}`} />
            <StatTile
              label="Node to remove"
              value={step.removedIndex !== null ? `index ${step.removedIndex} (value ${REMOVE_VALUES[step.removedIndex]})` : '—'}
              warn={step.removedIndex !== null}
            />
            <StatTile
              label="Result"
              value={step.removedIndex !== null ? `[${REMOVE_VALUES.filter((_, i) => i !== step.removedIndex).join(', ')}]` : '—'}
              accent={step.removedIndex !== null}
            />
          </StatGrid>
        </>
      ) : null}
    </VizCard>
  );
};

export const VizFastSlowPointers: React.FC = () => (
  <div>
    <VizFastSlowCycle />
    <VizFastSlowRemoveNth />
  </div>
);
