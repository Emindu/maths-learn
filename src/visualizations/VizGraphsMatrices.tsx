import React, { useMemo, useState } from 'react';
import { Controls, StatGrid, StatTile, VizCard, useStepPlayer } from './vizInterviewShared';

const DIRS: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

const cellBase: React.CSSProperties = {
  width: '38px',
  height: '38px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '6px',
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: '0.8rem',
  fontWeight: 600,
  transition: 'background 0.15s',
};

// ── Demo 1: BFS vs DFS on a maze grid ───────────────────────────────────────

const MAZE = [
  [0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0],
  [0, 1, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0],
];
const MAZE_ROWS = MAZE.length;
const MAZE_COLS = MAZE[0].length;
const MAZE_START: [number, number] = [0, 0];

function bfsOrderGrid(): [number, number][] {
  const visited = Array.from({ length: MAZE_ROWS }, () => Array(MAZE_COLS).fill(false));
  const order: [number, number][] = [];
  const queue: [number, number][] = [MAZE_START];
  visited[MAZE_START[0]][MAZE_START[1]] = true;
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    order.push([r, c]);
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < MAZE_ROWS && nc >= 0 && nc < MAZE_COLS && MAZE[nr][nc] === 0 && !visited[nr][nc]) {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }
  return order;
}

function dfsOrderGrid(): [number, number][] {
  const visited = Array.from({ length: MAZE_ROWS }, () => Array(MAZE_COLS).fill(false));
  const order: [number, number][] = [];
  const walk = (r: number, c: number) => {
    if (r < 0 || r >= MAZE_ROWS || c < 0 || c >= MAZE_COLS || MAZE[r][c] === 1 || visited[r][c]) return;
    visited[r][c] = true;
    order.push([r, c]);
    for (const [dr, dc] of DIRS) walk(r + dr, c + dc);
  };
  walk(MAZE_START[0], MAZE_START[1]);
  return order;
}

