import React, { useMemo, useState } from 'react';
import { Box, Controls, StatGrid, StatTile, VizCard, useStepPlayer } from './vizInterviewShared';

// ── Demo 1: Build a prefix sum array, then query ranges in O(1) ────────────

const RANGE_VALUES = [4, 2, -1, 3, 5, 1, -2, 4];

interface PrefixStep {
  i: number;
  prefix: (number | null)[];
}

function simulateBuildPrefix(arr: number[]): PrefixStep[] {
  const prefix: (number | null)[] = Array(arr.length).fill(null);
  const steps: PrefixStep[] = [];
  prefix[0] = arr[0];
  steps.push({ i: 0, prefix: [...prefix] });
  for (let i = 1; i < arr.length; i++) {
    prefix[i] = (prefix[i - 1] as number) + arr[i];
    steps.push({ i, prefix: [...prefix] });
  }
  return steps;
}

export const VizPrefixSumBuild: React.FC = () => {
  const n = RANGE_VALUES.length;
  const steps = useMemo(() => simulateBuildPrefix(RANGE_VALUES), []);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];
  const isDone = player.stepIdx === steps.length - 1;
  const fullPrefix = steps[steps.length - 1].prefix as number[];

  const [qi, setQi] = useState(2);
  const [qj, setQj] = useState(5);
  const lo = Math.min(qi, qj);
  const hi = Math.max(qi, qj);
  const bruteForceSum = RANGE_VALUES.slice(lo, hi + 1).reduce((a, b) => a + b, 0);
  const formulaSum = lo === 0 ? fullPrefix[hi] : fullPrefix[hi] - fullPrefix[lo - 1];

  return (
    <VizCard title="Build once, query in O(1) · Range Sum">
      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>arr</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-16)' }}>
        {RANGE_VALUES.map((v, idx) => <Box key={idx} label={String(v)} state={idx === step.i ? 'window' : 'idle'} index={idx} />)}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>prefix[i] = prefix[i-1] + arr[i]</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-16)' }}>
        {step.prefix.map((v, idx) => <Box key={idx} label={v === null ? '?' : String(v)} state={idx === step.i ? 'best' : 'idle'} index={idx} />)}
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
        <StatTile label="Computing" value={`prefix[${step.i}]`} />
        <StatTile label="Result" value={String(step.prefix[step.i])} />
        <StatTile label="Prefix array built?" value={isDone ? 'Yes ✓' : 'In progress'} accent={isDone} />
      </StatGrid>

      {isDone && (
        <div style={{ marginTop: 'var(--space-20)', paddingTop: 'var(--space-16)', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-10)' }}>
            Try any range [i, j] — compare a direct sum against the O(1) formula:
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: 'var(--space-12)' }}>
            <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              i = {lo}
              <input type="range" min={0} max={n - 1} value={qi} onChange={(e) => setQi(parseInt(e.target.value, 10))} style={{ display: 'block', width: '140px', marginTop: '4px' }} />
            </label>
            <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              j = {hi}
              <input type="range" min={0} max={n - 1} value={qj} onChange={(e) => setQj(parseInt(e.target.value, 10))} style={{ display: 'block', width: '140px', marginTop: '4px' }} />
            </label>
          </div>
          <StatGrid>
            <StatTile label="Direct sum (brute force)" value={`sum(arr[${lo}..${hi}]) = ${bruteForceSum}`} />
            <StatTile
              label="Formula (O(1))"
              value={lo === 0 ? `prefix[${hi}] = ${formulaSum}` : `prefix[${hi}] − prefix[${lo - 1}] = ${formulaSum}`}
            />
            <StatTile label="Match?" value={bruteForceSum === formulaSum ? 'Yes ✓' : 'No ✗'} accent={bruteForceSum === formulaSum} warn={bruteForceSum !== formulaSum} />
          </StatGrid>
        </div>
      )}
    </VizCard>
  );
};

// ── Demo 2: Subarray Sum Equals K ───────────────────────────────────────────

const SUBARRAY_NUMS = [1, 2, 3];
const TARGET_K = 3;

interface SubarrayStep {
  idx: number;
  num: number;
  sum: number;
  lookupValue: number;
  matchesFound: number; // count contributed by this step
  countSoFar: number;
  prefixCounts: Record<number, number>;
}

function simulateSubarraySum(nums: number[], k: number): SubarrayStep[] {
  const prefixCounts: Record<number, number> = { 0: 1 };
  let sum = 0;
  let count = 0;
  const steps: SubarrayStep[] = [];
  for (let idx = 0; idx < nums.length; idx++) {
    const num = nums[idx];
    sum += num;
    const lookupValue = sum - k;
    const matchesFound = prefixCounts[lookupValue] ?? 0;
    count += matchesFound;
    prefixCounts[sum] = (prefixCounts[sum] ?? 0) + 1;
    steps.push({ idx, num, sum, lookupValue, matchesFound, countSoFar: count, prefixCounts: { ...prefixCounts } });
  }
  return steps;
}

export const VizSubarraySumEqualsK: React.FC = () => {
  const steps = useMemo(() => simulateSubarraySum(SUBARRAY_NUMS, TARGET_K), []);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];
  const isDone = player.stepIdx === steps.length - 1;

  return (
    <VizCard title="How many prefixes equal (sum − k)? · Subarray Sum Equals K">
      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>nums (k = {TARGET_K})</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-16)' }}>
        {SUBARRAY_NUMS.map((v, idx) => <Box key={idx} label={String(v)} state={idx === step.idx ? 'window' : 'idle'} index={idx} />)}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Prefix-sum counts seen so far</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-16)' }}>
        {Object.entries(step.prefixCounts).map(([sum, cnt]) => (
          <span key={sum} style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono, monospace)', background: Number(sum) === step.lookupValue ? 'var(--color-primary)' : 'var(--color-background)', color: Number(sum) === step.lookupValue ? '#fff' : 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '3px 8px' }}>
            {sum}: {cnt}×
          </span>
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
        <StatTile label="Running sum" value={String(step.sum)} />
        <StatTile label="Looking up (sum − k)" value={String(step.lookupValue)} />
        <StatTile label="Matches found this step" value={String(step.matchesFound)} accent={step.matchesFound > 0} />
        <StatTile label="Subarrays summing to k" value={isDone ? String(step.countSoFar) : '—'} accent={isDone} />
      </StatGrid>
    </VizCard>
  );
};

export const VizPrefixSum: React.FC = () => (
  <div>
    <VizPrefixSumBuild />
    <VizSubarraySumEqualsK />
  </div>
);
