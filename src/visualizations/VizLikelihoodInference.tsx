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

function phi(z: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(z));
  const p = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const val = 1 - p * Math.exp(-z * z / 2);
  return z >= 0 ? val : 1 - val;
}

// ── 1. Likelihood Function (Binomial) ─────────────────────────────────────
export const VizLikelihoodFunction: React.FC = () => {
  const [s, setS] = useState(4);
  const n = 10;
  const PAD = { l: 50, r: 16, t: 28, b: 36 };
  const pw = W - PAD.l - PAD.r; const ph = H - PAD.t - PAD.b;

  let maxL = 0;
  const raw: [number, number][] = Array.from({ length: 201 }, (_, i) => {
    const th = 0.001 + 0.998 * i / 200;
    const l = Math.pow(th, s) * Math.pow(1 - th, n - s);
    if (l > maxL) maxL = l;
    return [th, l];
  });
  const xS = (t: number) => PAD.l + t * pw;
  const yS = (l: number) => PAD.t + ph - (maxL > 0 ? l / maxL : 0) * ph;
  const curve = raw.map(([t, l], i) => `${i === 0 ? 'M' : 'L'}${xS(t).toFixed(1)},${yS(l).toFixed(1)}`).join('');
  const fill = `${curve} L${xS(0.999).toFixed(1)},${yS(0).toFixed(1)} L${xS(0.001).toFixed(1)},${yS(0).toFixed(1)} Z`;
  const mle = s === 0 ? 0 : s === n ? 1 : s / n;
  const halfL = maxL * 0.5;
  let loTh = 0.001, hiTh = 0.999;
  for (let i = 0; i < raw.length - 1; i++) {
    if (raw[i][1] < halfL && raw[i + 1][1] >= halfL) loTh = raw[i][0];
    if (raw[i][1] >= halfL && raw[i + 1][1] < halfL) hiTh = raw[i][0];
  }

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Binomial(10, θ) Likelihood — {s} head{s !== 1 ? 's' : ''} observed &nbsp;·&nbsp; θ̂ = {mle.toFixed(2)}
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
        <text x={12} y={PAD.t + ph / 2} textAnchor="middle" fill={MUTED} fontSize={10}
          transform={`rotate(-90,12,${PAD.t + ph / 2})`}>L(θ|s)</text>
        {s > 0 && s < n && loTh < hiTh && (
          <rect x={xS(loTh)} y={PAD.t} width={xS(hiTh) - xS(loTh)} height={ph} fill={ACCENT} opacity={0.08} />
        )}
        <path d={fill} fill={PRIMARY} opacity={0.12} />
        <path d={curve} fill="none" stroke={PRIMARY} strokeWidth={2} />
        {s > 0 && s < n && (
          <line x1={PAD.l} y1={yS(halfL)} x2={PAD.l + pw} y2={yS(halfL)}
            stroke={ACCENT} strokeWidth={1} strokeDasharray="4,3" opacity={0.7} />
        )}
        {s > 0 && s < n && (
          <>
            <line x1={xS(mle)} y1={PAD.t + 2} x2={xS(mle)} y2={PAD.t + ph}
              stroke={SUCCESS} strokeWidth={1.5} strokeDasharray="4,3" />
            <circle cx={xS(mle)} cy={yS(maxL)} r={3} fill={SUCCESS} />
            <text x={xS(mle)} y={PAD.t + 14} textAnchor="middle" fill={SUCCESS} fontSize={10}>MLE</text>
          </>
        )}
        <text x={PAD.l + 6} y={PAD.t + 13} fill={MUTED} fontSize={9}>purple region = 0.5·L(θ̂) likelihood interval</text>
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, justifyContent: 'center' }}>
        <span style={{ color: MUTED, fontSize: 12 }}>Observed heads s:</span>
        <input type="range" min={0} max={10} step={1} value={s}
          onChange={e => setS(Number(e.target.value))} style={{ width: 140, accentColor: PRIMARY }} />
        <span style={{ color: TEXT, fontSize: 12, minWidth: 16 }}>{s} / 10</span>
      </div>
    </div>
  );
};

