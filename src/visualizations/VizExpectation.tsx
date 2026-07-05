import React, { useState } from 'react';

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
