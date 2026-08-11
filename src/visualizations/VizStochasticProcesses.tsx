import React, { useState } from 'react';

const W = 500, H = 220;
const BG = '#0f172a', SURFACE = '#1e293b', PRIMARY = '#38bdf8', ACCENT = '#818cf8';
const SUCCESS = '#34d399', WARN = '#fb923c', TEXT = '#f1f5f9', MUTED = '#64748b', DANGER = '#f87171';

function lcg(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 4294967295; };
}

const SliderRow: React.FC<{ label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string; color?: string }> =
  ({ label, value, min, max, step, onChange, display, color = PRIMARY }) => (
    <label style={{ color: MUTED, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
      {label}: <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))} style={{ width: 110, accentColor: color }} />
      <span style={{ color: TEXT }}>{display}</span>
    </label>
  );

// ── 1. Simple Random Walk — sample fortune paths vs the mean E(Xn)=a+n(2p-1) ──
export const VizRandomWalkFortune: React.FC = () => {
  const [p, setP] = useState(0.45);
  const a = 10, nSteps = 30;
  const seeds = [1, 2, 3, 4, 5];

  const paths = seeds.map(seed => {
    const rnd = lcg(seed * 7919);
    const vals = [a];
    for (let i = 0; i < nSteps; i++) {
      const step = rnd() < p ? 1 : -1;
      vals.push(vals[vals.length - 1] + step);
    }
    return vals;
  });

  const PAD = { l: 34, r: 16, t: 30, b: 34 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const yMin = a - nSteps, yMax = a + nSteps;
  const xS = (n: number) => PAD.l + (n / nSteps) * pw;
  const yS = (v: number) => PAD.t + ph - ((v - yMin) / (yMax - yMin)) * ph;

  const meanPts = Array.from({ length: nSteps + 1 }, (_, n) => `${xS(n).toFixed(1)},${yS(a + n * (2 * p - 1)).toFixed(1)}`).join(' ');

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Simple Random Walk — Fortune X_n vs. Mean E(X_n) = a + n(2p−1)
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <rect x={PAD.l} y={PAD.t} width={pw} height={ph} fill={SURFACE} rx={3} />
        <line x1={PAD.l} y1={yS(0)} x2={PAD.l + pw} y2={yS(0)} stroke={MUTED} strokeWidth={0.7} strokeDasharray="3,3" />
        <line x1={PAD.l} y1={yS(a)} x2={PAD.l + pw} y2={yS(a)} stroke={MUTED} strokeWidth={0.7} />
        {paths.map((vals, i) => (
          <polyline key={i}
            points={vals.map((v, n) => `${xS(n).toFixed(1)},${yS(v).toFixed(1)}`).join(' ')}
            fill="none" stroke={[PRIMARY, ACCENT, WARN, SUCCESS, DANGER][i]} strokeWidth={1.3} opacity={0.65} />
        ))}
        <polyline points={meanPts} fill="none" stroke={TEXT} strokeWidth={2.5} strokeDasharray="6,3" />
        <text x={W / 2} y={18} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">5 Simulated Paths (a=10, p={p.toFixed(2)})</text>
        <text x={PAD.l + pw / 2} y={H - 4} fill={MUTED} fontSize={9} textAnchor="middle">number of bets n</text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
        <SliderRow label="p (win probability)" value={p} min={0.2} max={0.8} step={0.01} onChange={setP} display={p.toFixed(2)} color={ACCENT} />
      </div>
    </div>
  );
};

