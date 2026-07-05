import React, { useState } from 'react';

// ── Shared helpers ─────────────────────────────────────────────────────────────

const W = 500, H = 270;
const PAD = { top: 20, right: 20, bottom: 40, left: 48 };
const PW = W - PAD.left - PAD.right;
const PH = H - PAD.top - PAD.bottom;

function normalPDF(x: number, mu = 0, sigma = 1) {
  return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

function chiSquaredPDF(x: number, k: number) {
  if (x <= 0) return 0;
  const gamma_k2 = gammaFn(k / 2);
  return (Math.pow(x, k / 2 - 1) * Math.exp(-x / 2)) / (Math.pow(2, k / 2) * gamma_k2);
}

function tPDF(x: number, df: number) {
  const num = gammaFn((df + 1) / 2);
  const den = Math.sqrt(df * Math.PI) * gammaFn(df / 2);
  return (num / den) * Math.pow(1 + (x * x) / df, -(df + 1) / 2);
}

function gammaFn(n: number): number {
  if (n === 0.5) return Math.sqrt(Math.PI);
  if (n === 1) return 1;
  if (n < 0.5) return Math.PI / (Math.sin(Math.PI * n) * gammaFn(1 - n));
  // Lanczos
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (n < 0.5) return Math.PI / (Math.sin(Math.PI * n) * gammaFn(1 - n));
  n -= 1;
  let x = c[0];
  for (let i = 1; i < g + 2; i++) x += c[i] / (n + i);
  const t = n + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x;
}

// Simple seeded LCG pseudo-random
function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function boxMuller(rand: () => number) {
  const u = rand(), v = rand();
  return Math.sqrt(-2 * Math.log(u + 1e-10)) * Math.cos(2 * Math.PI * v);
}


function histogramBins(data: number[], min: number, max: number, bins: number) {
  const counts = new Array(bins).fill(0);
  const bw = (max - min) / bins;
  for (const x of data) {
    const i = Math.min(bins - 1, Math.floor((x - min) / bw));
    if (i >= 0) counts[i]++;
  }
  return counts.map((c, i) => ({ x: min + i * bw, count: c, density: c / (data.length * bw) }));
}

const containerStyle: React.CSSProperties = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '10px',
  padding: '16px',
  margin: '16px 0',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fill: 'var(--color-text-secondary)',
};

// ── 4.1.1 Geometric Mean PMF ──────────────────────────────────────────────────

export const VizGeometricMean: React.FC = () => {
  // Exact PMF from Example 4.1.1
  const vals = [
    { label: '1', x: 1, p: 1 / 4 },
    { label: '√2', x: Math.SQRT2, p: 1 / 4 },
    { label: '√3', x: Math.sqrt(3), p: 1 / 4 },
    { label: '2', x: 2, p: 1 / 16 },
    { label: '√6', x: Math.sqrt(6), p: 1 / 8 },
    { label: '3', x: 3, p: 1 / 16 },
  ];

  const maxP = 0.28;
  const pad = { left: 50, right: 20, top: 20, bottom: 50 };
  const pw = W - pad.left - pad.right;
  const ph = H - pad.top - pad.bottom;
  const bw = pw / vals.length - 8;

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        Sampling Distribution of Y₂ = √(X₁X₂) — Example 4.1.1
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {/* Y axis */}
        {[0, 0.1, 0.2, 0.25].map((p) => {
          const y = pad.top + ph - (p / maxP) * ph;
          return (
            <g key={p}>
              <line x1={pad.left} x2={pad.left + pw} y1={y} y2={y} stroke="var(--color-border)" strokeDasharray="3,3" />
              <text x={pad.left - 4} y={y + 4} textAnchor="end" style={labelStyle}>{p.toFixed(2)}</text>
            </g>
          );
        })}
        {vals.map((v, i) => {
          const bx = pad.left + i * (pw / vals.length) + 4;
          const bh = (v.p / maxP) * ph;
          const by = pad.top + ph - bh;
          return (
            <g key={v.label}>
              <rect x={bx} y={by} width={bw} height={bh} fill="var(--color-primary)" opacity={0.85} rx={2} />
              <text x={bx + bw / 2} y={by - 5} textAnchor="middle" style={{ ...labelStyle, fontWeight: 600, fill: 'var(--color-text)' }}>
                {(v.p * 16).toFixed(0)}/16
              </text>
              <text x={bx + bw / 2} y={pad.top + ph + 16} textAnchor="middle" style={labelStyle}>{v.label}</text>
            </g>
          );
        })}
        <line x1={pad.left} x2={pad.left + pw} y1={pad.top + ph} y2={pad.top + ph} stroke="var(--color-text-secondary)" />
        <line x1={pad.left} x2={pad.left} y1={pad.top} y2={pad.top + ph} stroke="var(--color-text-secondary)" />
        <text x={pad.left + pw / 2} y={H - 2} textAnchor="middle" style={labelStyle}>Value of Y₂</text>
        <text x={12} y={pad.top + ph / 2} textAnchor="middle" style={labelStyle} transform={`rotate(-90, 12, ${pad.top + ph / 2})`}>Probability</text>
      </svg>
    </div>
  );
};

// ── 4.1.2 Sample Mean Distribution with n slider ──────────────────────────────

export const VizSampleMeanDist: React.FC = () => {
  const [n, setN] = useState(1);
  const N_SIM = 1500;
  const BINS = 20;
  const range: [number, number] = [0, 1];

  const data = React.useMemo(() => {
    const r = lcg(n * 31 + 7);
    const means: number[] = [];
    for (let i = 0; i < N_SIM; i++) {
      let s = 0;
      for (let j = 0; j < n; j++) s += r();
      means.push(s / n);
    }
    return means;
  }, [n]);

  const bins = histogramBins(data, range[0], range[1], BINS);
  const maxD = Math.max(...bins.map((b) => b.density));
  const mu = 0.5, sigma = 1 / Math.sqrt(12 * n);

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        Distribution of X̄ₙ from Uniform[0,1] — as n increases, shape narrows and approaches Normal
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, fontSize: '0.8rem', color: 'var(--color-text)' }}>
        <label>n = {n}</label>
        <input type="range" min={1} max={30} value={n} onChange={(e) => setN(+e.target.value)} style={{ flex: 1 }} />
        <span style={{ color: 'var(--color-text-secondary)' }}>σ = {sigma.toFixed(3)}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {bins.map((b, i) => {
          const bw = PW / BINS;
          const bx = PAD.left + i * bw;
          const bh = maxD > 0 ? (b.density / maxD) * PH : 0;
          const by = PAD.top + PH - bh;
          return <rect key={i} x={bx} y={by} width={bw - 1} height={bh} fill="var(--color-primary)" opacity={0.6} />;
        })}
        {/* Normal overlay */}
        {Array.from({ length: 100 }, (_, i) => {
          const x = range[0] + (i / 99) * (range[1] - range[0]);
          return x;
        }).map((x, i, arr) => {
          if (i === 0) return null;
          const x1 = arr[i - 1], x2 = x;
          const d1 = normalPDF(x1, mu, sigma), d2 = normalPDF(x2, mu, sigma);
          const sx1 = PAD.left + ((x1 - range[0]) / (range[1] - range[0])) * PW;
          const sx2 = PAD.left + ((x2 - range[0]) / (range[1] - range[0])) * PW;
          const sy1 = PAD.top + PH - (maxD > 0 ? (d1 / maxD) * PH : 0);
          const sy2 = PAD.top + PH - (maxD > 0 ? (d2 / maxD) * PH : 0);
          return <line key={i} x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke="var(--color-success)" strokeWidth={2} />;
        })}
        <line x1={PAD.left} x2={PAD.left + PW} y1={PAD.top + PH} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        <text x={PAD.left + PW / 2} y={H - 2} textAnchor="middle" style={labelStyle}>Sample mean value</text>
        <text x={10} y={PAD.top + PH / 2} textAnchor="middle" style={labelStyle} transform={`rotate(-90,10,${PAD.top + PH / 2})`}>Density</text>
      </svg>
      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
        Green curve = N(0.5, 1/12n) approximation · Blue bars = simulated sample means (n={n_sim_label(n)})
      </div>
    </div>
  );
};
function n_sim_label(n: number) { return n; }

