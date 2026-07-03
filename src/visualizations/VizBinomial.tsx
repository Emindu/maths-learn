import React, { useState, useMemo } from 'react';

const choose = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let r = 1;
  const kk = Math.min(k, n - k);
  for (let i = 0; i < kk; i++) r = r * (n - i) / (i + 1);
  return r;
};

const binomP = (n: number, k: number, t: number): number =>
  choose(n, k) * Math.pow(t, k) * Math.pow(1 - t, n - k);

const fmt2 = (x: number) => x.toFixed(4);

export const VizBinomial: React.FC = () => {
  const [n, setN] = useState(10);
  const [theta, setTheta] = useState(0.5);
  const [selected, setSelected] = useState<number | null>(null);

  const probs = useMemo(() => Array.from({ length: n + 1 }, (_, k) => binomP(n, k, theta)), [n, theta]);
  const maxP = Math.max(...probs);

  // SVG chart dimensions
  const CW = 460, CH = 180;
  const PAD_L = 42, PAD_B = 30, PAD_T = 10;
  const chartW = CW - PAD_L - 4;
  const chartH = CH - PAD_B - PAD_T;
  const barW = Math.max(2, chartW / (n + 1) - 2);
  const barStep = chartW / (n + 1);

  const yScale = (p: number) => chartH - (p / maxP) * chartH + PAD_T;

  // Y-axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map(f => ({ p: maxP * f, y: yScale(maxP * f) }));

  const mean = (n * theta).toFixed(2);
  const variance = (n * theta * (1 - theta)).toFixed(2);
  const selP = selected !== null ? probs[selected] : null;

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', margin: '24px 0' }}>
      <h4 style={{ margin: '0 0 4px', color: 'var(--text-primary)', fontSize: '1rem' }}>Binomial Distribution</h4>
      <p style={{ margin: '0 0 14px', color: 'var(--text-secondary)', fontSize: '0.87rem' }}>
        P(X = k) = C(n, k) · θᵏ · (1−θ)ⁿ⁻ᵏ. Click a bar to inspect that probability.
      </p>

      {/* Chart */}
      <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: '100%', display: 'block', margin: '0 auto 16px' }}>
        {/* Y-axis ticks */}
        {yTicks.map(({ p, y }) => (
          <g key={p}>
            <line x1={PAD_L - 4} y1={y} x2={PAD_L} y2={y} stroke="#888" strokeWidth="1" />
            <text x={PAD_L - 6} y={y + 4} textAnchor="end" style={{ fontSize: 9 }} fill="#888">
              {p.toFixed(3)}
            </text>
          </g>
        ))}

        {/* Axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={CH - PAD_B} stroke="var(--border-color)" strokeWidth="1.5" />
        <line x1={PAD_L} y1={CH - PAD_B} x2={CW - 2} y2={CH - PAD_B} stroke="var(--border-color)" strokeWidth="1.5" />

        {/* Bars */}
        {probs.map((p, k) => {
          const bx = PAD_L + k * barStep + (barStep - barW) / 2;
          const by = yScale(p);
          const bh = CH - PAD_B - by;
          const isSelected = selected === k;
          return (
            <g key={k} style={{ cursor: 'pointer' }} onClick={() => setSelected(selected === k ? null : k)}>
              <rect
                x={bx} y={by} width={barW} height={Math.max(1, bh)}
                fill={isSelected ? '#f59e0b' : '#3b82f6'}
                fillOpacity={isSelected ? 0.9 : 0.65}
              />
              {/* X label */}
              {(n <= 20 || k % 5 === 0) && (
                <text x={bx + barW / 2} y={CH - PAD_B + 14} textAnchor="middle" style={{ fontSize: 9 }} fill="#888">{k}</text>
              )}
            </g>
          );
        })}

        {/* Mean line */}
        <line
          x1={PAD_L + Number(mean) * barStep + barStep / 2}
          y1={PAD_T}
          x2={PAD_L + Number(mean) * barStep + barStep / 2}
          y2={CH - PAD_B}
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeDasharray="4,3"
        />

        {/* Axis labels */}
        <text x={CW / 2} y={CH - 2} textAnchor="middle" style={{ fontSize: 10 }} fill="#888">k (# successes)</text>
        <text x={10} y={CH / 2} textAnchor="middle" transform={`rotate(-90, 10, ${CH / 2})`} style={{ fontSize: 10 }} fill="#888">P(X=k)</text>
      </svg>

      {/* Sliders */}
      {[
        { label: `n = ${n} (trials)`, value: n, set: (v: number) => { setN(v); setSelected(null); }, color: '#3b82f6', min: 1, max: 40, step: 1 },
        { label: `θ = ${theta.toFixed(2)} (probability of success)`, value: theta, set: setTheta, color: '#8b5cf6', min: 0, max: 1, step: 0.01 },
      ].map(({ label, value, set, color, min, max, step }) => (
        <div key={label} style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>{label}</div>
          <input type="range" min={min} max={max} step={step} value={value}
            onChange={e => set(+e.target.value)} style={{ width: '100%', accentColor: color }} />
        </div>
      ))}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '4px' }}>
        {[
          { label: 'Mean', value: `${mean}`, note: 'nθ' },
          { label: 'Variance', value: `${variance}`, note: 'nθ(1−θ)' },
          { label: selected !== null ? `P(X=${selected})` : 'Click a bar', value: selP !== null ? fmt2(selP) : '—', note: selected !== null ? `C(${n},${selected}) · θ^${selected}` : 'to inspect' },
        ].map(({ label, value, note }) => (
          <div key={label} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{value}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{note}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
