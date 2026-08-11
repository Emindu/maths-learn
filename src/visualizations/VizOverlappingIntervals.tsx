import React, { useMemo } from 'react';
import { Controls, StatGrid, StatTile, VizCard, useStepPlayer } from './vizInterviewShared';

const AXIS_MAX = 19;
const AXIS_WIDTH = 380;
const toX = (v: number) => (v / AXIS_MAX) * AXIS_WIDTH;

const Timeline: React.FC<{
  bars: { start: number; end: number; color: string; label?: string; fade?: boolean }[];
  height?: number;
}> = ({ bars, height = 34 }) => (
  <div style={{ position: 'relative', width: `${AXIS_WIDTH}px`, height: `${height}px`, marginBottom: '4px' }}>
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'var(--color-border)' }} />
    {bars.map((bar, idx) => (
      <div
        key={idx}
        style={{
          position: 'absolute',
          left: `${toX(bar.start)}px`,
          width: `${Math.max(toX(bar.end) - toX(bar.start), 4)}px`,
          top: 0,
          height: `${height - 6}px`,
          background: bar.color,
          borderRadius: '5px',
          opacity: bar.fade ? 0.35 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono, monospace)',
          fontWeight: 700,
          transition: 'left 0.15s, width 0.15s, background 0.15s',
        }}
      >
        {bar.label ?? `${bar.start}-${bar.end}`}
      </div>
    ))}
  </div>
);

// ── Demo 1: Merge Intervals ──────────────────────────────────────────────────

const MERGE_INPUT: [number, number][] = [[1, 3], [2, 6], [8, 10], [15, 18]];

interface MergeStep {
  processedIdx: number;
  currentInterval: [number, number];
  merged: [number, number][];
  action: string;
}

function simulateMerge(intervals: [number, number][]): MergeStep[] {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const steps: MergeStep[] = [];
  const result: [number, number][] = [];
  sorted.forEach((iv, idx) => {
    if (result.length === 0 || result[result.length - 1][1] < iv[0]) {
      result.push([...iv]);
      steps.push({ processedIdx: idx, currentInterval: iv, merged: result.map((r) => [...r] as [number, number]), action: `[${iv[0]}, ${iv[1]}] starts a new merged interval` });
    } else {
      const last = result[result.length - 1];
      const newEnd = Math.max(last[1], iv[1]);
      result[result.length - 1] = [last[0], newEnd];
      steps.push({ processedIdx: idx, currentInterval: iv, merged: result.map((r) => [...r] as [number, number]), action: `[${iv[0]}, ${iv[1]}] overlaps → merge into [${last[0]}, ${newEnd}]` });
    }
  });
  return steps;
}

export const VizMergeIntervals: React.FC = () => {
  const sorted = useMemo(() => [...MERGE_INPUT].sort((a, b) => a[0] - b[0]), []);
  const steps = useMemo(() => simulateMerge(MERGE_INPUT), []);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];
  const isDone = player.stepIdx === steps.length - 1;

  return (
    <VizCard title="Sort by start, merge as you go · Merge Intervals">
      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Sorted input</div>
      <Timeline bars={sorted.map(([s, e], idx) => ({ start: s, end: e, color: idx === step.processedIdx ? 'var(--color-primary)' : 'var(--color-surface)', fade: idx > step.processedIdx }))} />

      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: '10px 0 6px' }}>Merged result so far</div>
      <Timeline bars={step.merged.map(([s, e]) => ({ start: s, end: e, color: '#22c55e' }))} />

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
        <StatTile label="Processing" value={`[${step.currentInterval[0]}, ${step.currentInterval[1]}]`} />
        <StatTile label="This step" value={step.action} />
        <StatTile label="Merged count" value={String(step.merged.length)} />
        <StatTile label="Final result" value={isDone ? step.merged.map(([s, e]) => `[${s},${e}]`).join(' ') : '—'} accent={isDone} />
      </StatGrid>
    </VizCard>
  );
};

// ── Demo 2: Non-overlapping Intervals (greedy, sort by end) ────────────────

const ERASE_INPUT: [number, number][] = [[1, 3], [2, 4], [3, 5], [6, 7]];

interface EraseStep {
  processedIdx: number;
  currentInterval: [number, number];
  kept: boolean;
  removedCount: number;
  prevEnd: number;
}

function simulateErase(intervals: [number, number][]): EraseStep[] {
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  const steps: EraseStep[] = [];
  let removed = 0;
  let prevEnd = -Infinity;
  sorted.forEach((iv, idx) => {
    if (iv[0] >= prevEnd) {
      prevEnd = iv[1];
      steps.push({ processedIdx: idx, currentInterval: iv, kept: true, removedCount: removed, prevEnd });
    } else {
      removed++;
      steps.push({ processedIdx: idx, currentInterval: iv, kept: false, removedCount: removed, prevEnd });
    }
  });
  return steps;
}

export const VizEraseOverlapIntervals: React.FC = () => {
  const sorted = useMemo(() => [...ERASE_INPUT].sort((a, b) => a[1] - b[1]), []);
  const steps = useMemo(() => simulateErase(ERASE_INPUT), []);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];
  const isDone = player.stepIdx === steps.length - 1;

  const decidedSoFar = new Map<number, boolean>();
  for (let i = 0; i <= player.stepIdx; i++) decidedSoFar.set(steps[i].processedIdx, steps[i].kept);

  return (
    <VizCard title="Sort by end, keep the earliest finisher · Non-overlapping Intervals">
      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Sorted by end time (green = keep, red = remove)</div>
      <Timeline
        height={40}
        bars={sorted.map(([s, e], idx) => {
          const decided = decidedSoFar.get(idx);
          const color = idx === step.processedIdx ? (step.kept ? '#22c55e' : '#ef4444') : decided === true ? '#22c55e' : decided === false ? '#ef4444' : 'var(--color-surface)';
          return { start: s, end: e, color, fade: decided === undefined && idx !== step.processedIdx };
        })}
      />

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
        <StatTile label="Interval" value={`[${step.currentInterval[0]}, ${step.currentInterval[1]}]`} />
        <StatTile label="Decision" value={step.kept ? `start ${step.currentInterval[0]} ≥ prevEnd → keep` : `start ${step.currentInterval[0]} < prevEnd → remove`} accent={step.kept} warn={!step.kept} />
        <StatTile label="Removed so far" value={String(step.removedCount)} />
        <StatTile label="Minimum removals" value={isDone ? String(step.removedCount) : '—'} accent={isDone} />
      </StatGrid>
    </VizCard>
  );
};

export const VizOverlappingIntervals: React.FC = () => (
  <div>
    <VizMergeIntervals />
    <VizEraseOverlapIntervals />
  </div>
);
