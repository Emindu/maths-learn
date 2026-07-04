import React, { useState } from 'react';

export const VizJointPMF: React.FC = () => {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Joint PMF (Two Dice):</strong> p(x,y) = 1/36 for all pairs. Highlighted are the 6 pairs where X + Y = 7.
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 40px)', gap: '4px', justifyContent: 'center', marginBottom: '16px' }}>
        <div /> {/* empty corner */}
        {[1,2,3,4,5,6].map(y => <div key={`hy-${y}`} style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-text-secondary)', alignSelf: 'end' }}>Y={y}</div>)}
        
        {[1,2,3,4,5,6].map(x => (
          <React.Fragment key={`row-${x}`}>
            <div style={{ textAlign: 'right', paddingRight: '8px', fontWeight: 'bold', color: 'var(--color-text-secondary)', alignSelf: 'center' }}>X={x}</div>
            {[1,2,3,4,5,6].map(y => {
              const isSeven = x + y === 7;
              return (
                <div key={`${x}-${y}`} style={{
                  width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isSeven ? 'rgba(59,130,246,0.2)' : 'var(--color-bg)',
                  border: `1px solid ${isSeven ? '#3b82f6' : 'var(--color-border)'}`,
                  borderRadius: '4px', fontSize: '0.75rem', fontWeight: isSeven ? 'bold' : 'normal',
                  color: isSeven ? '#3b82f6' : 'var(--color-text)'
                }}>
                  {x},{y}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text)' }}>
        P(X + Y = 7) = 6 × (1/36) = <strong>1/6</strong>
      </div>
    </div>
  );
};

export const VizMarginalDist: React.FC = () => {
  const [collapsed, setCollapsed] = useState<'none'|'x'|'y'>('none');
  
  // 3x3 joint probabilities
  const grid = [
    [0.1, 0.2, 0.0], // Y=1
    [0.1, 0.1, 0.2], // Y=2
    [0.0, 0.2, 0.1]  // Y=3
  ];
  
  const margX = [0.2, 0.5, 0.3];
  const margY = [0.3, 0.4, 0.3];

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Marginal Distributions:</strong> "Collapse" the joint PMF by summing rows or columns.
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button onClick={() => setCollapsed('y')} style={{ padding: '6px 12px', background: collapsed === 'y' ? '#10b981' : 'var(--color-bg)', color: collapsed === 'y' ? '#fff' : 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer' }}>Sum over Y (Get P(X))</button>
        <button onClick={() => setCollapsed('none')} style={{ padding: '6px 12px', background: collapsed === 'none' ? 'var(--color-primary)' : 'var(--color-bg)', color: collapsed === 'none' ? '#fff' : 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer' }}>Reset Joint</button>
        <button onClick={() => setCollapsed('x')} style={{ padding: '6px 12px', background: collapsed === 'x' ? '#ec4899' : 'var(--color-bg)', color: collapsed === 'x' ? '#fff' : 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer' }}>Sum over X (Get P(Y))</button>
      </div>

      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'auto repeat(3, 50px) auto', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
        <div /> 
        {[1,2,3].map(x => <div key={`hx-${x}`} style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-text)' }}>X={x}</div>)}
        <div style={{ fontWeight: 'bold', color: '#ec4899', paddingLeft: '8px' }}>P(Y)</div>
        
        {[0,1,2].map(yi => (
          <React.Fragment key={`row-${yi}`}>
            <div style={{ textAlign: 'right', paddingRight: '8px', fontWeight: 'bold', color: 'var(--color-text)' }}>Y={yi+1}</div>
            {[0,1,2].map(xi => {
              return (
                <div key={`${xi}-${yi}`} style={{
                  width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: collapsed === 'none' ? 'var(--color-bg)' : (collapsed === 'y' ? 'rgba(16,185,129,0.1)' : 'rgba(236,72,153,0.1)'),
                  border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem'
                }}>
                  {grid[yi][xi].toFixed(1)}
                </div>
              );
            })}
            <div style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#ec4899', opacity: collapsed === 'none' || collapsed === 'x' ? 1 : 0.2 }}>
              {margY[yi].toFixed(1)}
            </div>
          </React.Fragment>
        ))}
        
        <div style={{ textAlign: 'right', paddingRight: '8px', fontWeight: 'bold', color: '#10b981' }}>P(X)</div>
        {[0,1,2].map(xi => (
          <div key={`mx-${xi}`} style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#10b981', opacity: collapsed === 'none' || collapsed === 'y' ? 1 : 0.2 }}>
            {margX[xi].toFixed(1)}
          </div>
        ))}
        <div />
      </div>
    </div>
  );
};

export const VizJointDensity: React.FC = () => {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Joint Density (Triangle):</strong> Uniform over x ≥ 0, y ≥ 0, x + y ≤ 1. The volume over this triangle must be 1, so the height (density) is 2.
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '200px', height: '200px', background: 'var(--color-bg)', borderLeft: '2px solid var(--color-text)', borderBottom: '2px solid var(--color-text)' }}>
          <svg width="200" height="200">
            {/* Triangle x+y <= 1 (maps to 0,0 to 200,200 but inverted Y) */}
            {/* Origin is bottom left: (0, 200). (1,0) is (200, 200). (0,1) is (0, 0). */}
            <polygon points="0,200 200,200 0,0" fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="2" />
          </svg>
          <div style={{ position: 'absolute', bottom: '-20px', right: 0, fontSize: '0.75rem', fontWeight: 'bold' }}>1</div>
          <div style={{ position: 'absolute', top: 0, left: '-15px', fontSize: '0.75rem', fontWeight: 'bold' }}>1</div>
          <div style={{ position: 'absolute', bottom: '-20px', left: 0, fontSize: '0.75rem' }}>0</div>
          
          <div style={{ position: 'absolute', left: '40px', bottom: '40px', color: '#1d4ed8', fontWeight: 'bold', fontSize: '1.2rem' }}>f(x,y) = 2</div>
        </div>
      </div>
    </div>
  );
};

export const VizBivariateNormal: React.FC = () => {
  const [rho, setRho] = useState(0);

  // We'll simulate a rough scatter plot based on rho
  // Z1, Z2 ~ N(0,1)
  // X = Z1
  // Y = rho * Z1 + sqrt(1 - rho^2) * Z2
  
  // Pre-generate some N(0,1) pairs (using a rough pseudo-random deterministic approach for stable rendering)
  const zPairs = Array.from({ length: 200 }, (_, i) => {
    // Box-Muller transform for deterministic fake randomness
    const u1 = ((i * 137) % 1000) / 1000 + 0.001;
    const u2 = ((i * 271) % 1000) / 1000 + 0.001;
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    return { z1, z2 };
  });

  const points = zPairs.map(p => {
    const x = p.z1;
    const y = rho * p.z1 + Math.sqrt(1 - rho * rho) * p.z2;
    return { x, y };
  });

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Bivariate Normal:</strong> Adjust the correlation coefficient ρ.
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '240px', height: '240px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
          <svg width="240" height="240">
            {/* Grid lines */}
            <line x1="120" y1="0" x2="120" y2="240" stroke="var(--color-border)" strokeDasharray="4 4" />
            <line x1="0" y1="120" x2="240" y2="120" stroke="var(--color-border)" strokeDasharray="4 4" />
            
            {/* Scatter */}
            {points.map((p, i) => (
              <circle key={i} 
                cx={120 + p.x * 35} 
                cy={120 - p.y * 35} 
                r="2" 
                fill={rho > 0.5 ? 'rgba(16,185,129,0.7)' : (rho < -0.5 ? 'rgba(239,68,68,0.7)' : 'rgba(59,130,246,0.7)')} 
              />
            ))}
          </svg>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '300px', margin: '0 auto' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>ρ:</span>
        <input type="range" min={-0.95} max={0.95} step={0.05} value={rho} onChange={e => setRho(parseFloat(e.target.value))} style={{ flex: 1 }} />
        <span style={{ width: '40px', textAlign: 'right', fontWeight: 'bold', color: rho > 0 ? '#10b981' : (rho < 0 ? '#ef4444' : 'var(--color-text)') }}>{rho.toFixed(2)}</span>
      </div>
    </div>
  );
};
