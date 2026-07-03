import React, { useState } from 'react';

const DOT_COLORS = {
  ab: '#06b6d4',
  aOnly: '#3b82f6',
  bOnly: '#8b5cf6',
  neither: 'transparent',
};

export const VizInclusionExclusion: React.FC = () => {
  const [pA, setPa] = useState(0.40);
  const [pB, setPb] = useState(0.30);
  const [rawAB, setRawAB] = useState(0.12);

  const nA  = Math.round(pA * 100);
  const nB  = Math.round(pB * 100);
  const minAB = Math.max(0, nA + nB - 100);
  const maxAB = Math.min(nA, nB);
  const nAB = Math.min(maxAB, Math.max(minAB, Math.round(rawAB * 100)));

  const nAonly = nA - nAB;
  const nBonly = nB - nAB;
  const nAorB  = nAonly + nBonly + nAB;
  const pAorB  = nAorB / 100;

  // Dot 0..nAB-1 → A∩B, nAB..nA-1 → A only, nA..nA+nBonly-1 → B only, rest → neither
  const dotColor = (i: number): string => {
    if (i < nAB)            return DOT_COLORS.ab;
    if (i < nA)             return DOT_COLORS.aOnly;
    if (i < nA + nBonly)    return DOT_COLORS.bOnly;
    return DOT_COLORS.neither;
  };

  const COLS = 10, ROWS = 10;
  const DOT_R = 9, STEP_X = 44, STEP_Y = 22;
  const W = COLS * STEP_X, H = ROWS * STEP_Y;

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', margin: '24px 0' }}>
      <h4 style={{ margin: '0 0 4px', color: 'var(--text-primary)', fontSize: '1rem' }}>Inclusion-Exclusion Explorer</h4>
      <p style={{ margin: '0 0 14px', color: 'var(--text-secondary)', fontSize: '0.87rem' }}>
        Each dot is 1% of the sample space. See why P(A)+P(B) double-counts the overlap, requiring subtraction.
      </p>

      {/* Dot grid */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: `${W}px`, display: 'block', margin: '0 auto 14px' }}>
        {Array.from({ length: 100 }, (_, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const c = dotColor(i);
          const isNone = c === DOT_COLORS.neither;
          return (
            <circle
              key={i}
              cx={col * STEP_X + STEP_X / 2}
              cy={row * STEP_Y + STEP_Y / 2}
              r={DOT_R}
              fill={isNone ? 'var(--bg-primary)' : c}
              stroke={isNone ? 'var(--border-color)' : c}
              strokeWidth="1"
              fillOpacity={isNone ? 1 : 0.82}
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {[
          { c: DOT_COLORS.aOnly, label: `A only — ${nAonly}%` },
          { c: DOT_COLORS.ab,    label: `A ∩ B — ${nAB}%` },
          { c: DOT_COLORS.bOnly, label: `B only — ${nBonly}%` },
        ].map(({ c, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
            {label}
          </div>
        ))}
      </div>

      {/* Sliders */}
      {[
        { label: 'P(A)', value: pA, set: (v: number) => { setPa(v); }, color: '#3b82f6' },
        { label: 'P(B)', value: pB, set: (v: number) => setPb(v), color: '#8b5cf6' },
        { label: 'P(A ∩ B)', value: nAB / 100, set: (v: number) => setRawAB(v), color: '#06b6d4', min: minAB / 100, max: maxAB / 100 },
      ].map(({ label, value, set, color, min = 0, max = 1 }) => (
        <div key={label} style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{label}</span>
            <span style={{ color, fontWeight: 700, fontFamily: 'monospace' }}>{(value * 100).toFixed(0)}%</span>
          </div>
          <input type="range" min={min} max={max} step={0.01} value={value}
            onChange={e => set(+e.target.value)} style={{ width: '100%', accentColor: color }} />
        </div>
      ))}

      {/* Formula */}
      <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px 14px', fontFamily: 'monospace', fontSize: '0.87rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <div>P(A ∪ B) = P(A) + P(B) − P(A ∩ B)</div>
        <div>
          <span style={{ color: '#3b82f6' }}>{nA}%</span>
          {' + '}
          <span style={{ color: '#8b5cf6' }}>{nB}%</span>
          {' − '}
          <span style={{ color: '#06b6d4' }}>{nAB}%</span>
          {' = '}
          <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{pAorB <= 1 ? `${(pAorB * 100).toFixed(0)}%` : '> 100% ⚠'}</strong>
        </div>
        {nAorB > 100 && (
          <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '2px' }}>
            Adjust sliders — P(A∪B) cannot exceed 1.
          </div>
        )}
      </div>
    </div>
  );
};