// ── 2. Gambler's Ruin — extreme sensitivity to p at small vs. large scale ────
export const VizGamblersRuinScale: React.FC = () => {
  const [p, setP] = useState(0.5);
  const q = 1 - p;

  const successProb = (a: number, c: number) => {
    if (p === 0.5) return a / c;
    const ratio = q / p;
    // ln-based computation avoids overflow for large exponents
    const lnR = Math.log(ratio);
    const num = 1 - Math.exp(a * lnR);
    const den = 1 - Math.exp(c * lnR);
    return num / den;
  };

  const smallP = successProb(5, 10);
  const largeP = successProb(5000, 10000);

  const PAD = { l: 20, r: 20, t: 40, b: 30 };
  const panelW = (W - PAD.l - PAD.r - 40) / 2;
  const barMaxH = H - PAD.t - PAD.b;

  const Bar: React.FC<{ x: number; value: number; label: string; color: string }> = ({ x, value, label, color }) => (
    <g>
      <rect x={x} y={PAD.t} width={panelW} height={barMaxH} fill={SURFACE} rx={3} />
      <rect x={x} y={PAD.t + barMaxH * (1 - Math.max(0, Math.min(1, value)))} width={panelW}
        height={barMaxH * Math.max(0, Math.min(1, value))} fill={color} opacity={0.85} rx={3} />
      <text x={x + panelW / 2} y={PAD.t - 8} fill={TEXT} fontSize={10} textAnchor="middle" fontWeight="700">{label}</text>
      <text x={x + panelW / 2} y={PAD.t + barMaxH + 16} fill={color} fontSize={12} textAnchor="middle" fontWeight="700">
        {value < 0.001 ? value.toExponential(2) : value.toFixed(4)}
      </text>
    </g>
  );

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        P(reach c before 0) — same a/c ratio (1/2), two different scales
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <Bar x={PAD.l} value={smallP} label="a=5, c=10" color={PRIMARY} />
        <Bar x={PAD.l + panelW + 40} value={largeP} label="a=5000, c=10000" color={WARN} />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
        <SliderRow label="p (win probability)" value={p} min={0.49} max={0.51} step={0.0005} onChange={setP} display={p.toFixed(4)} color={ACCENT} />
      </div>
    </div>
  );
};

// ── 3. Markov Chain — distribution v_n = v_0 A^n over n steps ────────────────
export const VizMarkovChainSteps: React.FC = () => {
  const [n, setN] = useState(0);
  // Example 11.2.1's transition matrix
  const P = [
    [0, 0.5, 0.5],
    [1 / 3, 1 / 3, 1 / 3],
    [0.25, 0.25, 0.5],
  ];

  let v = [1, 0, 0];
  for (let step = 0; step < n; step++) {
    const next = [0, 0, 0];
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) next[j] += v[i] * P[i][j];
    }
    v = next;
  }

  const PAD = { l: 30, r: 16, t: 30, b: 34 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const barW = pw / 3 * 0.5;
  const xC = (i: number) => PAD.l + pw * (i + 0.5) / 3;
  const yS = (val: number) => PAD.t + ph - val * ph;

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Distribution v_n after n steps, starting at state 1
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <rect x={PAD.l} y={PAD.t} width={pw} height={ph} fill={SURFACE} rx={3} />
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <line key={t} x1={PAD.l} y1={yS(t)} x2={PAD.l + pw} y2={yS(t)} stroke={BG} strokeWidth={1} />
        ))}
        {v.map((val, i) => (
          <g key={i}>
            <rect x={xC(i) - barW / 2} y={yS(val)} width={barW} height={ph - (yS(val) - PAD.t)}
              fill={[PRIMARY, ACCENT, WARN][i]} opacity={0.85} rx={2} />
            <text x={xC(i)} y={yS(val) - 6} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">{val.toFixed(3)}</text>
            <text x={xC(i)} y={PAD.t + ph + 14} fill={MUTED} fontSize={9} textAnchor="middle">state {i + 1}</text>
          </g>
        ))}
        <text x={W / 2} y={18} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">n = {n} step{n === 1 ? '' : 's'}</text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
        <SliderRow label="steps n" value={n} min={0} max={20} step={1} onChange={setN} display={String(n)} color={ACCENT} />
      </div>
    </div>
  );
};

