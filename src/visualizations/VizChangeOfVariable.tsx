import React, { useState } from 'react';

export const VizCovSquaring: React.FC = () => {
  const [x, setX] = useState(0.5);
  const y = x * x;
  
  const W = 300;
  const H = 140;

  // f_X(x) = 1 (constant height 100 for visual)
  // f_Y(y) = 1 / (2 * sqrt(y))

  const fyCurve = `M 0,${H} ` + Array.from({ length: 100 }, (_, i) => {
    const yVal = (i + 1) / 100; // avoid 0
    let dens = 1 / (2 * Math.sqrt(yVal));
    if (dens > 3) dens = 3; // cap for drawing
    return `L ${yVal * W},${H - (dens / 3) * (H - 20)}`;
  }).join(' ');

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Squaring a Uniform:</strong> X ~ U[0,1], Y = X². Because the slope of X² is small near 0, probability clumps up near 0 for Y.
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {/* X Distribution */}
        <div style={{ width: '300px' }}>
          <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginBottom: '8px', textAlign: 'center', fontWeight: 'bold' }}>X ~ U[0, 1]</div>
          <div style={{ position: 'relative', height: H, background: 'var(--color-bg)', borderBottom: '2px solid var(--color-text)', borderLeft: '2px solid var(--color-text)' }}>
            <svg width="300" height={H}>
              {/* Box for uniform */}
              <rect x="0" y={H - 60} width={W} height="60" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="2" />
              {/* X line */}
              <line x1={x * W} y1="0" x2={x * W} y2={H} stroke="#3b82f6" strokeDasharray="4 4" />
              <circle cx={x * W} cy={H - 60} r="4" fill="#3b82f6" />
            </svg>
            <div style={{ position: 'absolute', bottom: '-20px', left: `${x * 100}%`, transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#3b82f6' }}>x={x.toFixed(2)}</div>
          </div>
        </div>

        {/* Y Distribution */}
        <div style={{ width: '300px' }}>
          <div style={{ fontSize: '0.75rem', color: '#ec4899', marginBottom: '8px', textAlign: 'center', fontWeight: 'bold' }}>Y = X²</div>
          <div style={{ position: 'relative', height: H, background: 'var(--color-bg)', borderBottom: '2px solid var(--color-text)', borderLeft: '2px solid var(--color-text)' }}>
            <svg width="300" height={H}>
              <path d={fyCurve} fill="none" stroke="#ec4899" strokeWidth="2" />
              <line x1={y * W} y1="0" x2={y * W} y2={H} stroke="#ec4899" strokeDasharray="4 4" />
              <circle cx={y * W} cy={H - (Math.min(3, 1/(2*Math.sqrt(Math.max(0.01, y))))/3) * (H-20)} r="4" fill="#ec4899" />
            </svg>
            <div style={{ position: 'absolute', bottom: '-20px', left: `${y * 100}%`, transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#ec4899' }}>y={y.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '300px', margin: '32px auto 16px' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>x:</span>
        <input type="range" min={0.01} max={1} step={0.01} value={x} onChange={e => setX(parseFloat(e.target.value))} style={{ flex: 1 }} />
      </div>
    </div>
  );
};

export const VizCovIncreasing: React.FC = () => {
  const [lambda, setLambda] = useState(2);
  const W = 300;
  const H = 140;

  // X ~ Exp(1) -> f(x) = e^(-x)
  const fXCurve = `M 0,${H} ` + Array.from({ length: 100 }, (_, i) => {
    const x = i * 0.05; // 0 to 5
    const dens = Math.exp(-x);
    return `L ${(x/5) * W},${H - dens * (H - 20)}`;
  }).join(' ');

  // Y ~ Exp(lambda) -> f(y) = lambda * e^(-lambda * y)
  // We plot y from 0 to 5 as well for comparison
  const fYCurve = `M 0,${H} ` + Array.from({ length: 100 }, (_, i) => {
    const y = i * 0.05;
    const dens = lambda * Math.exp(-lambda * y);
    // cap at 3 for visual scaling
    const scaledY = Math.min(3, dens) / 3;
    return `L ${(y/5) * W},${H - scaledY * (H - 20)}`;
  }).join(' ');

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Exponential Rescaling:</strong> X ~ Exp(1), Y = X/λ. The density shrinks/grows by the derivative factor λ to maintain total area = 1.
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        <div style={{ width: '300px' }}>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '8px', textAlign: 'center', fontWeight: 'bold' }}>X ~ Exp(1)</div>
          <div style={{ position: 'relative', height: H, background: 'var(--color-bg)', borderBottom: '2px solid var(--color-text)', borderLeft: '2px solid var(--color-text)' }}>
            <svg width="300" height={H}>
              <path d={fXCurve} fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="2" />
            </svg>
            <div style={{ position: 'absolute', bottom: '-20px', right: 0, fontSize: '0.75rem' }}>5</div>
          </div>
        </div>

        <div style={{ width: '300px' }}>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginBottom: '8px', textAlign: 'center', fontWeight: 'bold' }}>Y = X/{lambda.toFixed(1)} ➔ Exp({lambda.toFixed(1)})</div>
          <div style={{ position: 'relative', height: H, background: 'var(--color-bg)', borderBottom: '2px solid var(--color-text)', borderLeft: '2px solid var(--color-text)' }}>
            <svg width="300" height={H}>
              <path d={fYCurve} fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth="2" />
            </svg>
            <div style={{ position: 'absolute', bottom: '-20px', right: 0, fontSize: '0.75rem' }}>5</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '300px', margin: '32px auto 16px' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>λ:</span>
        <input type="range" min={0.5} max={3} step={0.1} value={lambda} onChange={e => setLambda(parseFloat(e.target.value))} style={{ flex: 1 }} />
      </div>
    </div>
  );
};

