import React, { useState } from 'react';

export const VizComplementRule: React.FC = () => {
  const [pA, setPA] = useState(0.4);

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Complement Rule:</strong> Adjust P(A) to see how P(A^c) changes.
      </div>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
        <input type="range" min={0} max={1} step={0.01} value={pA} 
               onChange={e => setPA(parseFloat(e.target.value))} 
               style={{ flex: 1 }}/>
      </div>

      <div style={{ display: 'flex', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--color-border)' }}>
        <div style={{ width: `${pA * 100}%`, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '0.9rem', transition: 'width 0.1s' }}>
          {pA > 0.1 ? `A (${pA.toFixed(2)})` : ''}
        </div>
        <div style={{ flex: 1, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '0.9rem', transition: 'flex 0.1s' }}>
          {(1 - pA) > 0.1 ? `A^c (${(1 - pA).toFixed(2)})` : ''}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
        P(A) + P(A^c) = {pA.toFixed(2)} + {(1 - pA).toFixed(2)} = <strong>1.00</strong>
      </div>
    </div>
  );
};

export const VizLawOfTotalProbability: React.FC = () => {
  const [activePartition, setActivePartition] = useState<number | null>(null);

  const partitions = [
    { id: 1, color: '#3b82f6', label: 'A₁', pA: 0.3, pBA: 0.2 },
    { id: 2, color: '#10b981', label: 'A₂', pA: 0.5, pBA: 0.6 },
    { id: 3, color: '#f59e0b', label: 'A₃', pA: 0.2, pBA: 0.8 },
  ];

  const totalB = partitions.reduce((sum, p) => sum + (p.pA * p.pBA), 0);

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Law of Total Probability:</strong> Hover over the partitions to see their contribution to event B.
      </div>
      
      <div style={{ display: 'flex', height: '160px', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--color-border)', position: 'relative' }}>
        {partitions.map((p, i) => (
          <div key={p.id} 
               onMouseEnter={() => setActivePartition(i)}
               onMouseLeave={() => setActivePartition(null)}
               style={{ 
                 width: `${p.pA * 100}%`, background: p.color, opacity: activePartition === null || activePartition === i ? 0.8 : 0.3,
                 borderRight: i < 2 ? '2px solid #fff' : 'none', position: 'relative', cursor: 'pointer', transition: 'opacity 0.2s'
               }}>
            <div style={{ position: 'absolute', top: '8px', left: '8px', color: '#fff', fontWeight: 600 }}>{p.label}</div>
            
            {/* Event B inside this partition */}
            <div style={{ 
              position: 'absolute', bottom: 0, left: 0, width: '100%', height: `${p.pBA * 100}%`,
              background: 'rgba(0,0,0,0.4)', borderTop: '2px solid rgba(255,255,255,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem'
            }}>
              {activePartition === i ? `P(${p.label} ∩ B) = ${(p.pA * p.pBA).toFixed(2)}` : ''}
            </div>
          </div>
        ))}
        <div style={{ position: 'absolute', top: '50%', left: '16px', color: '#fff', fontWeight: 600, fontSize: '1.2rem', pointerEvents: 'none', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          Event B
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
        P(B) = P(A₁ ∩ B) + P(A₂ ∩ B) + P(A₃ ∩ B) = {(partitions[0].pA * partitions[0].pBA).toFixed(2)} + {(partitions[1].pA * partitions[1].pBA).toFixed(2)} + {(partitions[2].pA * partitions[2].pBA).toFixed(2)} = <strong>{totalB.toFixed(2)}</strong>
      </div>
    </div>
  );
};

export const VizMonotonicity: React.FC = () => {
  const [pB, setPB] = useState(0.2);
  const pA = 0.6; // fixed size for A

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Monotonicity:</strong> Event A contains Event B (A ⊇ B). Adjust the size of B.
      </div>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
        <input type="range" min={0.05} max={pA} step={0.01} value={pB} 
               onChange={e => setPB(parseFloat(e.target.value))} 
               style={{ flex: 1 }}/>
      </div>

      <div style={{ position: 'relative', height: '200px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Sample Space */}
        <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Sample Space S (Area = 1)</div>
        
        {/* Event A */}
        <div style={{ 
          width: `${Math.sqrt(pA) * 200}px`, height: `${Math.sqrt(pA) * 200}px`, 
          background: 'rgba(59, 130, 246, 0.2)', border: '2px solid #3b82f6', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: '10px', color: '#3b82f6', fontWeight: 600 }}>A (0.60)</div>
          
          {/* Event B */}
          <div style={{ 
            width: `${Math.sqrt(pB / pA) * 100}%`, height: `${Math.sqrt(pB / pA) * 100}%`, 
            background: 'rgba(239, 68, 68, 0.4)', border: '2px solid #ef4444', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontWeight: 600, transition: 'all 0.1s'
          }}>
            B ({pB.toFixed(2)})
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
        Since A ⊇ B, we clearly see P(A) ≥ P(B) <br/>
        Also: P(A) = P(B) + P(A ∩ B^c) ➔ 0.60 = {pB.toFixed(2)} + {(pA - pB).toFixed(2)}
      </div>
    </div>
  );
};

export const VizSubadditivity: React.FC = () => {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Subadditivity (Boole's Inequality):</strong> Summing the individual probabilities overcounts overlapping areas.
      </div>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        {/* Union View */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>P(A₁ ∪ A₂ ∪ A₃)</div>
          <div style={{ position: 'relative', width: '160px', height: '160px' }}>
            <div style={{ position: 'absolute', top: '20px', left: '40px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(59,130,246,0.5)', mixBlendMode: 'multiply' }}></div>
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.5)', mixBlendMode: 'multiply' }}></div>
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245,158,11,0.5)', mixBlendMode: 'multiply' }}></div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.2rem', color: 'var(--color-text)', fontWeight: 'bold' }}>
          ≤
        </div>

        {/* Sum View */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>P(A₁) + P(A₂) + P(A₃)</div>
          <div style={{ position: 'relative', width: '160px', height: '160px' }}>
            <div style={{ position: 'absolute', top: '10px', left: '40px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(59,130,246,0.8)', border: '2px solid #fff' }}></div>
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.8)', border: '2px solid #fff' }}></div>
            <div style={{ position: 'absolute', bottom: '20px', right: '10px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245,158,11,0.8)', border: '2px solid #fff' }}></div>
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
        The union exactly measures the total shaded area. The sum measures the disjoint circles, double/triple-counting the intersections, therefore giving a larger or equal value.
      </div>
    </div>
  );
};
