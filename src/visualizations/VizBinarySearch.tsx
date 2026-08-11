import React, { useMemo, useState } from 'react';
import { Controls, StatGrid, StatTile, VizCard, useStepPlayer } from './vizInterviewShared';

type PointerRole = 'left' | 'right' | 'mid' | 'left-mid' | 'right-mid' | 'all' | 'none';

const ARRAY_BOX: Record<PointerRole, { bg: string; color: string }> = {
  left: { bg: 'var(--color-primary)', color: '#fff' },
  right: { bg: '#f59e0b', color: '#fff' },
  mid: { bg: '#8b5cf6', color: '#fff' },
  'left-mid': { bg: '#8b5cf6', color: '#fff' },
  'right-mid': { bg: '#8b5cf6', color: '#fff' },
  all: { bg: '#8b5cf6', color: '#fff' },
  none: { bg: 'var(--color-surface)', color: 'var(--color-text)' },
};

const IndexBox: React.FC<{ val: number | string; role: PointerRole; dim?: boolean; found?: boolean }> = ({ val, role, dim, found }) => {
  const { bg, color } = ARRAY_BOX[role];
  const finalBg = found ? '#22c55e' : bg;
  const labels: string[] = [];
  if (role === 'left' || role === 'left-mid' || role === 'all') labels.push('L');
  if (role === 'mid' || role === 'left-mid' || role === 'right-mid' || role === 'all') labels.push('M');
  if (role === 'right' || role === 'right-mid' || role === 'all') labels.push('R');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: dim ? 0.35 : 1 }}>
      <div style={{ height: '13px', fontSize: '0.6rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>{labels.join('')}</div>
      <div
        style={{
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          border: `1px solid ${role === 'none' && !found ? 'var(--color-border)' : 'transparent'}`,
          background: found ? finalBg : role === 'none' ? 'var(--color-surface)' : finalBg,
          color: found || role !== 'none' ? '#fff' : color,
          fontWeight: 600,
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.85rem',
          transition: 'background 0.15s',
        }}
      >
        {val}
      </div>
    </div>
  );
};

const roleFor = (idx: number, left: number, mid: number | null, right: number): PointerRole => {
  const isL = idx === left, isM = idx === mid, isR = idx === right;
  if (isL && isM && isR) return 'all';
  if (isL && isM) return 'left-mid';
  if (isR && isM) return 'right-mid';
  if (isM) return 'mid';
  if (isL) return 'left';
  if (isR) return 'right';
  return 'none';
};

// ── Demo 1: First & Last Occurrence (boundary search) ───────────────────────

const SORTED_VALUES = [1, 3, 3, 3, 5, 7, 7, 9, 9, 9, 11];

interface BoundStep {
  left: number;
  right: number; // exclusive
  mid: number | null;
  conditionTrue: boolean | null;
  resultIndex: number | null;
}

function simulateLowerBound(arr: number[], threshold: number): BoundStep[] {
  const steps: BoundStep[] = [];
  let left = 0;
  let right = arr.length;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    const cond = arr[mid] >= threshold;
    steps.push({ left, right, mid, conditionTrue: cond, resultIndex: null });
    if (cond) right = mid; else left = mid + 1;
  }
  steps.push({ left, right, mid: null, conditionTrue: null, resultIndex: left });
  return steps;
}

