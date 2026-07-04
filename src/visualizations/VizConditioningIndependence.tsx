import React, { useState } from 'react';

export const VizConditionalDiscrete: React.FC = () => {
  const [conditionedOnX0, setConditionedOnX0] = useState(false);

  const joint = [
    [0.1, 0.3], // X=0
    [0.2, 0.4]  // X=1
  ];
  const px0 = 0.4;
  // 0.1/0.4 = 0.25, 0.3/0.4 = 0.75
  const cond_Y_given_X0 = [0.25, 0.75];

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Conditional Distribution from a Table:</strong> When we condition on X=0, we restrict our universe to the X=0 row and re-normalise the probabilities so they sum to 1.
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', alignItems: 'center' }}>
        {/* Joint Table */}
        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '8px' }}>Joint p(x,y)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '40px 60px 60px', gap: '4px' }}>
            <div />
            <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>Y=0</div>
            <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>Y=1</div>
            
            <div style={{ alignSelf: 'center', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>X=0</div>
            <div style={{ height: '40px', background: conditionedOnX0 ? 'rgba(59,130,246,0.2)' : 'var(--color-bg)', border: `1px solid ${conditionedOnX0 ? '#3b82f6' : 'var(--color-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>{joint[0][0]}</div>
            <div style={{ height: '40px', background: conditionedOnX0 ? 'rgba(59,130,246,0.2)' : 'var(--color-bg)', border: `1px solid ${conditionedOnX0 ? '#3b82f6' : 'var(--color-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>{joint[0][1]}</div>

            <div style={{ alignSelf: 'center', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-text-secondary)', opacity: conditionedOnX0 ? 0.3 : 1 }}>X=1</div>
            <div style={{ height: '40px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', opacity: conditionedOnX0 ? 0.3 : 1 }}>{joint[1][0]}</div>
            <div style={{ height: '40px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', opacity: conditionedOnX0 ? 0.3 : 1 }}>{joint[1][1]}</div>
          </div>
        </div>

        <button onClick={() => setConditionedOnX0(!conditionedOnX0)} style={{ padding: '8px 16px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          {conditionedOnX0 ? 'Reset' : 'Condition on X=0'}
        </button>

        {/* Conditional Table */}
        <div style={{ opacity: conditionedOnX0 ? 1 : 0, transition: 'opacity 0.3s' }}>
          <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '8px', color: '#3b82f6' }}>p(y | X=0)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 60px', gap: '4px' }}>
            <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>Y=0</div>
            <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>Y=1</div>
            <div style={{ height: '40px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', color: '#3b82f6', fontWeight: 'bold' }}>{cond_Y_given_X0[0]}</div>
            <div style={{ height: '40px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', color: '#3b82f6', fontWeight: 'bold' }}>{cond_Y_given_X0[1]}</div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.75rem', marginTop: '8px', color: 'var(--color-text-secondary)' }}>Divided by P(X=0) = {px0}</div>
        </div>
      </div>
    </div>
  );
};

export const VizConditionalContinuous: React.FC = () => {
  const [xVal, setXVal] = useState(0);
  const rho = 0.6; 

  const condMeanY = rho * xVal;
  const condStdY = Math.sqrt(1 - rho * rho); 

  const curvePoints = Array.from({ length: 100 }, (_, i) => {
    const yVal = -4 + (i / 100) * 8; 
    const dens = (1 / (condStdY * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((yVal - condMeanY) / condStdY, 2));
    
    const svgX = 100 + yVal * 25; 
    const svgY = 180 - dens * 200; 
    
    return `${i === 0 ? 'M' : 'L'} ${svgX},${svgY}`;
  }).join(' ');

  const closedCurve = `${curvePoints} L 300,180 L -100,180 Z`;

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px', margin: '16px 0 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        <strong>Conditional Normal:</strong> When height and weight are correlated (ρ = 0.6), observing a person's height (x) literally shifts the mean of the conditional distribution of their weight (y).
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', alignItems: 'center' }}>
        {/* Left: Joint Scatter */}
        <div style={{ position: 'relative', width: '220px', height: '220px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-text-secondary)', zIndex: 10 }}>Joint Scatter (X, Y)</div>
          <svg width="220" height="220">
            <defs>
              <linearGradient id="ellipseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(59,130,246,0.1)" />
                <stop offset="100%" stopColor="rgba(139,92,246,0.1)" />
              </linearGradient>
            </defs>
            {/* Grid */}
            <line x1="110" y1="0" x2="110" y2="220" stroke="var(--color-border)" strokeDasharray="2 2" />
            <line x1="0" y1="110" x2="220" y2="110" stroke="var(--color-border)" strokeDasharray="2 2" />
            
            <ellipse cx="110" cy="110" rx="90" ry="45" fill="url(#ellipseGrad)" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 4" transform="rotate(-30, 110, 110)" />
            
            <line x1={110 + xVal * 25} y1="0" x2={110 + xVal * 25} y2="220" stroke="#3b82f6" strokeWidth="2.5" />
            <circle cx={110 + xVal * 25} cy={110 - condMeanY * 25} r="4" fill="#3b82f6" />
          </svg>
        </div>

        {/* Right: Conditional Density */}
        <div style={{ position: 'relative', width: '240px', height: '200px', background: 'var(--color-bg)', borderLeft: '2px solid var(--color-text)', borderBottom: '2px solid var(--color-text)' }}>
          <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.8rem', fontWeight: 'bold', color: '#10b981' }}>f(y | X = {xVal.toFixed(1)})</div>
          <svg width="240" height="200" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="fillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(16,185,129,0.4)" />
                <stop offset="100%" stopColor="rgba(16,185,129,0.0)" />
              </linearGradient>
            </defs>
            <path d={closedCurve} fill="url(#fillGrad)" />
            <path d={curvePoints} fill="none" stroke="#10b981" strokeWidth="3" style={{ filter: 'drop-shadow(0px 4px 6px rgba(16,185,129,0.3))' }} />
            
            <line x1={100 + condMeanY * 25} y1={180 - (1 / (condStdY * Math.sqrt(2 * Math.PI))) * 200} x2={100 + condMeanY * 25} y2="180" stroke="#10b981" strokeDasharray="3 3" strokeWidth="1.5" />
            <circle cx={100 + condMeanY * 25} cy={180} r="4" fill="#10b981" />
          </svg>
          <div style={{ position: 'absolute', bottom: '-24px', left: `${(100 + condMeanY * 25) / 2.4}%`, transform: 'translateX(-50%)', fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold', background: 'var(--color-surface)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16,185,129,0.2)' }}>μ={condMeanY.toFixed(2)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '350px', margin: '40px auto 0', background: 'var(--color-bg)', padding: '12px 20px', borderRadius: '30px', border: '1px solid var(--color-border)' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Observe X:</span>
        <input type="range" min={-3} max={3} step={0.1} value={xVal} onChange={e => setXVal(parseFloat(e.target.value))} style={{ flex: 1, accentColor: '#3b82f6' }} />
        <span style={{ width: '32px', textAlign: 'right', fontWeight: 'bold', color: '#3b82f6' }}>{xVal.toFixed(1)}</span>
      </div>
    </div>
  );
};

export const VizIndependenceCheck: React.FC = () => {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Checking Independence:</strong> For a uniform distribution on a [0,1]×[0,1] square, the joint density f(x,y)=1 perfectly splits into the product of marginals f(x)=1 and f(y)=1.
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>f(x, y) = 1</div>
          <div style={{ width: '80px', height: '80px', background: 'rgba(59,130,246,0.3)', border: '2px solid #3b82f6' }} />
        </div>
        
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--color-text)' }}>=</div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>f_X(x) = 1</div>
          <div style={{ width: '80px', height: '20px', background: 'rgba(16,185,129,0.3)', border: '2px solid #10b981' }} />
        </div>

        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-text)' }}>×</div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', color: '#ec4899', marginBottom: '8px' }}>f_Y(y) = 1</div>
          <div style={{ width: '20px', height: '80px', background: 'rgba(236,72,153,0.3)', border: '2px solid #ec4899', margin: '0 auto' }} />
        </div>
      </div>
    </div>
  );
};

export const VizIIDTrials: React.FC = () => {
  const [n, setN] = useState(3);
  const prob = Math.pow(0.5, n);

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>i.i.d. Bernoulli Trials:</strong> Flipping a coin N times. Because they are independent, the joint probability is the pure multiplication of marginal probabilities.
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
        {Array.from({ length: n }).map((_, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span>×</span>}
            <div style={{ background: 'var(--color-bg)', padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>(1/2)</div>
          </React.Fragment>
        ))}
        <span style={{ marginLeft: '12px', color: '#ec4899' }}>= (1/2)^{n} = {prob.toExponential(2)}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '300px', margin: '0 auto' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>N:</span>
        <input type="range" min={1} max={20} value={n} onChange={e => setN(parseInt(e.target.value))} style={{ flex: 1 }} />
        <span style={{ width: '30px', textAlign: 'right' }}>{n}</span>
      </div>
    </div>
  );
};