// ── 2. MLE via Score Equation (Bernoulli) ─────────────────────────────────
export const VizMLEScore: React.FC = () => {
  const [xbar, setXbar] = useState(0.6);
  const [mode, setMode] = useState<'loglik' | 'score'>('loglik');
  const n = 30;
  const PAD = { l: 54, r: 16, t: 28, b: 36 };
  const pw = W - PAD.l - PAD.r; const ph = H - PAD.t - PAD.b;

  const pts = Array.from({ length: 199 }, (_, i) => {
    const th = 0.01 + 0.98 * i / 198;
    const loglik = n * xbar * Math.log(th) + n * (1 - xbar) * Math.log(1 - th);
    const score = n * xbar / th - n * (1 - xbar) / (1 - th);
    return { th, loglik, score };
  });

  let minY: number, maxY: number;
  if (mode === 'loglik') {
    const vals = pts.map(p => p.loglik);
    maxY = Math.max(...vals); minY = maxY - 30;
  } else {
    minY = -60; maxY = 60;
  }

  const xS = (t: number) => PAD.l + (t - 0.01) / 0.98 * pw;
  const yS = (v: number) => PAD.t + ph - (v - minY) / (maxY - minY) * ph;

  const curvePts = pts.map((p, i) => {
    const y = mode === 'loglik' ? p.loglik : p.score;
    const cy = Math.max(PAD.t, Math.min(PAD.t + ph, yS(y)));
    return `${i === 0 ? 'M' : 'L'}${xS(p.th).toFixed(1)},${cy.toFixed(1)}`;
  }).join('');

  const mle = xbar;
  const zeroY = yS(0);

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Bernoulli(θ) — {mode === 'loglik' ? 'Log-Likelihood l(θ|x)' : 'Score Function S(θ|x)'}, x̄ = {xbar.toFixed(2)}
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        <line x1={PAD.l} y1={PAD.t + ph} x2={PAD.l + pw} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        {[0.1, 0.3, 0.5, 0.7, 0.9].map(v => (
          <g key={v}>
            <line x1={xS(v)} y1={PAD.t + ph} x2={xS(v)} y2={PAD.t + ph + 4} stroke={MUTED} strokeWidth={1} />
            <text x={xS(v)} y={PAD.t + ph + 14} textAnchor="middle" fill={MUTED} fontSize={10}>{v}</text>
          </g>
        ))}
        <text x={PAD.l + pw / 2} y={H - 2} textAnchor="middle" fill={MUTED} fontSize={10}>θ</text>
        {/* zero line for score */}
        {mode === 'score' && zeroY >= PAD.t && zeroY <= PAD.t + ph && (
          <line x1={PAD.l} y1={zeroY} x2={PAD.l + pw} y2={zeroY}
            stroke={MUTED} strokeWidth={1} strokeDasharray="3,3" />
        )}
        <path d={curvePts} fill="none" stroke={PRIMARY} strokeWidth={2} />
        {/* MLE vertical */}
        <line x1={xS(mle)} y1={PAD.t + 2} x2={xS(mle)} y2={PAD.t + ph}
          stroke={SUCCESS} strokeWidth={1.5} strokeDasharray="4,3" />
        <text x={xS(mle)} y={PAD.t + 14} textAnchor="middle" fill={SUCCESS} fontSize={10}>θ̂=x̄={xbar.toFixed(2)}</text>
        {mode === 'score' && (
          <text x={PAD.l + pw - 4} y={zeroY - 4} textAnchor="end" fill={MUTED} fontSize={9}>S=0</text>
        )}
        <text x={10} y={PAD.t + ph / 2} textAnchor="middle" fill={MUTED} fontSize={9}
          transform={`rotate(-90,10,${PAD.t + ph / 2})`}>{mode === 'loglik' ? 'l(θ)' : 'S(θ)'}</text>
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['loglik', 'score'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding: '3px 10px', fontSize: 11, borderRadius: 6, border: 'none', cursor: 'pointer',
              background: mode === m ? PRIMARY : SURFACE, color: mode === m ? BG : TEXT,
            }}>{m === 'loglik' ? 'Log-Likelihood' : 'Score S(θ)'}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: MUTED, fontSize: 12 }}>x̄:</span>
          <input type="range" min={0.05} max={0.95} step={0.01} value={xbar}
            onChange={e => setXbar(Number(e.target.value))} style={{ width: 110, accentColor: PRIMARY }} />
          <span style={{ color: TEXT, fontSize: 12 }}>{xbar.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// ── 3. Bias and MSE ────────────────────────────────────────────────────────
export const VizBiasMSE: React.FC = () => {
  const [theta, setTheta] = useState(0.4);
  const ns = [5, 10, 20, 50, 100];
  const PAD = { l: 54, r: 16, t: 28, b: 36 };
  const pw = W - PAD.l - PAD.r; const ph = H - PAD.t - PAD.b;

  // MLE of Bernoulli(theta): T = X̄
  // E[X̄] = theta → unbiased → bias = 0
  // Var[X̄] = theta(1-theta)/n
  // MSE = Var (since bias=0)
  // Compare to biased estimator T2 = (n*X̄+1)/(n+2) (Laplace smoothing)
  // E[T2] = (n*theta+1)/(n+2) → bias = (1-2*theta)/(n+2)
  // Var[T2] = n^2/(n+2)^2 * theta(1-theta)/n = n/(n+2)^2 * theta(1-theta)
  // MSE[T2] = Var[T2] + bias^2

  const mseMLE = ns.map(n => theta * (1 - theta) / n);
  const mseSmooth = ns.map(n => {
    const bias = (1 - 2 * theta) / (n + 2);
    const v = n / Math.pow(n + 2, 2) * theta * (1 - theta);
    return v + bias * bias;
  });

  const maxMSE = Math.max(...mseMLE, ...mseSmooth);
  const xS = (i: number) => PAD.l + (i / (ns.length - 1)) * pw;
  const yS = (v: number) => PAD.t + ph - (v / maxMSE) * ph;

  const mleColor = PRIMARY; const smoothColor = WARN;
  const mlePath = ns.map((_, i) => `${i === 0 ? 'M' : 'L'}${xS(i).toFixed(1)},${yS(mseMLE[i]).toFixed(1)}`).join('');
  const smoothPath = ns.map((_, i) => `${i === 0 ? 'M' : 'L'}${xS(i).toFixed(1)},${yS(mseSmooth[i]).toFixed(1)}`).join('');

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        MSE vs Sample Size — Bernoulli(θ={theta.toFixed(2)})
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        <line x1={PAD.l} y1={PAD.t + ph} x2={PAD.l + pw} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        {ns.map((n, i) => (
          <g key={n}>
            <line x1={xS(i)} y1={PAD.t + ph} x2={xS(i)} y2={PAD.t + ph + 4} stroke={MUTED} strokeWidth={1} />
            <text x={xS(i)} y={PAD.t + ph + 14} textAnchor="middle" fill={MUTED} fontSize={10}>{n}</text>
          </g>
        ))}
        <text x={PAD.l + pw / 2} y={H - 2} textAnchor="middle" fill={MUTED} fontSize={10}>sample size n</text>
        <text x={10} y={PAD.t + ph / 2} textAnchor="middle" fill={MUTED} fontSize={9}
          transform={`rotate(-90,10,${PAD.t + ph / 2})`}>MSE</text>
        <path d={mlePath} fill="none" stroke={mleColor} strokeWidth={2} />
        <path d={smoothPath} fill="none" stroke={smoothColor} strokeWidth={2} strokeDasharray="5,3" />
        {ns.map((_, i) => <circle key={i} cx={xS(i)} cy={yS(mseMLE[i])} r={3} fill={mleColor} />)}
        {ns.map((_, i) => <circle key={i} cx={xS(i)} cy={yS(mseSmooth[i])} r={3} fill={smoothColor} />)}
        <rect x={PAD.l + 4} y={PAD.t + 4} width={130} height={36} rx={4} fill={SURFACE} opacity={0.85} />
        <line x1={PAD.l + 10} y1={PAD.t + 15} x2={PAD.l + 26} y2={PAD.t + 15} stroke={mleColor} strokeWidth={2} />
        <text x={PAD.l + 30} y={PAD.t + 18} fill={mleColor} fontSize={10}>MLE x̄ (unbiased)</text>
        <line x1={PAD.l + 10} y1={PAD.t + 30} x2={PAD.l + 26} y2={PAD.t + 30} stroke={smoothColor} strokeWidth={2} strokeDasharray="4,2" />
        <text x={PAD.l + 30} y={PAD.t + 33} fill={smoothColor} fontSize={10}>Smoothed (biased)</text>
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, justifyContent: 'center' }}>
        <span style={{ color: MUTED, fontSize: 12 }}>True θ:</span>
        <input type="range" min={0.05} max={0.95} step={0.01} value={theta}
          onChange={e => setTheta(Number(e.target.value))} style={{ width: 140, accentColor: PRIMARY }} />
        <span style={{ color: TEXT, fontSize: 12 }}>{theta.toFixed(2)}</span>
      </div>
    </div>
  );
};

