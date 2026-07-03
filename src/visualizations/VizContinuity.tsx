import React, { useState } from 'react';

// P(An) = sum_{s=5}^{n} 2^{-s} = 2^{-4} - 2^{-n}  (for n >= 5)
const pAn = (n: number): number => Math.pow(2, -4) - Math.pow(2, -n);
const LIMIT = Math.pow(2, -4); // 1/16 = 0.0625

export const VizContinuity: React.FC = () => {
  const [maxN, setMaxN] = useState(10);
  const [hoveredN, setHoveredN] = useState<number | null>(null);

  const ns = Array.from({ length: maxN - 4 }, (_, i) => i + 5);
  const probs = ns.map(n => pAn(n));

  // Chart dimensions
  const PAD_L = 52, PAD_B = 30, PAD_T = 16, PAD_R = 12;
  const CW = 480, CH = 200;
  const chartW = CW - PAD_L - PAD_R;
  const chartH = CH - PAD_B - PAD_T;
  const Y_MAX = 0.068;

  const xOf = (i: number) => PAD_L + (i + 0.5) * chartW / ns.length;
  const yOf = (p: number) => PAD_T + chartH - (p / Y_MAX) * chartH;
  const barW = Math.max(3, chartW / ns.length - 3);
  const limitY = yOf(LIMIT);

  const yTicks = [0, 0.02, 0.04, 0.0625];

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', margin: '24px 0' }}>
      <h4 style={{ margin: '0 0 4px', color: 'var(--text-primary)', fontSize: '1rem' }}>
        Sequence Convergence Viewer
      </h4>
      <p style={{ margin: '0 0 14px', color: 'var(--text-secondary)', fontSize: '0.87rem' }}>
        For S = &#123;1, 2, 3, …&#125; with P(&#123;s&#125;) = 2⁻ˢ, let Aₙ = &#123;5, 6, …, n&#125;.
        As n → ∞, P(Aₙ) → P(A) = 2⁻⁴ = 1/16.
      </p>

      <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: '100%', display: 'block', margin: '0 auto 16px' }}>
        {/* Y-axis ticks */}
        {yTicks.map(p => {
          const y = yOf(p);
          const isLimit = p === LIMIT;
          return (
            <g key={p}>
              <line x1={PAD_L - 4} y1={y} x2={PAD_L} y2={y} stroke={isLimit ? '#ef4444' : '#888'} strokeWidth="1" />
              <text x={PAD_L - 6} y={y + 4} textAnchor="end" style={{ fontSize: 9, fontFamily: 'monospace' }}
                fill={isLimit ? '#ef4444' : '#888'}>
                {isLimit ? '1/16' : p.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={CH - PAD_B} stroke="var(--border-color)" strokeWidth="1.5" />
        <line x1={PAD_L} y1={CH - PAD_B} x2={CW - PAD_R} y2={CH - PAD_B} stroke="var(--border-color)" strokeWidth="1.5" />

        {/* Limit line */}
        <line x1={PAD_L} y1={limitY} x2={CW - PAD_R} y2={limitY}
          stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5,4" />
        <text x={CW - PAD_R} y={limitY - 4} textAnchor="end" style={{ fontSize: 9 }} fill="#ef4444">
          P(A) = 1/16 = 0.0625
        </text>

        {/* Bars */}
        {ns.map((n, i) => {
          const p = probs[i];
          const bx = xOf(i) - barW / 2;
          const by = yOf(p);
          const bh = CH - PAD_B - by;
          const isHov = hoveredN === n;
          return (
            <g key={n} style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredN(n)}
              onMouseLeave={() => setHoveredN(null)}>
              <rect x={bx} y={by} width={barW} height={Math.max(1, bh)}
                fill="#3b82f6" fillOpacity={isHov ? 0.9 : 0.55} />
              {/* X label */}
              <text x={xOf(i)} y={CH - PAD_B + 14} textAnchor="middle" style={{ fontSize: 9 }} fill="#888">{n}</text>
              {/* Tooltip on hover */}
              {isHov && (
                <g>
                  <rect x={bx - 2} y={by - 30} width={barW + 4} height={24} rx="3" fill="var(--bg-primary)" stroke="var(--border-color)" />
                  <text x={xOf(i)} y={by - 13} textAnchor="middle" style={{ fontSize: 9, fontFamily: 'monospace' }} fill="#3b82f6">
                    {p.toFixed(5)}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Axis labels */}
        <text x={CW / 2} y={CH - 2} textAnchor="middle" style={{ fontSize: 10 }} fill="#888">n</text>
        <text x={10} y={CH / 2} textAnchor="middle" transform={`rotate(-90, 10, ${CH / 2})`} style={{ fontSize: 10 }} fill="#888">P(Aₙ)</text>
      </svg>

      {/* Slider */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>
          Show sequence up to n = {maxN}
        </div>
        <input type="range" min={5} max={25} step={1} value={maxN}
          onChange={e => setMaxN(+e.target.value)} style={{ width: '100%', accentColor: '#3b82f6' }} />
      </div>

      {/* Stats table */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {[5, 8, 12, maxN].map(n => {
          const p = pAn(Math.min(n, maxN));
          const gap = LIMIT - pAn(n);
          return (
            <div key={n} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>n = {n}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#3b82f6', fontFamily: 'monospace' }}>{p.toFixed(4)}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>gap: {gap.toFixed(4)}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)', fontFamily: 'monospace', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px' }}>
        P(Aₙ) = 2⁻⁵ + 2⁻⁶ + … + 2⁻ⁿ = 2⁻⁴ − 2⁻ⁿ → 2⁻⁴ = 0.0625 as n → ∞
      </div>
    </div>
  );
};
