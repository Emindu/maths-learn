import React, { useState } from 'react';

export const VizContinuousArea: React.FC = () => {
  const [range, setRange] = useState({ a: 30, b: 70 });
  const W = 400;
  const H = 140;

  // Simple bell-like curve
  const curve = (x: number) => {
    const mu = 50;
    const sigma = 15;
    return Math.exp(-Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2)));
  };

  const pathD = `M 0,${H} ` + Array.from({ length: 101 }, (_, i) => {
    const x = i; // 0 to 100 mapping to 0 to 400
    const y = H - curve(x) * (H - 20);
    return `L ${x * 4},${y}`;
  }).join(' ') + ` L ${W},${H} Z`;

  // Area under range
  const areaD = `M ${range.a * 4},${H} ` + Array.from({ length: range.b - range.a + 1 }, (_, i) => {
    const x = range.a + i;
    const y = H - curve(x) * (H - 20);
    return `L ${x * 4},${y}`;
  }).join(' ') + ` L ${range.b * 4},${H} Z`;

  // Total area calculation (approximate)
  let totalArea = 0;
  let subArea = 0;
  for (let x = 0; x <= 100; x++) {
    const y = curve(x);
    totalArea += y;
    if (x >= range.a && x <= range.b) subArea += y;
  }
  const prob = subArea / totalArea;

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Continuous Distribution:</strong> Probability is represented by the <em>area</em> under the density curve. P(a ≤ X ≤ b) = Area.
      </div>
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto 20px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <path d={pathD} fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="2" />
          <path d={areaD} fill="rgba(59,130,246,0.3)" stroke="none" />
          <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" />
          {/* A and B lines */}
          <line x1={range.a * 4} y1="0" x2={range.a * 4} y2={H} stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
          <line x1={range.b * 4} y1="0" x2={range.b * 4} y2={H} stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ width: '20px', fontWeight: 'bold', color: 'var(--color-text)' }}>a:</span>
          <input type="range" min={0} max={100} value={range.a} onChange={e => {
            const val = parseInt(e.target.value);
            setRange(p => ({ ...p, a: Math.min(val, p.b - 1) }));
          }} style={{ flex: 1 }} />
          <span style={{ width: '30px', textAlign: 'right', fontSize: '0.8rem' }}>{range.a}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ width: '20px', fontWeight: 'bold', color: 'var(--color-text)' }}>b:</span>
          <input type="range" min={0} max={100} value={range.b} onChange={e => {
            const val = parseInt(e.target.value);
            setRange(p => ({ ...p, b: Math.max(val, p.a + 1) }));
          }} style={{ flex: 1 }} />
          <span style={{ width: '30px', textAlign: 'right', fontSize: '0.8rem' }}>{range.b}</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1rem', color: 'var(--color-text)' }}>
        P({range.a} ≤ X ≤ {range.b}) ≈ <strong>{prob.toFixed(3)}</strong>
      </div>
    </div>
  );
};