// ── 4.1.3 Sampling Pipeline Concept ──────────────────────────────────────────

export const VizSamplingConcept: React.FC = () => {
  const [step, setStep] = useState(0);

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        The Sampling Distribution Pipeline: from i.i.d. draws to Y = h(X₁,…,Xₙ)
      </div>
      <svg viewBox="0 0 500 200" style={{ width: '100%' }}>
        {/* Population distribution */}
        <rect x={20} y={60} width={100} height={80} rx={6} fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth={2} />
        <text x={70} y={55} textAnchor="middle" style={{ fontSize: '0.7rem', fill: 'var(--color-primary)', fontWeight: 600 }}>Population</text>
        {[0, 1, 2, 3, 4].map((i) => {
          const bh = [50, 30, 20, 15, 10][i];
          return <rect key={i} x={25 + i * 18} y={140 - bh} width={14} height={bh} fill="var(--color-primary)" opacity={0.7} />;
        })}

        {/* Arrow 1 */}
        <line x1={120} y1={100} x2={155} y2={100} stroke="var(--color-text-secondary)" strokeWidth={1.5} markerEnd="url(#arr)" strokeDasharray={step >= 1 ? 'none' : '4,3'} />
        <defs><marker id="arr" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto"><path d="M0,0 L6,3 L0,6Z" fill="var(--color-text-secondary)" /></marker></defs>
        <text x={137} y={93} textAnchor="middle" style={{ fontSize: '0.62rem', fill: 'var(--color-text-secondary)' }}>i.i.d.</text>

        {/* Sample boxes */}
        {['X₁', 'X₂', '…', 'Xₙ'].map((lbl, i) => (
          <g key={i}>
            <rect x={158 + i * 30} y={80} width={26} height={40} rx={4}
              fill={step >= 1 ? 'color-mix(in srgb, var(--color-primary) 15%, transparent)' : 'var(--color-surface)'}
              stroke="var(--color-border)" strokeWidth={1.5} />
            <text x={171 + i * 30} y={105} textAnchor="middle" style={{ fontSize: '0.7rem', fill: 'var(--color-text)' }}>{lbl}</text>
          </g>
        ))}

        {/* Arrow 2 */}
        <line x1={278} y1={100} x2={315} y2={100} stroke="var(--color-text-secondary)" strokeWidth={1.5} markerEnd="url(#arr)" strokeDasharray={step >= 2 ? 'none' : '4,3'} />
        <text x={296} y={93} textAnchor="middle" style={{ fontSize: '0.62rem', fill: 'var(--color-text-secondary)' }}>h(·)</text>

        {/* h box */}
        <rect x={318} y={76} width={48} height={48} rx={6}
          fill={step >= 2 ? 'color-mix(in srgb, var(--color-success) 15%, transparent)' : 'var(--color-surface)'}
          stroke={step >= 2 ? 'var(--color-success)' : 'var(--color-border)'} strokeWidth={1.5} />
        <text x={342} y={106} textAnchor="middle" style={{ fontSize: '0.85rem', fontWeight: 700, fill: step >= 2 ? 'var(--color-success)' : 'var(--color-text)' }}>h</text>

        {/* Arrow 3 */}
        <line x1={366} y1={100} x2={400} y2={100} stroke="var(--color-text-secondary)" strokeWidth={1.5} markerEnd="url(#arr)" strokeDasharray={step >= 3 ? 'none' : '4,3'} />

        {/* Y box */}
        <rect x={400} y={76} width={80} height={48} rx={6}
          fill={step >= 3 ? 'color-mix(in srgb, var(--color-primary) 20%, transparent)' : 'var(--color-surface)'}
          stroke={step >= 3 ? 'var(--color-primary)' : 'var(--color-border)'} strokeWidth={1.5} />
        <text x={440} y={97} textAnchor="middle" style={{ fontSize: '0.75rem', fontWeight: 700, fill: 'var(--color-text)' }}>Y = h(·)</text>
        <text x={440} y={115} textAnchor="middle" style={{ fontSize: '0.62rem', fill: 'var(--color-text-secondary)' }}>sampling dist.</text>

        <text x={250} y={175} textAnchor="middle" style={{ fontSize: '0.68rem', fill: 'var(--color-text-secondary)' }}>
          {['Click "Next" to walk through the pipeline →', 'Step 1: draw X₁,…,Xₙ i.i.d. from population', 'Step 2: apply statistic h to the sample', 'Step 3: Y has a sampling distribution'][step]}
        </text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        {['Reset', 'Next'].map((label, i) => (
          <button key={label} onClick={() => setStep(i === 0 ? 0 : Math.min(3, step + 1))}
            style={{ padding: '4px 14px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', cursor: 'pointer', fontSize: '0.78rem' }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ── 4.2.1 Convergence in Probability Scatter ──────────────────────────────────

export const VizConvProbScatter: React.FC = () => {
  const EPS = 0.35;
  const N = 80;
  const seeds = [11, 31, 57, 73, 99];
  const paths = seeds.map((s) => {
    const r = lcg(s);
    return Array.from({ length: N }, (_, n) => {
      const z = boxMuller(r);
      return Math.abs(z / (n + 1));
    });
  });

  const xScale = (n: number) => PAD.left + (n / (N - 1)) * PW;
  const yScale = (v: number) => PAD.top + PH - Math.min(v / 1.2, 1) * PH;
  const colors = ['var(--color-primary)', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        Convergence in Probability: |Xₙ − Y| for 5 independent sequences
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {/* ε line */}
        <line x1={PAD.left} x2={PAD.left + PW} y1={yScale(EPS)} y2={yScale(EPS)} stroke="#ef4444" strokeDasharray="5,3" strokeWidth={1.5} />
        <text x={PAD.left + PW + 2} y={yScale(EPS) + 4} style={{ fontSize: '0.65rem', fill: '#ef4444' }}>ε={EPS}</text>

        {paths.map((path, pi) =>
          path.map((v, n) => (
            <circle key={`${pi}-${n}`} cx={xScale(n)} cy={yScale(v)} r={2}
              fill={colors[pi]} opacity={0.7} />
          ))
        )}

        {/* Axes */}
        <line x1={PAD.left} x2={PAD.left + PW} y1={PAD.top + PH} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        {[0, 20, 40, 60, 80].map((n) => (
          <text key={n} x={xScale(n)} y={PAD.top + PH + 14} textAnchor="middle" style={labelStyle}>{n}</text>
        ))}
        <text x={PAD.left + PW / 2} y={H - 2} textAnchor="middle" style={labelStyle}>n</text>
        <text x={12} y={PAD.top + PH / 2} textAnchor="middle" style={labelStyle} transform={`rotate(-90,12,${PAD.top + PH / 2})`}>|Xₙ − Y|</text>

        <text x={PAD.left + PW / 2} y={PAD.top + 14} textAnchor="middle" style={{ fontSize: '0.68rem', fill: 'var(--color-text-secondary)' }}>
          Points fall below ε line with increasing probability as n grows
        </text>
      </svg>
    </div>
  );
};

// ── 4.2.2 Coin Fraction Converging (WLLN) ────────────────────────────────────

export const VizCoinFracConverge: React.FC = () => {
  const [nFlips, setNFlips] = useState(30);
  const EPS = 0.1;
  const seeds = [5, 17, 42];
  const paths = seeds.map((s) => {
    const r = lcg(s);
    let heads = 0;
    return Array.from({ length: nFlips }, (_, i) => {
      if (r() < 0.5) heads++;
      return heads / (i + 1);
    });
  });
  const colors = ['var(--color-primary)', '#f59e0b', '#10b981'];
  const xS = (i: number) => PAD.left + (i / (nFlips - 1)) * PW;
  const yS = (v: number) => PAD.top + PH - ((v - 0.2) / 0.6) * PH;

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        Weak LLN — Coin Fraction: Running proportion of heads converges to p = 0.5
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, fontSize: '0.8rem', color: 'var(--color-text)' }}>
        <label>n = {nFlips}</label>
        <input type="range" min={5} max={200} value={nFlips} onChange={(e) => setNFlips(+e.target.value)} style={{ flex: 1 }} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {/* ε band */}
        <rect x={PAD.left} y={yS(0.5 + EPS)} width={PW} height={yS(0.5 - EPS) - yS(0.5 + EPS)}
          fill="#ef4444" opacity={0.08} />
        <line x1={PAD.left} x2={PAD.left + PW} y1={yS(0.5 + EPS)} y2={yS(0.5 + EPS)} stroke="#ef4444" strokeDasharray="4,3" strokeWidth={1} />
        <line x1={PAD.left} x2={PAD.left + PW} y1={yS(0.5 - EPS)} y2={yS(0.5 - EPS)} stroke="#ef4444" strokeDasharray="4,3" strokeWidth={1} />
        <line x1={PAD.left} x2={PAD.left + PW} y1={yS(0.5)} y2={yS(0.5)} stroke="var(--color-text-secondary)" strokeDasharray="6,3" strokeWidth={1.5} />
        <text x={PAD.left + PW + 3} y={yS(0.5) + 4} style={{ fontSize: '0.62rem', fill: 'var(--color-text-secondary)' }}>p=0.5</text>

        {paths.map((path, pi) =>
          path.map((v, i) => {
            if (i === 0) return null;
            return <line key={`${pi}-${i}`}
              x1={xS(i - 1)} y1={yS(Math.max(0.2, Math.min(0.8, path[i - 1])))}
              x2={xS(i)} y2={yS(Math.max(0.2, Math.min(0.8, v)))}
              stroke={colors[pi]} strokeWidth={1.5} opacity={0.85} />;
          })
        )}
        <line x1={PAD.left} x2={PAD.left + PW} y1={PAD.top + PH} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        {[0.3, 0.4, 0.5, 0.6, 0.7].map((v) => (
          <text key={v} x={PAD.left - 4} y={yS(v) + 4} textAnchor="end" style={labelStyle}>{v.toFixed(1)}</text>
        ))}
        <text x={PAD.left + PW / 2} y={H - 2} textAnchor="middle" style={labelStyle}>Number of flips n</text>
        <text x={PAD.left + 4} y={PAD.top + 12} style={{ fontSize: '0.65rem', fill: '#ef4444' }}>Red band = ε = ±{EPS}</text>
      </svg>
    </div>
  );
};

// ── 4.2.3 WLLN General — Chebyshev Bound ─────────────────────────────────────

export const VizWLLNGeneral: React.FC = () => {
  const [n, setN] = useState(20);
  const EPS = 0.3;
  const mu = 1; // Exp(1) mean
  const v = 1;  // Exp(1) variance
  const bound = v / (n * EPS * EPS);
  const seeds = [3, 7, 13, 17, 23];

  const paths = seeds.map((s) => {
    const r = lcg(s);
    let sum = 0;
    return Array.from({ length: n }, (_, i) => {
      sum += -Math.log(r() + 1e-10);
      return sum / (i + 1);
    });
  });
  const colors = ['var(--color-primary)', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
  const xS = (i: number) => PAD.left + (i / (n - 1)) * PW;
  const yS = (v: number) => PAD.top + PH - Math.min(Math.max((v - 0.4) / 1.2, 0), 1) * PH;

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        WLLN — Sample Mean Mₙ of Exponential(1): Chebyshev bound P(|Mₙ−1|≥{EPS}) ≤ {bound.toFixed(3)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, fontSize: '0.8rem', color: 'var(--color-text)' }}>
        <label>n = {n}</label>
        <input type="range" min={5} max={200} value={n} onChange={(e) => setN(+e.target.value)} style={{ flex: 1 }} />
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Bound: {bound.toFixed(4)}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        <rect x={PAD.left} y={yS(mu + EPS)} width={PW} height={yS(mu - EPS) - yS(mu + EPS)}
          fill="var(--color-primary)" opacity={0.07} />
        <line x1={PAD.left} x2={PAD.left + PW} y1={yS(mu)} y2={yS(mu)} stroke="var(--color-text-secondary)" strokeDasharray="6,3" strokeWidth={1.5} />
        <text x={PAD.left + PW + 3} y={yS(mu) + 4} style={{ fontSize: '0.62rem', fill: 'var(--color-text-secondary)' }}>μ=1</text>
        {paths.map((path, pi) =>
          path.map((v, i) => {
            if (i === 0) return null;
            return <line key={`${pi}-${i}`}
              x1={xS(i - 1)} y1={yS(path[i - 1])} x2={xS(i)} y2={yS(v)}
              stroke={colors[pi]} strokeWidth={1.5} opacity={0.8} />;
          })
        )}
        <line x1={PAD.left} x2={PAD.left + PW} y1={PAD.top + PH} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        {[0.5, 1.0, 1.5].map((v) => (
          <text key={v} x={PAD.left - 4} y={yS(v) + 4} textAnchor="end" style={labelStyle}>{v.toFixed(1)}</text>
        ))}
        <text x={PAD.left + PW / 2} y={H - 2} textAnchor="middle" style={labelStyle}>n</text>
      </svg>
    </div>
  );
};

// ── 4.3.1 Almost Sure Path ────────────────────────────────────────────────────

export const VizAlmostSurePath: React.FC = () => {
  const N = 100;
  const r = lcg(42);
  const path = Array.from({ length: N }, (_, n) => boxMuller(r) / (n + 1));
  const xS = (i: number) => PAD.left + (i / (N - 1)) * PW;
  const yS = (v: number) => PAD.top + PH / 2 - Math.min(Math.max(v, -1.2), 1.2) / 1.2 * (PH / 2);
  const [nShow, setNShow] = useState(N);

  // Find first n where all subsequent values are within 0.2
  const EPS = 0.2;
  const capture = path.findIndex((_, i) => path.slice(i).every((v) => Math.abs(v) < EPS));

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        Almost Sure Convergence: a single path Xₙ = Zₙ/(n+1) → 0 with probability 1
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, fontSize: '0.8rem', color: 'var(--color-text)' }}>
        <label>Show n = {nShow}</label>
        <input type="range" min={1} max={N} value={nShow} onChange={(e) => setNShow(+e.target.value)} style={{ flex: 1 }} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {/* ε band */}
        <rect x={PAD.left} y={yS(EPS)} width={PW} height={yS(-EPS) - yS(EPS)} fill="var(--color-success)" opacity={0.1} />
        <line x1={PAD.left} x2={PAD.left + PW} y1={yS(EPS)} y2={yS(EPS)} stroke="var(--color-success)" strokeDasharray="4,3" strokeWidth={1} />
        <line x1={PAD.left} x2={PAD.left + PW} y1={yS(-EPS)} y2={yS(-EPS)} stroke="var(--color-success)" strokeDasharray="4,3" strokeWidth={1} />
        <line x1={PAD.left} x2={PAD.left + PW} y1={yS(0)} y2={yS(0)} stroke="var(--color-text-secondary)" strokeWidth={1} />

        {path.slice(0, nShow).map((v, i) => {
          if (i === 0) return null;
          const inBand = capture >= 0 && i >= capture;
          return <line key={i}
            x1={xS(i - 1)} y1={yS(path[i - 1])} x2={xS(i)} y2={yS(v)}
            stroke={inBand ? 'var(--color-success)' : 'var(--color-primary)'} strokeWidth={1.8} />;
        })}

        {capture >= 0 && nShow > capture && (
          <line x1={xS(capture)} y1={PAD.top} x2={xS(capture)} y2={PAD.top + PH}
            stroke="var(--color-success)" strokeDasharray="4,2" strokeWidth={1} />
        )}

        <line x1={PAD.left} x2={PAD.left + PW} y1={PAD.top + PH} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        <text x={PAD.left + PW / 2} y={H - 2} textAnchor="middle" style={labelStyle}>n</text>
        <text x={PAD.left + PW + 3} y={yS(EPS) + 4} style={{ fontSize: '0.62rem', fill: 'var(--color-success)' }}>ε</text>
        {capture >= 0 && (
          <text x={xS(capture)} y={PAD.top + 12} textAnchor="middle" style={{ fontSize: '0.62rem', fill: 'var(--color-success)' }}>Nε</text>
        )}
        <text x={PAD.left + 4} y={PAD.top + 14} style={{ fontSize: '0.65rem', fill: 'var(--color-text-secondary)' }}>
          Green = inside ε-band; for a.s. convergence path stays inside permanently after Nε
        </text>
      </svg>
    </div>
  );
};

