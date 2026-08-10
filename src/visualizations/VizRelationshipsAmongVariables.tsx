import React, { useState } from 'react';

const W = 500, H = 220;
const BG = '#0f172a', SURFACE = '#1e293b', PRIMARY = '#38bdf8', ACCENT = '#818cf8';
const SUCCESS = '#34d399', WARN = '#fb923c', TEXT = '#f1f5f9', MUTED = '#64748b', DANGER = '#f87171';

function lcg(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 4294967295; };
}

// Box-Muller from a seeded LCG, for reproducible synthetic scatter data.
function gaussianStream(seed: number) {
  const rnd = lcg(seed);
  return () => {
    const u1 = Math.max(rnd(), 1e-9), u2 = rnd();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };
}

const SliderRow: React.FC<{ label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string; color?: string }> =
  ({ label, value, min, max, step, onChange, display, color = PRIMARY }) => (
    <label style={{ color: MUTED, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
      {label}: <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))} style={{ width: 110, accentColor: color }} />
      <span style={{ color: TEXT }}>{display}</span>
    </label>
  );

// ── 1. Related vs Unrelated Variables (scatter comparison) ───────────────────
export const VizScatterRelationship: React.FC = () => {
  const n = 40;
  const gA = gaussianStream(11), gB = gaussianStream(22);

  const panelW = 195, gapX = 60, lPad = 25;
  const rPanelX = lPad + panelW + gapX;
  const tPad = 34, bPad = 30, plotH = H - tPad - bPad;

  const xMap = (x: number, panelL: number) => panelL + ((x + 3) / 6) * panelW;
  const yMap = (y: number) => tPad + plotH - ((y + 3) / 6) * plotH;

  const unrelated = Array.from({ length: n }, () => ({ x: gA(), y: gB() }));
  const related = Array.from({ length: n }, () => {
    const x = gA();
    const y = 0.85 * x + 0.5 * gaussianStream(x * 1000 | 0)();
    return { x, y };
  });

  return (
    <svg width={W} height={H} style={{ background: BG, borderRadius: 8, display: 'block', maxWidth: '100%' }}>
      <rect x={lPad} y={tPad} width={panelW} height={plotH} fill={SURFACE} rx={3} />
      <rect x={rPanelX} y={tPad} width={panelW} height={plotH} fill={SURFACE} rx={3} />

      {unrelated.map((p, i) => (
        <circle key={i} cx={xMap(p.x, lPad)} cy={yMap(p.y)} r={2.6} fill={WARN} opacity={0.75} />
      ))}
      {related.map((p, i) => (
        <circle key={i} cx={xMap(p.x, rPanelX)} cy={yMap(p.y)} r={2.6} fill={PRIMARY} opacity={0.8} />
      ))}

      {/* conditional-mean reference line for the related panel */}
      <line x1={xMap(-2.5, rPanelX)} y1={yMap(-2.5 * 0.85)} x2={xMap(2.5, rPanelX)} y2={yMap(2.5 * 0.85)}
        stroke={SUCCESS} strokeWidth={2} strokeDasharray="5,3" />

      <text x={lPad + panelW / 2} y={16} fill={WARN} fontSize={11} textAnchor="middle" fontWeight="700">X, Y independent</text>
      <text x={rPanelX + panelW / 2} y={16} fill={PRIMARY} fontSize={11} textAnchor="middle" fontWeight="700">X, Y related</text>
      <text x={lPad + panelW / 2} y={H - 8} fill={MUTED} fontSize={9} textAnchor="middle">f(y|x) = f(y) — knowing x tells us nothing</text>
      <text x={rPanelX + panelW / 2} y={H - 8} fill={MUTED} fontSize={9} textAnchor="middle">E(Y|X=x) shifts with x</text>
    </svg>
  );
};

