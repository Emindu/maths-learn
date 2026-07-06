import React from 'react';

const W = 500, H = 220;
const BG = '#0f172a', SURFACE = '#1e293b', PRIMARY = '#38bdf8', ACCENT = '#818cf8';
const SUCCESS = '#34d399', WARN = '#fb923c', TEXT = '#f1f5f9', MUTED = '#64748b';

function phi(x: number): number {
  const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
  const sign = x < 0 ? -1 : 1;
  const t2 = Math.abs(x) / Math.SQRT2;
  const t = 1 / (1 + p * t2);
  const y = 1 - (((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t) * Math.exp(-t2*t2);
  return 0.5 * (1 + sign * y);
}

function normalPDF(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5*z*z) / (sigma * 2.506628);
}

function binomPMF(k: number, n: number, p: number): number {
  let lp = 0;
  for (let i = 0; i < k; i++) lp += Math.log(n - i) - Math.log(i + 1);
  return Math.exp(lp + k * Math.log(Math.max(p, 1e-15)) + (n - k) * Math.log(Math.max(1 - p, 1e-15)));
}

// ── 1. Rao-Blackwell: comparing T=X₁ vs T_U=x̄ ──────────────────────────────
export const VizRaoBlackwell: React.FC = () => {
  const lam = 3, n = 5;
  const sdT = Math.sqrt(lam);         // Var(X₁) = λ
  const sdTU = Math.sqrt(lam / n);    // Var(x̄) = λ/n

  const panelW = 195, gapX = 60, lPad = 25;
  const rPanelX = lPad + panelW + gapX;
  const tPad = 34, bPad = 28, plotH = H - tPad - bPad;

  const xMin = -0.5, xMax = 8.5;
  const PTS = 80;

  const makeCurve = (sd: number, panelL: number) => {
    const peak = normalPDF(lam, lam, sd);
    return Array.from({ length: PTS }, (_, i) => {
      const x = xMin + (i / (PTS - 1)) * (xMax - xMin);
      const px = panelL + ((x - xMin) / (xMax - xMin)) * panelW;
      const py = tPad + plotH - (normalPDF(x, lam, sd) / peak) * plotH * 0.85;
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    }).join(' ');
  };

  const makeArea = (sd: number, panelL: number) => {
    const peak = normalPDF(lam, lam, sd);
    const inside = Array.from({ length: PTS }, (_, i) => {
      const x = xMin + (i / (PTS - 1)) * (xMax - xMin);
      const px = panelL + ((x - xMin) / (xMax - xMin)) * panelW;
      const py = tPad + plotH - (normalPDF(x, lam, sd) / peak) * plotH * 0.85;
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    }).join(' ');
    const baseY = (tPad + plotH).toFixed(1);
    const x0 = panelL.toFixed(1), x1 = (panelL + panelW).toFixed(1);
    return `${x0},${baseY} ${inside} ${x1},${baseY}`;
  };

  const lx = (lPad + ((lam - xMin) / (xMax - xMin)) * panelW).toFixed(1);
  const rx = (rPanelX + ((lam - xMin) / (xMax - xMin)) * panelW).toFixed(1);
  const baseY = tPad + plotH;

  return (
    <svg width={W} height={H} style={{ background: BG, borderRadius: 8, display: 'block', maxWidth: '100%' }}>
      <rect x={lPad} y={tPad} width={panelW} height={plotH} fill={SURFACE} rx={3} />
      <rect x={rPanelX} y={tPad} width={panelW} height={plotH} fill={SURFACE} rx={3} />

      {/* Left: T = X₁, wide */}
      <polygon points={makeArea(sdT, lPad)} fill={WARN} opacity={0.15} />
      <polyline points={makeCurve(sdT, lPad)} fill="none" stroke={WARN} strokeWidth={2.5} />
      <line x1={lx} y1={tPad} x2={lx} y2={baseY} stroke={SUCCESS} strokeWidth={1.5} strokeDasharray="4,3" />

      {/* Right: T_U = x̄, narrow */}
      <polygon points={makeArea(sdTU, rPanelX)} fill={PRIMARY} opacity={0.15} />
      <polyline points={makeCurve(sdTU, rPanelX)} fill="none" stroke={PRIMARY} strokeWidth={2.5} />
      <line x1={rx} y1={tPad} x2={rx} y2={baseY} stroke={SUCCESS} strokeWidth={1.5} strokeDasharray="4,3" />

      {/* Titles */}
      <text x={lPad + panelW / 2} y={16} fill={WARN} fontSize={11} textAnchor="middle" fontWeight="700">T = X₁</text>
      <text x={rPanelX + panelW / 2} y={16} fill={PRIMARY} fontSize={11} textAnchor="middle" fontWeight="700">T_U = x̄ (Rao-Blackwell)</text>
      <text x={lPad + panelW / 2} y={tPad + 13} fill={MUTED} fontSize={9} textAnchor="middle">Var = λ = {lam}</text>
      <text x={rPanelX + panelW / 2} y={tPad + 13} fill={MUTED} fontSize={9} textAnchor="middle">Var = λ/n = {(lam / n).toFixed(1)}</text>
      <text x={lPad + panelW / 2} y={H - 6} fill={MUTED} fontSize={9} textAnchor="middle">Inefficient estimator</text>
      <text x={rPanelX + panelW / 2} y={H - 6} fill={MUTED} fontSize={9} textAnchor="middle">UMVU (complete sufficient)</text>

      {/* Legend */}
      <line x1={5} y1={12} x2={17} y2={12} stroke={SUCCESS} strokeWidth={1.5} strokeDasharray="4,3" />
      <text x={20} y={15} fill={MUTED} fontSize={8}>λ = {lam}</text>
    </svg>
  );
};

// ── 2. Cramér-Rao Bound: variance vs Fisher information ──────────────────────
export const VizCramerRao: React.FC = () => {
  const sigma2 = 1;
  const nMax = 30;
  const PTS = nMax;

  const padL = 42, padR = 20, padT = 28, padB = 34;
  const pw = W - padL - padR, ph = H - padT - padB;

  const xMap = (n: number) => padL + ((n - 1) / (nMax - 1)) * pw;
  const varMax = 1.1;
  const yMap = (v: number) => padT + ph - (v / varMax) * ph;

  const crPoints = Array.from({ length: PTS }, (_, i) => {
    const n = i + 1;
    return `${xMap(n).toFixed(1)},${yMap(sigma2 / n).toFixed(1)}`;
  }).join(' ');

  const ineffPoints = `${xMap(1).toFixed(1)},${yMap(sigma2).toFixed(1)} ${xMap(nMax).toFixed(1)},${yMap(sigma2).toFixed(1)}`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1.0];

  return (
    <svg width={W} height={H} style={{ background: BG, borderRadius: 8, display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={pw} height={ph} fill={SURFACE} rx={3} />

      {/* Grid lines */}
      {yTicks.map(v => (
        <g key={v}>
          <line x1={padL} y1={yMap(v)} x2={padL + pw} y2={yMap(v)} stroke={BG} strokeWidth={1} />
          <text x={padL - 5} y={yMap(v) + 4} fill={MUTED} fontSize={8} textAnchor="end">{v.toFixed(2)}</text>
        </g>
      ))}
      {[5, 10, 15, 20, 25, 30].map(n => (
        <text key={n} x={xMap(n)} y={padT + ph + 14} fill={MUTED} fontSize={8} textAnchor="middle">{n}</text>
      ))}

      {/* Inefficient estimator: constant σ² */}
      <polyline points={ineffPoints} fill="none" stroke={WARN} strokeWidth={2} strokeDasharray="6,4" />

      {/* CR bound = UMVU variance = σ²/n */}
      <polyline points={crPoints} fill="none" stroke={PRIMARY} strokeWidth={2.5} />

      {/* Annotations */}
      <text x={padL + pw - 5} y={yMap(sigma2) - 6} fill={WARN} fontSize={9} textAnchor="end">Inefficient: Var = σ²</text>
      <text x={padL + pw * 0.55} y={yMap(sigma2 / 12) - 7} fill={PRIMARY} fontSize={9} textAnchor="middle">UMVU = CR bound = σ²/n</text>

      {/* Axes labels */}
      <text x={padL + pw / 2} y={H - 4} fill={MUTED} fontSize={9} textAnchor="middle">Sample size n</text>
      <text x={9} y={padT + ph / 2} fill={MUTED} fontSize={9} textAnchor="middle" transform={`rotate(-90,9,${padT + ph / 2})`}>Variance</text>
      <text x={W / 2} y={18} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">Cramér-Rao Bound (σ² = 1)</text>
    </svg>
  );
};

// ── 3. Neyman-Pearson: likelihood ratio test ─────────────────────────────────
export const VizNeymanPearson: React.FC = () => {
  const nObs = 10, theta0 = 0.3, theta1 = 0.7;
  const alpha = 0.05;

  const padL = 32, padR = 15, padT = 28, padB = 34;
  const pw = W - padL - padR, ph = H - padT - padB;

  const ks = Array.from({ length: 11 }, (_, i) => i);
  const ratios = ks.map(k => binomPMF(k, nObs, theta1) / Math.max(binomPMF(k, nObs, theta0), 1e-15));
  const maxR = Math.max(...ratios);

  // Rejection region: size α under θ₀ (upper tail of Binomial(10,0.3))
  const cdf0 = ks.map(k => {
    let c = 0; for (let j = 0; j <= k; j++) c += binomPMF(j, nObs, theta0); return c;
  });
  // c₀ = min k such that P(K≥k) ≤ α → find smallest k with 1-cdf0[k-1] ≤ α
  let crit = nObs + 1;
  for (let k = nObs; k >= 0; k--) {
    const pTail = 1 - (k > 0 ? cdf0[k - 1] : 0);
    if (pTail <= alpha) crit = k;
  }

  const barW = pw / 11 * 0.7;
  const xBar = (k: number) => padL + (k / 10) * pw;
  const yBar = (r: number) => padT + ph - (r / maxR) * ph * 0.9;

  return (
    <svg width={W} height={H} style={{ background: BG, borderRadius: 8, display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={pw} height={ph} fill={SURFACE} rx={3} />

      {ks.map(k => {
        const inReject = k >= crit;
        const r = ratios[k];
        const bx = xBar(k) - barW / 2;
        const by = yBar(r);
        const bh = padT + ph - by;
        return (
          <g key={k}>
            <rect x={bx.toFixed(1)} y={by.toFixed(1)} width={barW.toFixed(1)} height={Math.max(bh, 0).toFixed(1)}
              fill={inReject ? SUCCESS : PRIMARY} opacity={inReject ? 0.9 : 0.5} rx={2} />
            <text x={xBar(k)} y={padT + ph + 14} fill={MUTED} fontSize={8} textAnchor="middle">{k}</text>
          </g>
        );
      })}

      {/* Critical value line */}
      {crit <= nObs && (
        <line x1={xBar(crit) - barW * 0.8} y1={padT} x2={xBar(crit) - barW * 0.8} y2={padT + ph}
          stroke={WARN} strokeWidth={1.5} strokeDasharray="5,3" />
      )}

      {/* Labels */}
      <text x={W / 2} y={18} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">
        Neyman-Pearson: Likelihood Ratio f(k|θ₁)/f(k|θ₀)
      </text>
      <text x={padL + pw / 2} y={H - 4} fill={MUTED} fontSize={9} textAnchor="middle">
        k = number of successes (n=10, θ₀=0.3, θ₁=0.7)
      </text>
      <rect x={padL + 5} y={padT + 5} width={10} height={8} fill={SUCCESS} opacity={0.9} rx={1} />
      <text x={padL + 19} y={padT + 13} fill={MUTED} fontSize={8}>Reject H₀ (k≥{crit})</text>
      <rect x={padL + 80} y={padT + 5} width={10} height={8} fill={PRIMARY} opacity={0.5} rx={1} />
      <text x={padL + 94} y={padT + 13} fill={MUTED} fontSize={8}>Accept H₀</text>
    </svg>
  );
};

// ── 4. Power Function of UMP z-test ─────────────────────────────────────────
export const VizPowerFunction: React.FC = () => {
  const mu0 = 0, sigma = 1, nObs = 10, alpha = 0.05;
  const z_alpha = 1.6449; // z_{1-α} for one-sided test
  const muMin = -1, muMax = 3;

  const padL = 42, padR = 20, padT = 28, padB = 34;
  const pw = W - padL - padR, ph = H - padT - padB;

  const PTS = 120;
  const xMap = (mu: number) => padL + ((mu - muMin) / (muMax - muMin)) * pw;
  const yMap = (p: number) => padT + ph - p * ph;

  // β(μ) = 1 - Φ(z_{1-α} - μ√n/σ) = P(reject | μ)
  const powerPts = Array.from({ length: PTS }, (_, i) => {
    const mu = muMin + (i / (PTS - 1)) * (muMax - muMin);
    const beta = 1 - phi(z_alpha - (mu - mu0) * Math.sqrt(nObs) / sigma);
    return `${xMap(mu).toFixed(1)},${yMap(beta).toFixed(1)}`;
  }).join(' ');

  // Fill area under curve for mu > mu0
  const fillPts = Array.from({ length: PTS }, (_, i) => {
    const mu = muMin + (i / (PTS - 1)) * (muMax - muMin);
    const beta = 1 - phi(z_alpha - (mu - mu0) * Math.sqrt(nObs) / sigma);
    return `${xMap(mu).toFixed(1)},${yMap(beta).toFixed(1)}`;
  });
  const fillStr = `${xMap(mu0).toFixed(1)},${yMap(0).toFixed(1)} ` + fillPts.join(' ') + ` ${xMap(muMax).toFixed(1)},${yMap(0).toFixed(1)}`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1.0];
  const x0 = xMap(mu0), alphaY = yMap(alpha);

  return (
    <svg width={W} height={H} style={{ background: BG, borderRadius: 8, display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={pw} height={ph} fill={SURFACE} rx={3} />

      {/* Grid */}
      {yTicks.map(v => (
        <g key={v}>
          <line x1={padL} y1={yMap(v)} x2={padL + pw} y2={yMap(v)} stroke={BG} strokeWidth={1} />
          <text x={padL - 5} y={yMap(v) + 4} fill={MUTED} fontSize={8} textAnchor="end">{v.toFixed(2)}</text>
        </g>
      ))}
      {[-1, 0, 1, 2, 3].map(mu => (
        <text key={mu} x={xMap(mu)} y={padT + ph + 14} fill={MUTED} fontSize={8} textAnchor="middle">{mu}</text>
      ))}

      {/* Fill power region for Ha */}
      <polygon points={fillStr} fill={SUCCESS} opacity={0.08} />

      {/* Power curve */}
      <polyline points={powerPts} fill="none" stroke={SUCCESS} strokeWidth={2.5} />

      {/* H₀ vertical */}
      <line x1={x0} y1={padT} x2={x0} y2={padT + ph} stroke={WARN} strokeWidth={1.5} strokeDasharray="5,3" />

      {/* Size α marker */}
      <line x1={padL} y1={alphaY} x2={x0} y2={alphaY} stroke={WARN} strokeWidth={1} strokeDasharray="3,2" />
      <text x={x0 - 4} y={alphaY - 5} fill={WARN} fontSize={9} textAnchor="end">size α = {alpha}</text>

      {/* Annotations */}
      <text x={W / 2} y={18} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">
        Power Function β(μ) — One-sided z-test (n=10, σ=1)
      </text>
      <text x={padL + pw / 2} y={H - 4} fill={MUTED} fontSize={9} textAnchor="middle">True mean μ</text>
      <text x={9} y={padT + ph / 2} fill={MUTED} fontSize={9} textAnchor="middle" transform={`rotate(-90,9,${padT + ph / 2})`}>Power β(μ)</text>
      <text x={xMap(1.8)} y={yMap(0.82)} fill={SUCCESS} fontSize={9}>β(μ) = P(reject H₀ | μ)</text>
      <text x={xMap(mu0) + 5} y={padT + 14} fill={WARN} fontSize={9}>H₀: μ=0</text>
    </svg>
  );
};

// ── 5. Optimal Bayesian Inference: posterior mean ────────────────────────────
export const VizBayesDecision: React.FC = () => {
  const mu0 = 0, tau0 = 2;   // Prior N(0, 4)
  const muMLE = 3, sigma = 1, nObs = 5; // Data: x̄=3, σ=1, n=5
  // Posterior: 1/τ₁² = 1/τ₀² + n/σ²
  const invTau1sq = 1 / (tau0 * tau0) + nObs / (sigma * sigma);
  const tau1 = Math.sqrt(1 / invTau1sq);
  const mu1 = (mu0 / (tau0 * tau0) + nObs * muMLE / (sigma * sigma)) / invTau1sq;

  const padL = 25, padR = 20, padT = 28, padB = 34;
  const pw = W - padL - padR, ph = H - padT - padB;

  const xMin = -4, xMax = 6;
  const PTS = 150;
  const xMap = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * pw;

  const priorPeak = normalPDF(mu0, mu0, tau0);
  const likePeak  = normalPDF(muMLE, muMLE, sigma / Math.sqrt(nObs));
  const postPeak  = normalPDF(mu1, mu1, tau1);
  const scaleMax  = Math.max(priorPeak, likePeak, postPeak);

  const curve = (mu: number, sd: number) =>
    Array.from({ length: PTS }, (_, i) => {
      const x = xMin + (i / (PTS - 1)) * (xMax - xMin);
      const y = normalPDF(x, mu, sd) / scaleMax;
      return `${xMap(x).toFixed(1)},${(padT + ph - y * ph * 0.85).toFixed(1)}`;
    }).join(' ');

  const baseY = padT + ph;
  const xM0  = xMap(mu0);
  const xMLE = xMap(muMLE);
  const xPost = xMap(mu1);

  return (
    <svg width={W} height={H} style={{ background: BG, borderRadius: 8, display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={pw} height={ph} fill={SURFACE} rx={3} />

      {/* Prior */}
      <polyline points={curve(mu0, tau0)} fill="none" stroke={MUTED} strokeWidth={2} strokeDasharray="6,3" />
      {/* Likelihood (scaled) */}
      <polyline points={curve(muMLE, sigma / Math.sqrt(nObs))} fill="none" stroke={WARN} strokeWidth={2} />
      {/* Posterior */}
      <polyline points={curve(mu1, tau1)} fill="none" stroke={PRIMARY} strokeWidth={2.5} />

      {/* Vertical markers */}
      <line x1={xM0}  y1={padT} x2={xM0}  y2={baseY} stroke={MUTED} strokeWidth={1} strokeDasharray="4,3" />
      <line x1={xMLE} y1={padT} x2={xMLE} y2={baseY} stroke={WARN}  strokeWidth={1} strokeDasharray="4,3" />
      <line x1={xPost} y1={padT} x2={xPost} y2={baseY} stroke={PRIMARY} strokeWidth={2} />

      {/* Labels at bottom */}
      <text x={xM0}  y={baseY + 13} fill={MUTED} fontSize={9} textAnchor="middle">μ₀={mu0}</text>
      <text x={xPost} y={baseY + 13} fill={PRIMARY} fontSize={9} textAnchor="middle">Bayes={mu1.toFixed(2)}</text>
      <text x={xMLE} y={baseY + 13} fill={WARN} fontSize={9} textAnchor="middle">MLE={muMLE}</text>

      {/* Title and legend */}
      <text x={W / 2} y={18} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">
        Bayes Rule: Posterior Mean Minimises Expected Squared Error
      </text>
      <line x1={padL + 5} y1={padT + 13} x2={padL + 20} y2={padT + 13} stroke={MUTED} strokeWidth={2} strokeDasharray="6,3" />
      <text x={padL + 24} y={padT + 16} fill={MUTED} fontSize={8}>Prior N(0,{tau0}²)</text>
      <line x1={padL + 95} y1={padT + 13} x2={padL + 110} y2={padT + 13} stroke={WARN} strokeWidth={2} />
      <text x={padL + 114} y={padT + 16} fill={MUTED} fontSize={8}>Likelihood</text>
      <line x1={padL + 175} y1={padT + 13} x2={padL + 190} y2={padT + 13} stroke={PRIMARY} strokeWidth={2.5} />
      <text x={padL + 194} y={padT + 16} fill={MUTED} fontSize={8}>Posterior</text>
    </svg>
  );
};

// ── 6. Risk Function: decision theory ────────────────────────────────────────
export const VizRiskFunction: React.FC = () => {
  const sigma2 = 1, nObs = 10;
  const rUMVU = sigma2 / nObs;   // R(x̄, θ) = σ²/n (constant, minimax for location)

  const thetaMin = -3, thetaMax = 3;
  const rMax = 1.05;

  const padL = 42, padR = 20, padT = 28, padB = 34;
  const pw = W - padL - padR, ph = H - padT - padB;

  const xMap = (t: number) => padL + ((t - thetaMin) / (thetaMax - thetaMin)) * pw;
  const yMap = (r: number) => padT + ph - (r / rMax) * ph;

  const PTS = 120;
  // Risk of T = x̄: R = σ²/n = 0.1
  const umvuPts = `${xMap(thetaMin).toFixed(1)},${yMap(rUMVU).toFixed(1)} ${xMap(thetaMax).toFixed(1)},${yMap(rUMVU).toFixed(1)}`;

  // Risk of T = 0 (constant estimator): R = (0 - θ)² = θ²
  const constPts = Array.from({ length: PTS }, (_, i) => {
    const t = thetaMin + (i / (PTS - 1)) * (thetaMax - thetaMin);
    return `${xMap(t).toFixed(1)},${yMap(Math.min(t * t, rMax)).toFixed(1)}`;
  }).join(' ');

  // Risk of shrinkage estimator T = 0.8·x̄: bias² + variance
  // bias = 0.8μ - μ = -0.2μ, Var = 0.64·σ²/n
  const shrinkPts = Array.from({ length: PTS }, (_, i) => {
    const t = thetaMin + (i / (PTS - 1)) * (thetaMax - thetaMin);
    const r = (0.2 * t) ** 2 + 0.64 * rUMVU;
    return `${xMap(t).toFixed(1)},${yMap(Math.min(r, rMax)).toFixed(1)}`;
  }).join(' ');

  const yTicks = [0, 0.25, 0.5, 0.75, 1.0];

  return (
    <svg width={W} height={H} style={{ background: BG, borderRadius: 8, display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={pw} height={ph} fill={SURFACE} rx={3} />

      {/* Grid */}
      {yTicks.map(v => (
        <g key={v}>
          <line x1={padL} y1={yMap(v)} x2={padL + pw} y2={yMap(v)} stroke={BG} strokeWidth={1} />
          <text x={padL - 5} y={yMap(v) + 4} fill={MUTED} fontSize={8} textAnchor="end">{v.toFixed(2)}</text>
        </g>
      ))}
      {[-3, -2, -1, 0, 1, 2, 3].map(t => (
        <text key={t} x={xMap(t)} y={padT + ph + 14} fill={MUTED} fontSize={8} textAnchor="middle">{t}</text>
      ))}

      {/* Risk curves */}
      <polyline points={constPts} fill="none" stroke={WARN} strokeWidth={2} strokeDasharray="6,3" />
      <polyline points={shrinkPts} fill="none" stroke={ACCENT} strokeWidth={2} />
      <polyline points={umvuPts} fill="none" stroke={SUCCESS} strokeWidth={2.5} />

      {/* Labels */}
      <text x={W / 2} y={18} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">
        Risk Functions R_δ(θ) — Decision Theory (σ²=1, n=10)
      </text>
      <text x={padL + pw / 2} y={H - 4} fill={MUTED} fontSize={9} textAnchor="middle">True parameter θ</text>
      <text x={9} y={padT + ph / 2} fill={MUTED} fontSize={9} textAnchor="middle" transform={`rotate(-90,9,${padT + ph / 2})`}>Risk R_δ(θ)</text>

      {/* Legend */}
      <line x1={padL + 5} y1={padT + 14} x2={padL + 20} y2={padT + 14} stroke={SUCCESS} strokeWidth={2.5} />
      <text x={padL + 24} y={padT + 17} fill={MUTED} fontSize={8}>x̄ (UMVU, minimax)</text>
      <line x1={padL + 5} y1={padT + 26} x2={padL + 20} y2={padT + 26} stroke={ACCENT} strokeWidth={2} />
      <text x={padL + 24} y={padT + 29} fill={MUTED} fontSize={8}>0.8·x̄ (shrinkage)</text>
      <line x1={padL + 5} y1={padT + 38} x2={padL + 20} y2={padT + 38} stroke={WARN} strokeWidth={2} strokeDasharray="6,3" />
      <text x={padL + 24} y={padT + 41} fill={MUTED} fontSize={8}>T=0 (constant estimator)</text>
    </svg>
  );
};