// ── 4. Stationary Distribution — verifying the balance equations ────────────
export const VizStationaryBalance: React.FC = () => {
  // Example 11.2.16's chain and its stationary distribution (2/11, 3/11, 6/11)
  const P = [
    [0.5, 0.25, 0.25],
    [1 / 3, 1 / 3, 1 / 3],
    [0, 0.25, 0.75],
  ];
  const pi = [2 / 11, 3 / 11, 6 / 11];
  const piNext = [0, 0, 0];
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) piNext[j] += pi[i] * P[i][j];
  }

  const PAD = { l: 30, r: 16, t: 34, b: 34 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const groupW = pw / 3;
  const yS = (val: number) => PAD.t + ph - val * ph;

  return (
    <svg width={W} height={H} style={{ background: BG, borderRadius: 8, display: 'block', maxWidth: '100%' }}>
      <rect x={PAD.l} y={PAD.t} width={pw} height={ph} fill={SURFACE} rx={3} />
      {[0, 0.2, 0.4, 0.6] .map(t => (
        <line key={t} x1={PAD.l} y1={yS(t)} x2={PAD.l + pw} y2={yS(t)} stroke={BG} strokeWidth={1} />
      ))}
      {pi.map((val, i) => {
        const cx = PAD.l + groupW * (i + 0.5);
        return (
          <g key={i}>
            <rect x={cx - 20} y={yS(val)} width={16} height={ph - (yS(val) - PAD.t)} fill={PRIMARY} opacity={0.85} rx={2} />
            <rect x={cx + 4} y={yS(piNext[i])} width={16} height={ph - (yS(piNext[i]) - PAD.t)} fill={SUCCESS} opacity={0.85} rx={2} />
            <text x={cx} y={PAD.t + ph + 14} fill={MUTED} fontSize={9} textAnchor="middle">π_{i + 1}={val.toFixed(3)}</text>
          </g>
        );
      })}
      <text x={W / 2} y={18} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">π (blue) vs. Σᵢ πᵢpᵢⱼ (green) — they match exactly</text>
      <rect x={PAD.l + 5} y={PAD.t + 5} width={10} height={8} fill={PRIMARY} opacity={0.85} rx={1} />
      <text x={PAD.l + 19} y={PAD.t + 13} fill={MUTED} fontSize={8}>π_j</text>
      <rect x={PAD.l + 55} y={PAD.t + 5} width={10} height={8} fill={SUCCESS} opacity={0.85} rx={1} />
      <text x={PAD.l + 69} y={PAD.t + 13} fill={MUTED} fontSize={8}>Σᵢ πᵢpᵢⱼ</text>
    </svg>
  );
};

// ── 5. Metropolis-Hastings — trace and histogram converging to the target ────
export const VizMetropolisHastings: React.FC = () => {
  const [n, setN] = useState(200);
  const states = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  // Unnormalized bimodal target: two bumps, at -2 and 2.
  const target = (s: number) => Math.exp(-0.3 * (s + 2) ** 2) + 0.7 * Math.exp(-0.3 * (s - 2) ** 2);

  const rnd = lcg(42);
  let x = 0;
  const trace: number[] = [x];
  const counts: Record<number, number> = Object.fromEntries(states.map(s => [s, 0]));
  counts[x] += 1;
  for (let i = 0; i < n; i++) {
    const propose = rnd() < 0.5 ? x - 1 : x + 1;
    if (propose >= -4 && propose <= 4) {
      const alpha = Math.min(1, target(propose) / target(x));
      if (rnd() < alpha) x = propose;
    }
    trace.push(x);
    counts[x] += 1;
  }

  const PAD = { l: 30, r: 16, t: 30, b: 30 };
  const pw = W - PAD.l - PAD.r, ph = (H - PAD.t - PAD.b - 10) / 2;

  // Trace plot (top half)
  const traceXS = (i: number) => PAD.l + (i / n) * pw;
  const traceYS = (s: number) => PAD.t + ph - ((s + 4) / 8) * ph;
  const tracePts = trace.map((s, i) => `${traceXS(i).toFixed(1)},${traceYS(s).toFixed(1)}`).join(' ');

  // Histogram (bottom half)
  const histY0 = PAD.t + ph + 10;
  const maxCount = Math.max(...Object.values(counts));
  const barW = pw / states.length * 0.7;
  const barXC = (s: number) => PAD.l + pw * (s + 4.5) / 9;

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Metropolis–Hastings: Trace (top) and Visited-State Histogram (bottom)
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <rect x={PAD.l} y={PAD.t} width={pw} height={ph} fill={SURFACE} rx={3} />
        <polyline points={tracePts} fill="none" stroke={PRIMARY} strokeWidth={1} opacity={0.85} />
        <rect x={PAD.l} y={histY0} width={pw} height={ph} fill={SURFACE} rx={3} />
        {states.map(s => {
          const h = (counts[s] / maxCount) * ph;
          return (
            <rect key={s} x={barXC(s) - barW / 2} y={histY0 + ph - h} width={barW} height={h} fill={ACCENT} opacity={0.85} rx={1} />
          );
        })}
        <text x={W / 2} y={18} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">n = {n} iterations</text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
        <SliderRow label="iterations n" value={n} min={10} max={2000} step={10} onChange={setN} display={String(n)} color={ACCENT} />
      </div>
    </div>
  );
};

