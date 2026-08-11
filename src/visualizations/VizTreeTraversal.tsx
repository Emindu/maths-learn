import React, { useMemo, useState } from 'react';
import { Controls, StatGrid, StatTile, VizCard, useStepPlayer } from './vizInterviewShared';

// Complete binary tree stored in heap-style array layout: children of index i
// are 2i+1 and 2i+2. Values chosen so inorder comes out sorted (BST-shaped).
const TREE_VALUES = [4, 2, 6, 1, 3, 5, 7];
const N = TREE_VALUES.length;

function pos(i: number): { x: number; y: number } {
  const level = Math.floor(Math.log2(i + 1));
  const levelStart = 2 ** level - 1;
  const posInLevel = i - levelStart;
  const levelCount = 2 ** level;
  const width = 380;
  const x = ((posInLevel + 0.5) / levelCount) * width + 10;
  const y = level * 72 + 28;
  return { x, y };
}

function preorder(i: number, out: number[]) {
  if (i >= N) return;
  out.push(i);
  preorder(2 * i + 1, out);
  preorder(2 * i + 2, out);
}
function inorder(i: number, out: number[]) {
  if (i >= N) return;
  inorder(2 * i + 1, out);
  out.push(i);
  inorder(2 * i + 2, out);
}
function postorder(i: number, out: number[]) {
  if (i >= N) return;
  postorder(2 * i + 1, out);
  postorder(2 * i + 2, out);
  out.push(i);
}
function levelOrder(): number[] {
  const out: number[] = [];
  const queue: number[] = [0];
  while (queue.length > 0) {
    const i = queue.shift()!;
    out.push(i);
    if (2 * i + 1 < N) queue.push(2 * i + 1);
    if (2 * i + 2 < N) queue.push(2 * i + 2);
  }
  return out;
}

type Mode = 'preorder' | 'inorder' | 'postorder' | 'bfs';

const MODES: { id: Mode; label: string; compute: () => number[] }[] = [
  { id: 'preorder', label: 'Preorder', compute: () => { const o: number[] = []; preorder(0, o); return o; } },
  { id: 'inorder', label: 'Inorder', compute: () => { const o: number[] = []; inorder(0, o); return o; } },
  { id: 'postorder', label: 'Postorder', compute: () => { const o: number[] = []; postorder(0, o); return o; } },
  { id: 'bfs', label: 'Level-order (BFS)', compute: levelOrder },
];

const TreeSvg: React.FC<{ visitedUpTo: number; order: number[] }> = ({ visitedUpTo, order }) => {
  const current = order[visitedUpTo];
  const visitedSet = new Set(order.slice(0, visitedUpTo));

  return (
    <svg width="400" height="280" style={{ maxWidth: '100%' }}>
      {Array.from({ length: N }, (_, i) => i).map((i) => {
        const children = [2 * i + 1, 2 * i + 2].filter((c) => c < N);
        return children.map((c) => {
          const p1 = pos(i);
          const p2 = pos(c);
          return <line key={`${i}-${c}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--color-border)" strokeWidth={1.5} />;
        });
      })}
      {Array.from({ length: N }, (_, i) => i).map((i) => {
        const { x, y } = pos(i);
        const isCurrent = i === current;
        const isVisited = visitedSet.has(i);
        const fill = isCurrent ? 'var(--color-primary)' : isVisited ? '#22c55e' : 'var(--color-surface)';
        const textColor = isCurrent || isVisited ? '#ffffff' : 'var(--color-text)';
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={18} fill={fill} stroke={isCurrent || isVisited ? 'transparent' : 'var(--color-border)'} strokeWidth={1} style={{ transition: 'fill 0.15s' }} />
            <text x={x} y={y + 5} textAnchor="middle" fontSize={13} fontWeight={600} fill={textColor} fontFamily="var(--font-mono, monospace)">
              {TREE_VALUES[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export const VizTreeTraversal: React.FC = () => {
  const [mode, setMode] = useState<Mode>('preorder');
  const order = useMemo(() => MODES.find((m) => m.id === mode)!.compute(), [mode]);
  const player = useStepPlayer(order.length);
  const currentNode = order[player.stepIdx];
  const visitedValues = order.slice(0, player.stepIdx + 1).map((i) => TREE_VALUES[i]);
  const isDone = player.stepIdx === order.length - 1;

  return (
    <VizCard title="Same recursion, different visit order · Binary Tree Traversal">
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-16)' }}>
        {MODES.map((m) => (
          <button
            key={m.id}
            className={mode === m.id ? 'btn btn--primary btn--sm' : 'btn btn--outline btn--sm'}
            onClick={() => { setMode(m.id); player.reset(); }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: 'var(--space-12) 0' }}>
        <TreeSvg visitedUpTo={player.stepIdx} order={order} />
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
        <StatTile label="Mode" value={MODES.find((m) => m.id === mode)!.label} />
        <StatTile label="Visiting now" value={String(TREE_VALUES[currentNode])} />
        <StatTile label="Visited so far" value={`[${visitedValues.join(', ')}]`} />
        <StatTile label="Full order" value={isDone ? `[${visitedValues.join(', ')}]` : '—'} accent={isDone} />
      </StatGrid>
    </VizCard>
  );
};
