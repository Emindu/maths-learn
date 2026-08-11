import React, { useMemo, useState } from 'react';
import { Box, Controls, StatGrid, StatTile, VizCard, useStepPlayer } from './vizInterviewShared';

function toBits(n: number, width: number): number[] {
  return Array.from({ length: width }, (_, i) => (n >> (width - 1 - i)) & 1);
}

const BitRow: React.FC<{ label: string; bits: number[]; highlightIdx: number | null; dimOutside?: boolean }> = ({ label, bits, highlightIdx, dimOutside }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
    <div style={{ width: '70px', fontSize: '0.78rem', color: 'var(--color-text-secondary)', flexShrink: 0 }}>{label}</div>
    <div style={{ display: 'flex', gap: '4px' }}>
      {bits.map((b, idx) => (
        <div
          key={idx}
          style={{
            width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '5px', fontFamily: 'var(--font-mono, monospace)', fontWeight: 700, fontSize: '0.85rem',
            background: idx === highlightIdx ? 'var(--color-primary)' : b === 1 ? '#22c55e' : 'var(--color-surface)',
            color: idx === highlightIdx || b === 1 ? '#fff' : 'var(--color-text)',
            border: b === 0 && idx !== highlightIdx ? '1px solid var(--color-border)' : 'none',
            opacity: dimOutside && idx !== highlightIdx ? 0.4 : 1,
            transition: 'background 0.15s',
          }}
        >
          {b}
        </div>
      ))}
    </div>
  </div>
);

// ── Demo 1: AND / OR / XOR bit by bit ───────────────────────────────────────

const BIT_WIDTH = 8;

type Op = 'AND' | 'OR' | 'XOR';
const OPS: { id: Op; apply: (a: number, b: number) => number; symbol: string }[] = [
  { id: 'AND', apply: (a, b) => a & b, symbol: '&' },
  { id: 'OR', apply: (a, b) => a | b, symbol: '|' },
  { id: 'XOR', apply: (a, b) => a ^ b, symbol: '^' },
];

export const VizBitwiseOps: React.FC = () => {
  const [a, setA] = useState(0b10110110);
  const [b, setB] = useState(0b01100101);
  const [op, setOp] = useState<Op>('XOR');
  const opDef = OPS.find((o) => o.id === op)!;
  const result = opDef.apply(a, b);

  const player = useStepPlayer(BIT_WIDTH);
  const bitIdx = player.stepIdx;
  const bitsA = toBits(a, BIT_WIDTH);
  const bitsB = toBits(b, BIT_WIDTH);
  const bitsResult = toBits(result, BIT_WIDTH);
  const revealedResult = bitsResult.map((bit, idx) => (idx <= bitIdx ? bit : null));

  return (
    <VizCard title="Bit by bit · AND / OR / XOR">
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: 'var(--space-12)' }}>
        <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
          a = {a}
          <input type="range" min={0} max={255} value={a} onChange={(e) => { setA(parseInt(e.target.value, 10)); player.reset(); }} style={{ display: 'block', width: '150px', marginTop: '4px' }} />
        </label>
        <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
          b = {b}
          <input type="range" min={0} max={255} value={b} onChange={(e) => { setB(parseInt(e.target.value, 10)); player.reset(); }} style={{ display: 'block', width: '150px', marginTop: '4px' }} />
        </label>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
          {OPS.map((o) => (
            <button key={o.id} className={op === o.id ? 'btn btn--primary btn--sm' : 'btn btn--outline btn--sm'} onClick={() => { setOp(o.id); player.reset(); }}>{o.id}</button>
          ))}
        </div>
      </div>

      <div style={{ margin: 'var(--space-16) 0' }}>
        <BitRow label="a" bits={bitsA} highlightIdx={bitIdx} />
        <BitRow label={`b (${opDef.symbol})`} bits={bitsB} highlightIdx={bitIdx} />
        <div style={{ borderTop: '1px solid var(--color-border)', margin: '6px 0 6px 80px', width: `${BIT_WIDTH * 34 - 4}px` }} />
        <BitRow label="result" bits={revealedResult.map((v) => v ?? 0)} highlightIdx={bitIdx} dimOutside={false} />
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
        stepLabel={`bit ${bitIdx + 1} / ${BIT_WIDTH}`}
      />

      <StatGrid>
        <StatTile label="This bit" value={`${bitsA[bitIdx]} ${opDef.symbol} ${bitsB[bitIdx]} = ${bitsResult[bitIdx]}`} />
        <StatTile label="a" value={`${a} (0b${bitsA.join('')})`} />
        <StatTile label="b" value={`${b} (0b${bitsB.join('')})`} />
        <StatTile label={`a ${opDef.symbol} b`} value={`${result} (0b${bitsResult.join('')})`} accent={bitIdx === BIT_WIDTH - 1} />
      </StatGrid>
    </VizCard>
  );
};

// ── Demo 2: Missing Number via XOR ──────────────────────────────────────────

const MISSING_NUMS = [9, 6, 4, 2, 3, 5, 7, 0, 1]; // 0..9 with 8 missing

interface MissingStep {
  i: number; // -1 for the initial state
  numsVal: number | null;
  result: number;
}

function simulateMissing(nums: number[]): MissingStep[] {
  const n = nums.length;
  let result = n;
  const steps: MissingStep[] = [{ i: -1, numsVal: null, result }];
  for (let i = 0; i < n; i++) {
    result ^= i ^ nums[i];
    steps.push({ i, numsVal: nums[i], result });
  }
  return steps;
}

export const VizMissingNumber: React.FC = () => {
  const steps = useMemo(() => simulateMissing(MISSING_NUMS), []);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];
  const isDone = player.stepIdx === steps.length - 1;
  const resultBits = toBits(step.result, 4);

  return (
    <VizCard title="Every pair cancels out · Missing Number">
      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>nums (indices 0..8, values from 0..9, one missing)</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-16)' }}>
        {MISSING_NUMS.map((v, idx) => <Box key={idx} label={String(v)} state={idx === step.i ? 'window' : 'idle'} index={idx} />)}
      </div>

      <BitRow label="result" bits={resultBits} highlightIdx={null} />

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
        <StatTile label="This step" value={step.i === -1 ? 'result = n = 9' : `result ^= ${step.i} ^ ${step.numsVal}`} />
        <StatTile label="Running result" value={String(step.result)} />
        <StatTile label="Index processed" value={step.i === -1 ? '—' : `${step.i} / ${MISSING_NUMS.length - 1}`} />
        <StatTile label="Missing number" value={isDone ? String(step.result) : '—'} accent={isDone} />
      </StatGrid>
    </VizCard>
  );
};

export const VizBitManipulation: React.FC = () => (
  <div>
    <VizBitwiseOps />
    <VizMissingNumber />
  </div>
);
