import React, { useState } from 'react';

export const VizCDFDefinition: React.FC = () => {
  const [xVal, setXVal] = useState(50);
  const W = 300;
  const H = 140;

  // Simple bell-like curve for PDF
  const pdf = (x: number) => {
    const mu = 50;
    const sigma = 15;
    return Math.exp(-Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2)));
  };

  // Precompute CDF
  const cdfArr: number[] = [];
  let sum = 0;
  for (let i = 0; i <= 100; i++) sum += pdf(i);
  let accum = 0;
  for (let i = 0; i <= 100; i++) {
    accum += pdf(i);
    cdfArr[i] = accum / sum;
  }

  const pdfPath = `M 0,${H} ` + Array.from({ length: 101 }, (_, i) => `L ${i * 3},${H - pdf(i) * 100}`).join(' ') + ` L ${W},${H} Z`;
  const pdfArea = `M 0,${H} ` + Array.from({ length: xVal + 1 }, (_, i) => `L ${i * 3},${H - pdf(i) * 100}`).join(' ') + ` L ${xVal * 3},${H} Z`;

  const cdfPath = `M 0,${H} ` + Array.from({ length: 101 }, (_, i) => `L ${i * 3},${H - cdfArr[i] * 120}`).join(' ');
  
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Definition of the CDF:</strong> The CDF F(x) is exactly the accumulated area under the PDF up to point x.
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginBottom: '20px' }}>
        {/* PDF View */}
        <div style={{ width: '300px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px', textAlign: 'center' }}>PDF (Area = Probability)</div>
          <div style={{ background: 'var(--color-bg)', borderLeft: '2px solid var(--color-text)', borderBottom: '2px solid var(--color-text)', position: 'relative' }}>
            <svg width="300" height={H}>
              <path d={pdfPath} fill="none" stroke="#3b82f6" strokeWidth="2" />
              <path d={pdfArea} fill="rgba(59,130,246,0.3)" stroke="none" />
              <line x1={xVal * 3} y1="0" x2={xVal * 3} y2={H} stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
            <div style={{ position: 'absolute', bottom: '-20px', left: `${xVal}%`, transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: 'bold', color: '#3b82f6' }}>x</div>
          </div>
        </div>

        {/* CDF View */}
        <div style={{ width: '300px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px', textAlign: 'center' }}>CDF (Height = Probability)</div>
          <div style={{ background: 'var(--color-bg)', borderLeft: '2px solid var(--color-text)', borderBottom: '2px solid var(--color-text)', position: 'relative' }}>
            <svg width="300" height={H}>
              {/* Max line y=1 */}
              <line x1="0" y1={H - 120} x2="300" y2={H - 120} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />
              <path d={cdfPath} fill="none" stroke="#10b981" strokeWidth="2" />
              {/* Point */}
              <circle cx={xVal * 3} cy={H - cdfArr[xVal] * 120} r="4" fill="#10b981" />
              {/* Lines to axes */}
              <line x1={xVal * 3} y1={H - cdfArr[xVal] * 120} x2={xVal * 3} y2={H} stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="0" y1={H - cdfArr[xVal] * 120} x2={xVal * 3} y2={H - cdfArr[xVal] * 120} stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
            </svg>
            <div style={{ position: 'absolute', top: `${H - cdfArr[xVal] * 120 - 8}px`, left: '-35px', fontSize: '0.7rem', color: '#10b981' }}>{cdfArr[xVal].toFixed(2)}</div>
            <div style={{ position: 'absolute', bottom: '-20px', left: `${xVal}%`, transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: 'bold', color: '#10b981' }}>x</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>x:</span>
        <input type="range" min={0} max={100} value={xVal} onChange={e => setXVal(parseInt(e.target.value))} style={{ flex: 1 }} />
      </div>
    </div>
  );
};

