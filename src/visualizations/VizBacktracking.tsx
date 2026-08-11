import React, { useMemo } from 'react';
import { Box, Controls, StatGrid, StatTile, VizCard, useStepPlayer } from './vizInterviewShared';

// ── Demo 1: Subsets — choose / explore / un-choose ──────────────────────────

const SUBSET_NUMS = [1, 2, 3];

interface BTFrame {
  path: number[];
  subsetsSoFar: number[][];
  action: string;
  highlightIndex: number | null;
  highlightState: 'choose' | 'unchoose' | 'record' | null;
}

function simulateSubsets(nums: number[]): BTFrame[] {
  const frames: BTFrame[] = [];
  const path: number[] = [];
  const subsets: number[][] = [];

  function backtrack(start: number) {
    subsets.push([...path]);
    frames.push({
      path: [...path],
      subsetsSoFar: subsets.map((s) => [...s]),
      action: `record subset {${path.join(', ')}}`,
      highlightIndex: null,
      highlightState: 'record',
    });

    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      frames.push({ path: [...path], subsetsSoFar: subsets.map((s) => [...s]), action: `choose ${nums[i]}`, highlightIndex: i, highlightState: 'choose' });
      backtrack(i + 1);
      path.pop();
      frames.push({ path: [...path], subsetsSoFar: subsets.map((s) => [...s]), action: `un-choose ${nums[i]}`, highlightIndex: i, highlightState: 'unchoose' });
    }
  }
  backtrack(0);
  return frames;
}

export const VizBacktrackingSubsets: React.FC = () => {
  const frames = useMemo(() => simulateSubsets(SUBSET_NUMS), []);
  const player = useStepPlayer(frames.length);
  const frame = frames[player.stepIdx];
  const isDone = player.stepIdx === frames.length - 1;

  return (
    <VizCard title="Choose → explore → un-choose · Subsets">
      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Candidates</div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: 'var(--space-16)' }}>
        {SUBSET_NUMS.map((v, idx) => {
          const inPath = frame.path.includes(v);
          const isHighlighted = frame.highlightIndex === idx;
          const state = isHighlighted && frame.highlightState === 'choose' ? 'window' : isHighlighted && frame.highlightState === 'unchoose' ? 'bad' : inPath ? 'best' : 'idle';
          return <Box key={idx} label={String(v)} state={state} index={idx} />;
        })}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Current path (the recursion's call stack)</div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: 'var(--space-16)', minHeight: '46px' }}>
        {frame.path.length === 0 && <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>(empty)</span>}
        {frame.path.map((v, idx) => <Box key={idx} label={String(v)} state="window" />)}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Subsets found so far ({frame.subsetsSoFar.length} / {2 ** SUBSET_NUMS.length})</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-16)' }}>
        {frame.subsetsSoFar.map((s, idx) => (
          <span key={idx} style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono, monospace)', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '3px 8px' }}>
            {`{${s.join(', ')}}`}
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
        stepLabel={`step ${player.stepIdx + 1} / ${frames.length}`}
      />

      <StatGrid>
        <StatTile label="This step" value={frame.action} />
        <StatTile label="Path depth" value={String(frame.path.length)} />
        <StatTile label="Subsets recorded" value={String(frame.subsetsSoFar.length)} />
        <StatTile label="All 2ⁿ subsets found?" value={isDone ? 'Yes ✓' : 'In progress'} accent={isDone} />
      </StatGrid>
    </VizCard>
  );
};

// ── Demo 2: N-Queens (n = 4) ─────────────────────────────────────────────────

const N = 4;

interface QFrame {
  queenCol: number[];
  row: number;
  col: number | null;
  action: 'try' | 'place' | 'reject' | 'backtrack' | 'solution';
  solutionsSoFar: number;
}

function simulateNQueens(n: number): QFrame[] {
  const frames: QFrame[] = [];
  const queenCol: number[] = Array(n).fill(-1);
  let solutions = 0;

  function isSafe(row: number, col: number): boolean {
    for (let r = 0; r < row; r++) {
      const c = queenCol[r];
      if (c === col || Math.abs(c - col) === row - r) return false;
    }
    return true;
  }

  function backtrack(row: number) {
    if (row === n) {
      solutions++;
      frames.push({ queenCol: [...queenCol], row, col: null, action: 'solution', solutionsSoFar: solutions });
      return;
    }
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        frames.push({ queenCol: [...queenCol], row, col, action: 'try', solutionsSoFar: solutions });
        queenCol[row] = col;
        frames.push({ queenCol: [...queenCol], row, col, action: 'place', solutionsSoFar: solutions });
        backtrack(row + 1);
        queenCol[row] = -1;
        frames.push({ queenCol: [...queenCol], row, col, action: 'backtrack', solutionsSoFar: solutions });
      } else {
        frames.push({ queenCol: [...queenCol], row, col, action: 'reject', solutionsSoFar: solutions });
      }
    }
  }
  backtrack(0);
  return frames;
}

const actionLabel: Record<QFrame['action'], string> = {
  try: 'trying this square',
  place: 'safe — place queen',
  reject: 'attacked — skip (pruned)',
  backtrack: 'no solution below here — undo',
  solution: 'complete arrangement found!',
};

export const VizBacktrackingNQueens: React.FC = () => {
  const frames = useMemo(() => simulateNQueens(N), []);
  const player = useStepPlayer(frames.length);
  const frame = frames[player.stepIdx];
  const isDone = player.stepIdx === frames.length - 1;

  return (
    <VizCard title="Prune with a constraint · N-Queens (n = 4)">
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--space-16)' }}>
        {Array.from({ length: N }, (_, r) => (
          <div key={r} style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: N }, (_, c) => {
              const hasQueen = frame.queenCol[r] === c;
              const isTarget = frame.row === r && frame.col === c;
              let bg = (r + c) % 2 === 0 ? 'var(--color-surface)' : 'var(--color-background)';
              let border = '1px solid var(--color-border)';
              if (isTarget) {
                if (frame.action === 'reject') { bg = '#ef4444'; border = 'none'; }
                else if (frame.action === 'try') { bg = 'var(--color-primary)'; border = 'none'; }
                else if (frame.action === 'place') { bg = '#22c55e'; border = 'none'; }
              }
              return (
                <div key={c} style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, border, borderRadius: '4px', fontSize: '1.2rem', transition: 'background 0.15s' }}>
                  {hasQueen ? '♛' : ''}
                </div>
              );
            })}
          </div>
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
        stepLabel={`step ${player.stepIdx + 1} / ${frames.length}`}
      />

      <StatGrid>
        <StatTile label="Row, column" value={frame.col !== null ? `row ${frame.row}, col ${frame.col}` : `row ${frame.row} (complete)`} />
        <StatTile label="This step" value={actionLabel[frame.action]} warn={frame.action === 'reject'} accent={frame.action === 'place' || frame.action === 'solution'} />
        <StatTile label="Solutions found so far" value={String(frame.solutionsSoFar)} accent={frame.solutionsSoFar > 0} />
        <StatTile label="Total solutions (n=4)" value={isDone ? String(frame.solutionsSoFar) : '—'} accent={isDone} />
      </StatGrid>
    </VizCard>
  );
};

export const VizBacktracking: React.FC = () => (
  <div>
    <VizBacktrackingSubsets />
    <VizBacktrackingNQueens />
  </div>
);
