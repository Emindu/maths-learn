import React, { useState } from 'react';

export const VizSumDifference: React.FC = () => {
  const [xVal, setXVal] = useState(0.5);
  const [yVal, setYVal] = useState(0.5);

  const zVal = xVal + yVal;
  const wVal = xVal - yVal;

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px', margin: '16px 0 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        <strong>Sum and Difference Transformation:</strong> Drag the sliders to see how a point in (X, Y) space maps to (Z, W) space where Z = X + Y and W = X - Y. This is a 45° rotation combined with a scaling.
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', alignItems: 'center' }}>
        {/* Original Space (X, Y) */}
        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>(X, Y) Space</div>
          <div style={{ position: 'relative', width: '200px', height: '200px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
            <svg width="200" height="200">
              {/* Axes (-2 to 2 mapping to 0 to 200) => scale = 50, center = 100 */}
              <line x1="100" y1="0" x2="100" y2="200" stroke="var(--color-border)" />
              <line x1="0" y1="100" x2="200" y2="100" stroke="var(--color-border)" />
              
              <circle cx={100 + xVal * 50} cy={100 - yVal * 50} r="6" fill="#3b82f6" />
              <text x={100 + xVal * 50 + 10} y={100 - yVal * 50 - 10} fill="#3b82f6" fontSize="12" fontWeight="bold">({xVal.toFixed(1)}, {yVal.toFixed(1)})</text>
            </svg>
          </div>
        </div>

        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>➔</div>

        {/* Transformed Space (Z, W) */}
        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>(Z, W) Space</div>
          <div style={{ position: 'relative', width: '200px', height: '200px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
            <svg width="200" height="200">
              <line x1="100" y1="0" x2="100" y2="200" stroke="var(--color-border)" />
              <line x1="0" y1="100" x2="200" y2="100" stroke="var(--color-border)" />
              
              <circle cx={100 + zVal * 50} cy={100 - wVal * 50} r="6" fill="#ec4899" />
              <text x={100 + zVal * 50 + 10} y={100 - wVal * 50 - 10} fill="#ec4899" fontSize="12" fontWeight="bold">({zVal.toFixed(1)}, {wVal.toFixed(1)})</text>
            </svg>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '350px', margin: '32px auto 0', background: 'var(--color-bg)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)', width: '20px' }}>X:</span>
          <input type="range" min={-1.5} max={1.5} step={0.1} value={xVal} onChange={e => setXVal(parseFloat(e.target.value))} style={{ flex: 1, accentColor: '#3b82f6' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)', width: '20px' }}>Y:</span>
          <input type="range" min={-1.5} max={1.5} step={0.1} value={yVal} onChange={e => setYVal(parseFloat(e.target.value))} style={{ flex: 1, accentColor: '#3b82f6' }} />
        </div>
      </div>
    </div>
  );
};

export const VizJacobianDet: React.FC = () => {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px', margin: '16px 0 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        <strong>Area Distortion (Jacobian):</strong> A unit square [0,1]×[0,1] in (X,Y) space has Area = 1. The transformation Z=X+Y, W=X-Y maps this square to a diamond in (Z,W) space. The Area of this diamond is 2. The Jacobian determinant |J|=2 perfectly captures this exact area expansion!
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '200px', height: '200px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
            <svg width="200" height="200">
              <line x1="20" y1="0" x2="20" y2="200" stroke="var(--color-border)" />
              <line x1="0" y1="180" x2="200" y2="180" stroke="var(--color-border)" />
              
              {/* Unit square (0,0) to (1,1) mapped to (20,180) to (120,80) (scale=100) */}
              <rect x="20" y="80" width="100" height="100" fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="2" />
            </svg>
            <div style={{ position: 'absolute', top: '90px', left: '40px', fontWeight: 'bold', color: '#1d4ed8' }}>Area = 1</div>
          </div>
        </div>

        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>➔</div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '200px', height: '200px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
            <svg width="200" height="200">
              {/* Center axes */}
              <line x1="100" y1="0" x2="100" y2="200" stroke="var(--color-border)" />
              <line x1="0" y1="100" x2="200" y2="100" stroke="var(--color-border)" />
              
              {/* Diamond vertices: 
                  (0,0) -> (0,0)
                  (1,0) -> (1,1)
                  (1,1) -> (2,0)
                  (0,1) -> (1,-1)
                  Scale = 50, center = 100,100
              */}
              <polygon points="100,100 150,50 200,100 150,150" fill="rgba(236,72,153,0.3)" stroke="#ec4899" strokeWidth="2" />
            </svg>
            <div style={{ position: 'absolute', top: '70px', left: '130px', fontWeight: 'bold', color: '#be185d' }}>Area = 2</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VizConvolution: React.FC = () => {
  const [zVal, setZVal] = useState(2);
  const lambda = 1;

  // X ~ Exp(1), Y ~ Exp(1)
  // Convolution f_Z(z) = int_0^z f_X(w) f_Y(z-w) dw
  // For z = zVal, f_X(w) is blue, f_Y(z-w) is pink. They overlap from w=0 to w=zVal.
  // Their product forms the area we integrate.
  
  const wVals = Array.from({ length: 100 }, (_, i) => i * (4 / 100)); // 0 to 4
  
  const fxPath = `M 20,180 ` + wVals.map(w => {
    const dens = Math.exp(-lambda * w);
    return `L ${20 + w * 50},${180 - dens * 100}`;
  }).join(' ') + ` L ${20 + 4 * 50},180 Z`;

  // f_Y(z - w) is mirrored, peaks at w = zVal
  const fyPath = `M ${20 + Math.max(0, zVal) * 50},180 ` + wVals.map(w => {
    if (w > zVal) return ''; // 0 outside
    const dens = Math.exp(-lambda * (zVal - w));
    return `L ${20 + w * 50},${180 - dens * 100}`;
  }).filter(Boolean).join(' ') + ` L 20,180 Z`;
  
  // The integrated result f_Z(z) = lambda^2 * z * exp(-lambda * z)
  const fzPath = `M 20,180 ` + wVals.map(w => {
    const dens = lambda * lambda * w * Math.exp(-lambda * w);
    return `L ${20 + w * 50},${180 - dens * 100}`;
  }).join(' ') + ` L ${20 + 4 * 50},180 Z`;

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px', margin: '16px 0 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        <strong>Convolution of Two Exponentials:</strong> Z = X + Y. The density of Z at z is the "overlap" (integral) of f_X(w) and the flipped-and-shifted f_Y(z-w). Slide z to compute the convolution!
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', alignItems: 'center' }}>
        {/* Convolution Integration Visualization */}
        <div style={{ position: 'relative', width: '220px', height: '200px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
          <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>Overlap (Integral space)</div>
          <svg width="220" height="200">
            <line x1="20" y1="0" x2="20" y2="200" stroke="var(--color-border)" />
            <line x1="0" y1="180" x2="220" y2="180" stroke="var(--color-border)" />
            
            {/* f_X(w) */}
            <path d={fxPath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* f_Y(z-w) */}
            {zVal >= 0 && (
              <path d={fyPath} fill="rgba(236,72,153,0.3)" stroke="#ec4899" strokeWidth="2" />
            )}
            
            {/* marker for zVal */}
            <line x1={20 + zVal * 50} y1="180" x2={20 + zVal * 50} y2="190" stroke="var(--color-text)" />
            <text x={20 + zVal * 50} y="202" fontSize="10" fill="var(--color-text)" textAnchor="middle">w=z</text>
          </svg>
        </div>

        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>➔</div>

        {/* Resulting Density f_Z(z) */}
        <div style={{ position: 'relative', width: '220px', height: '200px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
          <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '0.75rem', fontWeight: 'bold', color: '#10b981' }}>f_Z(z) - Gamma(2, λ)</div>
          <svg width="220" height="200">
            <line x1="20" y1="0" x2="20" y2="200" stroke="var(--color-border)" />
            <line x1="0" y1="180" x2="220" y2="180" stroke="var(--color-border)" />
            
            <path d={fzPath} fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="2" />
            
            <line x1={20 + zVal * 50} y1="0" x2={20 + zVal * 50} y2="180" stroke="#10b981" strokeDasharray="4 4" />
            <circle cx={20 + zVal * 50} cy={180 - (lambda * lambda * zVal * Math.exp(-lambda * zVal)) * 100} r="5" fill="#10b981" />
          </svg>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '350px', margin: '32px auto 0', background: 'var(--color-bg)', padding: '12px 20px', borderRadius: '30px', border: '1px solid var(--color-border)' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Slide z:</span>
        <input type="range" min={0} max={4} step={0.1} value={zVal} onChange={e => setZVal(parseFloat(e.target.value))} style={{ flex: 1, accentColor: '#10b981' }} />
        <span style={{ width: '32px', textAlign: 'right', fontWeight: 'bold', color: '#10b981' }}>{zVal.toFixed(1)}</span>
      </div>
    </div>
  );
};