// ── 4.3.2 Strong LLN — 5 running averages ────────────────────────────────────

export const VizStrongLLN: React.FC = () => {
  const N = 200;
  const seeds = [1, 2, 3, 4, 5];
  const paths = seeds.map((s) => {
    const r = lcg(s * 100 + 3);
    let sum = 0;
    return Array.from({ length: N }, (_, i) => {
      sum += boxMuller(r); // N(0,1) → μ=0
      return sum / (i + 1);
    });
  });
  const colors = ['var(--color-primary)', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
  const [nShow, setNShow] = useState(50);
  const xS = (i: number) => PAD.left + (i / (N - 1)) * PW;
  const yS = (v: number) => PAD.top + PH / 2 - Math.min(Math.max(v, -2), 2) / 2 * (PH / 2);

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        Strong LLN — All 5 running averages of N(0,1) converge to μ = 0
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, fontSize: '0.8rem', color: 'var(--color-text)' }}>
        <label>n = {nShow}</label>
        <input type="range" min={1} max={N} value={nShow} onChange={(e) => setNShow(+e.target.value)} style={{ flex: 1 }} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        <line x1={PAD.left} x2={PAD.left + PW} y1={yS(0)} y2={yS(0)} stroke="var(--color-text-secondary)" strokeDasharray="6,3" strokeWidth={1.5} />
        <text x={PAD.left + PW + 3} y={yS(0) + 4} style={{ fontSize: '0.62rem', fill: 'var(--color-text-secondary)' }}>μ=0</text>
        {paths.map((path, pi) =>
          path.slice(0, nShow).map((v, i) => {
            if (i === 0) return null;
            return <line key={`${pi}-${i}`}
              x1={xS(i - 1)} y1={yS(path[i - 1])} x2={xS(i)} y2={yS(v)}
              stroke={colors[pi]} strokeWidth={1.5} opacity={0.8} />;
          })
        )}
        <line x1={PAD.left} x2={PAD.left + PW} y1={PAD.top + PH} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        {[-1, 0, 1].map((v) => (
          <text key={v} x={PAD.left - 4} y={yS(v) + 4} textAnchor="end" style={labelStyle}>{v}</text>
        ))}
        <text x={PAD.left + PW / 2} y={H - 2} textAnchor="middle" style={labelStyle}>n</text>
      </svg>
    </div>
  );
};