export const VizCovDecreasing: React.FC = () => {
  const [z, setZ] = useState(0);
  const y = Math.exp(z);
  
  const W = 300;
  const H = 140;

  // Z ~ N(0, 1) mapped from -3 to 3
  const fzCurve = `M 0,${H} ` + Array.from({ length: 100 }, (_, i) => {
    const zVal = -3 + (i / 100) * 6;
    const dens = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * zVal * zVal);
    return `L ${(i / 100) * W},${H - (dens / 0.5) * (H - 20)}`;
  }).join(' ');

  // Y ~ LogNormal(0,1) mapped from 0 to 6
  const fyCurve = `M 0,${H} ` + Array.from({ length: 100 }, (_, i) => {
    const yVal = (i / 100) * 6;
    if (yVal === 0) return `L 0,${H}`;
    const dens = (1 / (yVal * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(Math.log(yVal), 2));
    const scaledDens = Math.min(0.8, dens) / 0.8;
    return `L ${(i / 100) * W},${H - scaledDens * (H - 20)}`;
  }).join(' ');

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Log-Normal from Normal:</strong> Z ~ N(0,1), Y = e^Z. A symmetric distribution transforms into a heavily right-skewed one.
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {/* Z Distribution */}
        <div style={{ width: '300px' }}>
          <div style={{ fontSize: '0.75rem', color: '#8b5cf6', marginBottom: '8px', textAlign: 'center', fontWeight: 'bold' }}>Z ~ N(0, 1)</div>
          <div style={{ position: 'relative', height: H, background: 'var(--color-bg)', borderBottom: '2px solid var(--color-text)', borderLeft: '2px solid var(--color-text)' }}>
            <svg width="300" height={H}>
              <path d={fzCurve} fill="rgba(139,92,246,0.2)" stroke="#8b5cf6" strokeWidth="2" />
              <line x1={((z + 3) / 6) * W} y1="0" x2={((z + 3) / 6) * W} y2={H} stroke="#8b5cf6" strokeDasharray="4 4" />
            </svg>
            <div style={{ position: 'absolute', bottom: '-20px', left: `${((z + 3) / 6) * 100}%`, transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#8b5cf6' }}>z={z.toFixed(2)}</div>
            <div style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>0</div>
          </div>
        </div>

        {/* Y Distribution */}
        <div style={{ width: '300px' }}>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '8px', textAlign: 'center', fontWeight: 'bold' }}>Y = e^Z (Log-Normal)</div>
          <div style={{ position: 'relative', height: H, background: 'var(--color-bg)', borderBottom: '2px solid var(--color-text)', borderLeft: '2px solid var(--color-text)' }}>
            <svg width="300" height={H}>
              <path d={fyCurve} fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="2" />
              <line x1={Math.min(1, y / 6) * W} y1="0" x2={Math.min(1, y / 6) * W} y2={H} stroke="#ef4444" strokeDasharray="4 4" />
            </svg>
            <div style={{ position: 'absolute', bottom: '-20px', left: `${Math.min(100, (y / 6) * 100)}%`, transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#ef4444' }}>y={y.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '300px', margin: '32px auto 16px' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>z:</span>
        <input type="range" min={-3} max={3} step={0.1} value={z} onChange={e => setZ(parseFloat(e.target.value))} style={{ flex: 1 }} />
      </div>
    </div>
  );
};