// ── 6. Martingale + Optional Stopping — average stays at the starting value ──
export const VizMartingaleStopping: React.FC = () => {
  const [numPaths, setNumPaths] = useState(50);
  const a = 10, r = 0, s = 20;

  const finals: number[] = [];
  for (let i = 0; i < numPaths; i++) {
    const rnd = lcg(1000 + i * 37);
    let x = a;
    let guard = 0;
    while (x > r && x < s && guard < 5000) {
      x += rnd() < 0.5 ? 1 : -1;
      guard++;
    }
    finals.push(x);
  }
  const avgFinal = finals.reduce((acc, v) => acc + v, 0) / finals.length;
  const fracHitS = finals.filter(v => v === s).length / finals.length;

  const PAD = { l: 30, r: 16, t: 34, b: 34 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const yS = (v: number) => PAD.t + ph - ((v - r) / (s - r)) * ph;

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Optional Stopping: average of X_T across simulated paths
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <rect x={PAD.l} y={PAD.t} width={pw} height={ph} fill={SURFACE} rx={3} />
        <line x1={PAD.l} y1={yS(a)} x2={PAD.l + pw} y2={yS(a)} stroke={TEXT} strokeWidth={2} strokeDasharray="6,3" />
        <line x1={PAD.l} y1={yS(avgFinal)} x2={PAD.l + pw} y2={yS(avgFinal)} stroke={SUCCESS} strokeWidth={2} />
        <line x1={PAD.l} y1={yS(r)} x2={PAD.l + pw} y2={yS(r)} stroke={DANGER} strokeWidth={1} strokeDasharray="3,3" />
        <line x1={PAD.l} y1={yS(s)} x2={PAD.l + pw} y2={yS(s)} stroke={SUCCESS} strokeWidth={1} strokeDasharray="3,3" />
        {finals.map((v, i) => (
          <circle key={i} cx={PAD.l + 6 + (i / numPaths) * (pw - 12)} cy={yS(v)} r={2} fill={v === s ? SUCCESS : DANGER} opacity={0.6} />
        ))}
        <text x={W / 2} y={18} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">
          avg X_T = {avgFinal.toFixed(2)} (dashed white = a={a}) · {(fracHitS * 100).toFixed(0)}% hit {s}
        </text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
        <SliderRow label="simulated paths" value={numPaths} min={5} max={200} step={5} onChange={setNumPaths} display={String(numPaths)} color={ACCENT} />
      </div>
    </div>
  );
};

