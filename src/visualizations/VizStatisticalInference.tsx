import React, { useState, useMemo } from 'react';

const W = 500, H = 220;
const BG = 'var(--bg-primary,#0f1117)';
const SURFACE = 'var(--bg-secondary,#1a1d27)';
const PRIMARY = '#7c6af7';
const ACCENT = '#22d3ee';
const SUCCESS = '#4ade80';
const WARN = '#f59e0b';
const TEXT = 'var(--text-primary,#e2e8f0)';
const MUTED = 'var(--text-muted,#64748b)';

const containerStyle: React.CSSProperties = {
  background: BG,
  borderRadius: '12px',
  padding: '12px',
  margin: '16px 0',
  fontFamily: 'system-ui, sans-serif',
};

const btnBase: React.CSSProperties = {
  padding: '5px 12px',
  borderRadius: '6px',
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
  border: '1px solid',
  transition: 'all 0.15s',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function normalPDF(x: number, mu = 0, sigma = 1) {
  return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

function expPDF(x: number, lambda = 1) {
  return x < 0 ? 0 : lambda * Math.exp(-lambda * x);
}

function linspace(a: number, b: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => a + (i / (n - 1)) * (b - a));
}

// Seeded LCG for deterministic "random" samples
function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function normalSample(n: number, seed = 42): number[] {
  const rng = lcg(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const u1 = rng(), u2 = rng();
    out.push(Math.sqrt(-2 * Math.log(u1 + 1e-9)) * Math.cos(2 * Math.PI * u2));
  }
  return out;
}

// ── 5.1 Why Do We Need Statistics? ───────────────────────────────────────────
// Two-group dot plot: control vs treatment, with means marked

export const VizInferenceMotivation: React.FC = () => {
  const [showMeans, setShowMeans] = useState(true);

  // Deterministic fake "survival time" data (days) like the transplant example
  const control = [49,5,17,2,39,84,7,0,35,36,1400,12,34,15,11,2,1,39,8,101,
    2,148,1,68,31,1,20,118,91,427].slice(0, 20).map(v => Math.min(v, 200));
  const treatment = [15,3,624,46,127,61,1350,312,24,10,1024,39,730,136,1379,
    1,836,60,1140,1153,54,18,0,43,971,868,44,780,51,710].slice(0, 20).map(v => Math.min(v, 400));

  const cMean = control.reduce((a, b) => a + b, 0) / control.length;
  const tMean = treatment.reduce((a, b) => a + b, 0) / treatment.length;

  const pad = { left: 60, right: 20, top: 30, bot: 40 };
  const pw = W - pad.left - pad.right;
  const ph = H - pad.top - pad.bot;
  const maxVal = 450;

  const xScale = (v: number) => pad.left + (v / maxVal) * pw;
  const yControl = pad.top + ph * 0.28;
  const yTreat   = pad.top + ph * 0.72;

  const jitterY = (seed: number, spread: number) => {
    const rng = lcg(seed);
    return () => (rng() - 0.5) * spread;
  };
  const jC = jitterY(1, 22);
  const jT = jitterY(2, 22);

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color: TEXT, fontSize: '0.8rem', fontWeight: 600 }}>Heart Transplant Study: Survival Times (days, capped at 450)</span>
        <button
          onClick={() => setShowMeans(m => !m)}
          style={{ ...btnBase, borderColor: showMeans ? PRIMARY : MUTED, background: showMeans ? `${PRIMARY}22` : 'transparent', color: showMeans ? PRIMARY : MUTED }}
        >
          {showMeans ? 'Hide' : 'Show'} Means
        </button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {/* Background */}
        <rect width={W} height={H} fill={BG} rx={8} />

        {/* Axes */}
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={H - pad.bot} stroke={MUTED} strokeWidth={1} />
        <line x1={pad.left} y1={H - pad.bot} x2={W - pad.right} y2={H - pad.bot} stroke={MUTED} strokeWidth={1} />

        {/* X axis ticks */}
        {[0, 100, 200, 300, 400].map(v => (
          <g key={v}>
            <line x1={xScale(v)} y1={H - pad.bot} x2={xScale(v)} y2={H - pad.bot + 4} stroke={MUTED} strokeWidth={1} />
            <text x={xScale(v)} y={H - pad.bot + 14} textAnchor="middle" fill={MUTED} fontSize={10}>{v}</text>
          </g>
        ))}
        <text x={W / 2} y={H - 2} textAnchor="middle" fill={MUTED} fontSize={10}>Survival time (days)</text>

        {/* Group labels */}
        <text x={pad.left - 8} y={yControl + 4} textAnchor="end" fill={ACCENT} fontSize={10} fontWeight={600}>Control</text>
        <text x={pad.left - 8} y={yTreat + 4} textAnchor="end" fill={WARN} fontSize={10} fontWeight={600}>Treated</text>

        {/* Data dots – control */}
        {control.map((v, i) => (
          <circle key={i} cx={xScale(v)} cy={yControl + jC()} r={3.5} fill={ACCENT} opacity={0.7} />
        ))}
        {/* Data dots – treatment */}
        {treatment.map((v, i) => (
          <circle key={i} cx={xScale(v)} cy={yTreat + jT()} r={3.5} fill={WARN} opacity={0.7} />
        ))}

        {/* Means */}
        {showMeans && (
          <>
            <line x1={xScale(cMean)} y1={yControl - 14} x2={xScale(cMean)} y2={yControl + 14} stroke={ACCENT} strokeWidth={2} strokeDasharray="4,2" />
            <text x={xScale(cMean)} y={yControl - 18} textAnchor="middle" fill={ACCENT} fontSize={10}>x̄={Math.round(cMean)}</text>
            <line x1={xScale(tMean)} y1={yTreat - 14} x2={xScale(tMean)} y2={yTreat + 14} stroke={WARN} strokeWidth={2} strokeDasharray="4,2" />
            <text x={Math.min(xScale(tMean), W - 60)} y={yTreat - 18} textAnchor="middle" fill={WARN} fontSize={10}>x̄={Math.round(tMean)}</text>
            <text x={W / 2} y={pad.top + 12} textAnchor="middle" fill={TEXT} fontSize={10} opacity={0.8}>
              Treated mean &gt; Control mean — but is this due to the transplant, or just chance?
            </text>
          </>
        )}
      </svg>
      <p style={{ color: MUTED, fontSize: '0.72rem', margin: '6px 0 0', textAlign: 'center' }}>
        Statistical inference tells us whether the observed difference is real or due to random variation.
      </p>
    </div>
  );
};