// ── 2. Contingency Table & Chi-Squared Association ────────────────────────────
export const VizContingencyTable: React.FC = () => {
  const [delta, setDelta] = useState(0.2);
  const rowTotal = 50;
  const p1 = 0.5 + delta, p2 = 0.5 - delta;

  const o11 = Math.round(rowTotal * p1), o12 = rowTotal - o11;
  const o21 = Math.round(rowTotal * p2), o22 = rowTotal - o21;
  const n = 2 * rowTotal;
  const col1 = o11 + o21, col2 = o12 + o22;

  const e11 = (rowTotal * col1) / n, e12 = (rowTotal * col2) / n;
  const e21 = (rowTotal * col1) / n, e22 = (rowTotal * col2) / n;

  const X2 = ((o11 - e11) ** 2) / e11 + ((o12 - e12) ** 2) / e12 + ((o21 - e21) ** 2) / e21 + ((o22 - e22) ** 2) / e22;
  const sig = X2 > 3.841;

  const cellStyle = (): React.CSSProperties => ({
    padding: '10px 14px', textAlign: 'center', color: TEXT, fontSize: 14, fontWeight: 600,
    background: 'rgba(56,189,248,0.08)', border: `1px solid ${MUTED}33`,
  });

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 10, textAlign: 'center' }}>
        2×2 Contingency Table — Row/Column Association
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th></th>
              <th style={{ color: MUTED, fontSize: 11, padding: '0 10px' }}>Col 1</th>
              <th style={{ color: MUTED, fontSize: 11, padding: '0 10px' }}>Col 2</th>
              <th style={{ color: MUTED, fontSize: 11, padding: '0 10px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ color: MUTED, fontSize: 11, padding: '0 10px' }}>Row 1</td>
              <td style={cellStyle()}>{o11}</td>
              <td style={cellStyle()}>{o12}</td>
              <td style={{ ...cellStyle(), background: 'transparent', color: MUTED }}>{rowTotal}</td>
            </tr>
            <tr>
              <td style={{ color: MUTED, fontSize: 11, padding: '0 10px' }}>Row 2</td>
              <td style={cellStyle()}>{o21}</td>
              <td style={cellStyle()}>{o22}</td>
              <td style={{ ...cellStyle(), background: 'transparent', color: MUTED }}>{rowTotal}</td>
            </tr>
            <tr>
              <td style={{ color: MUTED, fontSize: 11, padding: '0 10px' }}>Total</td>
              <td style={{ ...cellStyle(), background: 'transparent', color: MUTED }}>{col1}</td>
              <td style={{ ...cellStyle(), background: 'transparent', color: MUTED }}>{col2}</td>
              <td style={{ ...cellStyle(), background: 'transparent', color: MUTED }}>{n}</td>
            </tr>
          </tbody>
        </table>
        <div style={{ textAlign: 'center', minWidth: 150 }}>
          <div style={{ fontSize: 11, color: MUTED }}>X² = Σ(o−e)²/e, df=1</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: sig ? SUCCESS : WARN }}>{X2.toFixed(3)}</div>
          <div style={{ fontSize: 11, color: sig ? SUCCESS : MUTED }}>
            {sig ? 'X² > 3.841 → reject independence (α=0.05)' : 'X² ≤ 3.841 → no evidence against independence'}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
        <SliderRow label="Association strength δ" value={delta} min={0} max={0.45} step={0.01}
          onChange={setDelta} display={delta.toFixed(2)} color={ACCENT} />
      </div>
    </div>
  );
};