// ── 7. Brownian Motion — a sample path and N(0,t) spread ─────────────────────
export const VizBrownianMotion: React.FC = () => {
  const [t, setT] = useState(10);
  const rnd = lcg(99);
  const steps = 400;
  const path: number[] = [0];
  for (let i = 1; i <= steps; i++) {
    const dt = t / steps;
    const z = Math.sqrt(-2 * Math.log(Math.max(rnd(), 1e-9))) * Math.cos(2 * Math.PI * rnd());
    path.push(path[i - 1] + Math.sqrt(dt) * z);
  }

  const PAD = { l: 34, r: 40, t: 30, b: 34 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const sd = Math.sqrt(t);
  const yMax = Math.max(3 * sd, 2);
  const xS = (i: number) => PAD.l + (i / steps) * pw;
  const yS = (v: number) => PAD.t + ph / 2 - (v / yMax) * (ph / 2);

  const pathPts = path.map((v, i) => `${xS(i).toFixed(1)},${yS(v).toFixed(1)}`).join(' ');

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        A Sample Path of Brownian Motion — B_t ~ N(0, t)
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <rect x={PAD.l} y={PAD.t} width={pw} height={ph} fill={SURFACE} rx={3} />
        <line x1={PAD.l} y1={yS(0)} x2={PAD.l + pw} y2={yS(0)} stroke={MUTED} strokeWidth={0.7} />
        <line x1={PAD.l} y1={yS(sd)} x2={PAD.l + pw} y2={yS(sd)} stroke={MUTED} strokeWidth={0.6} strokeDasharray="3,3" />
        <line x1={PAD.l} y1={yS(-sd)} x2={PAD.l + pw} y2={yS(-sd)} stroke={MUTED} strokeWidth={0.6} strokeDasharray="3,3" />
        <polyline points={pathPts} fill="none" stroke={PRIMARY} strokeWidth={1.5} />
        <circle cx={xS(steps)} cy={yS(path[steps])} r={4} fill={WARN} />
        <text x={PAD.l + pw + 6} y={yS(sd) + 3} fill={MUTED} fontSize={8}>+√t</text>
        <text x={PAD.l + pw + 6} y={yS(-sd) + 3} fill={MUTED} fontSize={8}>−√t</text>
        <text x={W / 2} y={18} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">
          t = {t} · B_t = {path[steps].toFixed(2)} · sd = √t = {sd.toFixed(2)}
        </text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
        <SliderRow label="time horizon t" value={t} min={1} max={40} step={1} onChange={setT} display={String(t)} color={ACCENT} />
      </div>
    </div>
  );
};

// ── 8. Poisson Process — event arrivals over time ────────────────────────────
export const VizPoissonProcess: React.FC = () => {
  const [rate, setRate] = useState(2);
  const horizon = 10;
  const rnd = lcg(55);
  const arrivals: number[] = [];
  let tCur = 0;
  while (tCur < horizon) {
    const r = -Math.log(Math.max(rnd(), 1e-9)) / rate;
    tCur += r;
    if (tCur < horizon) arrivals.push(tCur);
  }

  const PAD = { l: 34, r: 16, t: 30, b: 34 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const xS = (tv: number) => PAD.l + (tv / horizon) * pw;
  const maxN = Math.max(arrivals.length, 1);
  const yS = (n: number) => PAD.t + ph - (n / maxN) * ph;

  const stepPts: string[] = [`${xS(0)},${yS(0)}`];
  arrivals.forEach((tv, i) => {
    stepPts.push(`${xS(tv)},${yS(i)}`);
    stepPts.push(`${xS(tv)},${yS(i + 1)}`);
  });
  stepPts.push(`${xS(horizon)},${yS(arrivals.length)}`);

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Poisson Process — Event Arrivals and the Count N_t
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <rect x={PAD.l} y={PAD.t} width={pw} height={ph} fill={SURFACE} rx={3} />
        <polyline points={stepPts.join(' ')} fill="none" stroke={PRIMARY} strokeWidth={2} />
        {arrivals.map((tv, i) => (
          <circle key={i} cx={xS(tv)} cy={PAD.t + ph + 8} r={2.6} fill={WARN} />
        ))}
        <text x={W / 2} y={18} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">
          {arrivals.length} events by t={horizon} (rate a={rate}/unit time)
        </text>
        <text x={PAD.l + pw / 2} y={H - 4} fill={MUTED} fontSize={9} textAnchor="middle">time t (dots = individual event arrivals)</text>
        <text x={9} y={PAD.t + ph / 2} fill={MUTED} fontSize={9} textAnchor="middle" transform={`rotate(-90,9,${PAD.t + ph / 2})`}>N_t</text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
        <SliderRow label="intensity a" value={rate} min={0.5} max={6} step={0.5} onChange={setRate} display={rate.toFixed(1)} color={ACCENT} />
      </div>
    </div>
  );
};