export const VizGraphSearchMode: React.FC = () => {
  const [mode, setMode] = useState<'bfs' | 'dfs'>('bfs');
  const order = useMemo(() => (mode === 'bfs' ? bfsOrderGrid() : dfsOrderGrid()), [mode]);
  const player = useStepPlayer(order.length);
  const visitedSet = new Set(order.slice(0, player.stepIdx + 1).map(([r, c]) => `${r},${c}`));
  const [curR, curC] = order[player.stepIdx];
  const isDone = player.stepIdx === order.length - 1;

  return (
    <VizCard title="Queue vs. stack — BFS explores in rings, DFS dives deep · Grid search">
      <div style={{ display: 'flex', gap: '6px', marginBottom: 'var(--space-16)' }}>
        <button className={mode === 'bfs' ? 'btn btn--primary btn--sm' : 'btn btn--outline btn--sm'} onClick={() => { setMode('bfs'); player.reset(); }}>BFS (queue)</button>
        <button className={mode === 'dfs' ? 'btn btn--primary btn--sm' : 'btn btn--outline btn--sm'} onClick={() => { setMode('dfs'); player.reset(); }}>DFS (recursion)</button>
      </div>

      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--space-16)' }}>
        {MAZE.map((row, r) => (
          <div key={r} style={{ display: 'flex', gap: '4px' }}>
            {row.map((cell, c) => {
              const key = `${r},${c}`;
              const isWall = cell === 1;
              const isCurrent = r === curR && c === curC;
              const isVisited = visitedSet.has(key);
              const bg = isWall ? 'var(--color-text-secondary)' : isCurrent ? 'var(--color-primary)' : isVisited ? '#22c55e' : 'var(--color-surface)';
              const color = isWall || isCurrent || isVisited ? '#fff' : 'var(--color-text)';
              return (
                <div key={key} style={{ ...cellBase, background: bg, color, border: isWall || isCurrent || isVisited ? 'none' : '1px solid var(--color-border)' }}>
                  {isWall ? '■' : ''}
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
        stepLabel={`step ${player.stepIdx + 1} / ${order.length}`}
      />

      <StatGrid>
        <StatTile label="Mode" value={mode === 'bfs' ? 'BFS (queue)' : 'DFS (recursion)'} />
        <StatTile label="Visiting now" value={`(${curR}, ${curC})`} />
        <StatTile label="Cells visited" value={`${player.stepIdx + 1} / ${order.length}`} />
        <StatTile label="Reachable open cells" value={String(order.length)} accent={isDone} />
      </StatGrid>
    </VizCard>
  );
};

// ── Demo 2: Rotting Oranges (multi-source BFS) ──────────────────────────────

const ROT_PRESETS: { label: string; grid: number[][] }[] = [
  { label: 'Rots completely', grid: [[2, 1, 1], [1, 1, 0], [0, 1, 1]] },
  { label: 'Impossible (isolated orange)', grid: [[2, 1, 1], [0, 1, 1], [1, 0, 1]] },
];

interface RotStep {
  minute: number;
  grid: number[][];
  newlyRotted: [number, number][];
  freshRemaining: number;
  result: number | null;
}

function simulateRotting(initial: number[][]): RotStep[] {
  const rows = initial.length, cols = initial[0].length;
  const grid = initial.map((row) => [...row]);
  let fresh = 0;
  let queue: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  }

  const steps: RotStep[] = [{ minute: 0, grid: grid.map((r) => [...r]), newlyRotted: [...queue], freshRemaining: fresh, result: null }];
  let minute = 0;
  while (queue.length > 0 && fresh > 0) {
    const size = queue.length;
    const newlyRotted: [number, number][] = [];
    const nextQueue: [number, number][] = [];
    for (let i = 0; i < size; i++) {
      const [r, c] = queue[i];
      for (const [dr, dc] of DIRS) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          fresh--;
          nextQueue.push([nr, nc]);
          newlyRotted.push([nr, nc]);
        }
      }
    }
    queue = nextQueue;
    minute++;
    steps.push({ minute, grid: grid.map((r) => [...r]), newlyRotted, freshRemaining: fresh, result: null });
  }

  const result = fresh === 0 ? minute : -1;
  steps[steps.length - 1] = { ...steps[steps.length - 1], result };
  return steps;
}

export const VizRottingOranges: React.FC = () => {
  const [presetIdx, setPresetIdx] = useState(0);
  const steps = useMemo(() => simulateRotting(ROT_PRESETS[presetIdx].grid), [presetIdx]);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];
  const isLast = player.stepIdx === steps.length - 1;
  const newlySet = new Set(step.newlyRotted.map(([r, c]) => `${r},${c}`));

  return (
    <VizCard title="Multi-source BFS, one minute per level · Rotting Oranges">
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-16)' }}>
        {ROT_PRESETS.map((p, idx) => (
          <button key={p.label} className={idx === presetIdx ? 'btn btn--primary btn--sm' : 'btn btn--outline btn--sm'} onClick={() => { setPresetIdx(idx); player.reset(); }}>
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--space-16)' }}>
        {step.grid.map((row, r) => (
          <div key={r} style={{ display: 'flex', gap: '4px' }}>
            {row.map((cell, c) => {
              const key = `${r},${c}`;
              const isNew = newlySet.has(key);
              const bg = cell === 2 ? (isNew ? '#7c2d12' : '#b45309') : cell === 1 ? '#f59e0b' : 'var(--color-surface)';
              const color = cell === 0 ? 'var(--color-text-secondary)' : '#fff';
              return (
                <div key={key} style={{ ...cellBase, background: bg, color, border: cell === 0 ? '1px dashed var(--color-border)' : isNew ? '2px solid #22c55e' : 'none' }}>
                  {cell === 2 ? '☠' : cell === 1 ? '●' : ''}
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
        stepLabel={`minute ${step.minute} · step ${player.stepIdx + 1} / ${steps.length}`}
      />

      <StatGrid>
        <StatTile label="Minute" value={String(step.minute)} />
        <StatTile label="Newly rotted this minute" value={step.newlyRotted.length > 0 ? String(step.newlyRotted.length) : '—'} />
        <StatTile label="Fresh remaining" value={String(step.freshRemaining)} warn={step.freshRemaining > 0 && isLast} />
        <StatTile label="Result" value={isLast ? (step.result === -1 ? 'Impossible (-1)' : `${step.result} minutes`) : '—'} accent={isLast && step.result !== -1} warn={isLast && step.result === -1} />
      </StatGrid>
    </VizCard>
  );
};

export const VizGraphsMatrices: React.FC = () => (
  <div>
    <VizGraphSearchMode />
    <VizRottingOranges />
  </div>
);
