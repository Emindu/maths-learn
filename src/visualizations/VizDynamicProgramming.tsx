import React, { useMemo } from 'react';
import { Box, Controls, StatGrid, StatTile, VizCard, useStepPlayer } from './vizInterviewShared';

// ── Demo 1: Climbing Stairs — bottom-up table fill ──────────────────────────

const STAIR_N = 8;

interface StairStep {
  i: number;
  dp: (number | null)[];
  fromA: number | null;
  fromB: number | null;
}

function simulateStairs(n: number): StairStep[] {
  const dp: (number | null)[] = Array(n + 1).fill(null);
  const steps: StairStep[] = [];
  dp[0] = 1;
  steps.push({ i: 0, dp: [...dp], fromA: null, fromB: null });
  if (n >= 1) {
    dp[1] = 1;
    steps.push({ i: 1, dp: [...dp], fromA: null, fromB: null });
  }
  for (let i = 2; i <= n; i++) {
    dp[i] = (dp[i - 1] as number) + (dp[i - 2] as number);
    steps.push({ i, dp: [...dp], fromA: i - 1, fromB: i - 2 });
  }
  return steps;
}

export const VizDPClimbingStairs: React.FC = () => {
  const steps = useMemo(() => simulateStairs(STAIR_N), []);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];
  const isDone = player.stepIdx === steps.length - 1;

  return (
    <VizCard title="Bottom-up table fill · Climbing Stairs">
      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
        dp[i] = number of ways to reach step i (dp[i] = dp[i-1] + dp[i-2])
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-16)' }}>
        {step.dp.map((v, idx) => {
          const state = idx === step.i ? 'window' : idx === step.fromA || idx === step.fromB ? 'best' : 'idle';
          return <Box key={idx} label={v === null ? '?' : String(v)} state={state} index={idx} />;
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
        <StatTile label="Computing" value={`dp[${step.i}]`} />
        <StatTile
          label="Recurrence"
          value={step.fromA !== null ? `dp[${step.fromA}] + dp[${step.fromB}] = ${step.dp[step.fromA]} + ${step.dp[step.fromB!]}` : 'base case'}
        />
        <StatTile label="Result" value={String(step.dp[step.i])} />
        <StatTile label={`Ways to reach step ${STAIR_N}`} value={isDone ? String(step.dp[STAIR_N]) : '—'} accent={isDone} />
      </StatGrid>
    </VizCard>
  );
};

// ── Demo 2: Coin Change — 1D DP array, minimise over every coin ─────────────

const COINS = [1, 4, 5];
const AMOUNT = 8;
const INF = AMOUNT + 1;

interface CoinStep {
  amount: number;
  coinIdx: number;
  coin: number;
  candidate: number | null;
  dp: number[];
  improved: boolean;
}

function simulateCoinChange(coins: number[], amount: number): CoinStep[] {
  const dp = Array(amount + 1).fill(INF);
  dp[0] = 0;
  const steps: CoinStep[] = [];
  for (let a = 1; a <= amount; a++) {
    for (let ci = 0; ci < coins.length; ci++) {
      const coin = coins[ci];
      let candidate: number | null = null;
      let improved = false;
      if (coin <= a) {
        const candidateValue = dp[a - coin] + 1;
        candidate = candidateValue;
        if (candidateValue < dp[a]) { dp[a] = candidateValue; improved = true; }
      }
      steps.push({ amount: a, coinIdx: ci, coin, candidate, dp: [...dp], improved });
    }
  }
  return steps;
}

export const VizDPCoinChange: React.FC = () => {
  const steps = useMemo(() => simulateCoinChange(COINS, AMOUNT), []);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];
  const isDone = player.stepIdx === steps.length - 1;
  const finalAnswer = step.dp[AMOUNT] > AMOUNT ? -1 : step.dp[AMOUNT];

  return (
    <VizCard title="Minimise over every choice · Coin Change">
      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Coins</div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: 'var(--space-16)' }}>
        {COINS.map((c, idx) => <Box key={idx} label={String(c)} state={idx === step.coinIdx ? 'window' : 'idle'} />)}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
        dp[a] = fewest coins to make amount a
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-16)' }}>
        {step.dp.map((v, idx) => {
          const state = idx === step.amount ? (step.improved ? 'best' : 'window') : idx === step.amount - step.coin && step.candidate !== null ? 'good' : 'idle';
          return <Box key={idx} label={v >= INF ? '∞' : String(v)} state={state} index={idx} />;
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
        <StatTile label="Amount, coin" value={`a=${step.amount}, coin=${step.coin}`} />
        <StatTile
          label="Candidate"
          value={step.candidate !== null ? `dp[${step.amount - step.coin}] + 1 = ${step.candidate}` : `coin > a, skip`}
        />
        <StatTile label={`dp[${step.amount}] now`} value={step.dp[step.amount] >= INF ? '∞' : String(step.dp[step.amount])} accent={step.improved} />
        <StatTile label={`Fewest coins for ${AMOUNT}`} value={isDone ? (finalAnswer === -1 ? 'impossible' : String(finalAnswer)) : '—'} accent={isDone && finalAnswer !== -1} warn={isDone && finalAnswer === -1} />
      </StatGrid>
    </VizCard>
  );
};

export const VizDynamicProgramming: React.FC = () => (
  <div>
    <VizDPClimbingStairs />
    <VizDPCoinChange />
  </div>
);