export const VizCDFIntervals: React.FC = () => {
  const [range, setRange] = useState({ a: 30, b: 70 });
  const W = 400;
  const H = 160;

  const pdf = (x: number) => Math.exp(-Math.pow(x - 50, 2) / 450);
  const cdfArr: number[] = [];
  let sum = 0;
  for (let i = 0; i <= 100; i++) sum += pdf(i);
  let accum = 0;
  for (let i = 0; i <= 100; i++) {
    accum += pdf(i);
    cdfArr[i] = accum / sum;
  }

  const cdfPath = `M 0,${H} ` + Array.from({ length: 101 }, (_, i) => `L ${i * 4},${H - cdfArr[i] * 140}`).join(' ');

  const fa = cdfArr[range.a];
  const fb = cdfArr[range.b];

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Interval Probabilities from CDF:</strong> P(a &lt; X ≤ b) = F(b) - F(a)
      </div>
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto 20px', background: 'var(--color-bg)', borderLeft: '2px solid var(--color-text)', borderBottom: '2px solid var(--color-text)' }}>
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <line x1="0" y1={H - 140} x2="400" y2={H - 140} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />
          <path d={cdfPath} fill="none" stroke="#8b5cf6" strokeWidth="2" />
          
          {/* Points */}
          <circle cx={range.a * 4} cy={H - fa * 140} r="4" fill="#ec4899" />
          <circle cx={range.b * 4} cy={H - fb * 140} r="4" fill="#3b82f6" />
          
          {/* Vertical bounds */}
          <line x1={range.a * 4} y1={H - fa * 140} x2={range.a * 4} y2={H} stroke="#ec4899" strokeWidth="1" strokeDasharray="2 2" />
          <line x1={range.b * 4} y1={H - fb * 140} x2={range.b * 4} y2={H} stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
          
          {/* Horizontal projections */}
          <line x1="0" y1={H - fa * 140} x2={range.a * 4} y2={H - fa * 140} stroke="#ec4899" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="0" y1={H - fb * 140} x2={range.b * 4} y2={H - fb * 140} stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
          
          {/* Difference bracket */}
          <line x1="15" y1={H - fa * 140} x2="15" y2={H - fb * 140} stroke="var(--color-text)" strokeWidth="2" />
          <line x1="10" y1={H - fa * 140} x2="20" y2={H - fa * 140} stroke="var(--color-text)" strokeWidth="2" />
          <line x1="10" y1={H - fb * 140} x2="20" y2={H - fb * 140} stroke="var(--color-text)" strokeWidth="2" />
        </svg>

        <div style={{ position: 'absolute', top: `${H - fb * 140 - 8}px`, left: '-35px', fontSize: '0.7rem', color: '#3b82f6' }}>F(b)</div>
        <div style={{ position: 'absolute', top: `${H - fa * 140 - 8}px`, left: '-35px', fontSize: '0.7rem', color: '#ec4899' }}>F(a)</div>
        <div style={{ position: 'absolute', top: `${H - ((fa + fb)/2) * 140 - 6}px`, left: '25px', fontSize: '0.75rem', fontWeight: 'bold' }}>{(fb - fa).toFixed(2)}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ width: '20px', fontWeight: 'bold', color: '#ec4899' }}>a:</span>
          <input type="range" min={0} max={100} value={range.a} onChange={e => {
            const val = parseInt(e.target.value);
            setRange(p => ({ ...p, a: Math.min(val, p.b - 1) }));
          }} style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ width: '20px', fontWeight: 'bold', color: '#3b82f6' }}>b:</span>
          <input type="range" min={0} max={100} value={range.b} onChange={e => {
            const val = parseInt(e.target.value);
            setRange(p => ({ ...p, b: Math.max(val, p.a + 1) }));
          }} style={{ flex: 1 }} />
        </div>
      </div>
    </div>
  );
};