// ── 4. Confidence Interval Coverage ───────────────────────────────────────
export const VizConfidenceIntervals: React.FC = () => {
  const [seed, setSeed] = useState(42);
  const n = 15; const sigma = 1; const mu = 0;
  const z = 1.96; // z_{0.975}
  const N = 25; // number of intervals to show

  const rng = lcg(seed * 100 + 7);
  // Box-Muller for normal samples
  const normal = () => {
    const u1 = rng(), u2 = rng();
    return Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2);
  };

  const intervals: { lo: number; hi: number; xbar: number; covers: boolean }[] = [];
  for (let i = 0; i < N; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) sum += normal();
    const xbar = sum / n;
    const half = z * sigma / Math.sqrt(n);
    const lo = xbar - half, hi = xbar + half;
    intervals.push({ lo, hi, xbar, covers: lo <= mu && mu <= hi });
  }

  const PAD = { l: 20, r: 20, t: 22, b: 30 };
  const pw = W - PAD.l - PAD.r; const ph = H - PAD.t - PAD.b;
  const range = 3;
  const xS = (v: number) => PAD.l + (v + range) / (2 * range) * pw;
  const rowH = ph / N;
  const covered = intervals.filter(c => c.covers).length;

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        95% z-Confidence Intervals for μ=0 &nbsp;·&nbsp; {covered}/{N} cover μ ({(100 * covered / N).toFixed(0)}%)
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        {/* μ=0 line */}
        <line x1={xS(0)} y1={PAD.t} x2={xS(0)} y2={PAD.t + ph} stroke={WARN} strokeWidth={1.5} opacity={0.8} />
        {/* x-axis ticks */}
        {[-2, -1, 0, 1, 2].map(v => (
          <g key={v}>
            <line x1={xS(v)} y1={PAD.t + ph} x2={xS(v)} y2={PAD.t + ph + 4} stroke={MUTED} strokeWidth={1} />
            <text x={xS(v)} y={PAD.t + ph + 14} textAnchor="middle" fill={MUTED} fontSize={10}>{v}</text>
          </g>
        ))}
        {intervals.map((ci, i) => {
          const cy = PAD.t + (i + 0.5) * rowH;
          const color = ci.covers ? SUCCESS : WARN;
          return (
            <g key={i}>
              <line x1={Math.max(PAD.l, xS(ci.lo))} y1={cy} x2={Math.min(PAD.l + pw, xS(ci.hi))} y2={cy}
                stroke={color} strokeWidth={1.5} />
              <circle cx={xS(ci.xbar)} cy={cy} r={2} fill={color} />
            </g>
          );
        })}
        <text x={xS(0) + 3} y={PAD.t + 10} fill={WARN} fontSize={9}>μ=0</text>
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, justifyContent: 'center' }}>
        <button onClick={() => setSeed(s => s + 1)} style={{
          padding: '4px 14px', fontSize: 12, borderRadius: 8, border: 'none', cursor: 'pointer',
          background: PRIMARY, color: BG, fontWeight: 600,
        }}>New Samples</button>
        <span style={{ color: MUTED, fontSize: 11 }}>
          <span style={{ color: SUCCESS }}>■</span> covers &nbsp;
          <span style={{ color: WARN }}>■</span> misses &nbsp;·&nbsp; n={n}, z={z}
        </span>
      </div>
    </div>
  );
};