// ── 4.3.3 A.S. vs In-Probability Comparison ──────────────────────────────────

export const VizAsVsProb: React.FC = () => {
  const N = 60;
  const EPS = 0.25;
  // "In Prob" paths: many, but some escape band temporarily
  const probPaths = [1, 2, 3, 4].map((s) => {
    const r = lcg(s * 41);
    return Array.from({ length: N }, (_, n) => {
      const z = boxMuller(r);
      return z / Math.sqrt(n + 1); // converges in prob to 0
    });
  });
  // "A.S." paths: all stay inside eventually
  const asPaths = [5, 6, 7, 8].map((s) => {
    const r = lcg(s * 31);
    return Array.from({ length: N }, (_, n) => {
      const z = boxMuller(r);
      return z / (n + 1); // converges a.s. to 0
    });
  });
  const colors = ['var(--color-primary)', '#f59e0b', '#10b981', '#8b5cf6'];
  const half = W / 2 - 10;
  const xS = (i: number, offset: number) => offset + (i / (N - 1)) * (half - PAD.left - PAD.right / 2);
  const yS = (v: number) => PAD.top + PH / 2 - Math.min(Math.max(v, -1), 1) / 1 * (PH / 2);

  const renderPanel = (paths: number[][], offset: number, title: string) => (
    <g>
      <text x={offset + (half - PAD.left) / 2} y={PAD.top - 4} textAnchor="middle" style={{ fontSize: '0.65rem', fontWeight: 600, fill: 'var(--color-text)' }}>{title}</text>
      <rect x={offset} y={yS(EPS)} width={half - PAD.left - 4} height={yS(-EPS) - yS(EPS)} fill="var(--color-success)" opacity={0.08} />
      <line x1={offset} x2={offset + half - PAD.left - 4} y1={yS(EPS)} y2={yS(EPS)} stroke="var(--color-success)" strokeDasharray="3,2" strokeWidth={1} />
      <line x1={offset} x2={offset + half - PAD.left - 4} y1={yS(-EPS)} y2={yS(-EPS)} stroke="var(--color-success)" strokeDasharray="3,2" strokeWidth={1} />
      <line x1={offset} x2={offset + half - PAD.left - 4} y1={yS(0)} y2={yS(0)} stroke="var(--color-text-secondary)" strokeWidth={1} />
      {paths.map((path, pi) =>
        path.map((v, i) => {
          if (i === 0) return null;
          return <line key={`${pi}-${i}`}
            x1={xS(i - 1, offset)} y1={yS(Math.max(-1, Math.min(1, path[i - 1])))}
            x2={xS(i, offset)} y2={yS(Math.max(-1, Math.min(1, v)))}
            stroke={colors[pi]} strokeWidth={1.2} opacity={0.8} />;
        })
      )}
      <line x1={offset} x2={offset + half - PAD.left - 4} y1={PAD.top + PH} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
    </g>
  );

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        Convergence in Probability vs Almost Sure: paths can temporarily escape in-prob, but never after Nε for a.s.
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {renderPanel(probPaths, PAD.left, 'In Probability (can escape band)')}
        {renderPanel(asPaths, W / 2 + 5, 'Almost Sure (stays inside eventually)')}
        <line x1={W / 2} y1={PAD.top - 10} x2={W / 2} y2={PAD.top + PH} stroke="var(--color-border)" strokeWidth={1} strokeDasharray="4,2" />
        <text x={PAD.left + PW / 2} y={H - 2} textAnchor="middle" style={labelStyle}>n →</text>
      </svg>
    </div>
  );
};