export const VizCDFExponential: React.FC = () => {
  const [x, setX] = useState(200);
  const lambda = 0.01;
  const Fx = 1 - Math.exp(-lambda * x);
  const W = 400;
  const H = 140;

  const cdfPath = `M 0,${H} ` + Array.from({ length: 101 }, (_, i) => {
    const xv = i * 4;
    const yv = 1 - Math.exp(-lambda * xv);
    return `L ${xv},${H - yv * (H - 20)}`;
  }).join(' ');

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Exponential CDF:</strong> F(x) = 1 - e⁻^λx. For λ=0.01, find P(X ≤ {x}).
      </div>
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto 20px', background: 'var(--color-bg)', borderLeft: '2px solid var(--color-text)', borderBottom: '2px solid var(--color-text)' }}>
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <line x1="0" y1="20" x2={W} y2="20" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />
          <path d={cdfPath} fill="none" stroke="#10b981" strokeWidth="2" />
          
          <circle cx={x} cy={H - Fx * (H - 20)} r="4" fill="#10b981" />
          <line x1={x} y1={H - Fx * (H - 20)} x2={x} y2={H} stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="0" y1={H - Fx * (H - 20)} x2={x} y2={H - Fx * (H - 20)} stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
        </svg>

        <div style={{ position: 'absolute', top: `${H - Fx * (H - 20) - 8}px`, left: '-35px', fontSize: '0.7rem', color: '#10b981' }}>{Fx.toFixed(3)}</div>
        <div style={{ position: 'absolute', bottom: '-20px', left: `${(x/W)*100}%`, transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: 'bold' }}>{x}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>x:</span>
        <input type="range" min={0} max={400} value={x} onChange={e => setX(parseInt(e.target.value))} style={{ flex: 1 }} />
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
        P(X ≤ {x}) = 1 - e⁻⁰·⁰¹⁽^{x}⁾ = <strong>{Fx.toFixed(3)}</strong>
      </div>
    </div>
  );
};

export const VizCDFNormal: React.FC = () => {
  const [x, setX] = useState(7);
  // X ~ N(5, 4) -> mu=5, sigma=2
  const z = (x - 5) / 2;
  
  // Approx CDF for normal
  const F = (val: number) => {
    // very rough approx for visual purposes
    return 1 / (1 + Math.exp(-1.7 * val));
  };
  const prob = F(z);

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Standardising a Normal:</strong> Any normal X ~ N(μ, σ²) maps exactly to the standard Z ~ N(0, 1).
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center' }}>
        {/* X Graph */}
        <div style={{ width: '250px', textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: '#3b82f6', marginBottom: '8px' }}>X ~ N(5, 4)</div>
          <div style={{ height: '100px', background: 'var(--color-bg)', borderBottom: '2px solid var(--color-text)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: `${F(z)*100}%`, height: '100%', background: 'rgba(59,130,246,0.2)' }} />
            {/* Fake bell curve */}
            <svg width="250" height="100">
              <path d="M 0,100 Q 50,100 80,60 T 125,10 T 170,60 T 250,100" fill="none" stroke="#3b82f6" strokeWidth="2" />
              <line x1={125 + (x-5)*25} y1="0" x2={125 + (x-5)*25} y2="100" stroke="#3b82f6" strokeDasharray="4 4" />
            </svg>
            <div style={{ position: 'absolute', bottom: '-20px', left: `50%`, transform: 'translateX(-50%)', fontSize: '0.75rem' }}>μ=5</div>
            <div style={{ position: 'absolute', bottom: 0, left: `${50 + (x-5)*10}%`, transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: 'bold', color: '#3b82f6' }}>x={x}</div>
          </div>
        </div>

        {/* Z Graph */}
        <div style={{ width: '250px', textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: '#ec4899', marginBottom: '8px' }}>Z ~ N(0, 1)</div>
          <div style={{ height: '100px', background: 'var(--color-bg)', borderBottom: '2px solid var(--color-text)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: `${F(z)*100}%`, height: '100%', background: 'rgba(236,72,153,0.2)' }} />
            {/* Fake bell curve */}
            <svg width="250" height="100">
              <path d="M 0,100 Q 50,100 80,60 T 125,10 T 170,60 T 250,100" fill="none" stroke="#ec4899" strokeWidth="2" />
              <line x1={125 + z*50} y1="0" x2={125 + z*50} y2="100" stroke="#ec4899" strokeDasharray="4 4" />
            </svg>
            <div style={{ position: 'absolute', bottom: '-20px', left: `50%`, transform: 'translateX(-50%)', fontSize: '0.75rem' }}>0</div>
            <div style={{ position: 'absolute', bottom: 0, left: `${50 + z*20}%`, transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: 'bold', color: '#ec4899' }}>z={z.toFixed(1)}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '300px', margin: '24px auto 16px' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>x:</span>
        <input type="range" min={0} max={10} value={x} onChange={e => setX(parseInt(e.target.value))} style={{ flex: 1 }} />
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text)' }}>
        z = (x - 5) / 2 = <strong>{z.toFixed(1)}</strong> <br/>
        P(X ≤ {x}) = Φ({z.toFixed(1)}) ≈ <strong>{prob.toFixed(3)}</strong>
      </div>
    </div>
  );
};
