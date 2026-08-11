import React, { useMemo, useState } from 'react';
import { Controls, StatGrid, StatTile, VizCard, useStepPlayer } from './vizInterviewShared';

const NodeBox: React.FC<{ val: number; role: 'prev' | 'curr' | 'none' }> = ({ val, role }) => {
  const bg = role === 'prev' ? '#22c55e' : role === 'curr' ? '#f59e0b' : 'var(--color-surface)';
  const color = role === 'none' ? 'var(--color-text)' : '#ffffff';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <div style={{ height: '14px', fontSize: '0.62rem', fontWeight: 700, color: role === 'prev' ? '#22c55e' : role === 'curr' ? '#f59e0b' : 'transparent' }}>
        {role === 'prev' ? 'prev' : role === 'curr' ? 'curr' : '·'}
      </div>
      <div
        style={{
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: `1px solid ${role === 'none' ? 'var(--color-border)' : 'transparent'}`,
          background: bg,
          color,
          fontWeight: 600,
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.9rem',
          flexShrink: 0,
        }}
      >
        {val}
      </div>
    </div>
  );
};

// ── Demo 1: Full in-place reversal ──────────────────────────────────────────

const REVERSE_VALUES = [1, 2, 3, 4, 5];

interface ReverseStep {
  k: number; // number of nodes already reversed (prev chain length)
}

export const VizLinkedListReversalFull: React.FC = () => {
  const n = REVERSE_VALUES.length;
  const steps: ReverseStep[] = useMemo(() => Array.from({ length: n + 1 }, (_, k) => ({ k })), [n]);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];

  return (
    <VizCard title="prev / curr rewiring · Reverse Linked List">
      {step ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', margin: 'var(--space-16) 0' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginRight: '4px' }}>null</span>
            {REVERSE_VALUES.map((v, idx) => {
              const role = idx === step.k - 1 ? 'prev' : idx === step.k ? 'curr' : 'none';
              return (
                <React.Fragment key={idx}>
                  <NodeBox val={v} role={role} />
                  {idx < n - 1 && (
                    <span style={{ color: idx < step.k ? '#22c55e' : 'var(--color-text-secondary)', fontWeight: idx < step.k ? 700 : 400 }}>
                      {idx < step.k ? '←' : '→'}
                    </span>
                  )}
                </React.Fragment>
              );
            })}
            <span style={{ fontSize: '0.75rem', color: step.k === n ? 'var(--color-text-secondary)' : '#22c55e', marginLeft: '4px', fontWeight: step.k === n ? 400 : 700 }}>
              {step.k === n ? '' : '→ null'}
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
            <StatTile label="prev" value={step.k === 0 ? 'null' : String(REVERSE_VALUES[step.k - 1])} />
            <StatTile label="curr" value={step.k === n ? 'null' : String(REVERSE_VALUES[step.k])} />
            <StatTile label="Links reversed" value={`${Math.min(step.k, n - 1)} / ${n - 1}`} />
            <StatTile label="Result" value={step.k === n ? `new head = ${REVERSE_VALUES[n - 1]} ✓` : '—'} accent={step.k === n} />
          </StatGrid>
        </>
      ) : null}
    </VizCard>
  );
};

// ── Demo 2: Reverse Nodes in k-Group ────────────────────────────────────────

const KGROUP_VALUES = [1, 2, 3, 4, 5, 6, 7, 8];

function chunk<T>(arr: T[], k: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += k) out.push(arr.slice(i, i + k));
  return out;
}

function stateAtPhase(values: number[], k: number, groupsProcessed: number): number[] {
  return chunk(values, k)
    .map((group, idx) => (idx < groupsProcessed && group.length === k ? [...group].reverse() : group))
    .flat();
}

export const VizLinkedListReversalKGroup: React.FC = () => {
  const [k, setK] = useState(3);
  const groups = useMemo(() => chunk(KGROUP_VALUES, k), [k]);
  const fullGroupCount = groups.filter((g) => g.length === k).length;
  const player = useStepPlayer(fullGroupCount + 1);
  const groupsProcessed = player.stepIdx;
  const current = useMemo(() => stateAtPhase(KGROUP_VALUES, k, groupsProcessed), [k, groupsProcessed]);

  return (
    <VizCard title="Reverse each fixed-size chunk · Reverse Nodes in k-Group">
      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-12)' }}>
        k = {k}
        <input
          type="range"
          min={2}
          max={4}
          step={1}
          value={k}
          onChange={(e) => { setK(parseInt(e.target.value, 10)); player.reset(); }}
          style={{ display: 'block', width: '160px', marginTop: '4px' }}
        />
      </label>

      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Original (grouped by k)</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', marginBottom: 'var(--space-16)' }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 6px', borderRadius: '8px', border: `1px dashed ${g.length === k ? 'var(--color-border)' : '#ef4444'}` }}>
            {g.map((v, i) => <NodeBox key={i} val={v} role="none" />)}
          </div>
        ))}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Current state</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', margin: '0 0 var(--space-16)' }}>
        {chunk(current, k).map((g, gi) => (
          <div
            key={gi}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 6px', borderRadius: '8px',
              border: `1px solid ${gi < groupsProcessed && g.length === k ? '#22c55e' : 'var(--color-border)'}`,
              background: gi === groupsProcessed - 1 && g.length === k ? 'color-mix(in srgb, #22c55e 12%, transparent)' : 'transparent',
            }}
          >
            {g.map((v, i) => <NodeBox key={i} val={v} role="none" />)}
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
        stepLabel={`step ${player.stepIdx + 1} / ${fullGroupCount + 1}`}
      />

      <StatGrid>
        <StatTile label="Full groups of k" value={String(fullGroupCount)} />
        <StatTile label="Groups reversed so far" value={String(groupsProcessed)} accent={groupsProcessed > 0} />
        <StatTile label="Leftover (< k nodes)" value={groups.some((g) => g.length < k) ? `[${groups[groups.length - 1].join(', ')}] left as-is` : 'none'} />
        <StatTile label="Result" value={`[${current.join(', ')}]`} accent={groupsProcessed === fullGroupCount} />
      </StatGrid>
    </VizCard>
  );
};

export const VizLinkedListReversal: React.FC = () => (
  <div>
    <VizLinkedListReversalFull />
    <VizLinkedListReversalKGroup />
  </div>
);