// ── 4.4.1 CLT Histogram — main demo ──────────────────────────────────────────

export const VizCLTHistogram: React.FC = () => {
  const [n, setN] = useState(5);
  const N_SIM = 2000;
  const BINS = 30;
  const range: [number, number] = [-4, 4];

  const data = React.useMemo(() => {
    const r = lcg(n * 7 + 13);
    const zs: number[] = [];
    for (let i = 0; i < N_SIM; i++) {
      let s = 0;
      for (let j = 0; j < n; j++) s += -Math.log(r() + 1e-10); // Exp(1)
      const mean = s / n;
      const z = (mean - 1) / (1 / Math.sqrt(n)); // Exp(1) μ=1, σ=1
      zs.push(z);
    }
    return zs;
  }, [n]);

  const bins = histogramBins(data, range[0], range[1], BINS);
  const maxD = Math.max(...bins.map((b) => b.density), normalPDF(0));

  const nPoints = 120;
  const normalLine = Array.from({ length: nPoints }, (_, i) => {
    const x = range[0] + (i / (nPoints - 1)) * (range[1] - range[0]);
    return { x, y: normalPDF(x) };
  });

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        Central Limit Theorem — Standardised mean of Exponential(1): histogram approaches N(0,1)
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, fontSize: '0.8rem', color: 'var(--color-text)' }}>
        <label>n = {n}</label>
        <input type="range" min={1} max={50} value={n} onChange={(e) => setN(+e.target.value)} style={{ flex: 1 }} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {bins.map((b, i) => {
          const bw = PW / BINS;
          const bx = PAD.left + i * bw;
          const bh = (b.density / maxD) * PH;
          const by = PAD.top + PH - bh;
          return <rect key={i} x={bx} y={by} width={bw - 1} height={bh} fill="var(--color-primary)" opacity={0.6} />;
        })}
        <polyline
          points={normalLine.map((p) => {
            const sx = PAD.left + ((p.x - range[0]) / (range[1] - range[0])) * PW;
            const sy = PAD.top + PH - (p.y / maxD) * PH;
            return `${sx},${sy}`;
          }).join(' ')}
          fill="none" stroke="var(--color-success)" strokeWidth={2.5} />
        <line x1={PAD.left} x2={PAD.left + PW} y1={PAD.top + PH} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        {[-3, -2, -1, 0, 1, 2, 3].map((v) => {
          const sx = PAD.left + ((v - range[0]) / (range[1] - range[0])) * PW;
          return <text key={v} x={sx} y={PAD.top + PH + 14} textAnchor="middle" style={labelStyle}>{v}</text>;
        })}
        <text x={PAD.left + PW / 2} y={H - 2} textAnchor="middle" style={labelStyle}>Zₙ = (M̄ₙ − μ)/(σ/√n)</text>
        <text x={PAD.left + 4} y={PAD.top + 14} style={{ fontSize: '0.65rem', fill: 'var(--color-success)' }}>Green = N(0,1)</text>
      </svg>
    </div>
  );
};

// ── 4.4.2 CLT — Uniform source ───────────────────────────────────────────────

export const VizCLTUniform: React.FC = () => {
  const [n, setN] = useState(3);
  const N_SIM = 2000;
  const BINS = 28;
  const range: [number, number] = [-4, 4];

  const data = React.useMemo(() => {
    const r = lcg(n * 11 + 5);
    return Array.from({ length: N_SIM }, () => {
      let s = 0;
      for (let j = 0; j < n; j++) s += r();
      const mean = s / n;
      return Math.sqrt(12 * n) * (mean - 0.5);
    });
  }, [n]);

  const bins = histogramBins(data, range[0], range[1], BINS);
  const maxD = Math.max(...bins.map((b) => b.density), normalPDF(0));
  const normalLine = Array.from({ length: 100 }, (_, i) => {
    const x = range[0] + (i / 99) * (range[1] - range[0]);
    return { x, y: normalPDF(x) };
  });

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        CLT from Uniform[0,1] — Zₙ = √(12n)·(M̄ₙ − ½) converges to N(0,1)
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, fontSize: '0.8rem', color: 'var(--color-text)' }}>
        <label>n = {n}</label>
        <input type="range" min={1} max={20} value={n} onChange={(e) => setN(+e.target.value)} style={{ flex: 1 }} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {bins.map((b, i) => {
          const bw = PW / BINS;
          const bx = PAD.left + i * bw;
          const bh = (b.density / maxD) * PH;
          const by = PAD.top + PH - bh;
          return <rect key={i} x={bx} y={by} width={bw - 1} height={bh} fill="var(--color-primary)" opacity={0.6} />;
        })}
        <polyline
          points={normalLine.map((p) => {
            const sx = PAD.left + ((p.x - range[0]) / (range[1] - range[0])) * PW;
            const sy = PAD.top + PH - (p.y / maxD) * PH;
            return `${sx},${sy}`;
          }).join(' ')}
          fill="none" stroke="var(--color-success)" strokeWidth={2.5} />
        <line x1={PAD.left} x2={PAD.left + PW} y1={PAD.top + PH} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        {[-3, -2, -1, 0, 1, 2, 3].map((v) => {
          const sx = PAD.left + ((v - range[0]) / (range[1] - range[0])) * PW;
          return <text key={v} x={sx} y={PAD.top + PH + 14} textAnchor="middle" style={labelStyle}>{v}</text>;
        })}
        <text x={PAD.left + PW / 2} y={H - 2} textAnchor="middle" style={labelStyle}>Standardised sample mean</text>
      </svg>
    </div>
  );
};

