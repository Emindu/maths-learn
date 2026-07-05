import React, { useState, useEffect, useRef } from 'react';

// ── Shared style helpers ──────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  padding: '20px',
  margin: '16px 0 32px',
};
const label: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--color-text-secondary)',
  marginBottom: '16px',
};

// ── 1. Discrete Expectation ───────────────────────────────────────────────────
export const VizDiscreteExpectation: React.FC = () => {
  // Adjustable 4-value distribution
  const [weights, setWeights] = useState([1, 2, 4, 2]);
  const values = [1, 2, 3, 4];

  const total = weights.reduce((s, w) => s + w, 0);
  const probs = weights.map((w) => w / total);
  const ev = probs.reduce((s, p, i) => s + p * values[i], 0);

  return (
    <div style={card}>
      <div style={label}>
        <strong>Discrete Expectation:</strong> Drag the sliders to change the weight on each outcome.
        E(X) is the probability-weighted average.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        {values.map((v, i) => (
          <div key={v} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '30px', fontWeight: 'bold', color: 'var(--color-text)', textAlign: 'right' }}>
              X={v}
            </span>
            <input
              type="range" min={0} max={10} step={1} value={weights[i]}
              onChange={(e) => {
                const w = [...weights];
                w[i] = parseInt(e.target.value);
                setWeights(w);
              }}
              style={{ flex: 1 }}
            />
            <span style={{ width: '52px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              p={probs[i].toFixed(2)}
            </span>
            <div style={{
              height: '16px',
              width: `${probs[i] * 160}px`,
              background: '#3b82f6',
              borderRadius: '4px',
              transition: 'width 0.2s',
              minWidth: '2px',
            }} />
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', fontSize: '1rem', color: 'var(--color-text)', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
        E(X) = {probs.map((p, i) => `${p.toFixed(2)}×${values[i]}`).join(' + ')} ={' '}
        <strong style={{ color: '#3b82f6', fontSize: '1.1rem' }}>{ev.toFixed(3)}</strong>
      </div>
    </div>
  );
};

// ── 2. St. Petersburg Paradox ─────────────────────────────────────────────────
export const VizStPetersburg: React.FC = () => {
  const [rounds, setRounds] = useState(10);

  const rows = Array.from({ length: rounds }, (_, k) => {
    const flip = k + 1;
    const prob = Math.pow(0.5, flip);
    const prize = Math.pow(2, flip);
    const cumEV = flip; // each term contributes $1
    return { flip, prob, prize, cumEV };
  });

  return (
    <div style={card}>
      <div style={label}>
        <strong>St. Petersburg Paradox:</strong> Each row contributes exactly $1 to the expected value.
        The total grows without bound — yet most people pay only a few dollars to play.
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Show rows:</span>
        <input type="range" min={4} max={20} step={1} value={rounds}
          onChange={(e) => setRounds(parseInt(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>{rounds}</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}>
              {['First head on flip k', 'P(X=k)', 'Prize $2ᵏ', 'Contribution', 'Cumulative E(X)'].map((h) => (
                <th key={h} style={{ padding: '6px 10px', textAlign: 'right', borderBottom: '1px solid var(--color-border)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ flip, prob, prize, cumEV }) => (
              <tr key={flip} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '5px 10px', textAlign: 'right', color: 'var(--color-text)' }}>{flip}</td>
                <td style={{ padding: '5px 10px', textAlign: 'right', color: 'var(--color-text-secondary)' }}>1/{Math.round(1 / prob)}</td>
                <td style={{ padding: '5px 10px', textAlign: 'right', color: 'var(--color-text)' }}>${prize.toLocaleString()}</td>
                <td style={{ padding: '5px 10px', textAlign: 'right', color: '#3b82f6', fontWeight: 600 }}>$1</td>
                <td style={{ padding: '5px 10px', textAlign: 'right', color: '#8b5cf6', fontWeight: 600 }}>${cumEV}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        After {rounds} rows: E(X) = <strong style={{ color: '#8b5cf6' }}>${rounds}</strong> — and keeps growing as rows → ∞
      </div>
    </div>
  );
};

// ── 3. Continuous Expectation ─────────────────────────────────────────────────
export const VizContinuousExpectation: React.FC = () => {
  const [mu, setMu] = useState(0);
  const sigma = 1;
  const W = 300;
  const H = 140;

  const toSvgX = (x: number) => (x - (mu - 4)) / 8 * W;
  const normal = (x: number) => Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));

  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = (mu - 4) + (i / 200) * 8;
    pts.push({ x: toSvgX(x), y: H - normal(x) * 320 });
  }
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const muSvgX = toSvgX(mu);

  return (
    <div style={card}>
      <div style={label}>
        <strong>Continuous Expectation:</strong> The mean μ is the balance point of the density. Shift μ and watch the curve slide.
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <svg width={W} height={H + 20} style={{ overflow: 'visible' }}>
          <path d={pathD} fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2" />
          <line x1={muSvgX} y1={0} x2={muSvgX} y2={H} stroke="#ef4444" strokeWidth="2" strokeDasharray="5 3" />
          <text x={muSvgX} y={H + 16} textAnchor="middle" fontSize="12" fill="#ef4444" fontWeight="bold">μ = {mu.toFixed(1)}</text>
          <text x="4" y="12" fontSize="11" fill="var(--color-text-secondary)">f(x)</text>
        </svg>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>μ:</span>
        <input type="range" min={-3} max={3} step={0.1} value={mu}
          onChange={(e) => setMu(parseFloat(e.target.value))} style={{ flex: 1 }} />
        <span style={{ width: '36px', fontWeight: 'bold', color: '#ef4444' }}>{mu.toFixed(1)}</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        E(X) = <strong style={{ color: '#ef4444' }}>{mu.toFixed(1)}</strong> — the red line marks the centre of mass
      </div>
    </div>
  );
};

// ── 4. Variance and Spread ────────────────────────────────────────────────────
export const VizVarianceSpread: React.FC = () => {
  const [sigma, setSigma] = useState(1.0);
  const mu = 0;
  const W = 300;
  const H = 150;

  const normal = (x: number) => Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
  const toSvgX = (x: number) => (x + 4) / 8 * W;
  const toSvgY = (y: number) => H - y * 300;

  const pts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = -4 + (i / 200) * 8;
    pts.push(`${i === 0 ? 'M' : 'L'}${toSvgX(x).toFixed(1)},${toSvgY(normal(x)).toFixed(1)}`);
  }

  const x1Svg = toSvgX(mu - sigma);
  const x2Svg = toSvgX(mu + sigma);

  return (
    <div style={card}>
      <div style={label}>
        <strong>Variance as Spread:</strong> Larger σ means the distribution is more spread around the mean. Var(X) = σ².
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <svg width={W} height={H + 10} style={{ overflow: 'visible' }}>
          {/* ±1σ band */}
          <rect x={x1Svg} y={0} width={x2Svg - x1Svg} height={H} fill="rgba(16,185,129,0.15)" />
          <path d={pts.join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2" />
          <line x1={x1Svg} y1={0} x2={x1Svg} y2={H} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1={x2Svg} y1={0} x2={x2Svg} y2={H} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x={x1Svg - 2} y={H + 14} textAnchor="end" fontSize="11" fill="#10b981">−σ</text>
          <text x={x2Svg + 2} y={H + 14} textAnchor="start" fontSize="11" fill="#10b981">+σ</text>
          <text x={toSvgX(mu)} y={H + 14} textAnchor="middle" fontSize="11" fill="#ef4444">μ=0</text>
        </svg>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>σ:</span>
        <input type="range" min={0.3} max={2.5} step={0.05} value={sigma}
          onChange={(e) => setSigma(parseFloat(e.target.value))} style={{ flex: 1 }} />
        <span style={{ width: '36px', fontWeight: 'bold', color: '#10b981' }}>{sigma.toFixed(2)}</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.85rem', color: 'var(--color-text)' }}>
        Var(X) = σ² = <strong style={{ color: '#10b981' }}>{(sigma * sigma).toFixed(3)}</strong>
        &nbsp;&nbsp;|&nbsp;&nbsp;SD(X) = σ = <strong>{sigma.toFixed(2)}</strong>
      </div>
    </div>
  );
};

// ── 5. Covariance Sign Visualisation ─────────────────────────────────────────
export const VizCovarianceSign: React.FC = () => {
  const [rho, setRho] = useState(0.7);

  const zPairs = Array.from({ length: 120 }, (_, i) => {
    const u1 = ((i * 137 + 7) % 997) / 997 + 0.001;
    const u2 = ((i * 271 + 13) % 997) / 997 + 0.001;
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    return { z1, z2 };
  });

  const points = zPairs.map(({ z1, z2 }) => ({
    x: z1,
    y: rho * z1 + Math.sqrt(Math.max(0, 1 - rho * rho)) * z2,
  }));

  const W = 200;
  const H = 200;
  const toSvgX = (x: number) => W / 2 + x * 30;
  const toSvgY = (y: number) => H / 2 - y * 30;

  const dotColor = rho > 0.3 ? 'rgba(16,185,129,0.7)' : rho < -0.3 ? 'rgba(239,68,68,0.7)' : 'rgba(59,130,246,0.7)';

  return (
    <div style={card}>
      <div style={label}>
        <strong>Covariance &amp; Correlation:</strong> Adjust ρ to see positive, zero, or negative linear association.
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <div style={{ position: 'relative', width: W, height: H, background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
          <svg width={W} height={H}>
            <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="var(--color-border)" strokeDasharray="4 4" />
            <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="var(--color-border)" strokeDasharray="4 4" />
            {points.map((p, i) => (
              <circle key={i} cx={toSvgX(p.x)} cy={toSvgY(p.y)} r="2.5" fill={dotColor} />
            ))}
          </svg>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>ρ:</span>
        <input type="range" min={-0.95} max={0.95} step={0.05} value={rho}
          onChange={(e) => setRho(parseFloat(e.target.value))} style={{ flex: 1 }} />
        <span style={{ width: '44px', textAlign: 'right', fontWeight: 'bold', color: dotColor }}>{rho.toFixed(2)}</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        Corr(X,Y) = {rho.toFixed(2)} →{' '}
        {rho > 0.3 ? 'Positive association' : rho < -0.3 ? 'Negative association' : 'Near-zero association'}
      </div>
    </div>
  );
};

// ── 6. MGF Table ─────────────────────────────────────────────────────────────
export const VizMGFTable: React.FC = () => {
  const rows = [
    { dist: 'Bernoulli(θ)', mgf: '(1−θ) + θeˢ', mean: 'θ', variance: 'θ(1−θ)' },
    { dist: 'Binomial(n,θ)', mgf: '(1−θ+θeˢ)ⁿ', mean: 'nθ', variance: 'nθ(1−θ)' },
    { dist: 'Poisson(λ)', mgf: 'exp(λ(eˢ−1))', mean: 'λ', variance: 'λ' },
    { dist: 'Exp(λ)', mgf: 'λ/(λ−s)  for s<λ', mean: '1/λ', variance: '1/λ²' },
    { dist: 'N(μ,σ²)', mgf: 'exp(μs + σ²s²/2)', mean: 'μ', variance: 'σ²' },
  ];

  const thStyle: React.CSSProperties = {
    padding: '8px 12px',
    textAlign: 'left',
    borderBottom: '2px solid var(--color-border)',
    color: 'var(--color-text-secondary)',
    fontSize: '0.8rem',
    fontWeight: 600,
  };
  const tdStyle: React.CSSProperties = {
    padding: '7px 12px',
    borderBottom: '1px solid var(--color-border)',
    fontSize: '0.85rem',
    color: 'var(--color-text)',
  };

  return (
    <div style={card}>
      <div style={label}>
        <strong>Moment Generating Functions:</strong> m(s) = E[e^{'{sX}'}]. Differentiate at s=0 to read off moments.
        m'(0) = E[X], m''(0) = E[X²], and Var(X) = m''(0) − m'(0)².
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg)' }}>
              <th style={thStyle}>Distribution</th>
              <th style={thStyle}>MGF m(s)</th>
              <th style={{ ...thStyle, color: '#3b82f6' }}>Mean m'(0)</th>
              <th style={{ ...thStyle, color: '#10b981' }}>Variance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.dist}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{r.dist}</td>
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.8rem' }}>{r.mgf}</td>
                <td style={{ ...tdStyle, color: '#3b82f6', fontWeight: 600 }}>{r.mean}</td>
                <td style={{ ...tdStyle, color: '#10b981', fontWeight: 600 }}>{r.variance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── 7. Conditional Mean Visualisation ────────────────────────────────────────
export const VizConditionalMean: React.FC = () => {
  const [selectedY, setSelectedY] = useState<number | null>(null);

  // Joint PMF: p(X=x, Y=y)
  const joint = [
    [0.05, 0.10, 0.05],  // Y=1
    [0.10, 0.20, 0.10],  // Y=2
    [0.05, 0.10, 0.25],  // Y=3
  ];
  const xVals = [1, 2, 3];
  const yVals = [1, 2, 3];

  const margY = joint.map((row) => row.reduce((s, v) => s + v, 0));
  const condMeans = joint.map((row, yi) => {
    const py = margY[yi];
    return py > 0 ? row.reduce((s, v, xi) => s + (v / py) * xVals[xi], 0) : null;
  });

  return (
    <div style={card}>
      <div style={label}>
        <strong>Conditional Mean E(X|Y=y):</strong> Click a Y row to see the conditional distribution and mean.
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(3, 52px) auto', gap: '6px', alignItems: 'center' }}>
            <div />
            {xVals.map((x) => (
              <div key={x} style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>X={x}</div>
            ))}
            <div style={{ fontWeight: 'bold', color: '#ec4899', fontSize: '0.8rem', paddingLeft: '6px' }}>E(X|Y)</div>

            {yVals.map((y, yi) => (
              <React.Fragment key={y}>
                <button
                  onClick={() => setSelectedY(selectedY === y ? null : y)}
                  style={{
                    textAlign: 'right', paddingRight: '8px', fontWeight: 'bold', fontSize: '0.8rem',
                    color: selectedY === y ? '#8b5cf6' : 'var(--color-text-secondary)',
                    background: 'none', border: 'none', cursor: 'pointer',
                  }}
                >
                  Y={y}
                </button>
                {xVals.map((_, xi) => {
                  const isSelected = selectedY === y;
                  return (
                    <div key={xi} style={{
                      width: '52px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isSelected ? 'rgba(139,92,246,0.15)' : 'var(--color-bg)',
                      border: `1px solid ${isSelected ? '#8b5cf6' : 'var(--color-border)'}`,
                      borderRadius: '6px', fontSize: '0.8rem', fontWeight: isSelected ? 'bold' : 'normal',
                      color: isSelected ? '#8b5cf6' : 'var(--color-text)',
                      transition: 'all 0.15s',
                    }}>
                      {joint[yi][xi].toFixed(2)}
                    </div>
                  );
                })}
                <div style={{
                  height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', color: '#ec4899', paddingLeft: '6px', fontSize: '0.9rem',
                  opacity: selectedY === null || selectedY === y ? 1 : 0.3,
                }}>
                  {condMeans[yi]?.toFixed(2) ?? '—'}
                </div>
              </React.Fragment>
            ))}
          </div>

          {selectedY !== null && (
            <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.88rem', color: 'var(--color-text)', background: 'rgba(139,92,246,0.08)', borderRadius: '8px', padding: '10px' }}>
              P(Y={selectedY}) = {margY[selectedY - 1].toFixed(2)}&nbsp;&nbsp;|&nbsp;&nbsp;
              E(X | Y={selectedY}) = <strong style={{ color: '#ec4899' }}>{condMeans[selectedY - 1]?.toFixed(3)}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── 8. Total Expectation ──────────────────────────────────────────────────────
export const VizTotalExpectation: React.FC = () => {
  // Partition into 3 events, each with conditional mean and probability
  const events = [
    { label: 'A₁: Low (Y<3)', color: '#3b82f6', prob: 0.3, condMean: 1.5 },
    { label: 'A₂: Mid (3≤Y<7)', color: '#10b981', prob: 0.5, condMean: 5.0 },
    { label: 'A₃: High (Y≥7)', color: '#f59e0b', prob: 0.2, condMean: 9.0 },
  ];
  const totalEV = events.reduce((s, e) => s + e.prob * e.condMean, 0);

  return (
    <div style={card}>
      <div style={label}>
        <strong>Law of Total Expectation:</strong> E(X) = Σ E(X|Aᵢ) · P(Aᵢ). Partition the sample space, compute weighted conditional means.
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {events.map((e) => (
          <div key={e.label} style={{
            flex: '1 1 130px', border: `2px solid ${e.color}`, borderRadius: '10px', padding: '12px',
            background: `${e.color}18`, textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.75rem', color: e.color, fontWeight: 'bold', marginBottom: '6px' }}>{e.label}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>P(Aᵢ) = {e.prob}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>E(X|Aᵢ) = {e.condMean}</div>
            <div style={{ fontSize: '0.88rem', color: e.color, fontWeight: 'bold', marginTop: '6px' }}>
              × = {(e.prob * e.condMean).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.95rem', color: 'var(--color-text)', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
        E(X) = {events.map((e) => `${e.prob}×${e.condMean}`).join(' + ')} ={' '}
        <strong style={{ color: '#8b5cf6', fontSize: '1.1rem' }}>{totalEV.toFixed(2)}</strong>
      </div>
    </div>
  );
};

// ── 9. Markov Bound ───────────────────────────────────────────────────────────
export const VizMarkovBound: React.FC = () => {
  const [a, setA] = useState(2.0);
  const lambda = 1; // Exp(1), mean = 1
  const W = 300;
  const H = 130;

  const toSvgX = (x: number) => (x / 6) * W;
  const toSvgY = (y: number) => H - y * H * 0.9;
  const expDensity = (x: number) => lambda * Math.exp(-lambda * x);

  const pts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = (i / 200) * 6;
    pts.push(`${i === 0 ? 'M' : 'L'}${toSvgX(x).toFixed(1)},${toSvgY(expDensity(x)).toFixed(1)}`);
  }

  const exact = Math.exp(-lambda * a);
  const markov = Math.min(1, 1 / a); // E(X)/a = 1/a

  return (
    <div style={card}>
      <div style={label}>
        <strong>Markov's Inequality:</strong> X ~ Exp(1), E(X) = 1. Move the threshold a. Compare P(X≥a) exact vs Markov bound 1/a.
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        <svg width={W} height={H} style={{ overflow: 'visible' }}>
          {/* Tail area fill */}
          {(() => {
            const tailPts: string[] = [];
            const x0 = toSvgX(a);
            for (let i = 0; i <= 100; i++) {
              const x = a + (i / 100) * (6 - a);
              tailPts.push(`${i === 0 ? 'M' : 'L'}${toSvgX(x).toFixed(1)},${toSvgY(expDensity(x)).toFixed(1)}`);
            }
            tailPts.push(`L${toSvgX(6)},${H} L${x0},${H} Z`);
            return <path d={tailPts.join(' ')} fill="rgba(239,68,68,0.25)" stroke="none" />;
          })()}
          <path d={pts.join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2" />
          <line x1={toSvgX(a)} y1={0} x2={toSvgX(a)} y2={H} stroke="#ef4444" strokeWidth="2" />
          <text x={toSvgX(a)} y={-6} textAnchor="middle" fontSize="11" fill="#ef4444" fontWeight="bold">a={a.toFixed(1)}</text>
        </svg>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '300px', margin: '0 auto 12px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>a:</span>
        <input type="range" min={0.5} max={5} step={0.1} value={a}
          onChange={(e) => setA(parseFloat(e.target.value))} style={{ flex: 1 }} />
        <span style={{ width: '32px', fontWeight: 'bold', color: '#ef4444' }}>{a.toFixed(1)}</span>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', padding: '8px 16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Exact P(X≥{a.toFixed(1)})</div>
          <div style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '1rem' }}>{exact.toFixed(4)}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(59,130,246,0.08)', borderRadius: '8px', padding: '8px 16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Markov bound E(X)/a</div>
          <div style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: '1rem' }}>{markov.toFixed(4)}</div>
        </div>
      </div>
    </div>
  );
};

// ── 10. Chebyshev Bound ───────────────────────────────────────────────────────
export const VizChebyshevBound: React.FC = () => {
  const [k, setK] = useState(1.5);
  const mu = 0;
  const sigma = 1;
  const W = 300;
  const H = 130;

  const normal = (x: number) => Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
  const toSvgX = (x: number) => (x + 4) / 8 * W;
  const toSvgY = (y: number) => H - y * 340;

  const pts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = -4 + (i / 200) * 8;
    pts.push(`${i === 0 ? 'M' : 'L'}${toSvgX(x).toFixed(1)},${toSvgY(normal(x)).toFixed(1)}`);
  }

  const a = k * sigma;
  const lx = mu - a;
  const rx = mu + a;

  // Exact (normal): P(|Z|>=k*sigma) = 2*(1-Phi(k)) approximated
  const phi = (z: number) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const poly = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    const p = 1 - (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z) * poly;
    return z < 0 ? 1 - p : p;
  };
  const exact = 2 * (1 - phi(k));
  const cheb = Math.min(1, 1 / (k * k));

  const tailFill = (xFrom: number, xTo: number) => {
    const ps: string[] = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const x = xFrom + (i / steps) * (xTo - xFrom);
      ps.push(`${i === 0 ? 'M' : 'L'}${toSvgX(x).toFixed(1)},${toSvgY(normal(x)).toFixed(1)}`);
    }
    ps.push(`L${toSvgX(xTo)},${H} L${toSvgX(xFrom)},${H} Z`);
    return ps.join(' ');
  };

  return (
    <div style={card}>
      <div style={label}>
        <strong>Chebyshev's Inequality:</strong> N(0,1). Adjust k. The shaded tails show P(|X|≥k·σ); Chebyshev bounds it by 1/k².
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        <svg width={W} height={H} style={{ overflow: 'visible' }}>
          <path d={tailFill(-4, lx)} fill="rgba(239,68,68,0.3)" stroke="none" />
          <path d={tailFill(rx, 4)} fill="rgba(239,68,68,0.3)" stroke="none" />
          <path d={pts.join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2" />
          <line x1={toSvgX(lx)} y1={0} x2={toSvgX(lx)} y2={H} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1={toSvgX(rx)} y1={0} x2={toSvgX(rx)} y2={H} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x={toSvgX(lx)} y={-6} textAnchor="middle" fontSize="10" fill="#ef4444">−{k.toFixed(1)}σ</text>
          <text x={toSvgX(rx)} y={-6} textAnchor="middle" fontSize="10" fill="#ef4444">+{k.toFixed(1)}σ</text>
        </svg>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '300px', margin: '0 auto 12px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>k:</span>
        <input type="range" min={0.5} max={4} step={0.1} value={k}
          onChange={(e) => setK(parseFloat(e.target.value))} style={{ flex: 1 }} />
        <span style={{ width: '32px', fontWeight: 'bold', color: '#ef4444' }}>{k.toFixed(1)}</span>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', padding: '8px 16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Exact P(|Z|≥{k.toFixed(1)}σ)</div>
          <div style={{ fontWeight: 'bold', color: '#ef4444' }}>{exact.toFixed(4)}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(59,130,246,0.08)', borderRadius: '8px', padding: '8px 16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Chebyshev 1/k²</div>
          <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>{cheb.toFixed(4)}</div>
        </div>
      </div>
    </div>
  );
};

// ── 11. Jensen's Inequality ───────────────────────────────────────────────────
export const VizJensenInequality: React.FC = () => {
  const [mean, setMean] = useState(1.5);
  const [spread, setSpread] = useState(1.0);
  const W = 300;
  const H = 160;

  // f(x) = x² (convex)
  const f = (x: number) => x * x;
  const toSvgX = (x: number) => ((x + 0.5) / 5) * W;
  const toSvgY = (y: number) => H - (y / 16) * H;

  const pts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = -0.5 + (i / 200) * 5;
    pts.push(`${i === 0 ? 'M' : 'L'}${toSvgX(x).toFixed(1)},${toSvgY(f(x)).toFixed(1)}`);
  }

  // Two-point distribution: P(X=mean−spread) = P(X=mean+spread) = 0.5
  const x1 = mean - spread;
  const x2 = mean + spread;
  const fEX = f(mean);        // f(E[X])
  const EfX = 0.5 * f(x1) + 0.5 * f(x2);  // E[f(X)]

  const x1Svg = toSvgX(x1);
  const x2Svg = toSvgX(x2);
  const muSvg = toSvgX(mean);

  return (
    <div style={card}>
      <div style={label}>
        <strong>Jensen's Inequality:</strong> f(x) = x² is convex. The chord (dashed) connecting f(x₁) and f(x₂) lies above the curve.
        E[f(X)] ≥ f(E[X]) always.
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        <svg width={W} height={H} style={{ overflow: 'visible' }}>
          {/* f(x) = x² curve */}
          <path d={pts.join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2" />

          {/* Chord from (x1, f(x1)) to (x2, f(x2)) */}
          {x1 >= -0.5 && x2 <= 4.5 && (
            <line
              x1={x1Svg} y1={toSvgY(f(x1))}
              x2={x2Svg} y2={toSvgY(f(x2))}
              stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3"
            />
          )}

          {/* f(E[X]) point */}
          {mean >= -0.5 && mean <= 4.5 && (
            <circle cx={muSvg} cy={toSvgY(fEX)} r="5" fill="#ef4444" />
          )}

          {/* E[f(X)] point (midpoint of chord) */}
          {x1 >= -0.5 && x2 <= 4.5 && (
            <circle cx={muSvg} cy={toSvgY(EfX)} r="5" fill="#10b981" />
          )}

          {/* Vertical arrow from f(E[X]) to E[f(X)] */}
          {x1 >= -0.5 && x2 <= 4.5 && EfX > fEX && (
            <line x1={muSvg + 8} y1={toSvgY(fEX)} x2={muSvg + 8} y2={toSvgY(EfX)} stroke="#8b5cf6" strokeWidth="1.5" />
          )}

          {/* x1, x2, mean markers */}
          {x1 >= -0.5 && <line x1={x1Svg} y1={H - 3} x2={x1Svg} y2={H + 3} stroke="var(--color-text)" strokeWidth="1" />}
          {x2 <= 4.5 && <line x1={x2Svg} y1={H - 3} x2={x2Svg} y2={H + 3} stroke="var(--color-text)" strokeWidth="1" />}
        </svg>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '200px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Mean:</span>
          <input type="range" min={0.5} max={3.5} step={0.1} value={mean}
            onChange={(e) => setMean(parseFloat(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{mean.toFixed(1)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '200px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Spread:</span>
          <input type="range" min={0.1} max={Math.min(mean - 0.1, 4.5 - mean)} step={0.1} value={spread}
            onChange={(e) => setSpread(parseFloat(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{spread.toFixed(1)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', padding: '8px 14px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>f(E[X]) = (E[X])²</div>
          <div style={{ fontWeight: 'bold', color: '#ef4444' }}>{fEX.toFixed(3)}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', padding: '8px 14px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>E[f(X)] = E[X²]</div>
          <div style={{ fontWeight: 'bold', color: '#10b981' }}>{EfX.toFixed(3)}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(139,92,246,0.08)', borderRadius: '8px', padding: '8px 14px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Gap = Var(X)</div>
          <div style={{ fontWeight: 'bold', color: '#8b5cf6' }}>{(EfX - fEX).toFixed(3)}</div>
        </div>
      </div>
    </div>
  );
};

// ── Continuous expectation extras ────────────────────────────────────────────

// ── 12a. Riemann Sum → Integral ───────────────────────────────────────────────
export const VizRiemannExpectation: React.FC = () => {
  const [n, setN] = useState(12);
  const lambda = 1; // Exp(1), E(X) = 1
  const xMax = 6;
  const W = 360;
  const H = 160;

  const f = (x: number) => lambda * Math.exp(-lambda * x);
  const toSvgX = (x: number) => (x / xMax) * W;
  const toSvgY = (y: number) => H - y * H * 1.1;

  // Riemann sum for ∫ x·f(x)dx using midpoints
  const dx = xMax / n;
  const bars: { x: number; height: number; contrib: number }[] = [];
  let approx = 0;
  for (let i = 0; i < n; i++) {
    const x = (i + 0.5) * dx; // midpoint
    const h = x * f(x);       // integrand value
    bars.push({ x, height: h, contrib: h * dx });
    approx += h * dx;
  }
  const exact = 1 / lambda; // = 1

  // Smooth density curve
  const curvePts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = (i / 200) * xMax;
    curvePts.push(`${i === 0 ? 'M' : 'L'}${toSvgX(x).toFixed(1)},${toSvgY(f(x)).toFixed(1)}`);
  }
  // x·f(x) curve
  const integrandPts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = (i / 200) * xMax;
    integrandPts.push(`${i === 0 ? 'M' : 'L'}${toSvgX(x).toFixed(1)},${toSvgY(x * f(x)).toFixed(1)}`);
  }
  // Fill area under x·f(x)
  const fillPts = integrandPts.concat([`L${W},${H}`, `L0,${H}`, 'Z']);

  const maxBar = Math.max(...bars.map((b) => b.height));

  return (
    <div style={card}>
      <div style={label}>
        <strong>Riemann Sum → Integral:</strong> X ~ Exp(1). Each bar is x·f(x)·Δx — the contribution of a thin strip to E(X). As n→∞, the sum converges to the exact integral ∫₀^∞ x·f(x)dx = 1.
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        <svg width={W} height={H} style={{ background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'visible' }}>
          {/* Area under x·f(x) */}
          <path d={fillPts.join(' ')} fill="rgba(16,185,129,0.12)" stroke="none" />

          {/* Riemann bars */}
          {bars.map(({ x, height }, i) => {
            const barH = (height / Math.max(maxBar, 0.001)) * (H * 0.9);
            const intensity = height / Math.max(maxBar, 0.001);
            const r = Math.round(59 + intensity * (16 - 59));
            const g2 = Math.round(130 + intensity * (185 - 130));
            const b2 = Math.round(246 + intensity * (129 - 246));
            return (
              <rect
                key={i}
                x={toSvgX(x - dx / 2)}
                y={H - barH}
                width={Math.max(toSvgX(dx) - 1, 1)}
                height={barH}
                fill={`rgba(${r},${g2},${b2},0.6)`}
                stroke={`rgb(${r},${g2},${b2})`}
                strokeWidth="0.5"
              />
            );
          })}

          {/* x·f(x) curve */}
          <path d={integrandPts.join(' ')} fill="none" stroke="#10b981" strokeWidth="2" />
          {/* f(x) density curve */}
          <path d={curvePts.join(' ')} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5 3" />

          {/* Labels */}
          <text x="4" y="12" fontSize="10" fill="#10b981" fontWeight="bold">x·f(x)</text>
          <text x="4" y="26" fontSize="10" fill="#3b82f6">f(x)</text>
        </svg>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '320px', margin: '0 auto 14px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>Rectangles n:</span>
        <input type="range" min={2} max={100} step={1} value={n}
          onChange={(e) => setN(parseInt(e.target.value))} style={{ flex: 1 }} />
        <span style={{ width: '32px', fontWeight: 'bold', color: 'var(--color-text)' }}>{n}</span>
      </div>

      <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', background: 'rgba(59,130,246,0.08)', borderRadius: '8px', padding: '8px 16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Riemann sum (n={n})</div>
          <div style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: '1.05rem' }}>{approx.toFixed(4)}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', padding: '8px 16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Exact E(X) = 1/λ</div>
          <div style={{ fontWeight: 'bold', color: '#10b981', fontSize: '1.05rem' }}>{exact.toFixed(4)}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', padding: '8px 16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Error</div>
          <div style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '1.05rem' }}>{Math.abs(approx - exact).toFixed(4)}</div>
        </div>
      </div>
    </div>
  );
};

// ── 12b. Continuous Distribution Means Explorer ───────────────────────────────
export const VizContinuousDistMeans: React.FC = () => {
  const [L, setL] = useState(1);
  const [R, setR] = useState(5);
  const [lam, setLam] = useState(1.5);
  const [mu, setMu] = useState(2);
  const [sig, setSig] = useState(1);

  const W = 200;
  const H = 100;

  const panels = [
    {
      label: 'Uniform[L, R]',
      mean: (L + R) / 2,
      formula: `(${L}+${R})/2 = ${((L + R) / 2).toFixed(2)}`,
      color: '#3b82f6',
      render: () => {
        const toX = (x: number) => ((x - 0) / 7) * W;
        const toY = (y: number) => H - y * H * 0.85;
        const density = 1 / (R - L);
        const pts = [
          `M${toX(0)},${toY(0)}`,
          `L${toX(L)},${toY(0)}`,
          `L${toX(L)},${toY(density)}`,
          `L${toX(R)},${toY(density)}`,
          `L${toX(R)},${toY(0)}`,
          `L${toX(7)},${toY(0)}`,
        ].join(' ');
        const meanX = toX((L + R) / 2);
        return { pts, meanX, domain: [0, 7] as [number, number] };
      },
    },
    {
      label: 'Exponential(λ)',
      mean: 1 / lam,
      formula: `1/${lam} = ${(1 / lam).toFixed(2)}`,
      color: '#10b981',
      render: () => {
        const toX = (x: number) => (x / 6) * W;
        const toY = (y: number) => H - y * H * 0.85;
        const fExp = (x: number) => lam * Math.exp(-lam * x);
        const pts: string[] = [];
        for (let i = 0; i <= 150; i++) {
          const x = (i / 150) * 6;
          pts.push(`${i === 0 ? 'M' : 'L'}${toX(x).toFixed(1)},${toY(fExp(x)).toFixed(1)}`);
        }
        const meanX = toX(1 / lam);
        return { pts: pts.join(' '), meanX, domain: [0, 6] as [number, number] };
      },
    },
    {
      label: 'Normal(μ, σ²)',
      mean: mu,
      formula: `μ = ${mu.toFixed(1)}`,
      color: '#8b5cf6',
      render: () => {
        const xMin = mu - 4 * sig;
        const xMax = mu + 4 * sig;
        const toX = (x: number) => ((x - xMin) / (xMax - xMin)) * W;
        const toY = (y: number) => H - y * H * 0.85;
        const fNorm = (x: number) =>
          Math.exp(-0.5 * ((x - mu) / sig) ** 2) / (sig * Math.sqrt(2 * Math.PI));
        const pts: string[] = [];
        for (let i = 0; i <= 150; i++) {
          const x = xMin + (i / 150) * (xMax - xMin);
          pts.push(`${i === 0 ? 'M' : 'L'}${toX(x).toFixed(1)},${toY(fNorm(x)).toFixed(1)}`);
        }
        const meanX = toX(mu);
        return { pts: pts.join(' '), meanX, domain: [xMin, xMax] as [number, number] };
      },
    },
  ];

  return (
    <div style={card}>
      <div style={label}>
        <strong>Continuous Distribution Means:</strong> Adjust the parameters. The red dashed line marks E(X) — the centre of mass of each density.
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '18px' }}>
        {panels.map(({ label: lbl, mean, formula, color, render }) => {
          const { pts, meanX } = render();
          return (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color, marginBottom: '6px' }}>{lbl}</div>
              <svg width={W} height={H} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '6px', display: 'block' }}>
                <path d={pts} fill={`${color}20`} stroke={color} strokeWidth="2" />
                <line x1={meanX} y1={0} x2={meanX} y2={H} stroke="#ef4444" strokeWidth="2" strokeDasharray="5 3" />
              </svg>
              <div style={{ marginTop: '6px', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                E(X) = <strong style={{ color: '#ef4444' }}>{mean.toFixed(3)}</strong>
                <span style={{ color, marginLeft: '4px' }}>({formula})</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Parameter sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
        {[
          { name: 'L (Uniform left)',  val: L,   min: 0,   max: R - 0.5, step: 0.5, set: setL,   color: '#3b82f6' },
          { name: 'R (Uniform right)', val: R,   min: L + 0.5, max: 7, step: 0.5, set: setR,   color: '#3b82f6' },
          { name: 'λ (Exp rate)',      val: lam, min: 0.3, max: 4,     step: 0.1, set: setLam, color: '#10b981' },
          { name: 'μ (Normal mean)',   val: mu,  min: -2,  max: 5,     step: 0.5, set: setMu,  color: '#8b5cf6' },
          { name: 'σ (Normal SD)',     val: sig, min: 0.3, max: 2.5,   step: 0.1, set: setSig, color: '#8b5cf6' },
        ].map(({ name, val, min, max, step, set, color }) => (
          <div key={name}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>{name}</div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input type="range" min={min} max={max} step={step} value={val}
                onChange={(e) => set(parseFloat(e.target.value))} style={{ flex: 1 }} />
              <span style={{ fontWeight: 'bold', color, minWidth: '28px', fontSize: '0.82rem' }}>{val}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── 12c. Continuous LOTUS Demo ────────────────────────────────────────────────
export const VizContinuousLOTUS: React.FC = () => {
  const [fnIdx, setFnIdx] = useState(0);

  // X ~ Exp(1), E[X] = 1
  const lambda = 1;
  const f = (x: number) => lambda * Math.exp(-lambda * x);
  const xMax = 6;
  const steps = 500;
  const dx = xMax / steps;

  const fns = [
    { label: 'g(x) = x²',        fn: (x: number) => x * x,              color: '#3b82f6', desc: 'E[X²] = 2/λ² = 2 (gives Var(X) = 2−1 = 1 = 1/λ²)' },
    { label: 'g(x) = √x',        fn: (x: number) => Math.sqrt(x),       color: '#10b981', desc: 'E[√X] < √(E[X]) = 1 by Jensen (√ is concave)' },
    { label: 'g(x) = e^{−x}',    fn: (x: number) => Math.exp(-x),       color: '#f59e0b', desc: 'E[e^{−X}] = λ/(λ+1) = 0.5 for Exp(1)' },
    { label: 'g(x) = log(x+1)',  fn: (x: number) => Math.log(x + 1),    color: '#8b5cf6', desc: 'E[log(X+1)] — computed numerically; log is concave so E < log(E[X]+1)' },
  ];

  const { fn, color, desc } = fns[fnIdx];

  // Numerically compute E[g(X)] via trapezoid rule
  let EgX = 0;
  const maxGf = { val: 0 };
  for (let i = 0; i <= steps; i++) {
    const x = i * dx;
    const gfx = fn(x) * f(x);
    EgX += gfx * dx;
    if (gfx > maxGf.val) maxGf.val = gfx;
  }
  const gEX = fn(1 / lambda); // g(E[X]) = g(1)

  const W = 360;
  const H = 140;
  const toSvgX = (x: number) => (x / xMax) * W;
  const toSvgY = (y: number) => H - (y / Math.max(maxGf.val * 1.2, 0.01)) * H;

  // Paths
  const fPath: string[] = [];
  const gfPath: string[] = [];
  const gfFill: string[] = [];

  for (let i = 0; i <= 200; i++) {
    const x = (i / 200) * xMax;
    const fx = f(x);
    const gfx = fn(x) * fx;
    const sx = toSvgX(x).toFixed(1);
    fPath.push(`${i === 0 ? 'M' : 'L'}${sx},${toSvgY(fx).toFixed(1)}`);
    gfPath.push(`${i === 0 ? 'M' : 'L'}${sx},${toSvgY(gfx).toFixed(1)}`);
    gfFill.push(`${i === 0 ? 'M' : 'L'}${sx},${toSvgY(gfx).toFixed(1)}`);
  }
  gfFill.push(`L${W},${H} L0,${H} Z`);

  return (
    <div style={card}>
      <div style={label}>
        <strong>Continuous LOTUS:</strong> X ~ Exp(1). The shaded area is ∫ g(x)·f(x)dx = E[g(X)]. The dashed line is f(x). Note E[g(X)] ≠ g(E[X]) for nonlinear g.
      </div>

      {/* Function selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        {fns.map((fn2, i) => (
          <button key={fn2.label} onClick={() => setFnIdx(i)} style={{
            padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
            border: `1.5px solid ${i === fnIdx ? fns[i].color : 'var(--color-border)'}`,
            background: i === fnIdx ? `${fns[i].color}20` : 'var(--color-bg)',
            color: i === fnIdx ? fns[i].color : 'var(--color-text-secondary)',
          }}>{fn2.label}</button>
        ))}
      </div>
      <div style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)', marginBottom: '12px', fontStyle: 'italic' }}>{desc}</div>

      {/* Chart */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
        <svg width={W} height={H} style={{ background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          {/* g(x)·f(x) filled area */}
          <path d={gfFill.join(' ')} fill={`${color}25`} stroke="none" />
          {/* f(x) dashed */}
          <path d={fPath.join(' ')} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="5 3" />
          {/* g(x)·f(x) solid */}
          <path d={gfPath.join(' ')} fill="none" stroke={color} strokeWidth="2" />
          {/* Labels */}
          <text x="6" y="14" fontSize="10" fill={color} fontWeight="bold">g(x)·f(x)</text>
          <text x="6" y="28" fontSize="10" fill="#64748b">f(x)</text>
          {/* Mean line x=1 */}
          <line x1={toSvgX(1)} y1={0} x2={toSvgX(1)} y2={H} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x={toSvgX(1) + 3} y="12" fontSize="10" fill="#ef4444">E[X]=1</text>
        </svg>
      </div>

      <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', background: `${color}15`, border: `1px solid ${color}50`, borderRadius: '8px', padding: '8px 16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>E[g(X)] = ∫ g·f dx</div>
          <div style={{ fontWeight: 'bold', color, fontSize: '1.05rem' }}>{EgX.toFixed(4)}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(239,68,68,0.08)', border: '1px solid #ef444440', borderRadius: '8px', padding: '8px 16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>g(E[X]) = g(1)</div>
          <div style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '1.05rem' }}>{gEX.toFixed(4)}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(139,92,246,0.08)', border: '1px solid #8b5cf640', borderRadius: '8px', padding: '8px 16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Equal?</div>
          <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: Math.abs(EgX - gEX) < 0.002 ? '#22c55e' : '#f59e0b' }}>
            {Math.abs(EgX - gEX) < 0.002 ? '✓ Yes' : `✗ No (Δ=${Math.abs(EgX - gEX).toFixed(3)})`}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Variance / Covariance extras ─────────────────────────────────────────────

// ── V1. Variance Scaling & Shift ──────────────────────────────────────────────
export const VizVarianceScaling: React.FC = () => {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);

  // X = fair die
  const dieVals = [1, 2, 3, 4, 5, 6];
  const p = 1 / 6;
  const EX = 3.5;
  const VarX = dieVals.reduce((s, x) => s + p * (x - EX) ** 2, 0); // 35/12

  // Y = aX + b
  const yVals = dieVals.map((x) => a * x + b);
  const EY = a * EX + b;
  const VarY_formula = a * a * VarX;
  const VarY_direct = yVals.reduce((s, y) => s + p * (y - EY) ** 2, 0);

  const allVals = [...dieVals, ...yVals];
  const minV = Math.min(...allVals);
  const maxV = Math.max(...allVals);
  const range = Math.max(maxV - minV, 1);

  const W = 340;
  const H = 110;
  const toX = (v: number) => ((v - minV) / range) * (W - 40) + 20;

  return (
    <div style={card}>
      <div style={label}>
        <strong>Variance of aX + b:</strong> X is a fair die. Y = aX + b. Shifting by b moves the distribution but leaves the spread unchanged. Scaling by a multiplies variance by a².
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {[
          { name: 'a (scale)', val: a, min: -3, max: 5, step: 0.5, set: setA, color: '#10b981' },
          { name: 'b (shift)', val: b, min: -8, max: 8, step: 1,   set: setB, color: '#f59e0b' },
        ].map(({ name, val, min, max, step, set, color }) => (
          <div key={name} style={{ flex: 1, minWidth: '160px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>{name}</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="range" min={min} max={max} step={step} value={val}
                onChange={(e) => set(parseFloat(e.target.value))} style={{ flex: 1 }} />
              <span style={{ fontWeight: 'bold', color, minWidth: '28px' }}>{val > 0 ? '+' : ''}{val}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dot plot on shared axis */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        <svg width={W} height={H} style={{ overflow: 'visible' }}>
          {/* Axis */}
          <line x1={20} y1={H - 10} x2={W - 20} y2={H - 10} stroke="var(--color-border)" strokeWidth="1" />

          {/* X dots */}
          {dieVals.map((x) => (
            <g key={`x-${x}`}>
              <circle cx={toX(x)} cy={H - 38} r="7" fill="#3b82f640" stroke="#3b82f6" strokeWidth="1.5" />
              <text x={toX(x)} y={H - 34} textAnchor="middle" fontSize="9" fill="#3b82f6" fontWeight="bold">{x}</text>
            </g>
          ))}

          {/* Y dots */}
          {yVals.map((y, i) => (
            <g key={`y-${i}`}>
              <circle cx={toX(y)} cy={H - 16} r="7" fill="#10b98140" stroke="#10b981" strokeWidth="1.5" />
              <text x={toX(y)} y={H - 12} textAnchor="middle" fontSize="9" fill="#10b981" fontWeight="bold">{y}</text>
            </g>
          ))}

          {/* Mean lines */}
          <line x1={toX(EX)} y1={H - 50} x2={toX(EX)} y2={H - 10} stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 3" />
          <line x1={toX(EY)} y1={H - 30} x2={toX(EY)} y2={H - 10} stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" />

          {/* Labels */}
          <text x={8} y={H - 34} fontSize="10" fill="#3b82f6" fontWeight="bold">X</text>
          <text x={8} y={H - 13} fontSize="10" fill="#10b981" fontWeight="bold">Y</text>
        </svg>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {[
          { label: 'E[X]', val: EX.toFixed(3), color: '#3b82f6' },
          { label: `E[Y] = a·E[X]+b = ${a}×${EX}${b >= 0 ? '+' : ''}${b}`, val: EY.toFixed(3), color: '#10b981' },
          { label: 'Var(X)', val: VarX.toFixed(4), color: '#3b82f6' },
          { label: `Var(Y) = a²·Var(X) = ${a}²×${VarX.toFixed(3)}`, val: VarY_formula.toFixed(4), color: '#10b981' },
        ].map(({ label: lbl, val, color }) => (
          <div key={lbl} style={{ background: `${color}10`, borderRadius: '8px', padding: '8px 12px', border: `1px solid ${color}30` }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>{lbl}</div>
            <div style={{ fontWeight: 'bold', color, fontSize: '0.95rem' }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.8rem', color: '#22c55e', fontWeight: 600 }}>
        ✓ Direct = {VarY_direct.toFixed(4)} &nbsp;|&nbsp; Formula = {VarY_formula.toFixed(4)} — always agree
      </div>
    </div>
  );
};

// ── V2. Bernoulli Variance Parabola ──────────────────────────────────────────
export const VizBernoulliVarianceCurve: React.FC = () => {
  const [theta, setTheta] = useState(0.4);

  const varTheta = theta * (1 - theta);
  const W = 320;
  const H = 140;
  const toX = (t: number) => t * W;
  const toY = (v: number) => H - v * H * 3.8;

  // Parabola path
  const parabolaPts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const t = i / 200;
    parabolaPts.push(`${i === 0 ? 'M' : 'L'}${toX(t).toFixed(1)},${toY(t * (1 - t)).toFixed(1)}`);
  }
  const fillPts = [...parabolaPts, `L${W},${H} L0,${H} Z`];

  const thetaSvgX = toX(theta);
  const varSvgY = toY(varTheta);

  return (
    <div style={card}>
      <div style={label}>
        <strong>Bernoulli Variance = θ(1−θ):</strong> The parabola peaks at θ = ½ (maximum uncertainty). Variance vanishes at θ = 0 and θ = 1 (outcome certain).
      </div>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
        {/* Parabola chart */}
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '4px' }}>Var(X) = θ(1−θ)</div>
          <svg width={W} height={H} style={{ background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'visible' }}>
            <path d={fillPts.join(' ')} fill="rgba(139,92,246,0.12)" stroke="none" />
            <path d={parabolaPts.join(' ')} fill="none" stroke="#8b5cf6" strokeWidth="2" />
            {/* θ vertical line */}
            <line x1={thetaSvgX} y1={0} x2={thetaSvgX} y2={H} stroke="#ef4444" strokeWidth="2" strokeDasharray="5 3" />
            {/* Current var point */}
            <circle cx={thetaSvgX} cy={varSvgY} r="6" fill="#ef4444" />
            {/* Max at θ=0.5 */}
            <circle cx={toX(0.5)} cy={toY(0.25)} r="4" fill="#10b981" />
            <text x={toX(0.5) + 6} y={toY(0.25) - 4} fontSize="10" fill="#10b981">max=0.25</text>
            {/* Axes labels */}
            <text x={0} y={H + 14} fontSize="10" fill="var(--color-text-secondary)">0</text>
            <text x={W - 6} y={H + 14} fontSize="10" fill="var(--color-text-secondary)">1</text>
            <text x={toX(0.5) - 6} y={H + 14} fontSize="10" fill="var(--color-text-secondary)">0.5</text>
            <text x={thetaSvgX} y={H + 14} textAnchor="middle" fontSize="10" fill="#ef4444">θ</text>
          </svg>
        </div>

        {/* PMF bars */}
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '4px' }}>Bernoulli({theta.toFixed(2)}) PMF</div>
          <svg width={140} height={H} style={{ background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            {/* Bar 0: height (1-θ) */}
            <rect x={20} y={H - (1 - theta) * (H - 20) - 10} width={40} height={(1 - theta) * (H - 20)} fill="rgba(239,68,68,0.4)" stroke="#ef4444" strokeWidth="1.5" rx="3" />
            <text x={40} y={H - (1 - theta) * (H - 20) - 14} textAnchor="middle" fontSize="10" fill="#ef4444">{(1 - theta).toFixed(2)}</text>
            <text x={40} y={H - 2} textAnchor="middle" fontSize="11" fill="var(--color-text)" fontWeight="bold">0</text>
            {/* Bar 1: height θ */}
            <rect x={80} y={H - theta * (H - 20) - 10} width={40} height={theta * (H - 20)} fill="rgba(34,197,94,0.4)" stroke="#22c55e" strokeWidth="1.5" rx="3" />
            <text x={100} y={H - theta * (H - 20) - 14} textAnchor="middle" fontSize="10" fill="#22c55e">{theta.toFixed(2)}</text>
            <text x={100} y={H - 2} textAnchor="middle" fontSize="11" fill="var(--color-text)" fontWeight="bold">1</text>
          </svg>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '300px', margin: '0 auto 12px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>θ:</span>
        <input type="range" min={0.01} max={0.99} step={0.01} value={theta}
          onChange={(e) => setTheta(parseFloat(e.target.value))} style={{ flex: 1 }} />
        <span style={{ width: '36px', fontWeight: 'bold', color: '#ef4444' }}>{theta.toFixed(2)}</span>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', background: 'rgba(139,92,246,0.08)', borderRadius: '8px', padding: '7px 14px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Var(X) = θ(1−θ)</div>
          <div style={{ fontWeight: 'bold', color: '#8b5cf6', fontSize: '1.05rem' }}>{varTheta.toFixed(4)}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', padding: '7px 14px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>SD(X) = √(θ(1−θ))</div>
          <div style={{ fontWeight: 'bold', color: '#10b981', fontSize: '1.05rem' }}>{Math.sqrt(varTheta).toFixed(4)}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', padding: '7px 14px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Max at θ=½</div>
          <div style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '1.05rem' }}>0.2500</div>
        </div>
      </div>
    </div>
  );
};

// ── V3. Covariance Decomposition ──────────────────────────────────────────────
export const VizCovarianceDecomposition: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  // Simple 3×3 discrete joint distribution
  const xVals = [1, 2, 3];
  const yVals = [1, 2, 3];
  const joint = [
    [0.10, 0.05, 0.05],
    [0.05, 0.25, 0.10],
    [0.05, 0.10, 0.25],
  ];

  const margX = xVals.map((_, xi) => joint.reduce((s, row) => s + row[xi], 0));
  const margY = joint.map((row) => row.reduce((s, v) => s + v, 0));

  const EX = xVals.reduce((s, x, xi) => s + x * margX[xi], 0);
  const EY = yVals.reduce((s, y, yi) => s + y * margY[yi], 0);
  const EXY = xVals.reduce((s, x, xi) =>
    s + yVals.reduce((s2, y, yi) => s2 + x * y * joint[yi][xi], 0), 0);
  const cov = EXY - EX * EY;

  return (
    <div style={card}>
      <div style={label}>
        <strong>Cov(X,Y) = E[XY] − E[X]·E[Y]:</strong> Hover a cell to see its contribution to E[XY]. The covariance decomposes into whether (X,Y) pairs cluster along the diagonal (positive cov) or off-diagonal (negative cov).
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
        {/* Joint PMF table */}
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px', textAlign: 'center' }}>p(X=x, Y=y)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(3, 56px) auto', gap: '5px', alignItems: 'center' }}>
            <div />
            {xVals.map((x) => <div key={x} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', color: '#3b82f6' }}>X={x}</div>)}
            <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 'bold', paddingLeft: '4px' }}>P(Y)</div>

            {yVals.map((y, yi) => (
              <React.Fragment key={y}>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ec4899', paddingRight: '4px', textAlign: 'right' }}>Y={y}</div>
                {xVals.map((x, xi) => {
                  const cellId = `${xi}-${yi}`;
                  const isHov = hovered === cellId;
                  const contrib = x * y * joint[yi][xi];
                  return (
                    <div
                      key={xi}
                      onMouseEnter={() => setHovered(cellId)}
                      onMouseLeave={() => setHovered(null)}
                      title={`x·y·p = ${x}×${y}×${joint[yi][xi]} = ${contrib.toFixed(3)}`}
                      style={{
                        width: '56px', height: '48px', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', cursor: 'default',
                        background: isHov ? 'rgba(59,130,246,0.2)' : (x === y ? 'rgba(16,185,129,0.08)' : 'var(--color-bg)'),
                        border: `1.5px solid ${isHov ? '#3b82f6' : (x === y ? '#10b981' : 'var(--color-border)')}`,
                        borderRadius: '6px', transition: 'all 0.12s',
                      }}
                    >
                      <span style={{ fontSize: '0.78rem', fontWeight: isHov ? 'bold' : 'normal', color: isHov ? '#3b82f6' : 'var(--color-text)' }}>
                        {joint[yi][xi].toFixed(2)}
                      </span>
                      {isHov && (
                        <span style={{ fontSize: '0.62rem', color: '#3b82f6' }}>xy·p={contrib.toFixed(3)}</span>
                      )}
                    </div>
                  );
                })}
                <div style={{ paddingLeft: '4px', fontSize: '0.78rem', fontWeight: 'bold', color: '#10b981' }}>{margY[yi].toFixed(2)}</div>
              </React.Fragment>
            ))}

            <div style={{ fontSize: '0.72rem', color: '#3b82f6', fontWeight: 'bold', textAlign: 'right', paddingRight: '4px' }}>P(X)</div>
            {margX.map((p, xi) => (
              <div key={xi} style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 'bold', color: '#3b82f6' }}>{p.toFixed(2)}</div>
            ))}
            <div />
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', minWidth: '160px' }}>
          {[
            { label: 'E[X]  = Σ x·P(X=x)', val: EX, color: '#3b82f6' },
            { label: 'E[Y]  = Σ y·P(Y=y)', val: EY, color: '#ec4899' },
            { label: 'E[XY] = Σ xy·p(x,y)', val: EXY, color: '#f59e0b' },
            { label: 'E[X]·E[Y]', val: EX * EY, color: '#64748b' },
          ].map(({ label: lbl, val, color }) => (
            <div key={lbl} style={{ background: `${color}12`, borderRadius: '8px', padding: '7px 12px', border: `1px solid ${color}30` }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>{lbl}</div>
              <div style={{ fontWeight: 'bold', color, fontSize: '0.9rem' }}>{val.toFixed(4)}</div>
            </div>
          ))}
          <div style={{ background: cov > 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', borderRadius: '8px', padding: '8px 12px', border: `2px solid ${cov > 0 ? '#10b981' : '#ef4444'}` }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>Cov(X,Y) = E[XY]−E[X]E[Y]</div>
            <div style={{ fontWeight: 'bold', color: cov > 0 ? '#10b981' : '#ef4444', fontSize: '1.05rem' }}>
              {cov.toFixed(4)} &nbsp;({cov > 0 ? '▲ positive' : '▼ negative'})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── V4. Variance of a Sum — Stacked Breakdown ─────────────────────────────────
export const VizVarianceSumBreakdown: React.FC = () => {
  const [varX, setVarX] = useState(2);
  const [varY, setVarY] = useState(3);
  const [rho, setRho] = useState(0.4);

  const sdX = Math.sqrt(varX);
  const sdY = Math.sqrt(varY);
  const cov = rho * sdX * sdY;
  const twoCov = 2 * cov;
  const varSum = varX + varY + twoCov;

  // Bar chart: stacked components
  const maxAbs = Math.max(Math.abs(varX), Math.abs(varY), Math.abs(twoCov), Math.abs(varSum), 1);
  const W = 320;
  const H = 160;
  const BAR_W = 50;
  const toH = (v: number) => (Math.abs(v) / maxAbs) * (H * 0.7);
  const baseline = H * 0.75;

  const bars = [
    { label: 'Var(X)', val: varX,   color: '#3b82f6' },
    { label: 'Var(Y)', val: varY,   color: '#10b981' },
    { label: '2Cov',   val: twoCov, color: twoCov >= 0 ? '#f59e0b' : '#ef4444' },
    { label: 'Var(X+Y)', val: varSum, color: '#8b5cf6', thick: true },
  ];

  return (
    <div style={card}>
      <div style={label}>
        <strong>Var(X+Y) = Var(X) + Var(Y) + 2·Cov(X,Y):</strong> Adjust the individual variances and correlation ρ. The 2·Cov term can inflate or shrink the total variance of the sum.
      </div>

      {/* Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {[
          { name: 'Var(X)', val: varX, min: 0.1, max: 6, step: 0.1, set: setVarX, color: '#3b82f6' },
          { name: 'Var(Y)', val: varY, min: 0.1, max: 6, step: 0.1, set: setVarY, color: '#10b981' },
          { name: 'ρ (correlation)', val: rho, min: -0.99, max: 0.99, step: 0.01, set: setRho, color: rho >= 0 ? '#f59e0b' : '#ef4444' },
        ].map(({ name, val, min, max, step, set, color }) => (
          <div key={name}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '3px' }}>{name}</div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={(e) => set(parseFloat(e.target.value))} style={{ width: '100%' }} />
            <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color, textAlign: 'center' }}>
              {val.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
        <svg width={W} height={H} style={{ overflow: 'visible' }}>
          {/* Baseline */}
          <line x1={10} y1={baseline} x2={W - 10} y2={baseline} stroke="var(--color-border)" strokeWidth="1" />

          {bars.map(({ label: lbl, val, color, thick }, i) => {
            const bH = toH(val);
            const x = 15 + i * (BAR_W + 20);
            const y = val >= 0 ? baseline - bH : baseline;
            return (
              <g key={lbl}>
                <rect x={x} y={y} width={BAR_W + (thick ? 6 : 0)} height={bH}
                  fill={`${color}50`} stroke={color} strokeWidth={thick ? 2.5 : 1.5} rx="3" />
                <text x={x + (BAR_W + (thick ? 6 : 0)) / 2} y={val >= 0 ? y - 5 : y + bH + 13}
                  textAnchor="middle" fontSize="10" fill={color} fontWeight="bold">
                  {val.toFixed(2)}
                </text>
                <text x={x + (BAR_W + (thick ? 6 : 0)) / 2} y={H - 2}
                  textAnchor="middle" fontSize="9.5" fill="var(--color-text-secondary)">
                  {lbl}
                </text>
                {val < 0 && (
                  <text x={x + (BAR_W + (thick ? 6 : 0)) / 2} y={baseline - 5}
                    textAnchor="middle" fontSize="9" fill={color}>↓</text>
                )}
              </g>
            );
          })}

          {/* = sign between 2Cov bar and total bar */}
          <text x={15 + 3 * (BAR_W + 20) - 8} y={baseline - 2} fontSize="16" fill="var(--color-text-secondary)">=</text>
        </svg>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          { label: `Cov(X,Y) = ρ√Var(X)√Var(Y)`, val: cov, color: twoCov >= 0 ? '#f59e0b' : '#ef4444' },
          { label: 'Var(X+Y)', val: varSum, color: '#8b5cf6' },
        ].map(({ label: lbl, val, color }) => (
          <div key={lbl} style={{ textAlign: 'center', background: `${color}10`, borderRadius: '8px', padding: '7px 14px', border: `1px solid ${color}30` }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{lbl}</div>
            <div style={{ fontWeight: 'bold', color, fontSize: '1rem' }}>{val.toFixed(4)}</div>
          </div>
        ))}
      </div>
      {varSum < 0 && (
        <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.78rem', color: '#f59e0b' }}>
          ⚠ Var(X+Y) &lt; 0 — impossible in practice; ρ must satisfy |ρ| ≤ 1 with valid covariance matrix
        </div>
      )}
    </div>
  );
};

// ── 23. Markov Tightness ─────────────────────────────────────────────────────
export const VizMarkovTightness: React.FC = () => {
  const [a, setA] = useState(3.0);
  const mu = 1.0;
  const markovBound = mu / a;
  const expExact = Math.exp(-a);
  const tightPa = markovBound;
  const tightP0 = 1 - tightPa;

  return (
    <div style={card}>
      <div style={label}>
        <strong>When is Markov Tight?</strong> The bound P(X≥a) ≤ E(X)/a is achieved exactly by the two-point distribution: P(X=0)=1−E(X)/a, P(X=a)=E(X)/a. Exponential(1) is much tighter — Markov's looseness depends on the distribution.
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', maxWidth: '320px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>a = {a.toFixed(1)}</span>
        <input type="range" min={1.1} max={6} step={0.1} value={a}
          onChange={(e) => setA(Number(e.target.value))} style={{ flex: 1 }} />
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 auto' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Tightest distribution (E(X)=1)</div>
          <svg width={200} height={100} style={{ display: 'block' }}>
            <rect x={20} y={100 - tightP0 * 82} width={44} height={tightP0 * 82} fill="#3b82f6" opacity={0.75} rx={3} />
            <text x={42} y={98} textAnchor="middle" fontSize={9} fill="var(--color-text-secondary)">X=0</text>
            <text x={42} y={100 - tightP0 * 82 - 4} textAnchor="middle" fontSize={8} fill="#3b82f6">{tightP0.toFixed(3)}</text>
            <rect x={110} y={100 - tightPa * 82} width={44} height={tightPa * 82} fill="#ef4444" opacity={0.8} rx={3} />
            <text x={132} y={98} textAnchor="middle" fontSize={9} fill="var(--color-text-secondary)">X={a.toFixed(1)}</text>
            <text x={132} y={100 - tightPa * 82 - 4} textAnchor="middle" fontSize={8} fill="#ef4444">{tightPa.toFixed(3)}</text>
            <line x1={8} y1={88} x2={192} y2={88} stroke="var(--color-border)" />
          </svg>
          <div style={{ fontSize: '0.74rem', color: '#10b981', marginTop: '4px' }}>P(X≥a) = E(X)/a — equality holds!</div>
        </div>

        <div style={{ flex: '1 1 180px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px', fontSize: '0.82rem' }}>
          <div style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '10px' }}>E(X)=1, a={a.toFixed(1)}</div>
          {[
            { lbl: 'Markov bound E(X)/a', val: markovBound, color: '#8b5cf6' },
            { lbl: 'Two-point dist (tight)', val: tightPa, color: '#10b981' },
            { lbl: 'Exponential(1) exact', val: expExact, color: '#f59e0b' },
          ].map(({ lbl, val, color }) => (
            <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px', gap: '8px' }}>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.74rem', flex: 1 }}>{lbl}</span>
              <span style={{ fontWeight: 700, color }}>{val.toFixed(4)}</span>
            </div>
          ))}
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
            Exp vs Markov: {(expExact / markovBound).toFixed(3)}× — exponential is {((1 - expExact / markovBound) * 100).toFixed(0)}% tighter
          </div>
        </div>
      </div>
    </div>
  );
};

// ── 24. Chebyshev Across Distributions ───────────────────────────────────────
export const VizChebyshevComparison: React.FC = () => {
  const [k, setK] = useState(2.0);

  const phi = (z: number) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const poly = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    const p = 1 - (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z) * poly;
    return z < 0 ? 1 - p : p;
  };

  // All distributions standardized: μ=0, σ=1
  const normalExact = 2 * (1 - phi(k));
  // Exp(1): μ=1, σ=1. P(|X−1|≥k) = P(X≥1+k) + P(0≤X≤1−k) where latter only for k<1
  const expExact = Math.exp(-(1 + k)) + (k < 1 ? (1 - Math.exp(-(1 - k))) : 0);
  // Uniform[−√3, √3]: μ=0, σ=1. P(|X|≥k) = 1−k/√3 for k≤√3, else 0
  const sqrt3 = Math.sqrt(3);
  const uniformExact = k >= sqrt3 ? 0 : Math.max(0, 1 - k / sqrt3);
  const chebBound = Math.min(1, 1 / (k * k));

  const bars = [
    { lbl: 'Normal N(0,1)', val: normalExact, color: '#3b82f6' },
    { lbl: 'Exp(1) stdized', val: expExact, color: '#f59e0b' },
    { lbl: 'Uniform[−√3,√3]', val: uniformExact, color: '#10b981' },
    { lbl: '≤ 1/k² (Chebyshev)', val: chebBound, color: '#8b5cf6' },
  ];
  const maxVal = Math.max(...bars.map((b) => b.val), 0.01);
  const svgW = 360, svgH = 110;
  const bw = 52, gap = 16;

  return (
    <div style={card}>
      <div style={label}>
        <strong>Chebyshev is Distribution-Free:</strong> All three distributions here have μ=0, σ=1. The same 1/k² bound holds for all of them — but each distribution is far tighter in practice. This is the price of generality.
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', maxWidth: '320px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>k = {k.toFixed(1)}</span>
        <input type="range" min={0.5} max={4} step={0.1} value={k}
          onChange={(e) => setK(Number(e.target.value))} style={{ flex: 1 }} />
      </div>

      <svg width={svgW} height={svgH} style={{ display: 'block', margin: '0 auto' }}>
        <line x1={0} y1={svgH - 22} x2={svgW} y2={svgH - 22} stroke="var(--color-border)" />
        {bars.map(({ lbl, val, color }, i) => {
          const bh = (val / maxVal) * 65;
          const bx = gap + i * (bw + gap);
          return (
            <g key={lbl}>
              <rect x={bx} y={svgH - 22 - bh} width={bw} height={bh}
                fill={color} opacity={i === 3 ? 0.35 : 0.82} rx={3}
                stroke={i === 3 ? color : 'none'} strokeWidth={i === 3 ? 2 : 0}
                strokeDasharray={i === 3 ? '5,3' : undefined} />
              <text x={bx + bw / 2} y={svgH - 25 - bh} textAnchor="middle" fontSize={9} fill={color} fontWeight="bold">
                {val < 0.0001 ? '≈0' : val.toFixed(3)}
              </text>
              <text x={bx + bw / 2} y={svgH - 6} textAnchor="middle" fontSize={8} fill="var(--color-text-secondary)">
                {i === 3 ? 'bound' : lbl.split(' ')[0]}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
        {bars.map(({ lbl, val, color }) => (
          <div key={lbl} style={{ textAlign: 'center', background: `${color}10`, borderRadius: '6px', padding: '5px 10px', border: `1px solid ${color}30` }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>{lbl}</div>
            <div style={{ fontWeight: 700, color }}>{val < 0.00005 ? '0' : val.toFixed(4)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── 25. Cauchy–Schwarz ────────────────────────────────────────────────────────
export const VizCauchySchwarz: React.FC = () => {
  const [rho, setRho] = useState(0.6);
  const [sigX, setSigX] = useState(1.5);
  const [sigY, setSigY] = useState(1.0);

  const absCov = Math.abs(rho * sigX * sigY);
  const sdProd = sigX * sigY;
  const sqrtTerm = Math.sqrt(Math.max(1 - rho * rho, 0));

  // Correlation ellipse: X = sigX·cos(t), Y = sigY·(ρ·cos(t) + √(1-ρ²)·sin(t))
  const nPts = 80;
  const svgW = 220, svgH = 180;
  const maxR = Math.max(sigX, sigY) * 2.4;
  const cx = svgW / 2, cy = svgH / 2;
  const toSX = (x: number) => cx + (x / maxR) * (svgW / 2 - 8);
  const toSY = (y: number) => cy - (y / maxR) * (svgH / 2 - 8);

  const ellipsePath = Array.from({ length: nPts + 1 }, (_, i) => {
    const t = (i / nPts) * 2 * Math.PI;
    const ex = sigX * Math.cos(t);
    const ey = sigY * (rho * Math.cos(t) + sqrtTerm * Math.sin(t));
    return `${i === 0 ? 'M' : 'L'}${toSX(ex).toFixed(1)},${toSY(ey).toFixed(1)}`;
  }).join(' ') + ' Z';

  const barMaxW = 160;
  const covW = (absCov / sdProd) * barMaxW;

  return (
    <div style={card}>
      <div style={label}>
        <strong>Cauchy–Schwarz Inequality:</strong> |Cov(X,Y)| ≤ SD(X)·SD(Y), equivalently |Corr(X,Y)| ≤ 1. The ellipse collapses to a line as |ρ| → 1 (equality case: Y = aX + b exactly).
      </div>

      <div style={{ display: 'flex', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {[
          { nm: `ρ = ${rho.toFixed(2)}`, val: rho, min: -0.99, max: 0.99, step: 0.01, set: setRho, color: '#8b5cf6' },
          { nm: `σ_X = ${sigX.toFixed(1)}`, val: sigX, min: 0.5, max: 3, step: 0.1, set: setSigX, color: '#3b82f6' },
          { nm: `σ_Y = ${sigY.toFixed(1)}`, val: sigY, min: 0.5, max: 3, step: 0.1, set: setSigY, color: '#f59e0b' },
        ].map(({ nm, val, min, max, step, set, color }) => (
          <div key={nm}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{nm}</div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={(e) => set(Number(e.target.value))} style={{ width: '110px', accentColor: color }} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <svg width={svgW} height={svgH} style={{ display: 'block', flexShrink: 0 }}>
          <line x1={cx} y1={8} x2={cx} y2={svgH - 8} stroke="var(--color-border)" />
          <line x1={8} y1={cy} x2={svgW - 8} y2={cy} stroke="var(--color-border)" />
          <path d={ellipsePath} fill={`${rho >= 0 ? '#3b82f6' : '#ef4444'}15`}
            stroke={rho >= 0 ? '#3b82f6' : '#ef4444'} strokeWidth={2} />
          <text x={svgW - 10} y={cy + 14} fontSize={9} fill="var(--color-text-secondary)">X</text>
          <text x={cx + 5} y={14} fontSize={9} fill="var(--color-text-secondary)">Y</text>
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize={9} fill="var(--color-text-secondary)">
            ρ={rho.toFixed(2)}
          </text>
        </svg>

        <div style={{ flex: 1, minWidth: '170px' }}>
          {[
            { lbl: '|Cov(X,Y)| = |ρ|·σ_X·σ_Y', width: covW, val: absCov, color: '#8b5cf6' },
            { lbl: 'SD(X)·SD(Y) = σ_X·σ_Y', width: barMaxW, val: sdProd, color: '#3b82f6' },
          ].map(({ lbl, width, val, color }) => (
            <div key={lbl} style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{lbl}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: `${width}px`, height: '16px', background: color, opacity: 0.8, borderRadius: '4px', transition: 'width 0.1s', minWidth: '2px' }} />
                <span style={{ fontWeight: 700, color }}>{val.toFixed(4)}</span>
              </div>
            </div>
          ))}
          <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>|Corr| = |ρ|</span>
              <span style={{ fontWeight: 700, color: '#8b5cf6' }}>{Math.abs(rho).toFixed(4)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>≤ bound</span>
              <span style={{ fontWeight: 700, color: '#3b82f6' }}>1.0000</span>
            </div>
          </div>
          {Math.abs(rho) > 0.97 && (
            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              ≈ Equality: Y ≈ aX + b (linear relationship)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── 26. Jensen — Multiple Functions ──────────────────────────────────────────
export const VizJensenFunctions: React.FC = () => {
  type FnKey = 'x2' | 'sqrt' | 'expx' | 'logx';
  const [fnKey, setFnKey] = useState<FnKey>('x2');
  const [L, setL] = useState(1.0);
  const [R, setR] = useState(3.0);

  type FnDef = { label: string; f: (x: number) => number; convex: boolean; domMin: number };
  const fnDefs: Record<FnKey, FnDef> = {
    x2:   { label: 'f(x)=x²',    f: (x) => x * x,        convex: true,  domMin: 0   },
    sqrt: { label: 'f(x)=√x',    f: (x) => Math.sqrt(x),  convex: false, domMin: 0   },
    expx: { label: 'f(x)=eˣ',    f: (x) => Math.exp(x),   convex: true,  domMin: -99 },
    logx: { label: 'f(x)=ln(x)', f: (x) => Math.log(x),   convex: false, domMin: 0.01 },
  };
  const { label: fnLabel, f, convex, domMin } = fnDefs[fnKey];
  const safeL = Math.max(L, domMin + 0.01);
  const safeR = Math.max(safeL + 0.1, R);
  const mu = (safeL + safeR) / 2;

  const nSteps = 300;
  const EfX = Array.from({ length: nSteps }, (_, i) => f(safeL + (i + 0.5) * (safeR - safeL) / nSteps))
    .filter(isFinite).reduce((s, v, _, arr) => s + v / arr.length, 0);
  const fEX = f(mu);

  const xMin = safeL - (safeR - safeL) * 0.1;
  const xMax = safeR + (safeR - safeL) * 0.1;
  const plotPts = 120;
  const rawYs = Array.from({ length: plotPts }, (_, i) => {
    const x = xMin + (i / (plotPts - 1)) * (xMax - xMin);
    return isFinite(f(x)) ? f(x) : null;
  });
  const finiteYs = rawYs.filter((y): y is number => y !== null);
  const yMin = Math.min(...finiteYs, fEX, EfX) - 0.1;
  const yMax = Math.max(...finiteYs, fEX, EfX) + 0.1;

  const svgW = 260, svgH = 160;
  const toSX = (x: number) => ((x - xMin) / (xMax - xMin)) * (svgW - 10) + 5;
  const toSY = (y: number) => svgH - 15 - ((Math.min(Math.max(y, yMin), yMax) - yMin) / (yMax - yMin)) * (svgH - 25);

  const curvePts = rawYs.map((y, i) => {
    if (y === null) return null;
    const x = xMin + (i / (plotPts - 1)) * (xMax - xMin);
    return `${i === 0 || rawYs[i - 1] === null ? 'M' : 'L'}${toSX(x).toFixed(1)},${toSY(y).toFixed(1)}`;
  }).filter(Boolean).join(' ');

  const muSX = toSX(mu);

  return (
    <div style={card}>
      <div style={label}>
        <strong>Jensen for Multiple Functions:</strong> Convex f → chord above curve → f(E[X]) ≤ E[f(X)]. Concave f → inequality reverses. Switch functions to see the direction change.
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {(Object.keys(fnDefs) as FnKey[]).map((key) => {
          const d = fnDefs[key];
          return (
            <button key={key} onClick={() => setFnKey(key)} style={{
              padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem',
              background: fnKey === key ? (d.convex ? '#3b82f6' : '#10b981') : 'var(--color-surface)',
              color: fnKey === key ? '#fff' : 'var(--color-text)',
              border: `1px solid ${fnKey === key ? (d.convex ? '#3b82f6' : '#10b981') : 'var(--color-border)'}`,
            }}>{d.label}</button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {[
          { nm: `L = ${safeL.toFixed(1)}`, val: L, min: 0.1, max: 3.5, step: 0.1, set: setL },
          { nm: `R = ${safeR.toFixed(1)}`, val: R, min: 0.5, max: 5, step: 0.1, set: setR },
        ].map(({ nm, val, min, max, step, set }) => (
          <div key={nm}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{nm}</div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={(e) => set(Number(e.target.value))} style={{ width: '100px' }} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg width={svgW} height={svgH} style={{ display: 'block', flexShrink: 0 }}>
          <rect x={toSX(safeL)} y={10} width={Math.max(toSX(safeR) - toSX(safeL), 0)} height={svgH - 25}
            fill="var(--color-primary)" opacity={0.05} />
          <line x1={5} y1={svgH - 15} x2={svgW - 5} y2={svgH - 15} stroke="var(--color-border)" />
          <path d={curvePts} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
          {/* Chord */}
          <line x1={toSX(safeL)} y1={toSY(f(safeL))} x2={toSX(safeR)} y2={toSY(f(safeR))}
            stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5,3" />
          <line x1={muSX} y1={10} x2={muSX} y2={svgH - 15} stroke="var(--color-border)" strokeDasharray="3,3" />
          <circle cx={muSX} cy={toSY(fEX)} r={6} fill="#ef4444" />
          <circle cx={muSX} cy={toSY(EfX)} r={6} fill="#10b981" />
          {Math.abs(toSY(fEX) - toSY(EfX)) > 5 && (
            <line x1={muSX - 9} y1={toSY(fEX)} x2={muSX - 9} y2={toSY(EfX)}
              stroke="#8b5cf6" strokeWidth={2.5} />
          )}
          <text x={toSX(safeL)} y={svgH - 3} textAnchor="middle" fontSize={8} fill="var(--color-text-secondary)">L</text>
          <text x={toSX(safeR)} y={svgH - 3} textAnchor="middle" fontSize={8} fill="var(--color-text-secondary)">R</text>
          <text x={muSX} y={svgH - 3} textAnchor="middle" fontSize={8} fill="var(--color-text-secondary)">μ</text>
        </svg>

        <div style={{ flex: 1, minWidth: '150px' }}>
          <div style={{ background: `${convex ? '#3b82f6' : '#10b981'}12`, borderRadius: '8px', padding: '8px 12px', border: `1px solid ${convex ? '#3b82f630' : '#10b98130'}`, marginBottom: '10px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: convex ? '#3b82f6' : '#10b981' }}>
              {fnLabel} — {convex ? '▲ Convex' : '▼ Concave'}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text)', fontWeight: 600, marginTop: '4px' }}>
              {convex ? 'f(E[X]) ≤ E[f(X)]' : 'f(E[X]) ≥ E[f(X)]'}
            </div>
          </div>
          {[
            { lbl: '● f(E[X])', val: fEX, color: '#ef4444' },
            { lbl: '● E[f(X)]', val: EfX, color: '#10b981' },
            { lbl: 'Gap', val: Math.abs(EfX - fEX), color: '#8b5cf6' },
          ].map(({ lbl, val, color }) => (
            <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem' }}>{lbl}</span>
              <span style={{ fontWeight: 700, color }}>{isFinite(val) ? val.toFixed(4) : '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── 19. Conditional Event Update ─────────────────────────────────────────────
export const VizConditionalEventUpdate: React.FC = () => {
  const faces = [1, 2, 3, 4, 5, 6];
  const eventDefs = [
    { label: 'Even {2,4,6}', set: [2, 4, 6] },
    { label: 'Odd {1,3,5}',  set: [1, 3, 5] },
    { label: '≥ 4',          set: [4, 5, 6] },
    { label: '≤ 3',          set: [1, 2, 3] },
    { label: 'Prime {2,3,5}', set: [2, 3, 5] },
  ];
  const [selIdx, setSelIdx] = useState<number | null>(null);

  const activeSet = selIdx !== null ? eventDefs[selIdx].set : faces;
  const condP = (x: number) => activeSet.includes(x) ? 1 / activeSet.length : 0;
  const margP = 1 / 6;
  const EXcond = activeSet.reduce((s, x) => s + x, 0) / activeSet.length;

  const svgW = 340, svgH = 130;
  const maxH = 80;
  const maxProb = selIdx !== null ? 1 / activeSet.length : margP;
  const toH = (p: number) => (p / maxProb) * maxH;
  const bw = 36, gap = 18;
  const toX = (i: number) => gap + i * (bw + gap);

  return (
    <div style={card}>
      <div style={label}>
        <strong>Conditioning on an Event:</strong> Select an event A. Gray bars show the uniform die; blue bars show P(X|A) — the probability is renormalized over only the faces in A. Faces outside A drop to zero.
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <button onClick={() => setSelIdx(null)} style={{
          padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem',
          background: selIdx === null ? 'var(--color-primary)' : 'var(--color-surface)',
          color: selIdx === null ? '#fff' : 'var(--color-text)',
          border: `1px solid ${selIdx === null ? 'var(--color-primary)' : 'var(--color-border)'}`,
        }}>Unconditional</button>
        {eventDefs.map((ev, i) => (
          <button key={ev.label} onClick={() => setSelIdx(selIdx === i ? null : i)} style={{
            padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem',
            background: selIdx === i ? '#3b82f6' : 'var(--color-surface)',
            color: selIdx === i ? '#fff' : 'var(--color-text)',
            border: `1px solid ${selIdx === i ? '#3b82f6' : 'var(--color-border)'}`,
          }}>{ev.label}</button>
        ))}
      </div>

      <svg width={svgW} height={svgH} style={{ display: 'block', margin: '0 auto' }}>
        <line x1={0} y1={svgH - 20} x2={svgW} y2={svgH - 20} stroke="var(--color-border)" />
        {faces.map((x, i) => {
          const inA = activeSet.includes(x);
          const bx = toX(i);
          const margH = toH(margP);
          const barH = selIdx !== null ? toH(condP(x)) : margH;
          const barY = svgH - 20 - barH;
          return (
            <g key={x}>
              {/* Gray marginal bar (always visible) */}
              <rect x={bx} y={svgH - 20 - margH} width={bw} height={margH}
                fill={inA && selIdx !== null ? '#dbeafe' : '#e5e7eb'} rx={3} />
              {/* Blue conditional bar */}
              {selIdx !== null && inA && (
                <rect x={bx} y={barY} width={bw} height={barH} fill="#3b82f6" opacity={0.85} rx={3} />
              )}
              <text x={bx + bw / 2} y={svgH - 5} textAnchor="middle" fontSize={11}
                fill={inA ? 'var(--color-text)' : 'var(--color-text-secondary)'}
                fontWeight={inA && selIdx !== null ? 'bold' : 'normal'}>{x}</text>
            </g>
          );
        })}
        {/* Mean line */}
        {(() => {
          const scaledMeanX = gap + (EXcond - 1) * (bw + gap) + bw / 2;
          return (
            <line x1={scaledMeanX} y1={5} x2={scaledMeanX} y2={svgH - 20}
              stroke="#ef4444" strokeWidth={2} strokeDasharray="4,3" />
          );
        })()}
        <text x={gap + (EXcond - 1) * (bw + gap) + bw / 2 + 4} y={15}
          fontSize={9} fill="#ef4444">E={EXcond.toFixed(2)}</text>
      </svg>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '10px' }}>
        <div style={{ textAlign: 'center', background: '#e5e7eb20', borderRadius: '8px', padding: '6px 14px', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>E(X) unconditional</div>
          <div style={{ fontWeight: 700, color: 'var(--color-text-secondary)' }}>3.50</div>
        </div>
        <div style={{ textAlign: 'center', background: '#dbeafe30', borderRadius: '8px', padding: '6px 14px', border: '1px solid #3b82f660' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
            E(X{selIdx !== null ? `|${eventDefs[selIdx].label.split(' ')[0]}` : ''})
          </div>
          <div style={{ fontWeight: 700, color: '#3b82f6' }}>{EXcond.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

// ── 20. Conditional Bar Chart ─────────────────────────────────────────────────
export const VizConditionalBarChart: React.FC = () => {
  // Same joint PMF as VizConditionalMean
  const joint = [
    [0.05, 0.10, 0.05],
    [0.10, 0.20, 0.10],
    [0.05, 0.10, 0.25],
  ];
  const xVals = [1, 2, 3];
  const yVals = [1, 2, 3];
  const [selY, setSelY] = useState(1);

  const margX = xVals.map((_, xi) => joint.reduce((s, row) => s + row[xi], 0));
  const margY = joint.map((row) => row.reduce((s, v) => s + v, 0));
  const yi = selY - 1;
  const condRow = joint[yi].map((v) => v / margY[yi]);

  const EX = margX.reduce((s, p, i) => s + p * xVals[i], 0);
  const EXcond = condRow.reduce((s, p, i) => s + p * xVals[i], 0);

  const svgW = 340, svgH = 120, maxH = 80;
  const bw = 38, gap = 16;
  const offsetRight = svgW / 2;

  const toH = (p: number, maxP: number) => (p / maxP) * maxH;
  const maxMarg = Math.max(...margX);
  const maxCond = Math.max(...condRow);

  const colors = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div style={card}>
      <div style={label}>
        <strong>Marginal vs Conditional Distribution:</strong> Select Y=y to see how the distribution of X shifts. Left: marginal P(X). Right: conditional P(X|Y=y), renormalized to sum to 1.
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', justifyContent: 'center' }}>
        {yVals.map((y) => (
          <button key={y} onClick={() => setSelY(y)} style={{
            padding: '5px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem',
            background: selY === y ? '#8b5cf6' : 'var(--color-surface)',
            color: selY === y ? '#fff' : 'var(--color-text)',
            border: `1px solid ${selY === y ? '#8b5cf6' : 'var(--color-border)'}`,
            fontWeight: selY === y ? 700 : 400,
          }}>Y = {y}</button>
        ))}
      </div>

      <svg width={svgW} height={svgH} style={{ display: 'block', margin: '0 auto' }}>
        {/* Left: marginal P(X) */}
        <text x={offsetRight / 2} y={12} textAnchor="middle" fontSize={9} fill="var(--color-text-secondary)">P(X) — marginal</text>
        {xVals.map((x, xi) => {
          const bx = gap + xi * (bw + gap);
          const bh = toH(margX[xi], maxMarg);
          return (
            <g key={x}>
              <rect x={bx} y={svgH - 20 - bh} width={bw} height={bh} fill="#9ca3af" opacity={0.8} rx={3} />
              <text x={bx + bw / 2} y={svgH - 6} textAnchor="middle" fontSize={10} fill="var(--color-text-secondary)">X={x}</text>
              <text x={bx + bw / 2} y={svgH - 23 - bh} textAnchor="middle" fontSize={8} fill="var(--color-text-secondary)">{margX[xi].toFixed(2)}</text>
            </g>
          );
        })}
        {/* E(X) mean line */}
        <line x1={gap + (EX - 1) * (bw + gap) + bw / 2} y1={18} x2={gap + (EX - 1) * (bw + gap) + bw / 2} y2={svgH - 20} stroke="#6b7280" strokeWidth={1.5} strokeDasharray="3,3" />

        {/* Right: conditional P(X|Y=selY) */}
        <text x={offsetRight + offsetRight / 2} y={12} textAnchor="middle" fontSize={9} fill="#8b5cf6">P(X|Y={selY}) — conditional</text>
        {xVals.map((x, xi) => {
          const bx = offsetRight + gap + xi * (bw + gap);
          const bh = toH(condRow[xi], maxCond);
          return (
            <g key={x}>
              <rect x={bx} y={svgH - 20 - bh} width={bw} height={bh} fill={colors[xi]} opacity={0.85} rx={3} />
              <text x={bx + bw / 2} y={svgH - 6} textAnchor="middle" fontSize={10} fill="var(--color-text-secondary)">X={x}</text>
              <text x={bx + bw / 2} y={svgH - 23 - bh} textAnchor="middle" fontSize={8} fill={colors[xi]}>{condRow[xi].toFixed(2)}</text>
            </g>
          );
        })}
        {/* E(X|Y) mean line */}
        <line x1={offsetRight + gap + (EXcond - 1) * (bw + gap) + bw / 2} y1={18}
          x2={offsetRight + gap + (EXcond - 1) * (bw + gap) + bw / 2} y2={svgH - 20}
          stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4,3" />

        <line x1={0} y1={svgH - 20} x2={svgW} y2={svgH - 20} stroke="var(--color-border)" />
      </svg>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '10px' }}>
        {[
          { lbl: 'E(X) marginal', val: EX.toFixed(3), color: '#6b7280' },
          { lbl: `E(X|Y=${selY}) conditional`, val: EXcond.toFixed(3), color: '#8b5cf6' },
          { lbl: `P(Y=${selY})`, val: margY[yi].toFixed(2), color: 'var(--color-text-secondary)' },
        ].map(({ lbl, val, color }) => (
          <div key={lbl} style={{ textAlign: 'center', background: 'var(--color-bg)', borderRadius: '8px', padding: '6px 12px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{lbl}</div>
            <div style={{ fontWeight: 700, color }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── 21. Tower Property ────────────────────────────────────────────────────────
export const VizTowerProperty: React.FC = () => {
  // Adjustable conditional means and Y-probabilities (3 groups)
  const [condMeans, setCondMeans] = useState([2.0, 3.5, 6.0]);
  const [rawWeights, setRawWeights] = useState([3, 4, 3]);

  const total = rawWeights.reduce((s, w) => s + w, 0);
  const probs = rawWeights.map((w) => w / total);
  const EXconds = condMeans;
  const EX = condMeans.reduce((s, m, i) => s + m * probs[i], 0);

  const colors = ['#3b82f6', '#10b981', '#f59e0b'];
  const maxMean = Math.max(...condMeans, EX);
  const svgW = 360, svgH = 100;
  const toBarW = (m: number) => (m / maxMean) * (svgW - 100);

  return (
    <div style={card}>
      <div style={label}>
        <strong>Tower Property — E[E(X|Y)] = E(X):</strong> E(X|Y) is itself a random variable. Its expectation — the probability-weighted average of the conditional means — equals the unconditional E(X).
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '0.75rem', color: colors[i], fontWeight: 600 }}>
              Group {i + 1}: E(X|Y={i+1}) = {condMeans[i].toFixed(1)} · P(Y={i+1}) ∝ {rawWeights[i]}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>E(X|Y={i+1})</div>
                <input type="range" min={0.5} max={10} step={0.5} value={condMeans[i]}
                  onChange={(e) => { const next = [...condMeans]; next[i] = Number(e.target.value); setCondMeans(next); }}
                  style={{ width: '100px', accentColor: colors[i] }} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>weight</div>
                <input type="range" min={1} max={9} step={1} value={rawWeights[i]}
                  onChange={(e) => { const next = [...rawWeights]; next[i] = Number(e.target.value); setRawWeights(next); }}
                  style={{ width: '60px', accentColor: colors[i] }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <svg width={svgW} height={svgH} style={{ display: 'block' }}>
        {EXconds.map((m, i) => {
          const rowY = i * 28 + 4;
          const bw = toBarW(m);
          const contribution = m * probs[i];
          return (
            <g key={i}>
              <rect x={0} y={rowY} width={bw} height={20} fill={colors[i]} opacity={0.25} rx={3} />
              <rect x={0} y={rowY} width={toBarW(contribution)} height={20} fill={colors[i]} opacity={0.85} rx={3} />
              <text x={bw + 4} y={rowY + 13} fontSize={9} fill={colors[i]}>
                {m.toFixed(1)} × {probs[i].toFixed(2)} = {contribution.toFixed(3)}
              </text>
            </g>
          );
        })}
        {/* Total E(X) */}
        <line x1={toBarW(EX)} y1={0} x2={toBarW(EX)} y2={svgH - 10} stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4,3" />
        <text x={toBarW(EX) + 4} y={svgH - 1} fontSize={9} fill="#8b5cf6" fontWeight="bold">E(X) = {EX.toFixed(3)}</text>
      </svg>

      <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
        Weighted sum = {condMeans.map((m, i) => `${m.toFixed(1)}×${probs[i].toFixed(2)}`).join(' + ')} = <strong style={{ color: '#8b5cf6' }}>{EX.toFixed(3)}</strong>
      </div>
    </div>
  );
};

// ── 22. Total Variance Decomposition ─────────────────────────────────────────
export const VizTotalVarianceDecomp: React.FC = () => {
  // Same joint PMF as VizConditionalMean
  const joint = [
    [0.05, 0.10, 0.05],
    [0.10, 0.20, 0.10],
    [0.05, 0.10, 0.25],
  ];
  const xVals = [1, 2, 3];
  const yVals = [1, 2, 3];

  const margY = joint.map((row) => row.reduce((s, v) => s + v, 0));
  const margX = xVals.map((_, xi) => joint.reduce((s, row) => s + row[xi], 0));
  const EX = margX.reduce((s, p, i) => s + p * xVals[i], 0);

  const condStats = yVals.map((_, yi) => {
    const py = margY[yi];
    const condP = joint[yi].map((v) => v / py);
    const condMean = condP.reduce((s, p, xi) => s + p * xVals[xi], 0);
    const condEX2 = condP.reduce((s, p, xi) => s + p * xVals[xi] ** 2, 0);
    const condVar = condEX2 - condMean ** 2;
    return { py, condMean, condVar };
  });

  const ECondVar = condStats.reduce((s, { py, condVar }) => s + py * condVar, 0); // E[Var(X|Y)]
  const VarCondMean = condStats.reduce((s, { py, condMean }) => s + py * (condMean - EX) ** 2, 0); // Var(E(X|Y))
  const VarX = ECondVar + VarCondMean;

  const colors = ['#3b82f6', '#10b981', '#f59e0b'];
  const svgW = 360, svgH = 150;
  const maxVal = Math.max(VarX, 0.01);
  const toW = (v: number) => (v / maxVal) * (svgW - 120);

  return (
    <div style={card}>
      <div style={label}>
        <strong>Law of Total Variance — Var(X) = Var(E(X|Y)) + E[Var(X|Y)]:</strong> Total variance splits into explained variance (between-group: how much the conditional means differ) and unexplained variance (within-group: average spread within each Y-slice).
      </div>

      {/* Per-group rows */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 70px', gap: '6px', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
          <div>Group</div><div>E(X|Y=y)</div><div>Var(X|Y=y)</div><div>P(Y=y)</div>
        </div>
        {yVals.map((y, yi) => {
          const { py, condMean, condVar } = condStats[yi];
          return (
            <div key={y} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 70px', gap: '6px', marginBottom: '4px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: colors[yi], fontWeight: 700 }}>Y = {y}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ height: '14px', width: `${(condMean / 3) * 100}px`, background: colors[yi], opacity: 0.7, borderRadius: '3px' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text)' }}>{condMean.toFixed(3)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ height: '14px', width: `${condVar * 100}px`, background: '#ef4444', opacity: 0.5, borderRadius: '3px' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text)' }}>{condVar.toFixed(3)}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{py.toFixed(2)}</div>
            </div>
          );
        })}
      </div>

      {/* Decomposition bar */}
      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Variance decomposition:</div>
      <svg width={svgW} height={svgH} style={{ display: 'block' }}>
        {[
          { label: 'Var(E(X|Y)) — between-group', val: VarCondMean, color: '#8b5cf6', y: 10 },
          { label: 'E[Var(X|Y)] — within-group', val: ECondVar, color: '#10b981', y: 55 },
          { label: 'Var(X) = total', val: VarX, color: '#ef4444', y: 100 },
        ].map(({ label: lbl, val, color, y: rowY }) => (
          <g key={lbl}>
            <rect x={0} y={rowY} width={toW(val)} height={30} fill={color} opacity={0.8} rx={4} />
            <text x={toW(val) + 6} y={rowY + 19} fontSize={10} fill={color} fontWeight="bold">{val.toFixed(4)}</text>
            <text x={toW(val) + 50} y={rowY + 12} fontSize={9} fill="var(--color-text-secondary)">{lbl}</text>
          </g>
        ))}
        <text x={toW(VarCondMean) / 2} y={138} textAnchor="middle" fontSize={8} fill="var(--color-text-secondary)">
          {VarCondMean.toFixed(4)} + {ECondVar.toFixed(4)} = {VarX.toFixed(4)}
        </text>
      </svg>
    </div>
  );
};

// ── 15. PGF Coefficients ─────────────────────────────────────────────────────
export const VizPGFCoefficients: React.FC = () => {
  const [dist, setDist] = useState<'poisson' | 'binomial'>('poisson');
  const [lambda, setLambda] = useState(2.5);
  const [nBin, setNBin] = useState(8);
  const [theta, setTheta] = useState(0.4);

  const pmf = (k: number): number => {
    if (k < 0) return 0;
    if (dist === 'poisson') {
      let lp = -lambda;
      for (let i = 1; i <= k; i++) lp += Math.log(lambda) - Math.log(i);
      return Math.exp(lp);
    }
    if (k > nBin) return 0;
    let lp = 0;
    for (let i = 0; i < k; i++) lp += Math.log(nBin - i) - Math.log(i + 1);
    if (theta > 0 && k > 0) lp += k * Math.log(theta);
    if (theta < 1 && nBin - k > 0) lp += (nBin - k) * Math.log(1 - theta);
    return Math.exp(lp);
  };

  const pgf = (t: number): number =>
    dist === 'poisson'
      ? Math.exp(lambda * (t - 1))
      : Math.pow(theta * t + (1 - theta), nBin);

  const kMax = dist === 'poisson' ? 12 : Math.min(nBin, 12);
  const bars = Array.from({ length: kMax + 1 }, (_, k) => ({ k, p: pmf(k) }));
  const maxP = Math.max(...bars.map((b) => b.p), 0.01);

  const svgW = 300, svgH = 110;
  const tMax = 1.5;
  const yMaxPGF = 5;
  const nPts = 100;
  const toX = (t: number) => (t / tMax) * (svgW - 30) + 15;
  const toY = (y: number) => svgH - 15 - (Math.min(Math.max(y, 0), yMaxPGF) / yMaxPGF) * (svgH - 25);

  const pgfPts = Array.from({ length: nPts }, (_, i) => {
    const t = (i / (nPts - 1)) * tMax;
    return `${toX(t)},${toY(pgf(t))}`;
  }).join(' ');

  const t1x = toX(1);
  const evStr = (dist === 'poisson' ? lambda : nBin * theta).toFixed(2);

  return (
    <div style={card}>
      <div style={label}>
        <strong>PGF as a Power Series:</strong> r_X(t) = E[tˣ] = Σ P(X=k)·tᵏ — the bar heights are exactly the power-series coefficients. The curve at any t is the weighted sum of those bars.
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {(['poisson', 'binomial'] as const).map((d) => (
          <button key={d} onClick={() => setDist(d)} style={{
            padding: '4px 14px', borderRadius: '6px', cursor: 'pointer',
            background: dist === d ? 'var(--color-primary)' : 'var(--color-surface)',
            color: dist === d ? '#fff' : 'var(--color-text)',
            fontWeight: dist === d ? 700 : 400, fontSize: '0.82rem',
            border: `1px solid ${dist === d ? 'var(--color-primary)' : 'var(--color-border)'}`,
          }}>{d === 'poisson' ? 'Poisson(λ)' : 'Binomial(n,θ)'}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {dist === 'poisson' ? (
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>λ = {lambda.toFixed(1)}</div>
            <input type="range" min={0.5} max={6} step={0.5} value={lambda} onChange={(e) => setLambda(Number(e.target.value))} style={{ width: '140px' }} />
          </div>
        ) : (
          <>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>n = {nBin}</div>
              <input type="range" min={2} max={15} step={1} value={nBin} onChange={(e) => setNBin(Number(e.target.value))} style={{ width: '110px' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>θ = {theta.toFixed(2)}</div>
              <input type="range" min={0.05} max={0.95} step={0.05} value={theta} onChange={(e) => setTheta(Number(e.target.value))} style={{ width: '110px' }} />
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '5px' }}>P(X=k) — power series coefficients</div>
          <svg width={270} height={100} style={{ display: 'block' }}>
            {bars.map(({ k, p }) => {
              const bh = (p / maxP) * 72;
              return (
                <g key={k}>
                  <rect x={8 + k * 20} y={80 - bh} width={16} height={bh} fill="#3b82f6" opacity={0.8} rx={2} />
                  <text x={16 + k * 20} y={95} textAnchor="middle" fontSize={8} fill="var(--color-text-secondary)">{k}</text>
                </g>
              );
            })}
            <line x1={6} y1={80} x2={268} y2={80} stroke="var(--color-border)" strokeWidth={1} />
          </svg>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: '5px' }}>r_X(t) — PGF curve</div>
          <svg width={svgW} height={svgH} style={{ display: 'block' }}>
            <line x1={15} y1={10} x2={15} y2={svgH - 15} stroke="var(--color-border)" />
            <line x1={15} y1={svgH - 15} x2={svgW - 5} y2={svgH - 15} stroke="var(--color-border)" />
            <line x1={t1x} y1={10} x2={t1x} y2={svgH - 15} stroke="#10b981" strokeDasharray="4,3" strokeWidth={1.5} />
            <text x={t1x + 4} y={22} fontSize={8} fill="#10b981">t=1</text>
            <circle cx={t1x} cy={toY(1)} r={4} fill="#10b981" />
            <text x={t1x + 6} y={toY(1) + 4} fontSize={8} fill="#10b981">r(1)=1</text>
            <polyline points={pgfPts} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
            <text x={svgW / 2} y={svgH} textAnchor="middle" fontSize={8} fill="var(--color-text-secondary)">t</text>
          </svg>
        </div>
      </div>

      <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
        r_X(1) = 1 · r′_X(1) = E[X] = {evStr}
      </div>
    </div>
  );
};

// ── 16. MGF Shape ─────────────────────────────────────────────────────────────
export const VizMGFShape: React.FC = () => {
  const [mu, setMu] = useState(1.0);
  const [sigma, setSigma] = useState(1.0);

  const mgf = (s: number) => Math.exp(mu * s + 0.5 * sigma * sigma * s * s);

  const sMin = -1.5, sMax = 1.5;
  const svgW = 360, svgH = 160;
  const nPts = 100;

  const yvals = Array.from({ length: nPts }, (_, i) => mgf(sMin + (i / (nPts - 1)) * (sMax - sMin)));
  const yMax = Math.min(Math.max(...yvals) * 1.1, 8);

  const toX = (s: number) => ((s - sMin) / (sMax - sMin)) * (svgW - 50) + 30;
  const toY = (y: number) => svgH - 20 - (Math.min(Math.max(y, 0), yMax) / yMax) * (svgH - 35);

  const curvePts = Array.from({ length: nPts }, (_, i) => {
    const s = sMin + (i / (nPts - 1)) * (sMax - sMin);
    return `${toX(s)},${toY(mgf(s))}`;
  }).join(' ');

  const s0x = toX(0);
  const s0y = toY(1);
  const xAxisY = toY(0);

  // Tangent line at s=0: y = 1 + μ·s
  const tanY1 = 1 + mu * sMin;
  const tanY2 = 1 + mu * sMax;

  const EX2 = mu * mu + sigma * sigma;

  return (
    <div style={card}>
      <div style={label}>
        <strong>MGF Shape and Moments (Normal):</strong> m_X(s) = exp(μs + σ²s²/2). The tangent at s=0 has slope m′(0) = E[X] = μ. Repeated differentiation at s=0 yields all moments.
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {[
          { name: `μ = ${mu.toFixed(1)}`, val: mu, min: -2, max: 3, step: 0.5, set: setMu, color: '#3b82f6' },
          { name: `σ = ${sigma.toFixed(1)}`, val: sigma, min: 0.3, max: 2.5, step: 0.1, set: setSigma, color: '#f59e0b' },
        ].map(({ name, val, min, max, step, set, color }) => (
          <div key={name}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{name}</div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={(e) => set(Number(e.target.value))} style={{ width: '130px', accentColor: color }} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg width={svgW} height={svgH} style={{ display: 'block' }}>
          <line x1={30} y1={15} x2={30} y2={svgH - 20} stroke="var(--color-border)" />
          <line x1={30} y1={xAxisY} x2={svgW - 10} y2={xAxisY} stroke="var(--color-border)" />
          <line x1={s0x} y1={15} x2={s0x} y2={svgH - 20} stroke="var(--color-border)" strokeDasharray="3,3" />
          {/* Tangent line */}
          <line x1={toX(sMin)} y1={toY(tanY1)} x2={toX(sMax)} y2={toY(tanY2)}
            stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5,3" />
          <text x={toX(sMax) - 4} y={toY(tanY2) - 6} textAnchor="end" fontSize={9} fill="#ef4444">slope=μ=E[X]</text>
          <polyline points={curvePts} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
          <circle cx={s0x} cy={s0y} r={5} fill="#10b981" />
          <text x={s0x + 8} y={s0y + 4} fontSize={9} fill="#10b981">m(0)=1</text>
          {[-1, 0, 1].map((sv) => (
            <text key={sv} x={toX(sv)} y={xAxisY + 13} textAnchor="middle" fontSize={8} fill="var(--color-text-secondary)">{sv}</text>
          ))}
          <text x={svgW / 2 + 10} y={svgH - 4} textAnchor="middle" fontSize={9} fill="var(--color-text-secondary)">s</text>
        </svg>

        <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px', fontSize: '0.82rem', minWidth: '180px' }}>
          <div style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>Moments from m_X(s)</div>
          {[
            { expr: "m′(0) = E[X]", val: mu.toFixed(3), color: '#3b82f6' },
            { expr: "m″(0) = E[X²]", val: EX2.toFixed(3), color: '#8b5cf6' },
            { expr: "Var(X) = m″(0)−(m′(0))²", val: (sigma * sigma).toFixed(3), color: '#10b981' },
          ].map(({ expr, val, color }) => (
            <div key={expr} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', gap: '8px' }}>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.74rem' }}>{expr}</span>
              <span style={{ fontWeight: 700, color }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── 17. MGF Product Rule ──────────────────────────────────────────────────────
export const VizMGFProductRule: React.FC = () => {
  const [lam1, setLam1] = useState(1.5);
  const [lam2, setLam2] = useState(2.0);

  const mgfPois = (lam: number, s: number) => Math.exp(lam * (Math.exp(s) - 1));

  const sMin = -0.8, sMax = 0.8;
  const svgW = 380, svgH = 160;
  const nPts = 80;

  const mX = (s: number) => mgfPois(lam1, s);
  const mY = (s: number) => mgfPois(lam2, s);
  const mProd = (s: number) => mX(s) * mY(s);

  const sampledY = Array.from({ length: nPts }, (_, i) => {
    const s = sMin + (i / (nPts - 1)) * (sMax - sMin);
    return Math.max(mX(s), mY(s));
  });
  const yMax = Math.min(Math.max(...sampledY) * 1.2, 12);

  const toX = (s: number) => ((s - sMin) / (sMax - sMin)) * (svgW - 40) + 20;
  const toY = (y: number) => svgH - 20 - (Math.min(Math.max(y, 0), yMax) / yMax) * (svgH - 35);

  const makePts = (fn: (s: number) => number) =>
    Array.from({ length: nPts }, (_, i) => {
      const s = sMin + (i / (nPts - 1)) * (sMax - sMin);
      return `${toX(s)},${toY(fn(s))}`;
    }).join(' ');

  const xAxisY = toY(0);

  return (
    <div style={card}>
      <div style={label}>
        <strong>MGF Multiplication Rule:</strong> X ~ Poisson(λ₁), Y ~ Poisson(λ₂) independent ⟹ m_{'{'}X+Y{'}'} = m_X · m_Y = m_{'{'}Poisson(λ₁+λ₂){'}'}. The green product curve (solid) exactly overlays the dashed red Poisson(λ₁+λ₂) MGF.
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {[
          { name: `λ₁ = ${lam1.toFixed(1)}`, val: lam1, min: 0.5, max: 4, step: 0.5, set: setLam1, color: '#3b82f6' },
          { name: `λ₂ = ${lam2.toFixed(1)}`, val: lam2, min: 0.5, max: 4, step: 0.5, set: setLam2, color: '#f59e0b' },
        ].map(({ name, val, min, max, step, set, color }) => (
          <div key={name}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{name}</div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={(e) => set(Number(e.target.value))} style={{ width: '130px', accentColor: color }} />
          </div>
        ))}
      </div>

      <svg width={svgW} height={svgH} style={{ display: 'block', margin: '0 auto' }}>
        <line x1={20} y1={15} x2={20} y2={svgH - 20} stroke="var(--color-border)" />
        <line x1={20} y1={xAxisY} x2={svgW - 10} y2={xAxisY} stroke="var(--color-border)" />
        {[-0.5, 0, 0.5].map((sv) => (
          <text key={sv} x={toX(sv)} y={xAxisY + 12} textAnchor="middle" fontSize={8} fill="var(--color-text-secondary)">{sv}</text>
        ))}
        {/* m_{Poisson(λ₁+λ₂)} — drawn first (under) as thick dashed red */}
        <polyline points={makePts((s) => mgfPois(lam1 + lam2, s))} fill="none" stroke="#ef4444" strokeWidth={4} strokeDasharray="7,4" />
        {/* m_X · m_Y — solid green on top */}
        <polyline points={makePts(mProd)} fill="none" stroke="#10b981" strokeWidth={2} />
        <polyline points={makePts(mX)} fill="none" stroke="#3b82f6" strokeWidth={2} />
        <polyline points={makePts(mY)} fill="none" stroke="#f59e0b" strokeWidth={2} />
        <text x={svgW / 2} y={svgH - 4} textAnchor="middle" fontSize={9} fill="var(--color-text-secondary)">s</text>
      </svg>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
        {[
          { label: `m_X — Poisson(${lam1.toFixed(1)})`, color: '#3b82f6' },
          { label: `m_Y — Poisson(${lam2.toFixed(1)})`, color: '#f59e0b' },
          { label: 'm_X·m_Y (product)', color: '#10b981' },
          { label: `m_{Poisson(${(lam1+lam2).toFixed(1)})} — dashed`, color: '#ef4444' },
        ].map(({ label: lbl, color }) => (
          <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', color: 'var(--color-text-secondary)' }}>
            <div style={{ width: '16px', height: '3px', background: color, borderRadius: '2px' }} />
            {lbl}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── 18. Compound Poisson / Thinning ──────────────────────────────────────────
export const VizCompoundPoisson: React.FC = () => {
  const [lambda, setLambda] = useState(3.0);
  const [theta, setTheta] = useState(0.5);

  const lamS = lambda * theta;
  const kMax = 16;

  const poisPMF = (lam: number, k: number): number => {
    if (k < 0) return 0;
    let lp = -lam;
    for (let i = 1; i <= k; i++) lp += Math.log(lam) - Math.log(i);
    return Math.exp(lp);
  };

  const bars = Array.from({ length: kMax + 1 }, (_, k) => ({ k, p: poisPMF(lamS, k) }));
  const maxP = Math.max(...bars.map((b) => b.p), 0.01);

  const svgW = 380, svgH = 120;
  const barSlot = (svgW - 30) / (kMax + 1);
  const barW = Math.max(barSlot - 4, 4);
  const toBarX = (k: number) => 15 + k * barSlot;
  const meanX = toBarX(lamS) + barW / 2;

  return (
    <div style={card}>
      <div style={label}>
        <strong>Poisson Thinning (Compound Distribution):</strong> N ~ Poisson(λ) events arrive; each is independently kept with probability θ. The retained count S follows Poisson(λθ) — provable via PGF composition: r_S(t) = r_N(r_X(t)).
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {[
          { name: `λ (arrival rate) = ${lambda.toFixed(1)}`, val: lambda, min: 0.5, max: 6, step: 0.5, set: setLambda, color: '#3b82f6' },
          { name: `θ (keep probability) = ${theta.toFixed(2)}`, val: theta, min: 0.1, max: 0.9, step: 0.05, set: setTheta, color: '#f59e0b' },
        ].map(({ name, val, min, max, step, set, color }) => (
          <div key={name}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{name}</div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={(e) => set(Number(e.target.value))} style={{ width: '150px', accentColor: color }} />
          </div>
        ))}
      </div>

      <svg width={svgW} height={svgH} style={{ display: 'block', margin: '0 auto' }}>
        {bars.map(({ k, p }) => {
          const bh = (p / maxP) * 85;
          return (
            <g key={k}>
              <rect x={toBarX(k)} y={95 - bh} width={barW} height={bh} fill="#8b5cf6" opacity={0.85} rx={2} />
              <text x={toBarX(k) + barW / 2} y={110} textAnchor="middle" fontSize={8} fill="var(--color-text-secondary)">{k}</text>
            </g>
          );
        })}
        <line x1={13} y1={95} x2={svgW - 5} y2={95} stroke="var(--color-border)" />
        <line x1={meanX} y1={10} x2={meanX} y2={95} stroke="#ef4444" strokeWidth={2} strokeDasharray="5,3" />
        <text x={meanX + 5} y={24} fontSize={9} fill="#ef4444">E[S]=λθ={lamS.toFixed(2)}</text>
      </svg>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
        {[
          { lbl: 'S ~ Poisson(λθ)', val: `λθ = ${lamS.toFixed(2)}`, color: '#8b5cf6' },
          { lbl: 'E[S] = λθ', val: lamS.toFixed(3), color: '#ef4444' },
          { lbl: 'Var(S) = λθ', val: lamS.toFixed(3), color: '#3b82f6' },
        ].map(({ lbl, val, color }) => (
          <div key={lbl} style={{ textAlign: 'center', background: `${color}10`, borderRadius: '8px', padding: '6px 12px', border: `1px solid ${color}30` }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{lbl}</div>
            <div style={{ fontWeight: 700, color }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.76rem', color: 'var(--color-text-secondary)' }}>
        PGF proof: r_S(t) = r_N(θt+1−θ) = exp(λ·(θt+1−θ−1)) = exp(λθ(t−1)) = r_Poisson(λθ)(t)
      </div>
    </div>
  );
};

// ── 12. Distribution EV Comparison ───────────────────────────────────────────
export const VizDistributionEVCompare: React.FC = () => {
  const [theta, setTheta] = useState(0.4);
  const [n, setN] = useState(10);
  const [lambda, setLambda] = useState(3);

  const dists = [
    { label: 'Bernoulli(θ)',    ev: theta,                  color: '#3b82f6', formula: 'E = θ' },
    { label: `Binomial(${n},θ)`, ev: n * theta,             color: '#8b5cf6', formula: 'E = nθ' },
    { label: 'Geometric(θ)',    ev: (1 - theta) / theta,    color: '#f59e0b', formula: 'E = (1−θ)/θ' },
    { label: `Poisson(λ)`,      ev: lambda,                 color: '#10b981', formula: 'E = λ' },
  ];

  const maxEV = Math.max(...dists.map((d) => d.ev), 1);

  return (
    <div style={card}>
      <div style={label}>
        <strong>Distribution Means Explorer:</strong> Adjust parameters and see how E(X) changes across all four standard discrete distributions simultaneously.
      </div>

      {/* Parameter sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {[
          { name: 'θ (success prob)', val: theta, min: 0.05, max: 0.95, step: 0.01, set: setTheta, color: '#3b82f6' },
          { name: 'n (trials)', val: n, min: 1, max: 30, step: 1, set: setN, color: '#8b5cf6' },
          { name: 'λ (Poisson rate)', val: lambda, min: 0.5, max: 15, step: 0.5, set: setLambda, color: '#10b981' },
        ].map(({ name, val, min, max, step, set, color }) => (
          <div key={name}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{name}</div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={(e) => set(parseFloat(e.target.value))} style={{ width: '100%' }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color, textAlign: 'center' }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '130px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px', marginBottom: '10px' }}>
        {dists.map(({ label, ev, color, formula }) => {
          const pct = Math.min(ev / maxEV, 1);
          return (
            <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '0.7rem', color, fontWeight: 'bold', marginBottom: '4px' }}>{ev.toFixed(2)}</div>
              <div style={{
                width: '100%', height: `${pct * 100}px`,
                background: color, borderRadius: '4px 4px 0 0',
                transition: 'height 0.25s', minHeight: '3px',
                opacity: 0.85,
              }} />
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginTop: '6px', textAlign: 'center', lineHeight: 1.2 }}>
                {label}<br /><span style={{ color }}>{formula}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
        Geometric mean grows rapidly as θ → 0 (rare successes → many failures before first win)
      </div>
    </div>
  );
};

// ── 13. LOTUS Interactive Demo ────────────────────────────────────────────────
export const VizLOTUSDemo: React.FC = () => {
  const [fnIdx, setFnIdx] = useState(0);

  const fns = [
    { label: 'g(x) = x²',       fn: (x: number) => x * x,          color: '#3b82f6', desc: 'Squares the outcome — used to compute E[X²] and variance' },
    { label: 'g(x) = |x − 3.5|', fn: (x: number) => Math.abs(x - 3.5), color: '#f59e0b', desc: 'Mean absolute deviation from the expected value' },
    { label: 'g(x) = 2x − 1',   fn: (x: number) => 2 * x - 1,     color: '#10b981', desc: 'Linear transform — E = 2·E[X]−1 = 2·3.5−1 = 6 by linearity' },
    { label: 'g(x) = 1/(x+1)',  fn: (x: number) => 1 / (x + 1),   color: '#8b5cf6', desc: 'Non-linear — Jensen says E[g(X)] ≠ g(E[X]) in general' },
  ];

  const dieVals = [1, 2, 3, 4, 5, 6];
  const prob = 1 / 6;
  const { fn, color, desc } = fns[fnIdx];
  const gVals = dieVals.map((x) => ({ x, gx: fn(x) }));
  const ev = gVals.reduce((s, { gx }) => s + gx * prob, 0);
  const gOfEV = fn(3.5);
  const maxG = Math.max(...gVals.map((v) => v.gx));

  return (
    <div style={card}>
      <div style={label}>
        <strong>LOTUS — E[g(X)] for a Fair Die:</strong> Choose a function g. The table shows each g(x) value and the weighted sum gives E[g(X)] directly from the die's distribution.
      </div>

      {/* Function selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {fns.map((f, i) => (
          <button
            key={f.label}
            onClick={() => setFnIdx(i)}
            style={{
              padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
              border: `1.5px solid ${i === fnIdx ? fns[i].color : 'var(--color-border)'}`,
              background: i === fnIdx ? `${fns[i].color}20` : 'var(--color-bg)',
              color: i === fnIdx ? fns[i].color : 'var(--color-text-secondary)',
            }}
          >{f.label}</button>
        ))}
      </div>

      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: '14px', fontStyle: 'italic' }}>{desc}</div>

      {/* Table + bar chart */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '12px' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg)' }}>
              {['x', 'P(X=x)', 'g(x)', 'g(x)·P(X=x)', 'bar'].map((h) => (
                <th key={h} style={{ padding: '6px 10px', textAlign: 'right', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gVals.map(({ x, gx }) => (
              <tr key={x} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '5px 10px', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-text)' }}>{x}</td>
                <td style={{ padding: '5px 10px', textAlign: 'right', color: 'var(--color-text-secondary)' }}>1/6</td>
                <td style={{ padding: '5px 10px', textAlign: 'right', fontWeight: 'bold', color }}>{gx.toFixed(4)}</td>
                <td style={{ padding: '5px 10px', textAlign: 'right', color: 'var(--color-text-secondary)' }}>{(gx * prob).toFixed(4)}</td>
                <td style={{ padding: '5px 10px' }}>
                  <div style={{ height: '10px', width: `${(gx / maxG) * 120}px`, background: color, borderRadius: '3px', minWidth: '2px' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', background: `${color}15`, border: `1px solid ${color}`, borderRadius: '8px', padding: '8px 18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>E[g(X)] via LOTUS</div>
          <div style={{ fontWeight: 'bold', color, fontSize: '1.1rem' }}>{ev.toFixed(4)}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(239,68,68,0.08)', border: '1px solid #ef444440', borderRadius: '8px', padding: '8px 18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>g(E[X]) = g(3.5)</div>
          <div style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '1.1rem' }}>{gOfEV.toFixed(4)}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(139,92,246,0.08)', border: '1px solid #8b5cf640', borderRadius: '8px', padding: '8px 18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Equal?</div>
          <div style={{ fontWeight: 'bold', color: Math.abs(ev - gOfEV) < 0.001 ? '#22c55e' : '#f59e0b', fontSize: '1rem' }}>
            {Math.abs(ev - gOfEV) < 0.001 ? '✓ Yes (linear g)' : '✗ No (nonlinear)'}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── 14. Linearity of Expectation Demo ────────────────────────────────────────
export const VizLinearityDemo: React.FC = () => {
  const [a, setA] = useState(2);
  const [b, setB] = useState(-3);

  // Base: fair die, E[X] = 3.5, Var[X] = 35/12
  const EX = 3.5;
  const dieVals = [1, 2, 3, 4, 5, 6];
  const prob = 1 / 6;

  // Y = aX + b
  const yVals = dieVals.map((x) => a * x + b);
  const EY_direct = yVals.reduce((s, y) => s + y * prob, 0);
  const EY_linearity = a * EX + b;
  const maxAbsY = Math.max(...yVals.map(Math.abs), 1);

  return (
    <div style={card}>
      <div style={label}>
        <strong>Linearity: E[aX + b] = a·E[X] + b</strong> — X is a fair die roll. Set a and b to transform X into Y = aX + b. Both methods give the same E[Y].
      </div>

      {/* Sliders */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { name: 'a (scale)', val: a, min: -3, max: 5, step: 0.5, set: setA, color: '#3b82f6' },
          { name: 'b (shift)', val: b, min: -10, max: 10, step: 1, set: setB, color: '#f59e0b' },
        ].map(({ name, val, min, max, step, set, color }) => (
          <div key={name} style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{name}</div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={(e) => set(parseFloat(e.target.value))} style={{ width: '100%' }} />
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color }}>{val > 0 ? '+' : ''}{val}</div>
          </div>
        ))}
      </div>

      {/* Side-by-side bars: X vs Y */}
      <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '110px', marginBottom: '8px' }}>
        {dieVals.map((x, i) => {
          const y = yVals[i];
          const hX = (x / 6) * 90;
          const hY = Math.abs(y) / maxAbsY * 90;
          return (
            <div key={x} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <div style={{ fontSize: '0.6rem', color: '#3b82f6' }}>{x}</div>
              <div style={{ width: '100%', height: `${hX}px`, background: '#3b82f640', border: '1px solid #3b82f6', borderRadius: '3px 3px 0 0' }} />
              <div style={{ fontSize: '0.6rem', color: '#10b981' }}>{y}</div>
              <div style={{
                width: '100%', height: `${hY}px`,
                background: y >= 0 ? '#10b98140' : '#ef444440',
                border: `1px solid ${y >= 0 ? '#10b981' : '#ef4444'}`,
                borderRadius: '3px 3px 0 0',
              }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
        <span style={{ color: '#3b82f6' }}>■ X values (1–6)</span>
        <span style={{ color: '#10b981' }}>■ Y = {a}X {b >= 0 ? '+' : ''}{b} values</span>
      </div>

      {/* Result */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', background: 'rgba(59,130,246,0.08)', borderRadius: '8px', padding: '8px 16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>E[X] (die)</div>
          <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>3.5</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', padding: '8px 16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>E[Y] direct Σ y·P</div>
          <div style={{ fontWeight: 'bold', color: '#10b981' }}>{EY_direct.toFixed(3)}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(139,92,246,0.08)', borderRadius: '8px', padding: '8px 16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>a·E[X]+b = {a}×3.5{b >= 0 ? '+' : ''}{b}</div>
          <div style={{ fontWeight: 'bold', color: '#8b5cf6' }}>{EY_linearity.toFixed(3)}</div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.82rem', color: '#22c55e', fontWeight: 600 }}>
        ✓ Both methods always agree — linearity is exact, not approximate
      </div>
    </div>
  );
};

// ── 15. Running Average (LLN animation) ──────────────────────────────────────
export const VizRunningAverage: React.FC = () => {
  const [samples, setSamples] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(200);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const trueMean = 3.5;
  const W = 400;
  const H = 140;

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  };

  const start = () => {
    setSamples([]);
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSamples((prev) => {
        if (prev.length >= 200) {
          stop();
          return prev;
        }
        return [...prev, Math.floor(Math.random() * 6) + 1];
      });
    }, speed);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, speed]);

  // Running means
  const runMeans = samples.map((_, i) => {
    const slice = samples.slice(0, i + 1);
    return slice.reduce((s, v) => s + v, 0) / slice.length;
  });

  // SVG path for running mean
  const toX = (i: number) => (i / Math.max(samples.length - 1, 1)) * W;
  const toY = (v: number) => H / 2 - ((v - trueMean) / 2.5) * (H / 2 - 10);
  const meanLine = runMeans.map((m, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(m).toFixed(1)}`).join(' ');

  const currentMean = runMeans[runMeans.length - 1];
  const lastVal = samples[samples.length - 1];

  return (
    <div style={card}>
      <div style={label}>
        <strong>Law of Large Numbers — Live Simulation:</strong> Roll a fair die repeatedly. The running average (blue line) converges to E(X) = 3.5 (red line) as n grows.
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
        <button
          onClick={running ? stop : start}
          style={{
            padding: '7px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer',
            background: running ? '#ef4444' : 'var(--color-primary)', color: '#fff', fontWeight: 600, fontSize: '0.85rem',
          }}
        >{running ? 'Stop' : 'Start Rolling'}</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Speed:</span>
          <input type="range" min={50} max={500} step={50} value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))} style={{ width: '90px' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{speed}ms</span>
        </div>
        {samples.length > 0 && !running && (
          <button onClick={() => setSamples([])} style={{
            padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--color-border)',
            background: 'var(--color-bg)', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.8rem',
          }}>Reset</button>
        )}
      </div>

      {/* Chart */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        <svg width={W} height={H} style={{ background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          {/* True mean line */}
          <line x1={0} y1={toY(trueMean)} x2={W} y2={toY(trueMean)} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 4" />
          <text x={W - 4} y={toY(trueMean) - 4} textAnchor="end" fontSize="10" fill="#ef4444">E(X) = 3.5</text>

          {/* ±1 band */}
          <rect x={0} y={toY(4.5)} width={W} height={toY(2.5) - toY(4.5)} fill="rgba(239,68,68,0.05)" />

          {/* Running mean path */}
          {meanLine && <path d={meanLine} fill="none" stroke="#3b82f6" strokeWidth="2" />}

          {/* Latest point */}
          {currentMean !== undefined && (
            <circle cx={toX(samples.length - 1)} cy={toY(currentMean)} r="4" fill="#3b82f6" />
          )}

          {samples.length === 0 && (
            <text x={W / 2} y={H / 2} textAnchor="middle" fontSize="13" fill="var(--color-text-secondary)">Click "Start Rolling" to begin</text>
          )}
        </svg>
      </div>

      {/* Live stats */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', background: 'rgba(59,130,246,0.08)', borderRadius: '8px', padding: '7px 14px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Rolls so far</div>
          <div style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: '1.1rem' }}>{samples.length}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', padding: '7px 14px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Last roll</div>
          <div style={{ fontWeight: 'bold', color: '#10b981', fontSize: '1.1rem' }}>{lastVal ?? '—'}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', padding: '7px 14px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Running mean</div>
          <div style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '1.1rem' }}>{currentMean !== undefined ? currentMean.toFixed(3) : '—'}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(139,92,246,0.08)', borderRadius: '8px', padding: '7px 14px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Error |mean − 3.5|</div>
          <div style={{ fontWeight: 'bold', color: '#8b5cf6', fontSize: '1.1rem' }}>
            {currentMean !== undefined ? Math.abs(currentMean - trueMean).toFixed(3) : '—'}
          </div>
        </div>
      </div>
    </div>
  );
};