// ── 5.2 Inference Using a Probability Model ───────────────────────────────────
// Exponential(1) density with 3 inference modes

type InferMode = 'predict' | 'interval' | 'assess';

export const VizProbInference: React.FC = () => {
  const [mode, setMode] = useState<InferMode>('predict');

  const xs = linspace(0, 7, 200);
  const ys = xs.map(x => expPDF(x, 1));
  const maxY = 1.0;

  const pad = { left: 50, right: 20, top: 30, bot: 40 };
  const pw = W - pad.left - pad.right;
  const ph = H - pad.top - pad.bot;

  const xScale = (v: number) => pad.left + (v / 7) * pw;
  const yScale = (v: number) => H - pad.bot - (v / (maxY * 1.05)) * ph;

  const pathD = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${xScale(x).toFixed(1)},${yScale(ys[i]).toFixed(1)}`).join(' ');

  // 95% CI: (0, c) where c = -ln(0.05)
  const ci = -Math.log(0.05);
  const ciXs = xs.filter(x => x <= ci);

  const areaD = ciXs.length > 0
    ? `M${xScale(0)},${yScale(0)} ` +
      ciXs.map(x => `L${xScale(x).toFixed(1)},${yScale(expPDF(x, 1)).toFixed(1)}`).join(' ') +
      ` L${xScale(ciXs[ciXs.length - 1])},${yScale(0)} Z`
    : '';

  // Tail probability for x0 = 5: P(X > 5) = e^{-5}
  const tailXs = xs.filter(x => x >= 5);
  const tailD = tailXs.length > 0
    ? `M${xScale(5)},${yScale(0)} ` +
      tailXs.map(x => `L${xScale(x).toFixed(1)},${yScale(expPDF(x, 1)).toFixed(1)}`).join(' ') +
      ` L${xScale(tailXs[tailXs.length - 1])},${yScale(0)} Z`
    : '';

  const modes: { key: InferMode; label: string; color: string }[] = [
    { key: 'predict', label: 'Predict (mean)', color: SUCCESS },
    { key: 'interval', label: '95% Interval', color: PRIMARY },
    { key: 'assess', label: 'Assess x₀=5', color: WARN },
  ];

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color: TEXT, fontSize: '0.8rem', fontWeight: 600 }}>Machine Lifelength: X ~ Exponential(1)</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {modes.map(m => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              style={{ ...btnBase, borderColor: mode === m.key ? m.color : MUTED, background: mode === m.key ? `${m.color}22` : 'transparent', color: mode === m.key ? m.color : MUTED }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        <rect width={W} height={H} fill={BG} rx={8} />
        <line x1={pad.left} y1={H - pad.bot} x2={W - pad.right} y2={H - pad.bot} stroke={MUTED} strokeWidth={1} />
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={H - pad.bot} stroke={MUTED} strokeWidth={1} />
        {[0,1,2,3,4,5,6,7].map(v => (
          <g key={v}>
            <line x1={xScale(v)} y1={H-pad.bot} x2={xScale(v)} y2={H-pad.bot+4} stroke={MUTED} />
            <text x={xScale(v)} y={H-pad.bot+14} textAnchor="middle" fill={MUTED} fontSize={10}>{v}</text>
          </g>
        ))}
        <text x={W/2} y={H-2} textAnchor="middle" fill={MUTED} fontSize={10}>x (years)</text>
        {[0,0.25,0.5,0.75,1.0].map(v => (
          <g key={v}>
            <text x={pad.left-4} y={yScale(v)+4} textAnchor="end" fill={MUTED} fontSize={9}>{v.toFixed(2)}</text>
          </g>
        ))}

        {/* 95% CI fill */}
        {mode === 'interval' && <path d={areaD} fill={`${PRIMARY}33`} />}
        {/* Tail fill */}
        {mode === 'assess' && <path d={tailD} fill={`${WARN}44`} />}

        {/* Density curve */}
        <path d={pathD} fill="none" stroke={ACCENT} strokeWidth={2} />

        {/* Prediction: mean line at x=1 */}
        {mode === 'predict' && (
          <>
            <line x1={xScale(1)} y1={yScale(0)} x2={xScale(1)} y2={yScale(0.8)} stroke={SUCCESS} strokeWidth={2} strokeDasharray="5,3" />
            <text x={xScale(1)+4} y={yScale(0.6)} fill={SUCCESS} fontSize={11} fontWeight={600}>E(X)=1</text>
            <text x={W/2} y={pad.top+12} textAnchor="middle" fill={TEXT} fontSize={10}>Predict the lifelength by the mean: 1 year</text>
          </>
        )}

        {/* 95% credible interval */}
        {mode === 'interval' && (
          <>
            <line x1={xScale(ci)} y1={yScale(0)} x2={xScale(ci)} y2={yScale(0.3)} stroke={PRIMARY} strokeWidth={2} strokeDasharray="5,3" />
            <text x={xScale(ci)+4} y={yScale(0.2)} fill={PRIMARY} fontSize={10}>c={ci.toFixed(2)}</text>
            <text x={W/2} y={pad.top+12} textAnchor="middle" fill={TEXT} fontSize={10}>
              Smallest interval with 95% probability: (0, {ci.toFixed(2)})
            </text>
          </>
        )}

        {/* Hypothesis assessment */}
        {mode === 'assess' && (
          <>
            <line x1={xScale(5)} y1={yScale(0)} x2={xScale(5)} y2={yScale(0.25)} stroke={WARN} strokeWidth={2} strokeDasharray="5,3" />
            <text x={xScale(5)+4} y={yScale(0.18)} fill={WARN} fontSize={10}>x₀=5</text>
            <text x={W/2} y={pad.top+12} textAnchor="middle" fill={TEXT} fontSize={10}>
              P(X &gt; 5) = e⁻⁵ = 0.0067 — x₀=5 is implausible
            </text>
          </>
        )}
      </svg>
      <p style={{ color: MUTED, fontSize: '0.72rem', margin: '6px 0 0', textAlign: 'center' }}>
        Three types of inference when the probability model is known.
      </p>
    </div>
  );
};

// ── 5.3 Statistical Models ────────────────────────────────────────────────────
// Parameter space: two Exp distributions, slider for observed sample mean

export const VizStatModel: React.FC = () => {
  const [xBar, setXBar] = useState(1.5);

  // Model: θ=1 → Exp(1), θ=2 → Exp(2/3) (mean=1.5)
  const xs = linspace(0, 6, 200);
  const f1 = xs.map(x => expPDF(x, 1));
  const f2 = xs.map(x => expPDF(x, 2/3));

  const pad = { left: 50, right: 20, top: 35, bot: 42 };
  const pw = W - pad.left - pad.right;
  const ph = H - pad.top - pad.bot;

  const xScale = (v: number) => pad.left + (v / 6) * pw;
  const yScale = (v: number) => H - pad.bot - (v / 1.1) * ph;

  const mkPath = (ys: number[]) =>
    xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${xScale(x).toFixed(1)},${yScale(ys[i]).toFixed(1)}`).join(' ');

  // Which model fits better (by likelihood of observing x̄)?
  const ll1 = Math.exp(-xBar);     // proportional to likelihood under θ=1
  const ll2 = (2/3) * Math.exp(-(2/3) * xBar);
  const better = ll1 >= ll2 ? 1 : 2;

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
        <span style={{ color: TEXT, fontSize: '0.8rem', fontWeight: 600 }}>Statistical Model: &#123;Exp(1), Exp(2/3)&#125;</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ color: MUTED, fontSize: '0.75rem' }}>Observed x̄ = {xBar.toFixed(2)}</label>
          <input type="range" min={0.3} max={3.5} step={0.05} value={xBar}
            onChange={e => setXBar(Number(e.target.value))} style={{ width: '120px' }} />
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        <rect width={W} height={H} fill={BG} rx={8} />
        <line x1={pad.left} y1={H - pad.bot} x2={W - pad.right} y2={H - pad.bot} stroke={MUTED} strokeWidth={1} />
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={H - pad.bot} stroke={MUTED} strokeWidth={1} />
        {[0,1,2,3,4,5,6].map(v => (
          <g key={v}>
            <line x1={xScale(v)} y1={H-pad.bot} x2={xScale(v)} y2={H-pad.bot+4} stroke={MUTED} />
            <text x={xScale(v)} y={H-pad.bot+14} textAnchor="middle" fill={MUTED} fontSize={10}>{v}</text>
          </g>
        ))}
        <text x={W/2} y={H-2} textAnchor="middle" fill={MUTED} fontSize={10}>x</text>

        {/* Density curves */}
        <path d={mkPath(f1)} fill="none" stroke={better === 1 ? ACCENT : `${ACCENT}55`}
          strokeWidth={better === 1 ? 2.5 : 1.5} />
        <path d={mkPath(f2)} fill="none" stroke={better === 2 ? WARN : `${WARN}55`}
          strokeWidth={better === 2 ? 2.5 : 1.5} />

        {/* Observed x̄ */}
        <line x1={xScale(xBar)} y1={pad.top} x2={xScale(xBar)} y2={H-pad.bot} stroke={PRIMARY} strokeWidth={2} strokeDasharray="5,3" />
        <text x={xScale(xBar)+4} y={pad.top+14} fill={PRIMARY} fontSize={10}>x̄</text>

        {/* Legend */}
        <rect x={W-140} y={pad.top} width={120} height={50} fill={SURFACE} rx={5} opacity={0.9} />
        <line x1={W-130} y1={pad.top+14} x2={W-110} y2={pad.top+14} stroke={ACCENT} strokeWidth={2} />
        <text x={W-106} y={pad.top+18} fill={ACCENT} fontSize={10}>θ=1, E(X)=1</text>
        <line x1={W-130} y1={pad.top+32} x2={W-110} y2={pad.top+32} stroke={WARN} strokeWidth={2} />
        <text x={W-106} y={pad.top+36} fill={WARN} fontSize={10}>θ=2, E(X)=1.5</text>

        {/* Verdict */}
        <text x={W/2} y={pad.top+14} textAnchor="middle" fill={better === 1 ? ACCENT : WARN} fontSize={11} fontWeight={600}>
          θ={better} (Exp({better === 1 ? 1 : '2/3'})) fits x̄={xBar.toFixed(2)} better
        </text>
      </svg>
      <p style={{ color: MUTED, fontSize: '0.72rem', margin: '6px 0 0', textAlign: 'center' }}>
        Drag the slider to change x̄ and see which distribution in the model fits the data better.
      </p>
    </div>
  );
};