// ── 4.4.3 Binomial → Normal ──────────────────────────────────────────────────

export const VizBinomialNormal: React.FC = () => {
  const [nVal, setNVal] = useState(20);
  const p = 0.4;
  const mu = nVal * p, sigma = Math.sqrt(nVal * p * (1 - p));

  function binomPMF(k: number, n: number, pv: number) {
    if (k < 0 || k > n) return 0;
    let logp = 0;
    for (let i = 0; i < k; i++) logp += Math.log(n - i) - Math.log(i + 1);
    logp += k * Math.log(pv) + (n - k) * Math.log(1 - pv);
    return Math.exp(logp);
  }

  const kVals = Array.from({ length: nVal + 1 }, (_, k) => ({ k, p: binomPMF(k, nVal, p) }));
  const maxP = Math.max(...kVals.map((v) => v.p));
  const kMin = Math.max(0, Math.floor(mu - 4 * sigma));
  const kMax = Math.min(nVal, Math.ceil(mu + 4 * sigma));
  const kRange = kMax - kMin || 1;

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        Binomial(n, 0.4) → Normal approximation N(np, np(1−p))
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, fontSize: '0.8rem', color: 'var(--color-text)' }}>
        <label>n = {nVal}</label>
        <input type="range" min={5} max={80} value={nVal} onChange={(e) => setNVal(+e.target.value)} style={{ flex: 1 }} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {kVals.filter((v) => v.k >= kMin && v.k <= kMax).map((v) => {
          const bw = PW / (kRange + 1);
          const bx = PAD.left + ((v.k - kMin) / kRange) * PW - bw / 2;
          const bh = (v.p / maxP) * PH;
          const by = PAD.top + PH - bh;
          return <rect key={v.k} x={bx} y={by} width={bw - 1} height={bh} fill="var(--color-primary)" opacity={0.65} rx={1} />;
        })}
        <polyline
          points={Array.from({ length: 100 }, (_, i) => {
            const x = kMin + (i / 99) * kRange;
            const y = normalPDF(x, mu, sigma);
            const sx = PAD.left + ((x - kMin) / kRange) * PW;
            const sy = PAD.top + PH - (y / maxP) * PH;
            return `${sx},${sy}`;
          }).join(' ')}
          fill="none" stroke="var(--color-success)" strokeWidth={2.5} />
        <line x1={PAD.left} x2={PAD.left + PW} y1={PAD.top + PH} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        {[kMin, Math.round(mu), kMax].map((k) => {
          const sx = PAD.left + ((k - kMin) / kRange) * PW;
          return <text key={k} x={sx} y={PAD.top + PH + 14} textAnchor="middle" style={labelStyle}>{k}</text>;
        })}
        <text x={PAD.left + PW / 2} y={H - 2} textAnchor="middle" style={labelStyle}>k</text>
        <text x={PAD.left + 4} y={PAD.top + 14} style={{ fontSize: '0.65rem', fill: 'var(--color-success)' }}>Green = N({mu.toFixed(1)}, {(sigma * sigma).toFixed(1)})</text>
      </svg>
    </div>
  );
};

// ── 4.5.1 Monte Carlo π ──────────────────────────────────────────────────────

