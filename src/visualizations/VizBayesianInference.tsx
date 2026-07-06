import React, { useState } from 'react';

const W = 500, H = 220;
const BG = '#0f172a';
const SURFACE = '#1e293b';
const PRIMARY = '#38bdf8';
const ACCENT = '#818cf8';
const SUCCESS = '#34d399';
const WARN = '#fb923c';
const TEXT = '#f1f5f9';
const MUTED = '#64748b';

function lcg(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 4294967295; };
}

function normalPDF(x: number, mu: number, sigma: number): number {
  return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

function betaUnnorm(x: number, a: number, b: number): number {
  if (x <= 0 || x >= 1) return 0;
  return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x));
}

function logBinom(n: number, k: number): number {
  if (k < 0 || k > n) return -Infinity;
  let r = 0;
  for (let i = 0; i < k; i++) r += Math.log(n - i) - Math.log(i + 1);
  return r;
}

// ── 1. Prior & Posterior (Beta-Bernoulli) ─────────────────────────────────
export const VizPriorPosterior: React.FC = () => {
  const [s, setS] = useState(8);
  const [alpha, setAlpha] = useState(2);
  const [beta, setBeta] = useState(2);
  const n = 20;
  const aPost = alpha + s;
  const bPost = beta + (n - s);

  const PAD = { l: 44, r: 16, t: 36, b: 36 };
  const pw = W - PAD.l - PAD.r;
  const ph = H - PAD.t - PAD.b;

  const NGRID = 200;
  const step = 1 / NGRID;
  const grid = Array.from({ length: NGRID + 1 }, (_, i) => i / NGRID);

  const priorVals = grid.map(x => betaUnnorm(x, alpha, beta));
  const postVals  = grid.map(x => betaUnnorm(x, aPost, bPost));
  const priorInt  = priorVals.reduce((s, v) => s + v * step, 0) || 1;
  const postInt   = postVals.reduce((s, v) => s + v * step, 0) || 1;
  const priorDens = priorVals.map(v => v / priorInt);
  const postDens  = postVals.map(v => v / postInt);
  const maxDens   = Math.max(...priorDens, ...postDens, 0.01);

  const xS = (t: number) => PAD.l + t * pw;
  const yS = (d: number) => PAD.t + ph - (d / maxDens) * ph;

  const priorPath = grid.map((x, i) => `${i === 0 ? 'M' : 'L'}${xS(x).toFixed(1)},${yS(priorDens[i]).toFixed(1)}`).join('');
  const postPath  = grid.map((x, i) => `${i === 0 ? 'M' : 'L'}${xS(x).toFixed(1)},${yS(postDens[i]).toFixed(1)}`).join('');

  const postMode  = aPost > 1 && bPost > 1 ? (aPost - 1) / (aPost + bPost - 2) : 0;
  const postMean  = aPost / (aPost + bPost);

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Beta–Bernoulli Update · Prior Beta({alpha},{beta}) → Posterior Beta({aPost},{bPost})
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        <line x1={PAD.l} y1={PAD.t + ph} x2={PAD.l + pw} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        {[0, 0.25, 0.5, 0.75, 1].map(v => (
          <g key={v}>
            <line x1={xS(v)} y1={PAD.t + ph} x2={xS(v)} y2={PAD.t + ph + 4} stroke={MUTED} strokeWidth={1} />
            <text x={xS(v)} y={PAD.t + ph + 14} textAnchor="middle" fill={MUTED} fontSize={10}>{v}</text>
          </g>
        ))}
        <text x={PAD.l + pw / 2} y={H - 2} textAnchor="middle" fill={MUTED} fontSize={10}>θ</text>
        <path d={priorPath} fill="none" stroke={ACCENT} strokeWidth={2} strokeDasharray="5,3" />
        <path d={postPath}  fill="none" stroke={SUCCESS} strokeWidth={2} />
        {/* posterior mode */}
        <line x1={xS(postMode)} y1={PAD.t + 2} x2={xS(postMode)} y2={PAD.t + ph} stroke={SUCCESS} strokeWidth={1} strokeDasharray="3,3" />
        <text x={xS(postMode)} y={PAD.t + 12} textAnchor="middle" fill={SUCCESS} fontSize={9}>mode={postMode.toFixed(2)}</text>
        {/* posterior mean */}
        <line x1={xS(postMean)} y1={PAD.t + 2} x2={xS(postMean)} y2={PAD.t + ph} stroke={WARN} strokeWidth={1} strokeDasharray="3,3" />
        <text x={xS(postMean)} y={PAD.t + 22} textAnchor="middle" fill={WARN} fontSize={9}>mean={postMean.toFixed(2)}</text>
        {/* MLE */}
        <line x1={xS(s / n)} y1={PAD.t + 2} x2={xS(s / n)} y2={PAD.t + ph} stroke={PRIMARY} strokeWidth={1} strokeDasharray="2,4" opacity={0.7} />
        <text x={xS(s / n)} y={PAD.t + 32} textAnchor="middle" fill={PRIMARY} fontSize={9}>MLE={( s/n).toFixed(2)}</text>
        {/* legend */}
        <rect x={PAD.l + 4} y={PAD.t + 4} width={120} height={30} rx={3} fill={SURFACE} opacity={0.9} />
        <line x1={PAD.l + 10} y1={PAD.t + 14} x2={PAD.l + 24} y2={PAD.t + 14} stroke={ACCENT} strokeWidth={2} strokeDasharray="4,2" />
        <text x={PAD.l + 28} y={PAD.t + 17} fill={ACCENT} fontSize={9}>Prior</text>
        <line x1={PAD.l + 10} y1={PAD.t + 27} x2={PAD.l + 24} y2={PAD.t + 27} stroke={SUCCESS} strokeWidth={2} />
        <text x={PAD.l + 28} y={PAD.t + 30} fill={SUCCESS} fontSize={9}>Posterior</text>
        <text x={10} y={PAD.t + ph / 2} textAnchor="middle" fill={MUTED} fontSize={9}
          transform={`rotate(-90,10,${PAD.t + ph / 2})`}>density</text>
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6, justifyContent: 'center' }}>
        <label style={{ color: MUTED, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          Successes s: <input type="range" min={0} max={n} step={1} value={s}
            onChange={e => setS(Number(e.target.value))} style={{ width: 100, accentColor: SUCCESS }} />
          <span style={{ color: TEXT }}>{s}/{n}</span>
        </label>
        <label style={{ color: MUTED, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          α: <input type="range" min={1} max={10} step={1} value={alpha}
            onChange={e => setAlpha(Number(e.target.value))} style={{ width: 80, accentColor: ACCENT }} />
          <span style={{ color: TEXT }}>{alpha}</span>
        </label>
        <label style={{ color: MUTED, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          β: <input type="range" min={1} max={10} step={1} value={beta}
            onChange={e => setBeta(Number(e.target.value))} style={{ width: 80, accentColor: ACCENT }} />
          <span style={{ color: TEXT }}>{beta}</span>
        </label>
      </div>
    </div>
  );
};

// ── 2. Normal–Normal Conjugate Update ─────────────────────────────────────
export const VizNormalNormalUpdate: React.FC = () => {
  const [xbar, setXbar] = useState(1.5);
  const [n, setN] = useState(5);

  const mu0 = 0, tau0sq = 4, sigmasq = 1;
  const tau0 = Math.sqrt(tau0sq);
  // posterior precision
  const precPost = 1 / tau0sq + n / sigmasq;
  const tau1sq   = 1 / precPost;
  const tau1     = Math.sqrt(tau1sq);
  const mu1      = (mu0 / tau0sq + n * xbar / sigmasq) / precPost;

  const PAD = { l: 44, r: 16, t: 28, b: 36 };
  const pw = W - PAD.l - PAD.r;
  const ph = H - PAD.t - PAD.b;

  const xMin = -8, xMax = 8;
  const xS = (v: number) => PAD.l + (v - xMin) / (xMax - xMin) * pw;
  const NGRID = 200;
  const pts = Array.from({ length: NGRID + 1 }, (_, i) => xMin + (xMax - xMin) * i / NGRID);

  const priorVals  = pts.map(x => normalPDF(x, mu0, tau0));
  const postVals   = pts.map(x => normalPDF(x, mu1, tau1));
  const likeVals   = pts.map(x => normalPDF(x, xbar, Math.sqrt(sigmasq / n)));
  const maxPDF     = Math.max(...priorVals, ...postVals, ...likeVals, 0.01);
  const yS = (p: number) => PAD.t + ph - (p / maxPDF) * ph;

  const mkPath = (vals: number[]) =>
    pts.map((x, i) => `${i === 0 ? 'M' : 'L'}${xS(x).toFixed(1)},${yS(vals[i]).toFixed(1)}`).join('');

  const ticks = [-6, -4, -2, 0, 2, 4, 6];

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Normal–Normal Conjugate Update · Posterior N({mu1.toFixed(2)}, {tau1sq.toFixed(3)})
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <line x1={PAD.l} y1={PAD.t + ph} x2={PAD.l + pw} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        {ticks.filter(v => v >= xMin && v <= xMax).map(v => (
          <g key={v}>
            <line x1={xS(v)} y1={PAD.t + ph} x2={xS(v)} y2={PAD.t + ph + 4} stroke={MUTED} strokeWidth={1} />
            <text x={xS(v)} y={PAD.t + ph + 14} textAnchor="middle" fill={MUTED} fontSize={10}>{v}</text>
          </g>
        ))}
        <text x={PAD.l + pw / 2} y={H - 2} textAnchor="middle" fill={MUTED} fontSize={10}>μ</text>
        <path d={mkPath(priorVals)}  fill="none" stroke={ACCENT}  strokeWidth={2} strokeDasharray="5,3" />
        <path d={mkPath(likeVals)}   fill="none" stroke={WARN}    strokeWidth={1.5} strokeDasharray="3,3" opacity={0.8} />
        <path d={mkPath(postVals)}   fill="none" stroke={SUCCESS}  strokeWidth={2} />
        {/* posterior mean */}
        <line x1={xS(mu1)} y1={PAD.t + 2} x2={xS(mu1)} y2={PAD.t + ph} stroke={SUCCESS} strokeWidth={1.5} strokeDasharray="3,3" />
        <text x={xS(mu1)} y={PAD.t + 14} textAnchor="middle" fill={SUCCESS} fontSize={9}>μ₁={mu1.toFixed(2)}</text>
        {/* prior mean */}
        <line x1={xS(mu0)} y1={PAD.t + 2} x2={xS(mu0)} y2={PAD.t + ph} stroke={ACCENT} strokeWidth={1} strokeDasharray="2,4" opacity={0.6} />
        <text x={xS(mu0)} y={PAD.t + 24} textAnchor="middle" fill={ACCENT} fontSize={9}>μ₀={mu0}</text>
        {/* likelihood peak = xbar */}
        <line x1={xS(xbar)} y1={PAD.t + 2} x2={xS(xbar)} y2={PAD.t + ph} stroke={WARN} strokeWidth={1} strokeDasharray="2,4" opacity={0.7} />
        <text x={xS(xbar)} y={PAD.t + 34} textAnchor="middle" fill={WARN} fontSize={9}>x̄={xbar.toFixed(1)}</text>
        {/* legend */}
        <rect x={PAD.l + pw - 106} y={PAD.t + 2} width={102} height={44} rx={3} fill={SURFACE} opacity={0.9} />
        <line x1={PAD.l + pw - 100} y1={PAD.t + 12} x2={PAD.l + pw - 86} y2={PAD.t + 12} stroke={ACCENT} strokeWidth={2} strokeDasharray="4,2" />
        <text x={PAD.l + pw - 82} y={PAD.t + 15} fill={ACCENT} fontSize={9}>Prior</text>
        <line x1={PAD.l + pw - 100} y1={PAD.t + 24} x2={PAD.l + pw - 86} y2={PAD.t + 24} stroke={WARN} strokeWidth={1.5} strokeDasharray="2,2" />
        <text x={PAD.l + pw - 82} y={PAD.t + 27} fill={WARN} fontSize={9}>Likelihood</text>
        <line x1={PAD.l + pw - 100} y1={PAD.t + 36} x2={PAD.l + pw - 86} y2={PAD.t + 36} stroke={SUCCESS} strokeWidth={2} />
        <text x={PAD.l + pw - 82} y={PAD.t + 39} fill={SUCCESS} fontSize={9}>Posterior</text>
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6, justifyContent: 'center' }}>
        <label style={{ color: MUTED, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          x̄: <input type="range" min={-4} max={4} step={0.1} value={xbar}
            onChange={e => setXbar(Number(e.target.value))} style={{ width: 100, accentColor: WARN }} />
          <span style={{ color: TEXT }}>{xbar.toFixed(1)}</span>
        </label>
        <label style={{ color: MUTED, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          n: <input type="range" min={1} max={30} step={1} value={n}
            onChange={e => setN(Number(e.target.value))} style={{ width: 100, accentColor: PRIMARY }} />
          <span style={{ color: TEXT }}>{n}</span>
        </label>
      </div>
    </div>
  );
};

// ── 3. Bayesian Point Estimation (Beta posterior) ─────────────────────────
export const VizBayesianEstimation: React.FC = () => {
  const [alpha, setAlpha] = useState(4);
  const [beta, setBeta] = useState(6);

  const PAD = { l: 44, r: 16, t: 36, b: 36 };
  const pw = W - PAD.l - PAD.r;
  const ph = H - PAD.t - PAD.b;

  const NGRID = 200;
  const step = 1 / NGRID;
  const grid = Array.from({ length: NGRID + 1 }, (_, i) => i / NGRID);
  const vals = grid.map(x => betaUnnorm(x, alpha, beta));
  const integral = vals.reduce((s, v) => s + v * step, 0) || 1;
  const dens = vals.map(v => v / integral);
  const maxD = Math.max(...dens, 0.01);

  const xS = (t: number) => PAD.l + t * pw;
  const yS = (d: number) => PAD.t + ph - (d / maxD) * ph;

  const mode = alpha > 1 && beta > 1 ? (alpha - 1) / (alpha + beta - 2) : alpha <= 1 ? 0 : 1;
  const mean = alpha / (alpha + beta);
  const med  = (alpha - 1 / 3) / (alpha + beta - 2 / 3);

  const curvePath = grid.map((x, i) => `${i === 0 ? 'M' : 'L'}${xS(x).toFixed(1)},${yS(dens[i]).toFixed(1)}`).join('');
  const fillPath  = `${curvePath} L${xS(1).toFixed(1)},${yS(0).toFixed(1)} L${xS(0).toFixed(1)},${yS(0).toFixed(1)} Z`;

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Beta({alpha},{beta}) Posterior · Mode vs Mean vs Median
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        <line x1={PAD.l} y1={PAD.t + ph} x2={PAD.l + pw} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        {[0, 0.25, 0.5, 0.75, 1].map(v => (
          <g key={v}>
            <line x1={xS(v)} y1={PAD.t + ph} x2={xS(v)} y2={PAD.t + ph + 4} stroke={MUTED} strokeWidth={1} />
            <text x={xS(v)} y={PAD.t + ph + 14} textAnchor="middle" fill={MUTED} fontSize={10}>{v}</text>
          </g>
        ))}
        <text x={PAD.l + pw / 2} y={H - 2} textAnchor="middle" fill={MUTED} fontSize={10}>θ</text>
        <path d={fillPath} fill={PRIMARY} opacity={0.08} />
        <path d={curvePath} fill="none" stroke={PRIMARY} strokeWidth={2} />
        <line x1={xS(mode)} y1={PAD.t + 2} x2={xS(mode)} y2={PAD.t + ph} stroke={WARN} strokeWidth={1.5} strokeDasharray="4,3" />
        <text x={xS(mode)} y={PAD.t + 14} textAnchor="middle" fill={WARN} fontSize={9}>Mode={mode.toFixed(3)}</text>
        <line x1={xS(mean)} y1={PAD.t + 2} x2={xS(mean)} y2={PAD.t + ph} stroke={SUCCESS} strokeWidth={1.5} strokeDasharray="4,3" />
        <text x={xS(mean)} y={PAD.t + 26} textAnchor="middle" fill={SUCCESS} fontSize={9}>Mean={mean.toFixed(3)}</text>
        <line x1={xS(med)} y1={PAD.t + 2} x2={xS(med)} y2={PAD.t + ph} stroke={ACCENT} strokeWidth={1} strokeDasharray="3,3" />
        <text x={xS(med)} y={PAD.t + 38} textAnchor="middle" fill={ACCENT} fontSize={9}>Med≈{med.toFixed(3)}</text>
        <text x={10} y={PAD.t + ph / 2} textAnchor="middle" fill={MUTED} fontSize={9}
          transform={`rotate(-90,10,${PAD.t + ph / 2})`}>π(θ|s)</text>
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6, justifyContent: 'center' }}>
        <label style={{ color: MUTED, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          α: <input type="range" min={1} max={20} step={1} value={alpha}
            onChange={e => setAlpha(Number(e.target.value))} style={{ width: 100, accentColor: WARN }} />
          <span style={{ color: TEXT }}>{alpha}</span>
        </label>
        <label style={{ color: MUTED, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          β: <input type="range" min={1} max={20} step={1} value={beta}
            onChange={e => setBeta(Number(e.target.value))} style={{ width: 100, accentColor: ACCENT }} />
          <span style={{ color: TEXT }}>{beta}</span>
        </label>
      </div>
    </div>
  );
};

// ── 4. HPD Credible Interval ───────────────────────────────────────────────
export const VizCredibleInterval: React.FC = () => {
  const [alpha, setAlpha] = useState(5);
  const [beta, setBeta]   = useState(12);
  const [gamma, setGamma] = useState(0.95);

  const PAD = { l: 44, r: 16, t: 28, b: 36 };
  const pw = W - PAD.l - PAD.r;
  const ph = H - PAD.t - PAD.b;

  const NGRID = 400;
  const step  = 1 / NGRID;
  const grid  = Array.from({ length: NGRID + 1 }, (_, i) => i / NGRID);
  const vals  = grid.map(x => betaUnnorm(x, alpha, beta));
  const intgr = vals.reduce((s, v) => s + v * step, 0) || 1;
  const dens  = vals.map(v => v / intgr);
  const maxD  = Math.max(...dens, 0.01);

  // Binary search for HPD level c
  let lo = 0, hi = maxD, cLevel = 0;
  for (let iter = 0; iter < 60; iter++) {
    cLevel = (lo + hi) / 2;
    const mass = dens.reduce((s, d) => d >= cLevel ? s + d * step : s, 0);
    if (mass > gamma) lo = cLevel; else hi = cLevel;
  }
  const hpdIndices = dens.map((d, i) => d >= cLevel ? i : -1).filter(i => i >= 0);
  const hpdLo = hpdIndices.length > 0 ? hpdIndices[0] / NGRID : 0;
  const hpdHi = hpdIndices.length > 0 ? hpdIndices[hpdIndices.length - 1] / NGRID : 1;

  const xS = (t: number) => PAD.l + t * pw;
  const yS = (d: number) => PAD.t + ph - (d / maxD) * ph;

  const curvePath = grid.map((x, i) => `${i === 0 ? 'M' : 'L'}${xS(x).toFixed(1)},${yS(dens[i]).toFixed(1)}`).join('');
  const hpdPts = grid.filter((_, i) => dens[i] >= cLevel);
  const hpdPath = hpdPts.length > 1
    ? hpdPts.map((x, i) => `${i === 0 ? 'M' : 'L'}${xS(x).toFixed(1)},${yS(dens[grid.indexOf(x)]).toFixed(1)}`).join('')
    + ` L${xS(hpdHi).toFixed(1)},${yS(0).toFixed(1)} L${xS(hpdLo).toFixed(1)},${yS(0).toFixed(1)} Z`
    : '';

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        {(gamma * 100).toFixed(0)}% HPD Credible Interval for Beta({alpha},{beta}): [{hpdLo.toFixed(3)}, {hpdHi.toFixed(3)}]
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <line x1={PAD.l} y1={PAD.t + ph} x2={PAD.l + pw} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        {[0, 0.25, 0.5, 0.75, 1].map(v => (
          <g key={v}>
            <line x1={xS(v)} y1={PAD.t + ph} x2={xS(v)} y2={PAD.t + ph + 4} stroke={MUTED} strokeWidth={1} />
            <text x={xS(v)} y={PAD.t + ph + 14} textAnchor="middle" fill={MUTED} fontSize={10}>{v}</text>
          </g>
        ))}
        <text x={PAD.l + pw / 2} y={H - 2} textAnchor="middle" fill={MUTED} fontSize={10}>θ</text>
        {hpdPath && <path d={hpdPath} fill={SUCCESS} opacity={0.25} />}
        {/* HPD level line */}
        <line x1={PAD.l} y1={yS(cLevel)} x2={PAD.l + pw} y2={yS(cLevel)} stroke={SUCCESS} strokeWidth={1} strokeDasharray="3,3" opacity={0.7} />
        <text x={PAD.l + 4} y={yS(cLevel) - 3} fill={SUCCESS} fontSize={9}>c={cLevel.toFixed(2)}</text>
        <path d={curvePath} fill="none" stroke={PRIMARY} strokeWidth={2} />
        {/* HPD bounds */}
        <line x1={xS(hpdLo)} y1={PAD.t + 2} x2={xS(hpdLo)} y2={PAD.t + ph} stroke={SUCCESS} strokeWidth={1.5} />
        <line x1={xS(hpdHi)} y1={PAD.t + 2} x2={xS(hpdHi)} y2={PAD.t + ph} stroke={SUCCESS} strokeWidth={1.5} />
        <text x={(xS(hpdLo) + xS(hpdHi)) / 2} y={PAD.t + 14} textAnchor="middle" fill={SUCCESS} fontSize={10}>
          {(gamma * 100).toFixed(0)}% HPD = [{hpdLo.toFixed(2)}, {hpdHi.toFixed(2)}]
        </text>
        <text x={10} y={PAD.t + ph / 2} textAnchor="middle" fill={MUTED} fontSize={9}
          transform={`rotate(-90,10,${PAD.t + ph / 2})`}>π(θ|s)</text>
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6, justifyContent: 'center' }}>
        <label style={{ color: MUTED, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          α: <input type="range" min={1} max={20} step={1} value={alpha}
            onChange={e => setAlpha(Number(e.target.value))} style={{ width: 80, accentColor: PRIMARY }} />
          <span style={{ color: TEXT }}>{alpha}</span>
        </label>
        <label style={{ color: MUTED, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          β: <input type="range" min={1} max={20} step={1} value={beta}
            onChange={e => setBeta(Number(e.target.value))} style={{ width: 80, accentColor: PRIMARY }} />
          <span style={{ color: TEXT }}>{beta}</span>
        </label>
        <label style={{ color: MUTED, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          γ: <input type="range" min={0.50} max={0.99} step={0.01} value={gamma}
            onChange={e => setGamma(Number(e.target.value))} style={{ width: 80, accentColor: SUCCESS }} />
          <span style={{ color: TEXT }}>{(gamma * 100).toFixed(0)}%</span>
        </label>
      </div>
    </div>
  );
};

// ── 5. Bayes Factor ────────────────────────────────────────────────────────
export const VizBayesFactor: React.FC = () => {
  const [nObs, setNObs] = useState(20);

  const PAD = { l: 60, r: 16, t: 28, b: 36 };
  const pw = W - PAD.l - PAD.r;
  const ph = H - PAD.t - PAD.b;

  // H0: theta=0.5, H1: theta~Uniform(0,1) (Beta(1,1))
  // BF(H0:H1) = P(s|H0) / m(s|H1) = C(n,s)*0.5^n / (1/(n+1)) = (n+1)*C(n,s)*0.5^n
  const sFull = Array.from({ length: nObs + 1 }, (_, i) => i);
  const bfVals = sFull.map(s => {
    const logBF = Math.log(nObs + 1) + logBinom(nObs, s) + nObs * Math.log(0.5);
    return Math.exp(logBF);
  });

  const maxBF = Math.max(...bfVals, 0.01);
  const xS = (s: number) => PAD.l + (s / nObs) * pw;
  const yS = (bf: number) => PAD.t + ph - Math.min(bf / maxBF, 1) * ph;
  const zeroY = yS(0);

  // BF=1 line
  const bf1y = yS(1);

  const barW = pw / (nObs + 2);

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Bayes Factor BF(H₀:H₁) vs successes s — H₀: θ=0.5 vs H₁: θ~Uniform
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        <line x1={PAD.l} y1={PAD.t + ph} x2={PAD.l + pw} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        {[0, 0.25, 0.5, 0.75, 1].map(v => {
          const sv = Math.round(v * nObs);
          return (
            <g key={v}>
              <text x={xS(sv)} y={PAD.t + ph + 14} textAnchor="middle" fill={MUTED} fontSize={10}>{sv}</text>
            </g>
          );
        })}
        <text x={PAD.l + pw / 2} y={H - 2} textAnchor="middle" fill={MUTED} fontSize={10}>successes s</text>
        {/* BF=1 line */}
        {bf1y >= PAD.t && bf1y <= PAD.t + ph && (
          <>
            <line x1={PAD.l} y1={bf1y} x2={PAD.l + pw} y2={bf1y} stroke={MUTED} strokeWidth={1} strokeDasharray="3,3" />
            <text x={PAD.l + 2} y={bf1y - 3} fill={MUTED} fontSize={9}>BF=1</text>
          </>
        )}
        {/* bars */}
        {bfVals.map((bf, s) => {
          const x = xS(s) - barW / 2;
          const col = bf > 1 ? SUCCESS : WARN;
          return (
            <rect key={s} x={x} y={yS(bf)} width={Math.max(barW - 1, 1)}
              height={Math.max(zeroY - yS(bf), 1)}
              fill={col} opacity={0.75} />
          );
        })}
        {/* y-axis labels */}
        <text x={PAD.l - 4} y={PAD.t + 10} textAnchor="end" fill={MUTED} fontSize={9}>{maxBF.toFixed(1)}</text>
        <text x={PAD.l - 4} y={PAD.t + ph + 4} textAnchor="end" fill={MUTED} fontSize={9}>0</text>
        <text x={10} y={PAD.t + ph / 2} textAnchor="middle" fill={MUTED} fontSize={9}
          transform={`rotate(-90,10,${PAD.t + ph / 2})`}>BF(H₀:H₁)</text>
        <text x={PAD.l + 4} y={PAD.t + 14} fill={SUCCESS} fontSize={9}>green: favours H₀</text>
        <text x={PAD.l + 4} y={PAD.t + 24} fill={WARN} fontSize={9}>orange: favours H₁</text>
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, justifyContent: 'center' }}>
        <span style={{ color: MUTED, fontSize: 12 }}>n (trials):</span>
        <input type="range" min={5} max={40} step={1} value={nObs}
          onChange={e => setNObs(Number(e.target.value))} style={{ width: 140, accentColor: PRIMARY }} />
        <span style={{ color: TEXT, fontSize: 12 }}>{nObs}</span>
      </div>
    </div>
  );
};

// ── 6. Gibbs Sampling Trace ────────────────────────────────────────────────
export const VizGibbsSampling: React.FC = () => {
  const [rho, setRho] = useState(0.8);
  const [seed, setSeed] = useState(42);

  const STEPS = 300;
  const rng = lcg(seed * 137 + 7);
  const bm = () => {
    const u1 = Math.max(rng(), 1e-10), u2 = rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };

  // Gibbs sampler for bivariate N(0,0; 1,1; rho)
  // X|Y=y ~ N(rho*y, 1-rho^2), Y|X=x ~ N(rho*x, 1-rho^2)
  const sd = Math.sqrt(Math.max(1 - rho * rho, 1e-6));
  const xs: number[] = [0], ys: number[] = [0];
  for (let i = 0; i < STEPS; i++) {
    const newY = rho * xs[xs.length - 1] + sd * bm();
    const newX = rho * newY + sd * bm();
    xs.push(newX);
    ys.push(newY);
  }

  // left panel: trace of x
  const PAD = { l: 36, r: 16, t: 24, b: 30 };
  const W2 = W / 2 - 4;
  const pw = W2 - PAD.l - PAD.r;
  const ph = H - PAD.t - PAD.b;

  const xRange = 4;
  const traceXS = (i: number) => PAD.l + (i / STEPS) * pw;
  const traceYS = (v: number) => PAD.t + ph / 2 - (v / xRange) * (ph / 2);

  // right panel: x histogram
  const nBins = 20;
  const binEdges = Array.from({ length: nBins + 1 }, (_, i) => -xRange + 2 * xRange * i / nBins);
  const bins = Array(nBins).fill(0);
  xs.forEach(v => {
    const b = Math.floor((v + xRange) / (2 * xRange) * nBins);
    if (b >= 0 && b < nBins) bins[b]++;
  });
  const maxBin = Math.max(...bins, 1);
  const histX0 = W2 + 8;
  const histPW = W - histX0 - 16;
  const histXS = (v: number) => histX0 + (v + xRange) / (2 * xRange) * histPW;
  const histYS = (c: number) => PAD.t + ph - (c / maxBin) * ph;
  const bw = histPW / nBins;

  // N(0,1) overlay on histogram
  const histPts = Array.from({ length: 81 }, (_, i) => -xRange + 2 * xRange * i / 80);
  const normCurve = histPts.map(x => {
    const d = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    const histHeight = d * 2 * xRange / nBins * (STEPS + 1);
    return histHeight;
  });
  const normPath = histPts.map((x, i) =>
    `${i === 0 ? 'M' : 'L'}${histXS(x).toFixed(1)},${histYS(normCurve[i]).toFixed(1)}`).join('');

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Gibbs Sampler — Bivariate N(0, ρ={rho.toFixed(1)}) · {STEPS} steps
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        {/* Trace panel */}
        <line x1={PAD.l} y1={PAD.t + ph / 2} x2={PAD.l + pw} y2={PAD.t + ph / 2} stroke={MUTED} strokeWidth={1} strokeDasharray="3,3" />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        <line x1={PAD.l} y1={PAD.t + ph} x2={PAD.l + pw} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        <text x={PAD.l + pw / 2} y={H - 2} textAnchor="middle" fill={MUTED} fontSize={9}>iteration</text>
        <text x={PAD.l - 2} y={PAD.t + ph / 2 + 4} textAnchor="end" fill={MUTED} fontSize={9}>0</text>
        <text x={PAD.l - 2} y={PAD.t + 10} textAnchor="end" fill={MUTED} fontSize={9}>{xRange}</text>
        <text x={PAD.l - 2} y={PAD.t + ph + 4} textAnchor="end" fill={MUTED} fontSize={9}>-{xRange}</text>
        <text x={PAD.l + pw / 2} y={PAD.t + 12} textAnchor="middle" fill={MUTED} fontSize={9}>X trace</text>
        {xs.slice(0, STEPS).map((_, i) => (
          <line key={i}
            x1={traceXS(i).toFixed(1)} y1={traceYS(xs[i]).toFixed(1)}
            x2={traceXS(i + 1).toFixed(1)} y2={traceYS(xs[i + 1]).toFixed(1)}
            stroke={PRIMARY} strokeWidth={0.7} opacity={0.7} />
        ))}
        {/* Histogram panel */}
        <line x1={histX0} y1={PAD.t} x2={histX0} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        <line x1={histX0} y1={PAD.t + ph} x2={histX0 + histPW} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        <text x={histX0 + histPW / 2} y={H - 2} textAnchor="middle" fill={MUTED} fontSize={9}>X values</text>
        <text x={histX0 + histPW / 2} y={PAD.t + 12} textAnchor="middle" fill={MUTED} fontSize={9}>Marginal histogram</text>
        {bins.map((cnt, i) => (
          <rect key={i}
            x={histXS(binEdges[i])} y={histYS(cnt)}
            width={Math.max(bw - 1, 1)} height={Math.max(PAD.t + ph - histYS(cnt), 0)}
            fill={ACCENT} opacity={0.65} />
        ))}
        <path d={normPath} fill="none" stroke={SUCCESS} strokeWidth={1.5} />
        <text x={histX0 + histPW - 2} y={PAD.t + 22} textAnchor="end" fill={SUCCESS} fontSize={8}>N(0,1)</text>
        {[-2, 0, 2].map(v => (
          <text key={v} x={histXS(v)} y={PAD.t + ph + 14} textAnchor="middle" fill={MUTED} fontSize={9}>{v}</text>
        ))}
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6, justifyContent: 'center' }}>
        <label style={{ color: MUTED, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          ρ: <input type="range" min={-0.95} max={0.95} step={0.05} value={rho}
            onChange={e => setRho(Number(e.target.value))} style={{ width: 120, accentColor: PRIMARY }} />
          <span style={{ color: TEXT }}>{rho.toFixed(2)}</span>
        </label>
        <button onClick={() => setSeed(s => s + 1)} style={{
          padding: '3px 12px', fontSize: 11, borderRadius: 6, border: 'none', cursor: 'pointer',
          background: SURFACE, color: TEXT,
        }}>New Chain</button>
      </div>
    </div>
  );
};