export const VizBinarySearchBoundary: React.FC = () => {
  const [target, setTarget] = useState(7);
  const [mode, setMode] = useState<'first' | 'last'>('first');
  const n = SORTED_VALUES.length;
  const threshold = mode === 'first' ? target : target + 1;
  const steps = useMemo(() => simulateLowerBound(SORTED_VALUES, threshold), [threshold]);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];

  const finalIndex = step.resultIndex !== null ? (mode === 'first' ? step.resultIndex : step.resultIndex - 1) : null;
  const finalValid = finalIndex !== null && finalIndex >= 0 && finalIndex < n && SORTED_VALUES[finalIndex] === target;

  return (
    <VizCard title="Boundary search · Find First and Last Position of Element">
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-12)' }}>
        <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
          target = {target}
          <input type="range" min={0} max={12} step={1} value={target} onChange={(e) => { setTarget(parseInt(e.target.value, 10)); player.reset(); }} style={{ display: 'block', width: '140px', marginTop: '4px' }} />
        </label>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['first', 'last'] as const).map((m) => (
            <button key={m} className={mode === m ? 'btn btn--primary btn--sm' : 'btn btn--outline btn--sm'} onClick={() => { setMode(m); player.reset(); }}>
              {m === 'first' ? 'First occurrence' : 'Last occurrence'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', flexWrap: 'wrap', margin: 'var(--space-16) 0' }}>
        {SORTED_VALUES.map((v, idx) => (
          <IndexBox key={idx} val={v} role={roleFor(idx, step.left, step.mid, step.right - 1)} found={finalValid && idx === finalIndex} />
        ))}
        <IndexBox val="∅" role="none" dim />
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
        <StatTile label="[left, right)" value={`[${step.left}, ${step.right})`} />
        <StatTile label="mid" value={step.mid !== null ? `${step.mid} (arr=${SORTED_VALUES[step.mid]})` : '—'} />
        <StatTile
          label="Condition"
          value={step.conditionTrue !== null ? `arr[mid] ${mode === 'first' ? '≥' : '>'} ${target}: ${step.conditionTrue ? 'true' : 'false'}` : '—'}
          accent={step.conditionTrue === true}
        />
        <StatTile
          label={mode === 'first' ? 'First index' : 'Last index'}
          value={finalIndex === null ? '—' : finalValid ? String(finalIndex) : 'not found'}
          accent={finalValid}
          warn={finalIndex !== null && !finalValid}
        />
      </StatGrid>
    </VizCard>
  );
};

// ── Demo 2: Search in Rotated Sorted Array ──────────────────────────────────

const ROTATED_VALUES = [5, 6, 7, 8, 1, 2, 3, 4];

interface RotatedStep {
  left: number;
  right: number;
  mid: number;
  leftHalfSorted: boolean;
  action: string;
  found: boolean;
}

function simulateRotatedSearch(arr: number[], target: number): RotatedStep[] {
  const steps: RotatedStep[] = [];
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] === target) {
      steps.push({ left, right, mid, leftHalfSorted: arr[left] <= arr[mid], action: 'found target', found: true });
      return steps;
    }
    const leftHalfSorted = arr[left] <= arr[mid];
    let action: string;
    if (leftHalfSorted) {
      if (arr[left] <= target && target < arr[mid]) {
        action = 'target in sorted left half → search left';
        steps.push({ left, right, mid, leftHalfSorted, action, found: false });
        right = mid - 1;
      } else {
        action = 'target not in sorted left half → search right';
        steps.push({ left, right, mid, leftHalfSorted, action, found: false });
        left = mid + 1;
      }
    } else {
      if (arr[mid] < target && target <= arr[right]) {
        action = 'target in sorted right half → search right';
        steps.push({ left, right, mid, leftHalfSorted, action, found: false });
        left = mid + 1;
      } else {
        action = 'target not in sorted right half → search left';
        steps.push({ left, right, mid, leftHalfSorted, action, found: false });
        right = mid - 1;
      }
    }
  }
  steps.push({ left, right, mid: -1, leftHalfSorted: false, action: 'not found', found: false });
  return steps;
}

export const VizBinarySearchRotated: React.FC = () => {
  const [target, setTarget] = useState(2);
  const steps = useMemo(() => simulateRotatedSearch(ROTATED_VALUES, target), [target]);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];
  const isLast = player.stepIdx === steps.length - 1;
  const notFound = isLast && step.mid === -1;

  return (
    <VizCard title="One half is always sorted · Search in Rotated Sorted Array">
      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-12)' }}>
        target = {target}
        <input type="range" min={1} max={9} step={1} value={target} onChange={(e) => { setTarget(parseInt(e.target.value, 10)); player.reset(); }} style={{ display: 'block', width: '160px', marginTop: '4px' }} />
      </label>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', flexWrap: 'wrap', margin: 'var(--space-16) 0' }}>
        {ROTATED_VALUES.map((v, idx) => {
          const inRange = idx >= step.left && idx <= step.right;
          return <IndexBox key={idx} val={v} role={roleFor(idx, step.left, step.mid === -1 ? null : step.mid, step.right)} dim={!inRange} found={step.found && idx === step.mid} />;
        })}
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
        <StatTile label="[left, right]" value={notFound ? '∅ (empty)' : `[${step.left}, ${step.right}]`} />
        <StatTile label="mid" value={step.mid >= 0 ? `${step.mid} (arr=${ROTATED_VALUES[step.mid]})` : '—'} />
        <StatTile label="Which half is sorted?" value={step.mid >= 0 ? (step.leftHalfSorted ? 'left half' : 'right half') : '—'} />
        <StatTile label="This step" value={step.action} accent={step.found} warn={notFound} />
      </StatGrid>
    </VizCard>
  );
};

export const VizBinarySearch: React.FC = () => (
  <div>
    <VizBinarySearchBoundary />
    <VizBinarySearchRotated />
  </div>
);