export const VizMCPi: React.FC = () => {
  const [N, setN] = useState(200);
  const points = React.useMemo(() => {
    const r = lcg(N * 3 + 7);
    return Array.from({ length: N }, () => ({ x: r(), y: r() }));
  }, [N]);
  const inside = points.filter((p) => p.x * p.x + p.y * p.y <= 1);
  const piEst = (4 * inside.length / N).toFixed(4);

  const SZ = 220;
  const toSvg = (v: number) => 40 + v * SZ;

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        Monte Carlo π Estimation — π ≈ 4 × (inside / total)
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, fontSize: '0.8rem', color: 'var(--color-text)' }}>
        <label>N = {N}</label>
        <input type="range" min={50} max={3000} step={50} value={N} onChange={(e) => setN(+e.target.value)} style={{ flex: 1 }} />
        <span style={{ color: 'var(--color-primary)', fontWeight: 700, minWidth: 80 }}>π̂ = {piEst}</span>
      </div>
      <svg viewBox="0 0 500 280" style={{ width: '100%' }}>
        <rect x={40} y={30} width={SZ} height={SZ} fill="var(--color-surface)" stroke="var(--color-border)" />
        <path d={`M ${40} ${30 + SZ} A ${SZ} ${SZ} 0 0 1 ${40 + SZ} ${30 + SZ}`} fill="none" stroke="var(--color-primary)" strokeWidth={1.5} />
        {points.map((pt, i) => {
          const isIn = pt.x * pt.x + pt.y * pt.y <= 1;
          return <circle key={i} cx={toSvg(pt.x)} cy={30 + SZ - pt.y * SZ} r={2}
            fill={isIn ? 'var(--color-success)' : '#ef4444'} opacity={0.7} />;
        })}
        <g transform="translate(280, 60)">
          <rect x={0} y={0} width={200} height={180} rx={8} fill="var(--color-surface)" stroke="var(--color-border)" />
          <text x={100} y={28} textAnchor="middle" style={{ fontSize: '0.75rem', fontWeight: 700, fill: 'var(--color-text)' }}>Results</text>
          {[
            ['Total darts N', N.toString()],
            ['Inside circle', inside.length.toString()],
            ['Fraction inside', (inside.length / N).toFixed(4)],
            ['π̂ = 4 × fraction', piEst],
            ['True π', '3.14159…'],
            ['Error', Math.abs(parseFloat(piEst) - Math.PI).toFixed(4)],
          ].map(([label, val], i) => (
            <g key={label}>
              <text x={16} y={52 + i * 22} style={{ fontSize: '0.68rem', fill: 'var(--color-text-secondary)' }}>{label}</text>
              <text x={184} y={52 + i * 22} textAnchor="end" style={{ fontSize: '0.68rem', fontWeight: 600, fill: 'var(--color-text)' }}>{val}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

// ── 4.5.2 Monte Carlo Integration ────────────────────────────────────────────

export const VizMCIntegration: React.FC = () => {
  const [N, setN] = useState(300);
  const points = React.useMemo(() => {
    const r = lcg(N * 5 + 11);
    return Array.from({ length: N }, () => {
      const x = r();
      const y = r();
      return { x, y, below: y <= x * x };
    });
  }, [N]);
  const estimate = (points.filter((p) => p.below).length / N).toFixed(4);

  const SZ = 220;
  const toSvgX = (v: number) => 40 + v * SZ;
  const toSvgY = (v: number) => 30 + SZ - v * SZ;
  const curve = Array.from({ length: 60 }, (_, i) => {
    const x = i / 59;
    return `${toSvgX(x)},${toSvgY(x * x)}`;
  });

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        Monte Carlo Integration — estimating ∫₀¹ x² dx = 1/3 ≈ 0.3333
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, fontSize: '0.8rem', color: 'var(--color-text)' }}>
        <label>N = {N}</label>
        <input type="range" min={50} max={3000} step={50} value={N} onChange={(e) => setN(+e.target.value)} style={{ flex: 1 }} />
        <span style={{ color: 'var(--color-primary)', fontWeight: 700, minWidth: 80 }}>∫̂ = {estimate}</span>
      </div>
      <svg viewBox="0 0 500 280" style={{ width: '100%' }}>
        <rect x={40} y={30} width={SZ} height={SZ} fill="var(--color-surface)" stroke="var(--color-border)" />
        <polyline points={curve.join(' ')} fill="none" stroke="var(--color-primary)" strokeWidth={2} />
        {points.map((pt, i) => (
          <circle key={i} cx={toSvgX(pt.x)} cy={toSvgY(pt.y)} r={2}
            fill={pt.below ? 'var(--color-success)' : '#ef4444'} opacity={0.6} />
        ))}
        {[0, 0.5, 1].map((v) => (
          <text key={v} x={toSvgX(v)} y={30 + SZ + 14} textAnchor="middle" style={labelStyle}>{v}</text>
        ))}
        <g transform="translate(280, 60)">
          <rect x={0} y={0} width={200} height={130} rx={8} fill="var(--color-surface)" stroke="var(--color-border)" />
          <text x={100} y={28} textAnchor="middle" style={{ fontSize: '0.75rem', fontWeight: 700, fill: 'var(--color-text)' }}>∫₀¹ x² dx</text>
          {[
            ['Estimate', estimate],
            ['True value', '0.3333…'],
            ['Error', Math.abs(parseFloat(estimate) - 1 / 3).toFixed(4)],
            ['N', N.toString()],
          ].map(([label, val], i) => (
            <g key={label}>
              <text x={16} y={50 + i * 22} style={{ fontSize: '0.68rem', fill: 'var(--color-text-secondary)' }}>{label}</text>
              <text x={184} y={50 + i * 22} textAnchor="end" style={{ fontSize: '0.68rem', fontWeight: 600, fill: 'var(--color-text)' }}>{val}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

// ── 4.5.3 MC Error vs N ──────────────────────────────────────────────────────

export const VizMCError: React.FC = () => {
  const Ns = [50, 100, 200, 400, 800, 1600, 3200, 6400];
  const nRuns = 8;
  const errors = Ns.map((N) => {
    const runs = Array.from({ length: nRuns }, (_, ri) => {
      const r = lcg(N * 7 + ri * 31);
      let inside = 0;
      for (let i = 0; i < N; i++) {
        const x = r(), y = r();
        if (x * x + y * y <= 1) inside++;
      }
      return Math.abs(4 * inside / N - Math.PI);
    });
    return { N, mean: runs.reduce((a, b) => a + b, 0) / nRuns, runs };
  });

  const maxErr = Math.max(...errors.map((e) => e.mean)) * 2;
  const logMin = Math.log(Ns[0]), logRange = Math.log(Ns[Ns.length - 1]) - logMin;
  const xS = (N: number) => PAD.left + ((Math.log(N) - logMin) / logRange) * PW;
  const yS = (err: number) => PAD.top + PH - Math.max(0, Math.min(1, err / maxErr)) * PH;

  const theoreticalErr = (N: number) => 1.5 / Math.sqrt(N);

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        Monte Carlo Error Decay — |π̂ − π| vs N (log-log scale, shows 1/√N rate)
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {errors.map((e) =>
          e.runs.map((err, ri) => (
            <circle key={`${e.N}-${ri}`} cx={xS(e.N)} cy={yS(err)} r={2.5}
              fill="var(--color-primary)" opacity={0.4} />
          ))
        )}
        {errors.map((e, i) => {
          if (i === 0) return null;
          const prev = errors[i - 1];
          return <line key={i} x1={xS(prev.N)} y1={yS(prev.mean)} x2={xS(e.N)} y2={yS(e.mean)}
            stroke="var(--color-primary)" strokeWidth={2.5} />;
        })}
        <polyline
          points={Ns.map((N) => `${xS(N)},${yS(theoreticalErr(N))}`).join(' ')}
          fill="none" stroke="var(--color-success)" strokeWidth={2} strokeDasharray="5,3" />
        <line x1={PAD.left} x2={PAD.left + PW} y1={PAD.top + PH} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        {Ns.map((N) => (
          <text key={N} x={xS(N)} y={PAD.top + PH + 14} textAnchor="middle" style={{ ...labelStyle, fontSize: '0.6rem' }}>{N}</text>
        ))}
        <text x={PAD.left + PW / 2} y={H - 2} textAnchor="middle" style={labelStyle}>Sample size N</text>
        <text x={12} y={PAD.top + PH / 2} textAnchor="middle" style={labelStyle} transform={`rotate(-90,12,${PAD.top + PH / 2})`}>Error |π̂−π|</text>
        <text x={PAD.left + PW - 4} y={PAD.top + 14} textAnchor="end" style={{ fontSize: '0.65rem', fill: 'var(--color-success)' }}>— 1/√N curve</text>
      </svg>
    </div>
  );
};

// ── 4.6.1 Normal Linear Combination ──────────────────────────────────────────

export const VizNormalLinearComb: React.FC = () => {
  const [mu1, setMu1] = useState(0);
  const [mu2, setMu2] = useState(2);
  const [sig1, setSig1] = useState(1.0);
  const [sig2, setSig2] = useState(0.8);

  const muSum = mu1 + mu2;
  const sigSum = Math.sqrt(sig1 * sig1 + sig2 * sig2);
  const range: [number, number] = [-6, 10];

  const curves = [
    { mu: mu1, sig: sig1, color: 'var(--color-primary)', label: `X ~ N(${mu1},${sig1.toFixed(1)}²)` },
    { mu: mu2, sig: sig2, color: '#f59e0b', label: `Y ~ N(${mu2},${sig2.toFixed(1)}²)` },
    { mu: muSum, sig: sigSum, color: 'var(--color-success)', label: `X+Y ~ N(${muSum.toFixed(1)},${sigSum.toFixed(2)}²)` },
  ];

  const maxD = Math.max(...curves.map((c) => normalPDF(c.mu, c.mu, c.sig)));

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        Linear Combinations: X+Y ~ N(μ₁+μ₂, σ₁²+σ₂²) for independent normals
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8, fontSize: '0.75rem', color: 'var(--color-text)' }}>
        <label>μ₁ = {mu1} <input type="range" min={-3} max={5} step={0.5} value={mu1} onChange={(e) => setMu1(+e.target.value)} style={{ width: '100%' }} /></label>
        <label>μ₂ = {mu2} <input type="range" min={-3} max={5} step={0.5} value={mu2} onChange={(e) => setMu2(+e.target.value)} style={{ width: '100%' }} /></label>
        <label>σ₁ = {sig1.toFixed(1)} <input type="range" min={0.3} max={2} step={0.1} value={sig1} onChange={(e) => setSig1(+e.target.value)} style={{ width: '100%' }} /></label>
        <label>σ₂ = {sig2.toFixed(1)} <input type="range" min={0.3} max={2} step={0.1} value={sig2} onChange={(e) => setSig2(+e.target.value)} style={{ width: '100%' }} /></label>
      </div>
      <svg viewBox={`0 0 ${W} 200`} style={{ width: '100%' }}>
        {curves.map((c) => {
          const pts = Array.from({ length: 120 }, (_, i) => {
            const x = range[0] + (i / 119) * (range[1] - range[0]);
            const d = normalPDF(x, c.mu, c.sig);
            const sx = PAD.left + ((x - range[0]) / (range[1] - range[0])) * PW;
            const sy = 20 + (160 - 20) - (d / maxD) * (160 - 20);
            return `${sx},${sy}`;
          });
          return <polyline key={c.label} points={pts.join(' ')} fill="none" stroke={c.color} strokeWidth={2.5} />;
        })}
        <line x1={PAD.left} x2={PAD.left + PW} y1={160} y2={160} stroke="var(--color-text-secondary)" />
        {curves.map((c, i) => (
          <g key={c.label}>
            <line x1={PAD.left + 10} y1={175 + i * 12} x2={PAD.left + 26} y2={175 + i * 12} stroke={c.color} strokeWidth={2.5} />
            <text x={PAD.left + 30} y={175 + i * 12 + 4} style={{ fontSize: '0.62rem', fill: 'var(--color-text)' }}>{c.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// ── 4.6.2 Chi-Squared Distribution ───────────────────────────────────────────

export const VizChiSquared: React.FC = () => {
  const [k, setK] = useState(3);
  const range: [number, number] = [0, 20];
  const colors: Record<number, string> = { 1: '#ef4444', 2: '#f59e0b', 3: 'var(--color-primary)', 5: '#10b981', 8: '#8b5cf6', 10: '#ec4899' };

  const kVals = [1, 2, 3, 5, 8, 10];
  const allCurves = kVals.map((kv) => ({
    k: kv,
    pts: Array.from({ length: 120 }, (_, i) => {
      const x = 0.01 + (i / 119) * range[1];
      return { x, y: chiSquaredPDF(x, kv) };
    }),
  }));

  const maxD = Math.max(...allCurves.map((c) => Math.max(...c.pts.map((p) => p.y))));

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        Chi-Squared Distribution χ²(k) — mean = k, variance = 2k
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, fontSize: '0.8rem', color: 'var(--color-text)' }}>
        <label>Active k = {k}</label>
        <input type="range" min={1} max={10} value={k} onChange={(e) => setK(+e.target.value)} style={{ flex: 1 }} />
        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.72rem' }}>mean={k}, var={2 * k}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {allCurves.map((c) => (
          <polyline key={c.k}
            points={c.pts.map((p) => {
              const sx = PAD.left + (p.x / range[1]) * PW;
              const sy = PAD.top + PH - (p.y / maxD) * PH;
              return `${sx},${sy}`;
            }).join(' ')}
            fill="none" stroke={colors[c.k] || 'var(--color-primary)'}
            strokeWidth={c.k === k ? 3 : 1} opacity={c.k === k ? 1 : 0.35} />
        ))}
        <line x1={PAD.left} x2={PAD.left + PW} y1={PAD.top + PH} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        {[0, 5, 10, 15, 20].map((v) => {
          const sx = PAD.left + (v / range[1]) * PW;
          return <text key={v} x={sx} y={PAD.top + PH + 14} textAnchor="middle" style={labelStyle}>{v}</text>;
        })}
        <text x={PAD.left + PW / 2} y={H - 2} textAnchor="middle" style={labelStyle}>x</text>
        <text x={PAD.left + PW - 4} y={PAD.top + 14} textAnchor="end" style={{ fontSize: '0.65rem', fill: 'var(--color-text-secondary)' }}>
          {kVals.map((kv) => `k=${kv}`).join(' · ')}
        </text>
      </svg>
    </div>
  );
};

// ── 4.6.3 t-Distribution vs Normal ───────────────────────────────────────────

export const VizTDistribution: React.FC = () => {
  const [df, setDf] = useState(5);
  const range: [number, number] = [-5, 5];

  const normalPts = Array.from({ length: 120 }, (_, i) => {
    const x = range[0] + (i / 119) * (range[1] - range[0]);
    return { x, y: normalPDF(x) };
  });
  const tPts = Array.from({ length: 120 }, (_, i) => {
    const x = range[0] + (i / 119) * (range[1] - range[0]);
    return { x, y: tPDF(x, df) };
  });

  const maxD = normalPDF(0);
  const xS = (x: number) => PAD.left + ((x - range[0]) / (range[1] - range[0])) * PW;
  const yS = (y: number) => PAD.top + PH - (y / maxD) * PH;

  // Tail fill: x > 2 for t
  const tailRight = tPts.filter((p) => p.x >= 2);
  const tailLeft = tPts.filter((p) => p.x <= -2);

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        t(df) vs N(0,1) — heavier tails for small df; as df→∞, t approaches normal
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, fontSize: '0.8rem', color: 'var(--color-text)' }}>
        <label>df = {df}</label>
        <input type="range" min={1} max={40} value={df} onChange={(e) => setDf(+e.target.value)} style={{ flex: 1 }} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {/* t tail fills */}
        {[tailRight, tailLeft].map((tail, ti) => {
          if (tail.length < 2) return null;
          const pts = [...tail.map((p) => `${xS(p.x)},${yS(p.y)}`), `${xS(tail[tail.length - 1].x)},${yS(0)}`, `${xS(tail[0].x)},${yS(0)}`];
          return <polygon key={ti} points={pts.join(' ')} fill="#ef4444" opacity={0.2} />;
        })}
        <polyline points={tPts.map((p) => `${xS(p.x)},${yS(p.y)}`).join(' ')}
          fill="none" stroke="var(--color-primary)" strokeWidth={2.5} />
        <polyline points={normalPts.map((p) => `${xS(p.x)},${yS(p.y)}`).join(' ')}
          fill="none" stroke="var(--color-success)" strokeWidth={2} strokeDasharray="6,3" />
        <line x1={PAD.left} x2={PAD.left + PW} y1={PAD.top + PH} y2={PAD.top + PH} stroke="var(--color-text-secondary)" />
        {[-4, -2, 0, 2, 4].map((v) => (
          <text key={v} x={xS(v)} y={PAD.top + PH + 14} textAnchor="middle" style={labelStyle}>{v}</text>
        ))}
        <text x={PAD.left + PW / 2} y={H - 2} textAnchor="middle" style={labelStyle}>x</text>
        <g>
          <line x1={PAD.left + 10} y1={PAD.top + 14} x2={PAD.left + 26} y2={PAD.top + 14} stroke="var(--color-primary)" strokeWidth={2.5} />
          <text x={PAD.left + 30} y={PAD.top + 18} style={{ fontSize: '0.65rem', fill: 'var(--color-text)' }}>t({df})</text>
          <line x1={PAD.left + 10} y1={PAD.top + 28} x2={PAD.left + 26} y2={PAD.top + 28} stroke="var(--color-success)" strokeWidth={2} strokeDasharray="5,2" />
          <text x={PAD.left + 30} y={PAD.top + 32} style={{ fontSize: '0.65rem', fill: 'var(--color-text)' }}>N(0,1)</text>
          <rect x={PAD.left + 8} y={PAD.top + 38} width={14} height={10} fill="#ef4444" opacity={0.25} />
          <text x={PAD.left + 30} y={PAD.top + 47} style={{ fontSize: '0.65rem', fill: '#ef4444' }}>Heavier tails</text>
        </g>
      </svg>
    </div>
  );
};