export const VizContinuousUniform: React.FC = () => {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Uniform Distribution [0, 60]:</strong> Bus Arrival. P(X {'>'} 40) is the area from 40 to 60.
      </div>
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto 20px', height: '120px', background: 'var(--color-bg)', borderLeft: '2px solid var(--color-text)', borderBottom: '2px solid var(--color-text)' }}>
        {/* Density Line */}
        <div style={{ position: 'absolute', left: '0', top: '20px', width: '100%', height: '2px', background: '#3b82f6' }} />
        <div style={{ position: 'absolute', left: '-30px', top: '10px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>1/60</div>
        
        {/* Fill Area (40 to 60) */}
        <div style={{ position: 'absolute', left: '66.66%', top: '22px', width: '33.33%', height: '98px', background: 'rgba(59,130,246,0.3)', borderLeft: '2px dashed #3b82f6' }} />

        {/* X Axis Labels */}
        <div style={{ position: 'absolute', left: '0', bottom: '-20px', fontSize: '0.75rem', color: 'var(--color-text)' }}>0</div>
        <div style={{ position: 'absolute', left: '66.66%', bottom: '-20px', transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>40</div>
        <div style={{ position: 'absolute', right: '0', bottom: '-20px', fontSize: '0.75rem', color: 'var(--color-text)' }}>60</div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '36px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
        P(X {'>'} 40) = Area = Width × Height = (60 - 40) × 1/60 = 20/60 = <strong>1/3</strong>
      </div>
    </div>
  );
};

export const VizContinuousExponential: React.FC = () => {
  const lambda = 0.01;
  const W = 400;
  const H = 140;

  const curve = (x: number) => lambda * Math.exp(-lambda * x); // x from 0 to 400
  const maxDensity = lambda; // at x=0

  const pathD = `M 0,${H} ` + Array.from({ length: 101 }, (_, i) => {
    const x = i * 4; // 0 to 400
    const y = H - (curve(x) / maxDensity) * (H - 20);
    return `L ${x},${y}`;
  }).join(' ') + ` L ${W},${H} Z`;

  const areaD = `M 200,${H} ` + Array.from({ length: 51 }, (_, i) => {
    const x = 200 + i * 4; // 200 to 400
    const y = H - (curve(x) / maxDensity) * (H - 20);
    return `L ${x},${y}`;
  }).join(' ') + ` L ${W},${H} Z`;

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Exponential Distribution (λ=0.01):</strong> Light Bulb Lifetime. P(X {'>'} 200).
      </div>
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto 20px', background: 'var(--color-bg)', borderLeft: '2px solid var(--color-text)', borderBottom: '2px solid var(--color-text)' }}>
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2" />
          <path d={areaD} fill="rgba(16,185,129,0.3)" stroke="none" />
          <line x1="200" y1="0" x2="200" y2={H} stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
        </svg>

        {/* X Axis Labels */}
        <div style={{ position: 'absolute', left: '0', bottom: '-20px', fontSize: '0.75rem', color: 'var(--color-text)' }}>0</div>
        <div style={{ position: 'absolute', left: '50%', bottom: '-20px', transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>200</div>
        <div style={{ position: 'absolute', right: '0', bottom: '-20px', fontSize: '0.75rem', color: 'var(--color-text)' }}>400+</div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '36px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
        P(X {'>'} 200) = e⁻⁰·⁰¹⁽²⁰⁰⁾ = e⁻² ≈ <strong>0.135</strong>
      </div>
    </div>
  );
};

export const VizContinuousGamma: React.FC = () => {
  const W = 400;
  const H = 140;

  // Gamma(3, 2) curve approximation. Mode is (alpha-1)/lambda = 2/2 = 1. Mean is 3/2 = 1.5.
  // f(x) = (2^3 * x^2 * e^(-2x)) / Gamma(3) = 4 * x^2 * e^(-2x)
  const curve = (x: number) => 4 * Math.pow(x, 2) * Math.exp(-2 * x); // max is ~0.54 at x=1

  const pathD = `M 0,${H} ` + Array.from({ length: 101 }, (_, i) => {
    const x = i * 0.05; // 0 to 5
    const y = H - (curve(x) / 0.6) * (H - 20);
    return `L ${i * 4},${y}`;
  }).join(' ') + ` L ${W},${H} Z`;

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Gamma Distribution (α=3, λ=2):</strong> Waiting for 3 events. Mean is α/λ = 1.5.
      </div>
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto 20px', background: 'var(--color-bg)', borderLeft: '2px solid var(--color-text)', borderBottom: '2px solid var(--color-text)' }}>
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <path d={pathD} fill="rgba(245,158,11,0.1)" stroke="#f59e0b" strokeWidth="2" />
          {/* Mean Line at x=1.5 (which is index 30 -> 120px) */}
          <line x1="120" y1="0" x2="120" y2={H} stroke="#d97706" strokeWidth="2" strokeDasharray="4 4" />
        </svg>

        {/* X Axis Labels */}
        <div style={{ position: 'absolute', left: '0', bottom: '-20px', fontSize: '0.75rem', color: 'var(--color-text)' }}>0</div>
        <div style={{ position: 'absolute', left: '30%', bottom: '-20px', transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#d97706', fontWeight: 'bold' }}>μ = 1.5</div>
        <div style={{ position: 'absolute', right: '0', bottom: '-20px', fontSize: '0.75rem', color: 'var(--color-text)' }}>5+</div>
      </div>
    </div>
  );
};

export const VizContinuousNormal: React.FC = () => {
  const W = 400;
  const H = 140;

  // Standard normal scaled
  const curve = (x: number) => Math.exp(-Math.pow(x, 2) / 2);

  const pathD = `M 0,${H} ` + Array.from({ length: 101 }, (_, i) => {
    const x = (i - 50) / 15; // -3.33 to 3.33
    const y = H - curve(x) * (H - 20);
    return `L ${i * 4},${y}`;
  }).join(' ') + ` L ${W},${H} Z`;

  // -1 sigma to +1 sigma -> roughly indices 35 to 65
  const areaD = `M 140,${H} ` + Array.from({ length: 31 }, (_, i) => {
    const idx = 35 + i;
    const x = (idx - 50) / 15;
    const y = H - curve(x) * (H - 20);
    return `L ${idx * 4},${y}`;
  }).join(' ') + ` L 260,${H} Z`;

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Normal Distribution:</strong> N(μ=178, σ²=49) ➔ σ=7. Area between μ - σ (171) and μ + σ (185).
      </div>
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto 20px', background: 'var(--color-bg)', borderBottom: '2px solid var(--color-text)' }}>
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="2" />
          <path d={areaD} fill="rgba(139,92,246,0.3)" stroke="none" />
          {/* Sigma Boundaries */}
          <line x1="140" y1="0" x2="140" y2={H} stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="260" y1="0" x2="260" y2={H} stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="200" y1="0" x2="200" y2={H} stroke="#6d28d9" strokeWidth="1" />
        </svg>

        {/* X Axis Labels */}
        <div style={{ position: 'absolute', left: '35%', bottom: '-20px', transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 'bold' }}>171</div>
        <div style={{ position: 'absolute', left: '50%', bottom: '-20px', transform: 'translateX(-50%)', fontSize: '0.75rem', color: 'var(--color-text)' }}>178</div>
        <div style={{ position: 'absolute', left: '65%', bottom: '-20px', transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 'bold' }}>185</div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '36px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
        P(171 ≤ X ≤ 185) ≈ <strong>68.27%</strong>
      </div>
    </div>
  );
};