// ── 3. Simple Linear Regression — least squares vs a guessed line ────────────
export const VizRegressionLine: React.FC = () => {
  const g = gaussianStream(7);
  const n = 14;
  const xs = Array.from({ length: n }, (_, i) => -3 + (6 * i) / (n - 1));
  const trueB0 = 4, trueB1 = 1.4;
  const ys = xs.map(x => trueB0 + trueB1 * x + 1.1 * g());

  const xbar = xs.reduce((a, b) => a + b, 0) / n;
  const ybar = ys.reduce((a, b) => a + b, 0) / n;
  const sxx = xs.reduce((s, x) => s + (x - xbar) ** 2, 0);
  const sxy = xs.reduce((s, x, i) => s + (x - xbar) * (ys[i] - ybar), 0);
  const b1hat = sxy / sxx;
  const b0hat = ybar - b1hat * xbar;
  const sseHat = xs.reduce((s, x, i) => s + (ys[i] - (b0hat + b1hat * x)) ** 2, 0);

  const [b1guess, setB1guess] = useState(0.5);
  const b0guess = ybar - b1guess * xbar; // guess line always passes through (x̄, ȳ)
  const sseGuess = xs.reduce((s, x, i) => s + (ys[i] - (b0guess + b1guess * x)) ** 2, 0);

  const PAD = { l: 40, r: 16, t: 30, b: 34 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const xMin = -4, xMax = 4, yMin = -4, yMax = 12;
  const xS = (x: number) => PAD.l + ((x - xMin) / (xMax - xMin)) * pw;
  const yS = (y: number) => PAD.t + ph - ((y - yMin) / (yMax - yMin)) * ph;

  const linePts = (b0: number, b1: number) => `${xS(xMin).toFixed(1)},${yS(b0 + b1 * xMin).toFixed(1)} ${xS(xMax).toFixed(1)},${yS(b0 + b1 * xMax).toFixed(1)}`;

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Least Squares Fit — drag the slope and watch SSE
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <rect x={PAD.l} y={PAD.t} width={pw} height={ph} fill={SURFACE} rx={3} />
        <polyline points={linePts(b0guess, b1guess)} stroke={WARN} strokeWidth={2} strokeDasharray="6,4" />
        <polyline points={linePts(b0hat, b1hat)} stroke={PRIMARY} strokeWidth={2.5} />
        {xs.map((x, i) => (
          <circle key={i} cx={xS(x)} cy={yS(ys[i])} r={3} fill={TEXT} opacity={0.9} />
        ))}
        <text x={W / 2} y={16} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">
          y = β̂₀ + β̂₁x  vs.  your guess
        </text>
        <rect x={PAD.l + 5} y={PAD.t + 5} width={10} height={8} fill={PRIMARY} rx={1} />
        <text x={PAD.l + 19} y={PAD.t + 13} fill={MUTED} fontSize={8}>OLS fit (β̂₁={b1hat.toFixed(2)})</text>
        <rect x={PAD.l + 140} y={PAD.t + 5} width={10} height={8} fill={WARN} rx={1} />
        <text x={PAD.l + 154} y={PAD.t + 13} fill={MUTED} fontSize={8}>Your line (b₁={b1guess.toFixed(2)})</text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginTop: 6 }}>
        <SliderRow label="Slope guess b₁" value={b1guess} min={-1} max={3.5} step={0.05}
          onChange={setB1guess} display={b1guess.toFixed(2)} color={WARN} />
        <div style={{ fontSize: 12, color: MUTED }}>
          SSE(guess) = <span style={{ color: WARN, fontWeight: 700 }}>{sseGuess.toFixed(2)}</span>
          {'  ·  '}
          SSE(OLS) = <span style={{ color: PRIMARY, fontWeight: 700 }}>{sseHat.toFixed(2)}</span>
          {sseGuess < sseHat + 1e-6 && Math.abs(sseGuess - sseHat) < 1e-6 && (
            <span style={{ color: SUCCESS }}> — matched the minimum!</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ── 4. Residual Plot for the fitted regression ───────────────────────────────
export const VizRegressionResiduals: React.FC = () => {
  const g = gaussianStream(7);
  const n = 14;
  const xs = Array.from({ length: n }, (_, i) => -3 + (6 * i) / (n - 1));
  const trueB0 = 4, trueB1 = 1.4;
  const ys = xs.map(x => trueB0 + trueB1 * x + 1.1 * g());

  const xbar = xs.reduce((a, b) => a + b, 0) / n;
  const ybar = ys.reduce((a, b) => a + b, 0) / n;
  const sxx = xs.reduce((s, x) => s + (x - xbar) ** 2, 0);
  const sxy = xs.reduce((s, x, i) => s + (x - xbar) * (ys[i] - ybar), 0);
  const b1hat = sxy / sxx;
  const b0hat = ybar - b1hat * xbar;
  const resid = xs.map((x, i) => ys[i] - (b0hat + b1hat * x));
  const s2 = resid.reduce((s, r) => s + r * r, 0) / (n - 2);
  const s = Math.sqrt(s2);
  const standardized = resid.map(r => r / s);

  const PAD = { l: 36, r: 16, t: 30, b: 34 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const xMin = -4, xMax = 4, yLim = 3;
  const xS = (x: number) => PAD.l + ((x - xMin) / (xMax - xMin)) * pw;
  const yS = (r: number) => PAD.t + ph / 2 - (Math.max(-yLim, Math.min(yLim, r)) / yLim) * (ph / 2);

  return (
    <svg width={W} height={H} style={{ background: BG, borderRadius: 8, display: 'block', maxWidth: '100%' }}>
      <rect x={PAD.l} y={PAD.t} width={pw} height={ph} fill={SURFACE} rx={3} />
      <line x1={PAD.l} y1={yS(0)} x2={PAD.l + pw} y2={yS(0)} stroke={MUTED} strokeWidth={1} />
      <line x1={PAD.l} y1={yS(2)} x2={PAD.l + pw} y2={yS(2)} stroke={MUTED} strokeWidth={0.7} strokeDasharray="2,3" />
      <line x1={PAD.l} y1={yS(-2)} x2={PAD.l + pw} y2={yS(-2)} stroke={MUTED} strokeWidth={0.7} strokeDasharray="2,3" />
      {xs.map((x, i) => (
        <circle key={i} cx={xS(x)} cy={yS(standardized[i])} r={3.2} fill={Math.abs(standardized[i]) > 2 ? DANGER : PRIMARY} />
      ))}
      <text x={W / 2} y={18} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">
        Standardized Residuals rᵢ⋆ = eᵢ/s vs xᵢ
      </text>
      <text x={PAD.l + pw / 2} y={H - 4} fill={MUTED} fontSize={9} textAnchor="middle">Predictor x</text>
      <text x={9} y={PAD.t + ph / 2} fill={MUTED} fontSize={9} textAnchor="middle" transform={`rotate(-90,9,${PAD.t + ph / 2})`}>rᵢ⋆</text>
      <text x={PAD.l + pw - 4} y={PAD.t + 12} fill={MUTED} fontSize={8} textAnchor="end">no pattern, all inside (−2,2) → model looks reasonable</text>
    </svg>
  );
};

// ── 5. Correlation Strength — scatter shape as r varies ───────────────────────
export const VizCorrelationStrength: React.FC = () => {
  const [r, setR] = useState(0.6);
  const n = 60;
  const gx = gaussianStream(3), gz = gaussianStream(9);
  const pts = Array.from({ length: n }, () => {
    const x = gx();
    const z = gz();
    const y = r * x + Math.sqrt(Math.max(0, 1 - r * r)) * z;
    return { x, y };
  });

  const PAD = { l: 30, r: 16, t: 30, b: 30 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const lim = 3.2;
  const xS = (x: number) => PAD.l + ((x + lim) / (2 * lim)) * pw;
  const yS = (y: number) => PAD.t + ph - ((y + lim) / (2 * lim)) * ph;

  const color = r >= 0 ? SUCCESS : DANGER;

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Sample Correlation r = {r.toFixed(2)}
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <rect x={PAD.l} y={PAD.t} width={pw} height={ph} fill={SURFACE} rx={3} />
        <line x1={xS(-lim)} y1={yS(0)} x2={xS(lim)} y2={yS(0)} stroke={MUTED} strokeWidth={0.6} />
        <line x1={xS(0)} y1={yS(-lim)} x2={xS(0)} y2={yS(lim)} stroke={MUTED} strokeWidth={0.6} />
        {pts.map((p, i) => (
          <circle key={i} cx={xS(p.x)} cy={yS(p.y)} r={2.8} fill={color} opacity={0.8} />
        ))}
        {Math.abs(r) > 0.05 && (
          <line x1={xS(-lim)} y1={yS(-lim * r)} x2={xS(lim)} y2={yS(lim * r)} stroke={color} strokeWidth={1.5} strokeDasharray="5,3" opacity={0.8} />
        )}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
        <SliderRow label="r" value={r} min={-0.98} max={0.98} step={0.02} onChange={setR} display={r.toFixed(2)} color={color} />
      </div>
    </div>
  );
};

// ── 6. One-Way ANOVA — between vs within group variance ──────────────────────
export const VizANOVAGroups: React.FC = () => {
  const [effect, setEffect] = useState(1.5);
  const k = 3, nPerGroup = 8;
  const seeds = [101, 202, 303];
  const groupMeans = [0, effect, -effect * 0.6];

  const groups = groupMeans.map((mu, gi) => {
    const g = gaussianStream(seeds[gi]);
    return Array.from({ length: nPerGroup }, () => mu + 1 * g());
  });

  const allVals = groups.flat();
  const N = allVals.length;
  const grandMean = allVals.reduce((a, b) => a + b, 0) / N;
  const groupSampleMeans = groups.map(g => g.reduce((a, b) => a + b, 0) / g.length);

  const ssb = groups.reduce((s, g, i) => s + g.length * (groupSampleMeans[i] - grandMean) ** 2, 0);
  const ssw = groups.reduce((s, g, i) => s + g.reduce((s2, v) => s2 + (v - groupSampleMeans[i]) ** 2, 0), 0);
  const dfb = k - 1, dfw = N - k;
  const msb = ssb / dfb, msw = ssw / dfw;
  const F = msb / msw;
  const fCrit = 3.47; // approx F_{0.05}(2,21)

  const PAD = { l: 34, r: 16, t: 30, b: 34 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const yMin = -4, yMax = 4;
  const yS = (v: number) => PAD.t + ph - ((v - yMin) / (yMax - yMin)) * ph;
  const groupW = pw / k;

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        One-Way ANOVA — F = MSB/MSW = {F.toFixed(2)} {F > fCrit ? '(significant at α=0.05)' : '(not significant)'}
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <rect x={PAD.l} y={PAD.t} width={pw} height={ph} fill={SURFACE} rx={3} />
        <line x1={PAD.l} y1={yS(grandMean)} x2={PAD.l + pw} y2={yS(grandMean)} stroke={MUTED} strokeWidth={1} strokeDasharray="4,3" />
        {groups.map((g, gi) => {
          const cx = PAD.l + groupW * (gi + 0.5);
          return (
            <g key={gi}>
              {g.map((v, i) => (
                <circle key={i} cx={cx + (i % 2 === 0 ? -6 : 6)} cy={yS(v)} r={2.6} fill={[PRIMARY, ACCENT, WARN][gi]} opacity={0.75} />
              ))}
              <line x1={cx - 16} y1={yS(groupSampleMeans[gi])} x2={cx + 16} y2={yS(groupSampleMeans[gi])} stroke={[PRIMARY, ACCENT, WARN][gi]} strokeWidth={2.5} />
              <text x={cx} y={PAD.t + ph + 14} fill={MUTED} fontSize={9} textAnchor="middle">group {gi + 1}</text>
            </g>
          );
        })}
        <text x={PAD.l + pw - 4} y={PAD.t + 12} fill={MUTED} fontSize={8} textAnchor="end">dashed = grand mean</text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginTop: 6 }}>
        <SliderRow label="Effect size (mean separation)" value={effect} min={0} max={3} step={0.1}
          onChange={setEffect} display={effect.toFixed(1)} color={ACCENT} />
        <div style={{ fontSize: 12, color: MUTED }}>
          SSB={ssb.toFixed(1)} · SSW={ssw.toFixed(1)} · F_crit(2,21)≈{fCrit}
        </div>
      </div>
    </div>
  );
};

// ── 7. Multiple Comparisons — family-wise error rate ──────────────────────────
export const VizMultipleComparisons: React.FC = () => {
  const [alpha] = useState(0.05);
  const mMax = 20;

  const PAD = { l: 42, r: 16, t: 30, b: 34 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const xS = (m: number) => PAD.l + ((m - 1) / (mMax - 1)) * pw;
  const yS = (p: number) => PAD.t + ph - p * ph;

  const unadjusted = Array.from({ length: mMax }, (_, i) => {
    const m = i + 1;
    return `${xS(m).toFixed(1)},${yS(1 - (1 - alpha) ** m).toFixed(1)}`;
  }).join(' ');

  const bonferroniLine = `${xS(1).toFixed(1)},${yS(alpha).toFixed(1)} ${xS(mMax).toFixed(1)},${yS(alpha).toFixed(1)}`;

  return (
    <svg width={W} height={H} style={{ background: BG, borderRadius: 8, display: 'block', maxWidth: '100%' }}>
      <rect x={PAD.l} y={PAD.t} width={pw} height={ph} fill={SURFACE} rx={3} />
      {[0, 0.25, 0.5, 0.75, 1].map(v => (
        <g key={v}>
          <line x1={PAD.l} y1={yS(v)} x2={PAD.l + pw} y2={yS(v)} stroke={BG} strokeWidth={1} />
          <text x={PAD.l - 5} y={yS(v) + 4} fill={MUTED} fontSize={8} textAnchor="end">{v.toFixed(2)}</text>
        </g>
      ))}
      {[1, 5, 10, 15, 20].map(m => (
        <text key={m} x={xS(m)} y={PAD.t + ph + 14} fill={MUTED} fontSize={8} textAnchor="middle">{m}</text>
      ))}
      <polyline points={unadjusted} fill="none" stroke={DANGER} strokeWidth={2.5} />
      <polyline points={bonferroniLine} fill="none" stroke={SUCCESS} strokeWidth={2} strokeDasharray="6,4" />
      <text x={W / 2} y={18} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">
        Family-Wise Error Rate vs. Number of Comparisons m
      </text>
      <text x={PAD.l + pw / 2} y={H - 4} fill={MUTED} fontSize={9} textAnchor="middle">m independent comparisons, each at α=0.05</text>
      <text x={9} y={PAD.t + ph / 2} fill={MUTED} fontSize={9} textAnchor="middle" transform={`rotate(-90,9,${PAD.t + ph / 2})`}>P(≥1 false positive)</text>
      <line x1={PAD.l + 5} y1={PAD.t + 12} x2={PAD.l + 20} y2={PAD.t + 12} stroke={DANGER} strokeWidth={2.5} />
      <text x={PAD.l + 24} y={PAD.t + 15} fill={MUTED} fontSize={8}>Unadjusted: 1−(1−α)ᵐ</text>
      <line x1={PAD.l + 5} y1={PAD.t + 24} x2={PAD.l + 20} y2={PAD.t + 24} stroke={SUCCESS} strokeWidth={2} strokeDasharray="6,4" />
      <text x={PAD.l + 24} y={PAD.t + 27} fill={MUTED} fontSize={8}>Bonferroni: α/m per test → held at α</text>
    </svg>
  );
};