// ── 5. P-value Illustration (z-test) ──────────────────────────────────────
export const VizPvalueTest: React.FC = () => {
  const [xbar, setXbar] = useState(2.6);
  const n = 10; const sigma = 1; const mu0 = 0;
  const se = sigma / Math.sqrt(n);
  const z = (xbar - mu0) / se;
  const pval = 2 * (1 - phi(Math.abs(z)));

  const PAD = { l: 44, r: 16, t: 28, b: 36 };
  const pw = W - PAD.l - PAD.r; const ph = H - PAD.t - PAD.b;
  const xMin = mu0 - 4 * se, xMax = mu0 + 4 * se;
  const xS = (v: number) => PAD.l + (v - xMin) / (xMax - xMin) * pw;
  const pdfN = (x: number) => Math.exp(-0.5 * Math.pow((x - mu0) / se, 2)) / (se * Math.sqrt(2 * Math.PI));
  const pdfMax = pdfN(mu0);
  const yS = (p: number) => PAD.t + ph - p / pdfMax * ph;

  const nPts = 200;
  const pts: [number, number][] = Array.from({ length: nPts + 1 }, (_, i) => {
    const x = xMin + (xMax - xMin) * i / nPts;
    return [x, pdfN(x)];
  });
  const curvePath = pts.map(([x, p], i) => `${i === 0 ? 'M' : 'L'}${xS(x).toFixed(1)},${yS(p).toFixed(1)}`).join('');

  const abs_xbar = Math.abs(xbar);
  // right tail fill
  const rTail = pts.filter(([x]) => x >= abs_xbar).map(([x, p], i) =>
    `${i === 0 ? 'M' : 'L'}${xS(x).toFixed(1)},${yS(p).toFixed(1)}`).join('');
  const rFill = pts.filter(([x]) => x >= abs_xbar).length > 1
    ? `${rTail} L${xS(Math.min(xMax, abs_xbar + 4 * se)).toFixed(1)},${yS(0).toFixed(1)} L${xS(abs_xbar).toFixed(1)},${yS(0).toFixed(1)} Z`
    : '';
  // left tail fill
  const lTail = pts.filter(([x]) => x <= -abs_xbar).map(([x, p], i) =>
    `${i === 0 ? 'M' : 'L'}${xS(x).toFixed(1)},${yS(p).toFixed(1)}`).join('');
  const lFill = pts.filter(([x]) => x <= -abs_xbar).length > 1
    ? `${lTail} L${xS(-abs_xbar).toFixed(1)},${yS(0).toFixed(1)} L${xS(Math.max(xMin, -abs_xbar - 4 * se)).toFixed(1)},${yS(0).toFixed(1)} Z`
    : '';

  const xTicks = [-3, -2, -1, 0, 1, 2, 3].map(v => mu0 + v * se);
  const pColor = pval < 0.05 ? WARN : SUCCESS;

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        z-Test: H₀: μ = {mu0} — P-value = <span style={{ color: pColor }}>{pval < 0.001 ? '< 0.001' : pval.toFixed(4)}</span>
        {pval < 0.05 ? ' (significant)' : ' (not significant)'}
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <line x1={PAD.l} y1={PAD.t + ph} x2={PAD.l + pw} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        {xTicks.filter(v => v >= xMin && v <= xMax).map(v => (
          <g key={v}>
            <line x1={xS(v)} y1={PAD.t + ph} x2={xS(v)} y2={PAD.t + ph + 4} stroke={MUTED} strokeWidth={1} />
            <text x={xS(v)} y={PAD.t + ph + 14} textAnchor="middle" fill={MUTED} fontSize={9}>{v.toFixed(1)}</text>
          </g>
        ))}
        <text x={PAD.l + pw / 2} y={H - 2} textAnchor="middle" fill={MUTED} fontSize={10}>x̄</text>
        {rFill && <path d={rFill} fill={WARN} opacity={0.35} />}
        {lFill && <path d={lFill} fill={WARN} opacity={0.35} />}
        <path d={curvePath} fill="none" stroke={PRIMARY} strokeWidth={2} />
        {/* μ₀ line */}
        <line x1={xS(mu0)} y1={PAD.t} x2={xS(mu0)} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} strokeDasharray="3,3" />
        {/* observed x̄ */}
        {xS(xbar) >= PAD.l && xS(xbar) <= PAD.l + pw && (
          <>
            <line x1={xS(xbar)} y1={PAD.t} x2={xS(xbar)} y2={PAD.t + ph}
              stroke={SUCCESS} strokeWidth={1.5} strokeDasharray="4,3" />
            <text x={xS(xbar)} y={PAD.t + 14} textAnchor="middle" fill={SUCCESS} fontSize={10}>x̄={xbar.toFixed(2)}</text>
          </>
        )}
        <text x={xS(mu0)} y={PAD.t + 14} textAnchor="middle" fill={MUTED} fontSize={10}>μ₀</text>
        <text x={PAD.l + pw - 4} y={PAD.t + 14} textAnchor="end" fill={WARN} fontSize={10}>P-value (shaded)</text>
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, justifyContent: 'center' }}>
        <span style={{ color: MUTED, fontSize: 12 }}>Observed x̄:</span>
        <input type="range" min={-3.5} max={3.5} step={0.05} value={xbar}
          onChange={e => setXbar(Number(e.target.value))} style={{ width: 140, accentColor: PRIMARY }} />
        <span style={{ color: TEXT, fontSize: 12 }}>{xbar.toFixed(2)}</span>
      </div>
    </div>
  );
};

