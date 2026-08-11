import React, { useMemo } from 'react';
import { Box, BoxState, Controls, StatGrid, StatTile, VizCard, useStepPlayer } from './vizInterviewShared';

const StackDisplay: React.FC<{ label: string; items: { label: string; state: BoxState }[] }> = ({ label, items }) => (
  <div style={{ marginBottom: 'var(--space-16)' }}>
    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>{label} (bottom → top)</div>
    <div style={{ display: 'flex', gap: '6px', minHeight: '38px' }}>
      {items.length === 0 && <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>(empty)</span>}
      {items.map((it, idx) => <Box key={idx} label={it.label} state={it.state} />)}
    </div>
  </div>
);

// ── Demo 1: Daily Temperatures ──────────────────────────────────────────────

const TEMPS = [73, 74, 75, 71, 69, 72, 76, 73];

interface TempStep {
  i: number;
  poppedIndices: number[];
  stackAfter: number[];
  resultSoFar: number[]; // -1 = pending
}

function simulateDailyTemps(temps: number[]): TempStep[] {
  const n = temps.length;
  const result = Array(n).fill(-1);
  const stack: number[] = [];
  const steps: TempStep[] = [];
  for (let i = 0; i < n; i++) {
    const popped: number[] = [];
    while (stack.length > 0 && temps[stack[stack.length - 1]] < temps[i]) {
      const day = stack.pop()!;
      result[day] = i - day;
      popped.push(day);
    }
    stack.push(i);
    steps.push({ i, poppedIndices: [...popped], stackAfter: [...stack], resultSoFar: [...result] });
  }
  return steps;
}

export const VizDailyTemperatures: React.FC = () => {
  const steps = useMemo(() => simulateDailyTemps(TEMPS), []);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];
  const isDone = player.stepIdx === steps.length - 1;

  return (
    <VizCard title="Decreasing stack, pop on a warmer day · Daily Temperatures">
      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Temperatures</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-16)' }}>
        {TEMPS.map((t, idx) => {
          const state = idx === step.i ? 'window' : step.poppedIndices.includes(idx) ? 'bad' : step.stackAfter.includes(idx) ? 'best' : 'idle';
          return <Box key={idx} label={String(t)} state={state} index={idx} />;
        })}
      </div>

      <StackDisplay label="Stack (day indices)" items={step.stackAfter.map((d) => ({ label: `d${d}`, state: 'best' as const }))} />

      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Result (days to wait)</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-16)' }}>
        {step.resultSoFar.map((r, idx) => <Box key={idx} label={r === -1 ? '?' : String(r)} state={idx === step.i ? 'window' : 'idle'} index={idx} />)}
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
        <StatTile label="Today (index)" value={`day ${step.i}, temp ${TEMPS[step.i]}`} />
        <StatTile label="Popped this step" value={step.poppedIndices.length > 0 ? step.poppedIndices.map((d) => `d${d}`).join(', ') : '—'} accent={step.poppedIndices.length > 0} />
        <StatTile label="Stack size" value={String(step.stackAfter.length)} />
        <StatTile label="Final result" value={isDone ? `[${step.resultSoFar.map((r) => (r === -1 ? 0 : r)).join(', ')}]` : '—'} accent={isDone} />
      </StatGrid>
    </VizCard>
  );
};

// ── Demo 2: Largest Rectangle in Histogram ──────────────────────────────────

const HEIGHTS = [2, 1, 5, 6, 2, 3];

interface HistStep {
  i: number; // 0..n (n = sentinel step)
  h: number;
  poppedInfo: { idx: number; height: number; width: number; area: number }[];
  stackAfter: number[];
  maxAreaSoFar: number;
}

function simulateHistogram(heights: number[]): HistStep[] {
  const n = heights.length;
  const stack: number[] = [];
  const steps: HistStep[] = [];
  let maxArea = 0;

  for (let i = 0; i <= n; i++) {
    const h = i === n ? 0 : heights[i];
    const popped: HistStep['poppedInfo'] = [];
    while (stack.length > 0 && heights[stack[stack.length - 1]] > h) {
      const top = stack.pop()!;
      const height = heights[top];
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      const area = height * width;
      maxArea = Math.max(maxArea, area);
      popped.push({ idx: top, height, width, area });
    }
    stack.push(i);
    steps.push({ i, h, poppedInfo: popped, stackAfter: [...stack].filter((x) => x < n), maxAreaSoFar: maxArea });
  }
  return steps;
}

export const VizLargestRectangle: React.FC = () => {
  const steps = useMemo(() => simulateHistogram(HEIGHTS), []);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];
  const isDone = player.stepIdx === steps.length - 1;
  const maxH = Math.max(...HEIGHTS);

  return (
    <VizCard title="Increasing stack, pop on a shorter bar · Largest Rectangle in Histogram">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '110px', marginBottom: 'var(--space-16)' }}>
        {HEIGHTS.map((h, idx) => {
          const isCurrent = idx === step.i;
          const wasPopped = step.poppedInfo.some((p) => p.idx === idx);
          const inStack = step.stackAfter.includes(idx);
          const bg = isCurrent ? 'var(--color-primary)' : wasPopped ? '#22c55e' : inStack ? '#8b5cf6' : 'var(--color-surface)';
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '32px', height: `${(h / maxH) * 90}px`, background: bg, border: '1px solid var(--color-border)', borderRadius: '3px 3px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 700, paddingTop: '2px' }}>{h}</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{idx}</div>
            </div>
          );
        })}
      </div>

      <StackDisplay label="Stack (bar indices)" items={step.stackAfter.map((d) => ({ label: String(d), state: 'window' as const }))} />

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
        <StatTile label="Position" value={step.i === HEIGHTS.length ? 'sentinel (height 0)' : `index ${step.i}, height ${step.h}`} />
        <StatTile
          label="Rectangles closed this step"
          value={step.poppedInfo.length > 0 ? step.poppedInfo.map((p) => `h=${p.height}×w=${p.width}=${p.area}`).join(', ') : '—'}
          accent={step.poppedInfo.length > 0}
        />
        <StatTile label="Max area so far" value={String(step.maxAreaSoFar)} accent={step.poppedInfo.some((p) => p.area === step.maxAreaSoFar)} />
        <StatTile label="Largest rectangle" value={isDone ? String(step.maxAreaSoFar) : '—'} accent={isDone} />
      </StatGrid>
    </VizCard>
  );
};

export const VizMonotonicStack: React.FC = () => (
  <div>
    <VizDailyTemperatures />
    <VizLargestRectangle />
  </div>
);
