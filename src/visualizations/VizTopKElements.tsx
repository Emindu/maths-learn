import React, { useMemo, useState } from 'react';
import { Box, Controls, StatGrid, StatTile, VizCard, useStepPlayer } from './vizInterviewShared';

// ── Demo 1: Top K largest via size-k min-heap ───────────────────────────────

const ARRAY_VALUES = [7, 2, 9, 4, 1, 8, 3, 6];

interface HeapStep {
  index: number;
  value: number;
  heap: number[]; // sorted ascending; heap[0] is the min-heap root
  evicted: number | null;
}

function simulateTopKLargest(arr: number[], k: number): HeapStep[] {
  const steps: HeapStep[] = [];
  let heap: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i];
    heap = [...heap, v].sort((a, b) => a - b);
    let evicted: number | null = null;
    if (heap.length > k) {
      evicted = heap[0];
      heap = heap.slice(1);
    }
    steps.push({ index: i, value: v, heap, evicted });
  }
  return steps;
}

export const VizTopKLargest: React.FC = () => {
  const [k, setK] = useState(3);
  const steps = useMemo(() => simulateTopKLargest(ARRAY_VALUES, k), [k]);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];
  const isLast = player.stepIdx === steps.length - 1;

  return (
    <VizCard title="Size-k min-heap · Top K Largest / Kth Largest Element">
      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-12)' }}>
        k = {k}
        <input type="range" min={1} max={5} step={1} value={k} onChange={(e) => { setK(parseInt(e.target.value, 10)); player.reset(); }} style={{ display: 'block', width: '140px', marginTop: '4px' }} />
      </label>

      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Input array</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-16)' }}>
        {ARRAY_VALUES.map((v, idx) => (
          <Box key={idx} label={String(v)} state={idx === step.index ? 'window' : idx < step.index ? 'idle' : 'idle'} index={idx} />
        ))}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
        Min-heap (capped at k={k}) — leftmost box is the root (current minimum of the kept set)
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-16)', minHeight: '58px' }}>
        {step.heap.length === 0 && <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>(empty)</span>}
        {step.heap.map((v, idx) => (
          <Box key={idx} label={String(v)} state={idx === 0 ? 'best' : 'idle'} />
        ))}
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
        <StatTile label="Just pushed" value={String(step.value)} />
        <StatTile label="Evicted (heap > k)" value={step.evicted !== null ? String(step.evicted) : '—'} warn={step.evicted !== null} />
        <StatTile label="Heap contents" value={`{${step.heap.join(', ')}}`} />
        <StatTile label={`Kth (${k}) largest`} value={isLast ? String(step.heap[0]) : '—'} accent={isLast} />
      </StatGrid>
    </VizCard>
  );
};

// ── Demo 2: Top K Frequent Elements ─────────────────────────────────────────

const FREQ_VALUES = [1, 1, 1, 2, 2, 3, 4, 4, 4, 4, 5, 5];

interface FreqStep {
  index: number;
  value: number;
  freq: Record<number, number>;
  heap: number[]; // sorted ascending by frequency; heap[0] has the lowest frequency
  evicted: number | null;
}

function simulateTopKFrequent(arr: number[], k: number): FreqStep[] {
  const fullFreq: Record<number, number> = {};
  for (const v of arr) fullFreq[v] = (fullFreq[v] ?? 0) + 1;

  const steps: FreqStep[] = [];
  const runningFreq: Record<number, number> = {};
  let heap: number[] = [];
  const seen = new Set<number>();

  for (let i = 0; i < arr.length; i++) {
    const v = arr[i];
    runningFreq[v] = (runningFreq[v] ?? 0) + 1;
    let evicted: number | null = null;
    if (!seen.has(v)) {
      seen.add(v);
      heap = [...heap, v];
    }
    heap = heap.sort((a, b) => runningFreq[a] - runningFreq[b] || a - b);
    if (heap.length > k) {
      evicted = heap[0];
      heap = heap.slice(1);
      seen.delete(evicted);
    }
    steps.push({ index: i, value: v, freq: { ...runningFreq }, heap: [...heap], evicted });
  }
  return steps;
}

export const VizTopKFrequent: React.FC = () => {
  const [k, setK] = useState(2);
  const steps = useMemo(() => simulateTopKFrequent(FREQ_VALUES, k), [k]);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];
  const isLast = player.stepIdx === steps.length - 1;

  return (
    <VizCard title="Same trick, ordered by frequency · Top K Frequent Elements">
      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-12)' }}>
        k = {k}
        <input type="range" min={1} max={3} step={1} value={k} onChange={(e) => { setK(parseInt(e.target.value, 10)); player.reset(); }} style={{ display: 'block', width: '140px', marginTop: '4px' }} />
      </label>

      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Input array</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-16)' }}>
        {FREQ_VALUES.map((v, idx) => (
          <Box key={idx} label={String(v)} state={idx === step.index ? 'window' : 'idle'} index={idx} />
        ))}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Running frequency count</div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: 'var(--space-16)' }}>
        {Object.entries(step.freq).sort((a, b) => Number(a[0]) - Number(b[0])).map(([val, count]) => (
          <div key={val} style={{ fontSize: '0.8rem', color: 'var(--color-text)', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '4px 8px' }}>
            <strong>{val}</strong>: {count}×
          </div>
        ))}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
        Min-heap of values (capped at k={k}), ordered by frequency — leftmost is least frequent of the kept set
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-16)', minHeight: '58px' }}>
        {step.heap.length === 0 && <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>(empty)</span>}
        {step.heap.map((v, idx) => (
          <Box key={v} label={String(v)} state={idx === 0 ? 'best' : 'idle'} index={`${step.freq[v]}×`} />
        ))}
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
        <StatTile label="Just seen" value={String(step.value)} />
        <StatTile label="Evicted (heap > k)" value={step.evicted !== null ? String(step.evicted) : '—'} warn={step.evicted !== null} />
        <StatTile label="Heap values" value={`{${step.heap.join(', ')}}`} />
        <StatTile label={`Top ${k} frequent`} value={isLast ? `{${step.heap.join(', ')}}` : '—'} accent={isLast} />
      </StatGrid>
    </VizCard>
  );
};

export const VizTopKElements: React.FC = () => (
  <div>
    <VizTopKLargest />
    <VizTopKFrequent />
  </div>
);