// ── 6. Bootstrap Distribution ──────────────────────────────────────────────
export const VizBootstrap: React.FC = () => {
  const [m, setM] = useState(500);
  // Fixed sample of n=15 (from Example 6.4.2 data)
  const sample = [-2.0, -0.2, -5.2, -3.5, -3.9, -0.6, -4.3, -1.7, -9.5, 1.6, -2.9, 0.9, -1.0, -2.0, 3.0];
  const n = sample.length;
  const sampleMean = sample.reduce((a, b) => a + b, 0) / n;
  const sortedSample = [...sample].sort((a, b) => a - b);
  const sampleMedian = (sortedSample[Math.floor(n / 2) - 1] + sortedSample[Math.floor(n / 2)]) / 2;

  const rng = lcg(12345 + m);
  const bootstrapMedians: number[] = [];
  for (let i = 0; i < m; i++) {
    const bs = Array.from({ length: n }, () => sample[Math.floor(rng() * n)]);
    bs.sort((a, b) => a - b);
    bootstrapMedians.push((bs[Math.floor(n / 2) - 1] + bs[Math.floor(n / 2)]) / 2);
  }

  const bsMean = bootstrapMedians.reduce((a, b) => a + b, 0) / m;
  const bsVar = bootstrapMedians.reduce((s, v) => s + (v - bsMean) ** 2, 0) / (m - 1);
  const bsSE = Math.sqrt(bsVar);

  // histogram
  const binMin = -8, binMax = 3;
  const nBins = 22;
  const binW = (binMax - binMin) / nBins;
  const bins = Array(nBins).fill(0);
  bootstrapMedians.forEach(v => {
    const b = Math.floor((v - binMin) / binW);
    if (b >= 0 && b < nBins) bins[b]++;
  });
  const maxCount = Math.max(...bins, 1);

  const PAD = { l: 30, r: 16, t: 28, b: 36 };
  const pw = W - PAD.l - PAD.r; const ph = H - PAD.t - PAD.b;
  const xS = (v: number) => PAD.l + (v - binMin) / (binMax - binMin) * pw;
  const yS = (c: number) => PAD.t + ph - c / maxCount * ph;

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Bootstrap Distribution of Sample Median &nbsp;·&nbsp; m={m} resamples &nbsp;·&nbsp; SE≈{bsSE.toFixed(3)}
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <line x1={PAD.l} y1={PAD.t + ph} x2={PAD.l + pw} y2={PAD.t + ph} stroke={MUTED} strokeWidth={1} />
        {[-8, -6, -4, -2, 0, 2].map(v => (
          <g key={v}>
            <line x1={xS(v)} y1={PAD.t + ph} x2={xS(v)} y2={PAD.t + ph + 4} stroke={MUTED} strokeWidth={1} />
            <text x={xS(v)} y={PAD.t + ph + 14} textAnchor="middle" fill={MUTED} fontSize={10}>{v}</text>
          </g>
        ))}
        <text x={PAD.l + pw / 2} y={H - 2} textAnchor="middle" fill={MUTED} fontSize={10}>sample median</text>
        {bins.map((cnt, i) => {
          const x0 = xS(binMin + i * binW);
          const x1 = xS(binMin + (i + 1) * binW);
          return <rect key={i} x={x0} y={yS(cnt)} width={x1 - x0 - 1} height={ph - (yS(cnt) - PAD.t)}
            fill={ACCENT} opacity={0.7} />;
        })}
        {/* sample median marker */}
        <line x1={xS(sampleMedian)} y1={PAD.t} x2={xS(sampleMedian)} y2={PAD.t + ph}
          stroke={SUCCESS} strokeWidth={1.5} strokeDasharray="4,3" />
        <text x={xS(sampleMedian)} y={PAD.t + 14} textAnchor="middle" fill={SUCCESS} fontSize={10}>x̂₀.₅={sampleMedian.toFixed(2)}</text>
        {/* sample mean marker */}
        <line x1={xS(sampleMean)} y1={PAD.t + 2} x2={xS(sampleMean)} y2={PAD.t + ph}
          stroke={PRIMARY} strokeWidth={1} strokeDasharray="2,3" opacity={0.7} />
        <text x={xS(sampleMean)} y={PAD.t + 24} textAnchor="middle" fill={PRIMARY} fontSize={9}>x̄={sampleMean.toFixed(2)}</text>
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, justifyContent: 'center' }}>
        <span style={{ color: MUTED, fontSize: 12 }}>Bootstrap samples m:</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {[100, 500, 2000].map(mv => (
            <button key={mv} onClick={() => setM(mv)} style={{
              padding: '3px 10px', fontSize: 11, borderRadius: 6, border: 'none', cursor: 'pointer',
              background: m === mv ? ACCENT : SURFACE, color: TEXT,
            }}>{mv}</button>
          ))}
        </div>
      </div>
    </div>
  );
};
