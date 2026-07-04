import React, { useState } from 'react';

export const VizDiscreteSimulation: React.FC = () => {
  const [uVal, setUVal] = useState(0.42);

  // Die probabilities: 1/6 each
  const prob = 1 / 6;
  
  // Determine which outcome based on U
  let outcome = 1;
  if (uVal >= 1 * prob && uVal < 2 * prob) outcome = 2;
  if (uVal >= 2 * prob && uVal < 3 * prob) outcome = 3;
  if (uVal >= 3 * prob && uVal < 4 * prob) outcome = 4;
  if (uVal >= 4 * prob && uVal < 5 * prob) outcome = 5;
  if (uVal >= 5 * prob) outcome = 6;

  const colors = ['#f87171', '#fb923c', '#fbbf24', '#34d399', '#3b82f6', '#c084fc'];

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px', margin: '16px 0 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        <strong>Discrete Simulation via CDF:</strong> A Uniform[0,1] random number generator outputs a continuous value between 0 and 1. By carving the [0,1] line into segments of length 1/6, we can perfectly simulate a fair 6-sided die!
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '300px', height: '150px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>U ~ Uniform[0,1] Line</div>
          <svg width="260" height="60" style={{ overflow: 'visible' }}>
            {/* The segments */}
            {Array.from({ length: 6 }).map((_, i) => (
              <g key={i}>
                <rect x={i * (260 / 6)} y="20" width={260 / 6} height="20" fill={colors[i]} opacity={outcome === i + 1 ? 1 : 0.3} />
                <text x={i * (260 / 6) + (260 / 12)} y="15" fontSize="10" fill="var(--color-text-secondary)" textAnchor="middle">{i+1}</text>
              </g>
            ))}
            
            {/* The U pointer */}
            <polygon points={`${uVal * 260},45 ${uVal * 260 - 5},55 ${uVal * 260 + 5},55`} fill="var(--color-text)" />
            <text x={uVal * 260} y="70" fontSize="12" fill="var(--color-text)" textAnchor="middle" fontWeight="bold">U = {uVal.toFixed(2)}</text>
          </svg>
        </div>

        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>➔</div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Simulated Outcome</div>
          <div style={{ width: '100px', height: '100px', background: colors[outcome - 1], borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            {outcome}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '350px', margin: '40px auto 0', background: 'var(--color-bg)', padding: '12px 20px', borderRadius: '30px', border: '1px solid var(--color-border)' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Slide U:</span>
        <input type="range" min={0} max={0.99} step={0.01} value={uVal} onChange={e => setUVal(parseFloat(e.target.value))} style={{ flex: 1, accentColor: '#3b82f6' }} />
      </div>
    </div>
  );
};

export const VizInverseCDF: React.FC = () => {
  const [uVal, setUVal] = useState(0.5);
  const lambda = 1;

  // Inverse CDF for Exponential(1): x = -ln(1-u)
  // Or simply x = -ln(u) since 1-u is also Uniform(0,1). The text uses x = -log(u)/lambda.
  // But if we use F(x) = 1 - e^(-lambda*x) = u, then e^(-lambda*x) = 1-u => -lambda*x = ln(1-u) => x = -ln(1-u)/lambda
  const xVal = -Math.log(1 - uVal) / lambda;

  // CDF Path for plotting
  const cdfPoints = Array.from({ length: 100 }, (_, i) => {
    const x = (i / 100) * 5; // x from 0 to 5
    const f = 1 - Math.exp(-lambda * x); // y from 0 to 1
    const svgX = 40 + x * 40; // 0->40, 5->240
    const svgY = 160 - f * 120; // 0->160, 1->40
    return `${i === 0 ? 'M' : 'L'} ${svgX},${svgY}`;
  }).join(' ');

  const currentSvgX = 40 + xVal * 40;
  const currentSvgY = 160 - uVal * 120;

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px', margin: '16px 0 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        <strong>Inverse CDF Method:</strong> To generate a random number from an Exponential distribution, we generate U on the y-axis, hit the CDF curve F(x), and drop down to the x-axis to find our simulated value X = F⁻¹(U).
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '280px', height: '220px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
          <div style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '0.8rem', fontWeight: 'bold', color: '#10b981' }}>Exponential CDF</div>
          <svg width="280" height="220">
            {/* Grid */}
            <line x1="40" y1="40" x2="260" y2="40" stroke="var(--color-border)" strokeDasharray="2 2" />
            <text x="25" y="45" fontSize="10" fill="var(--color-text-secondary)">1.0</text>
            <text x="25" y="165" fontSize="10" fill="var(--color-text-secondary)">0.0</text>
            
            {/* Axes */}
            <line x1="40" y1="20" x2="40" y2="180" stroke="var(--color-text)" />
            <line x1="20" y1="160" x2="260" y2="160" stroke="var(--color-text)" />
            
            {/* CDF Curve */}
            <path d={cdfPoints} fill="none" stroke="#10b981" strokeWidth="3" />
            
            {/* The mapping lines */}
            {/* Horizontal line from U */}
            <line x1="40" y1={currentSvgY} x2={currentSvgX} y2={currentSvgY} stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
            {/* Vertical line down to X */}
            <line x1={currentSvgX} y1={currentSvgY} x2={currentSvgX} y2="160" stroke="#ec4899" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* Points */}
            <circle cx="40" cy={currentSvgY} r="4" fill="#3b82f6" />
            <circle cx={currentSvgX} cy={currentSvgY} r="4" fill="white" stroke="#10b981" strokeWidth="2" />
            <circle cx={currentSvgX} cy="160" r="4" fill="#ec4899" />
            
            {/* Labels */}
            <text x="15" y={currentSvgY + 4} fontSize="12" fill="#3b82f6" fontWeight="bold">U</text>
            <text x={Math.min(currentSvgX, 240)} y="175" fontSize="12" fill="#ec4899" fontWeight="bold">X = {xVal.toFixed(2)}</text>
          </svg>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '350px', margin: '32px auto 0', background: 'var(--color-bg)', padding: '12px 20px', borderRadius: '30px', border: '1px solid var(--color-border)' }}>
        <span style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: '0.85rem' }}>Slide U:</span>
        <input type="range" min={0.01} max={0.99} step={0.01} value={uVal} onChange={e => setUVal(parseFloat(e.target.value))} style={{ flex: 1, accentColor: '#3b82f6' }} />
        <span style={{ width: '32px', textAlign: 'right', fontWeight: 'bold', color: '#3b82f6' }}>{uVal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export const VizBoxMuller: React.FC = () => {
  const [u1, setU1] = useState(0.5);
  const [u2, setU2] = useState(0.25);

  // Box muller
  // R = sqrt(-2 ln(U1)) => magnitude
  // Theta = 2 pi U2 => angle
  const R = Math.sqrt(-2 * Math.log(u1));
  const Theta = 2 * Math.PI * u2;
  
  const X = R * Math.cos(Theta);
  const Y = R * Math.sin(Theta);

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px', margin: '16px 0 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        <strong>Box-Muller Transform:</strong> Two independent uniform variables $U_1, U_2$ can be transformed into two independent Normal variables $X, Y$. $U_1$ controls the radius (distance from center) and $U_2$ controls the angle (rotation).
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* Input variables */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--color-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', width: '220px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold' }}>
              <span style={{ color: '#3b82f6' }}>U₁ (Controls Radius)</span>
              <span>{u1.toFixed(2)}</span>
            </div>
            <input type="range" min={0.01} max={0.99} step={0.01} value={u1} onChange={e => setU1(parseFloat(e.target.value))} style={{ accentColor: '#3b82f6' }} />
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textAlign: 'right' }}>R = {R.toFixed(2)}</div>
          </div>
          
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold' }}>
              <span style={{ color: '#ec4899' }}>U₂ (Controls Angle)</span>
              <span>{u2.toFixed(2)}</span>
            </div>
            <input type="range" min={0.00} max={1.00} step={0.01} value={u2} onChange={e => setU2(parseFloat(e.target.value))} style={{ accentColor: '#ec4899' }} />
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textAlign: 'right' }}>θ = {(Theta * 180 / Math.PI).toFixed(0)}°</div>
          </div>
        </div>

        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>➔</div>

        {/* Output Scatter */}
        <div style={{ position: 'relative', width: '220px', height: '220px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.75rem', fontWeight: 'bold' }}>X, Y ~ N(0,1)</div>
          <svg width="220" height="220">
            {/* Grid & Circles */}
            <circle cx="110" cy="110" r="30" fill="none" stroke="var(--color-border)" strokeDasharray="2 2" />
            <circle cx="110" cy="110" r="60" fill="none" stroke="var(--color-border)" strokeDasharray="2 2" />
            <circle cx="110" cy="110" r="90" fill="none" stroke="var(--color-border)" strokeDasharray="2 2" />
            
            <line x1="110" y1="0" x2="110" y2="220" stroke="var(--color-border)" />
            <line x1="0" y1="110" x2="220" y2="110" stroke="var(--color-border)" />
            
            {/* The Radius Line */}
            <line x1="110" y1="110" x2={110 + X * 30} y2={110 - Y * 30} stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
            
            {/* The Point */}
            <circle cx={110 + X * 30} cy={110 - Y * 30} r="6" fill="#8b5cf6" stroke="white" strokeWidth="2" style={{ filter: 'drop-shadow(0 2px 4px rgba(139,92,246,0.4))' }} />
            
            <text x={110 + X * 30 + 10} y={110 - Y * 30 - 10} fontSize="12" fill="#8b5cf6" fontWeight="bold">({X.toFixed(1)}, {Y.toFixed(1)})</text>
          </svg>
        </div>
      </div>
    </div>
  );
};