// ── 5.4 Data Collection / Empirical CDF ──────────────────────────────────────

export const VizEmpiricalCDF: React.FC = () => {
  const [n, setN] = useState(20);

  // Fixed N(0,1) population sample — use deterministic seed
  const bigSample = useMemo(() => normalSample(500, 77), []);
  const sample = useMemo(() => bigSample.slice(0, n).sort((a, b) => a - b), [bigSample, n]);

  const xs = linspace(-3.5, 3.5, 200);
  const trueCDF = xs.map(x => {
    // Approximate Φ(x) via error function
    const t = x / Math.sqrt(2);
    const erf = t < 0
      ? -approxErf(-t)
      : approxErf(t);
    return 0.5 * (1 + erf);
  });

  function approxErf(z: number): number {
    const a1=0.254829592, a2=-0.284496736, a3=1.421413741, a4=-1.453152027, a5=1.061405429, p=0.3275911;
    const t = 1/(1+p*z);
    return 1-(((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-z*z);
  }

  const pad = { left: 50, right: 20, top: 30, bot: 40 };
  const pw = W - pad.left - pad.right;
  const ph = H - pad.top - pad.bot;
  const xMin = -3.5, xMax = 3.5;

  const xScale = (v: number) => pad.left + ((v - xMin) / (xMax - xMin)) * pw;
  const yScale = (v: number) => H - pad.bot - v * ph;

  // Empirical CDF path
  const ecdfPath = (() => {
    const pts: string[] = [`M${xScale(xMin)},${yScale(0)}`];
    sample.forEach((x, i) => {
      const prev = i === 0 ? 0 : i / n;
      const cur = (i + 1) / n;
      pts.push(`L${xScale(x).toFixed(1)},${yScale(prev).toFixed(1)}`);
      pts.push(`L${xScale(x).toFixed(1)},${yScale(cur).toFixed(1)}`);
    });
    pts.push(`L${xScale(xMax)},${yScale(1)}`);
    return pts.join(' ');
  })();

  const truePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${xScale(x).toFixed(1)},${yScale(trueCDF[i]).toFixed(1)}`).join(' ');

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
        <span style={{ color: TEXT, fontSize: '0.8rem', fontWeight: 600 }}>Empirical CDF vs True N(0,1) CDF</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ color: MUTED, fontSize: '0.75rem' }}>n = {n}</label>
          <input type="range" min={5} max={200} step={5} value={n}
            onChange={e => setN(Number(e.target.value))} style={{ width: '120px' }} />
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        <rect width={W} height={H} fill={BG} rx={8} />
        <line x1={pad.left} y1={H-pad.bot} x2={W-pad.right} y2={H-pad.bot} stroke={MUTED} strokeWidth={1} />
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={H-pad.bot} stroke={MUTED} strokeWidth={1} />
        {[-3,-2,-1,0,1,2,3].map(v => (
          <g key={v}>
            <line x1={xScale(v)} y1={H-pad.bot} x2={xScale(v)} y2={H-pad.bot+4} stroke={MUTED} />
            <text x={xScale(v)} y={H-pad.bot+14} textAnchor="middle" fill={MUTED} fontSize={10}>{v}</text>
          </g>
        ))}
        {[0,0.25,0.5,0.75,1].map(v => (
          <g key={v}>
            <text x={pad.left-4} y={yScale(v)+4} textAnchor="end" fill={MUTED} fontSize={9}>{v.toFixed(2)}</text>
          </g>
        ))}
        <text x={W/2} y={H-2} textAnchor="middle" fill={MUTED} fontSize={10}>x</text>

        {/* True CDF */}
        <path d={truePath} fill="none" stroke={ACCENT} strokeWidth={2} />
        {/* Empirical CDF */}
        <path d={ecdfPath} fill="none" stroke={WARN} strokeWidth={1.5} />

        {/* Legend */}
        <rect x={W-155} y={pad.top} width={135} height={45} fill={SURFACE} rx={5} opacity={0.9} />
        <line x1={W-145} y1={pad.top+14} x2={W-125} y2={pad.top+14} stroke={ACCENT} strokeWidth={2} />
        <text x={W-120} y={pad.top+18} fill={ACCENT} fontSize={10}>True F_X (N(0,1))</text>
        <line x1={W-145} y1={pad.top+30} x2={W-125} y2={pad.top+30} stroke={WARN} strokeWidth={1.5} />
        <text x={W-120} y={pad.top+34} fill={WARN} fontSize={10}>Empirical F̂_X (n={n})</text>

        <text x={W/2} y={pad.top+14} textAnchor="middle" fill={TEXT} fontSize={10} opacity={0.8}>
          {n >= 100 ? 'Large n: empirical CDF closely tracks true CDF' : n >= 30 ? 'Moderate n: reasonable approximation' : 'Small n: noticeable deviation from true CDF'}
        </text>
      </svg>
      <p style={{ color: MUTED, fontSize: '0.72rem', margin: '6px 0 0', textAlign: 'center' }}>
        By the WLLN, F̂_X(x) →^P F_X(x) as n → ∞. Increase n to watch convergence.
      </p>
    </div>
  );
};

// ── 5.5 Some Basic Inferences / Descriptive Statistics ───────────────────────

export const VizDescriptiveStats: React.FC = () => {
  const [withOutlier, setWithOutlier] = useState(false);

  // Base data from Example 5.5.1
  const base = [1.2, 2.1, 0.4, 3.3, -2.1, 4.0, -0.3, 2.2, 1.5, 5.0];
  const data = withOutlier ? [...base.slice(0, 9), 50.0] : base;
  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length;
  const mean = data.reduce((s, v) => s + v, 0) / n;
  const median = n % 2 === 0
    ? (sorted[n/2 - 1] + sorted[n/2]) / 2
    : sorted[Math.floor(n/2)];
  const q1 = sorted[Math.floor((n-1)*0.25)];
  const q3 = sorted[Math.floor((n-1)*0.75)];
  const iqr = q3 - q1;

  const pad = { left: 50, right: 20, top: 50, bot: 50 };
  const pw = W - pad.left - pad.right;
  const midY = H / 2;
  const dataMin = Math.min(...data);
  const dataMax = Math.max(...data);
  const range = dataMax - dataMin || 1;
  const plotMin = dataMin - range * 0.1;
  const plotMax = dataMax + range * 0.1;
  const xScale = (v: number) => pad.left + ((v - plotMin) / (plotMax - plotMin)) * pw;

  const jitter = lcg(5);
  const jitters = data.map(() => (jitter() - 0.5) * 24);

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color: TEXT, fontSize: '0.8rem', fontWeight: 600 }}>Descriptive Statistics (n={n})</span>
        <button
          onClick={() => setWithOutlier(o => !o)}
          style={{ ...btnBase, borderColor: withOutlier ? WARN : MUTED, background: withOutlier ? `${WARN}22` : 'transparent', color: withOutlier ? WARN : MUTED }}
        >
          {withOutlier ? 'Remove' : 'Add'} Outlier (50)
        </button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        <rect width={W} height={H} fill={BG} rx={8} />

        {/* Axis line */}
        <line x1={pad.left} y1={midY} x2={W-pad.right} y2={midY} stroke={MUTED} strokeWidth={1} />

        {/* Data dots */}
        {data.map((v, i) => (
          <circle key={i} cx={xScale(v)} cy={midY + jitters[i]} r={4}
            fill={i === n-1 && withOutlier ? WARN : ACCENT} opacity={0.8} />
        ))}

        {/* Q1–Q3 box */}
        <rect x={xScale(q1)} y={midY - 18} width={xScale(q3) - xScale(q1)} height={36}
          fill={`${PRIMARY}22`} stroke={PRIMARY} strokeWidth={1.5} rx={2} />

        {/* Median line */}
        <line x1={xScale(median)} y1={midY-18} x2={xScale(median)} y2={midY+18} stroke={SUCCESS} strokeWidth={2.5} />

        {/* Mean marker */}
        <line x1={xScale(mean)} y1={midY-10} x2={xScale(mean)} y2={midY+10} stroke={WARN} strokeWidth={2} strokeDasharray="4,2" />
        <polygon points={`${xScale(mean)},${midY-18} ${xScale(mean)-5},${midY-10} ${xScale(mean)+5},${midY-10}`} fill={WARN} />

        {/* Labels above */}
        <text x={xScale(q1)} y={midY-24} textAnchor="middle" fill={PRIMARY} fontSize={9}>Q1={q1.toFixed(2)}</text>
        <text x={xScale(q3)} y={midY-24} textAnchor="middle" fill={PRIMARY} fontSize={9}>Q3={q3.toFixed(2)}</text>
        <text x={xScale(median)} y={midY+32} textAnchor="middle" fill={SUCCESS} fontSize={10} fontWeight={600}>
          Median={median.toFixed(2)}
        </text>
        <text x={Math.min(xScale(mean), W-60)} y={midY-28} textAnchor="middle" fill={WARN} fontSize={10} fontWeight={600}>
          Mean={mean.toFixed(2)}
        </text>

        {/* Summary row */}
        <text x={pad.left} y={H-8} fill={MUTED} fontSize={9}>
          IQR={iqr.toFixed(2)} | s²={((data.map(v => (v-mean)**2).reduce((a,b)=>a+b,0))/(n-1)).toFixed(2)} | n={n}
        </text>
      </svg>
      <p style={{ color: MUTED, fontSize: '0.72rem', margin: '6px 0 0', textAlign: 'center' }}>
        {withOutlier
          ? 'The mean shifts dramatically with the outlier; the median is robust.'
          : 'Mean and median are close for this roughly symmetric sample.'}
      </p>
    </div>
  );
};

// ── 5.5 Types of Inferences (Estimation / CI / Hypothesis) ───────────────────

type InfType = 'estimation' | 'confidence' | 'hypothesis';

export const VizTypesOfInference: React.FC = () => {
  const [type, setType] = useState<InfType>('estimation');

  // Heights data from Example 5.5.6 (n=30, normal model)
  const heights = [64.9,61.4,66.3,64.3,65.1,64.4,59.8,63.6,66.5,65.0,
                   64.9,64.3,62.5,63.1,65.0,65.8,63.4,61.9,66.6,60.9,
                   61.6,64.0,61.5,64.2,66.8,66.4,65.8,71.4,67.8,66.3];
  const n = heights.length;
  const xBar = heights.reduce((s, v) => s + v, 0) / n;
  const s2 = heights.map(v => (v - xBar) ** 2).reduce((a, b) => a + b, 0) / (n - 1);
  const s = Math.sqrt(s2);
  // 95% CI: [x̄ - s*c, x̄ + s*c] where c = 0.3734 (from text)
  const c = 0.3734;
  const ciLo = xBar - s * c, ciHi = xBar + s * c;
  // t-statistic for μ₀=65
  const mu0 = 65;
  const tStat = (xBar - mu0) / (s / Math.sqrt(n));

  const pad = { left: 50, right: 20, top: 35, bot: 40 };
  const pw = W - pad.left - pad.right;
  const ph = H - pad.top - pad.bot;

  const plotMin = 59, plotMax = 73;
  const densXs = linspace(plotMin, plotMax, 200);
  const densYs = densXs.map(x => normalPDF(x, xBar, s));
  const maxDens = Math.max(...densYs);

  const xScale = (v: number) => pad.left + ((v - plotMin) / (plotMax - plotMin)) * pw;
  const yScale = (v: number) => H - pad.bot - (v / (maxDens * 1.1)) * ph;

  const densPath = densXs.map((x, i) => `${i === 0 ? 'M' : 'L'}${xScale(x).toFixed(1)},${yScale(densYs[i]).toFixed(1)}`).join(' ');

  // CI fill
  const ciXs = densXs.filter(x => x >= ciLo && x <= ciHi);
  const ciFill = ciXs.length > 0
    ? `M${xScale(ciLo)},${yScale(0)} ` + ciXs.map(x => `L${xScale(x).toFixed(1)},${yScale(normalPDF(x, xBar, s)).toFixed(1)}`).join(' ') + ` L${xScale(ciHi)},${yScale(0)} Z`
    : '';

  const types: { key: InfType; label: string; color: string }[] = [
    { key: 'estimation', label: 'Estimation', color: SUCCESS },
    { key: 'confidence', label: '95% CI', color: PRIMARY },
    { key: 'hypothesis', label: 'Hypothesis (μ₀=65)', color: WARN },
  ];

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
        <span style={{ color: TEXT, fontSize: '0.8rem', fontWeight: 600 }}>Heights (in) — N(μ, σ²) Model</span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {types.map(t => (
            <button key={t.key} onClick={() => setType(t.key)}
              style={{ ...btnBase, borderColor: type === t.key ? t.color : MUTED, background: type === t.key ? `${t.color}22` : 'transparent', color: type === t.key ? t.color : MUTED }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        <rect width={W} height={H} fill={BG} rx={8} />
        <line x1={pad.left} y1={H-pad.bot} x2={W-pad.right} y2={H-pad.bot} stroke={MUTED} strokeWidth={1} />
        {[60,62,64,66,68,70,72].map(v => (
          <g key={v}>
            <line x1={xScale(v)} y1={H-pad.bot} x2={xScale(v)} y2={H-pad.bot+4} stroke={MUTED} />
            <text x={xScale(v)} y={H-pad.bot+14} textAnchor="middle" fill={MUTED} fontSize={10}>{v}</text>
          </g>
        ))}
        <text x={W/2} y={H-2} textAnchor="middle" fill={MUTED} fontSize={10}>height (inches)</text>

        {/* Data dots at bottom */}
        {heights.map((h, i) => (
          <circle key={i} cx={xScale(h)} cy={H-pad.bot-6} r={2.5} fill={ACCENT} opacity={0.5} />
        ))}

        {/* CI fill */}
        {type === 'confidence' && <path d={ciFill} fill={`${PRIMARY}33`} />}

        {/* Density curve */}
        <path d={densPath} fill="none" stroke={ACCENT} strokeWidth={2} />

        {/* Estimation: x̄ */}
        {type === 'estimation' && (
          <>
            <line x1={xScale(xBar)} y1={yScale(0)} x2={xScale(xBar)} y2={pad.top} stroke={SUCCESS} strokeWidth={2} strokeDasharray="5,3" />
            <text x={xScale(xBar)+4} y={yScale(maxDens*0.6)} fill={SUCCESS} fontSize={11} fontWeight={600}>x̄={xBar.toFixed(2)}</text>
            <text x={W/2} y={pad.top+12} textAnchor="middle" fill={TEXT} fontSize={10}>
              T(x₁,…,xₙ) = x̄ = {xBar.toFixed(3)} estimates population mean μ
            </text>
          </>
        )}

        {/* 95% CI */}
        {type === 'confidence' && (
          <>
            <line x1={xScale(ciLo)} y1={H-pad.bot-6} x2={xScale(ciHi)} y2={H-pad.bot-6} stroke={PRIMARY} strokeWidth={3} />
            <line x1={xScale(ciLo)} y1={H-pad.bot-12} x2={xScale(ciLo)} y2={H-pad.bot} stroke={PRIMARY} strokeWidth={2} />
            <line x1={xScale(ciHi)} y1={H-pad.bot-12} x2={xScale(ciHi)} y2={H-pad.bot} stroke={PRIMARY} strokeWidth={2} />
            <text x={W/2} y={pad.top+12} textAnchor="middle" fill={TEXT} fontSize={10}>
              95% CI: [{ciLo.toFixed(3)}, {ciHi.toFixed(3)}] — half-width {(s*c).toFixed(3)} inches
            </text>
          </>
        )}

        {/* Hypothesis */}
        {type === 'hypothesis' && (
          <>
            <line x1={xScale(mu0)} y1={yScale(0)} x2={xScale(mu0)} y2={pad.top} stroke={WARN} strokeWidth={2} strokeDasharray="5,3" />
            <text x={xScale(mu0)-6} y={yScale(maxDens*0.5)} textAnchor="end" fill={WARN} fontSize={10}>μ₀={mu0}</text>
            <text x={W/2} y={pad.top+12} textAnchor="middle" fill={TEXT} fontSize={10}>
              t = (x̄−μ₀)/(s/√n) = ({xBar.toFixed(2)}−{mu0})/(s/√{n}) = {tStat.toFixed(3)} — plausible
            </text>
          </>
        )}
      </svg>
      <p style={{ color: MUTED, fontSize: '0.72rem', margin: '6px 0 0', textAlign: 'center' }}>
        Three types of inference about the population mean μ from the sample.
      </p>
    </div>
  );
};
