import React, { useState } from 'react';

export const VizConditionalProbability: React.FC = () => {
  const outcomes = [
    { id: 'HHH', firstH: true, exactly2H: false },
    { id: 'HHT', firstH: true, exactly2H: true },
    { id: 'HTH', firstH: true, exactly2H: true },
    { id: 'HTT', firstH: true, exactly2H: false },
    { id: 'THH', firstH: false, exactly2H: true },
    { id: 'THT', firstH: false, exactly2H: false },
    { id: 'TTH', firstH: false, exactly2H: false },
    { id: 'TTT', firstH: false, exactly2H: false },
  ];

  const [step, setStep] = useState(0);

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Conditional Probability:</strong> Flipping 3 coins. Event A = "First coin is Heads", Event B = "Exactly two Heads".
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
        {outcomes.map(o => {
          let bg = 'var(--color-bg)';
          let color = 'var(--color-text)';
          let border = '1px solid var(--color-border)';
          let opacity = 1;

          if (step >= 1) {
            // Apply condition B
            if (!o.exactly2H) {
              opacity = 0.2;
            } else {
              bg = 'rgba(59, 130, 246, 0.1)';
              border = '2px solid #3b82f6';
              color = '#3b82f6';
            }
          }
          if (step >= 2 && o.exactly2H) {
            // Highlight A intersection B
            if (o.firstH) {
              bg = '#22c55e';
              border = '2px solid #16a34a';
              color = '#fff';
            }
          }

          return (
            <div key={o.id} style={{
              width: '60px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600,
              background: bg, color: color, border: border, opacity: opacity, transition: 'all 0.3s'
            }}>
              {o.id}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
        <button onClick={() => setStep(0)} style={{ padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', background: step === 0 ? 'var(--color-primary)' : 'var(--color-bg)', color: step === 0 ? '#fff' : 'var(--color-text)', border: '1px solid var(--color-border)' }}>1. All Outcomes (S)</button>
        <button onClick={() => setStep(1)} style={{ padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', background: step === 1 ? 'var(--color-primary)' : 'var(--color-bg)', color: step === 1 ? '#fff' : 'var(--color-text)', border: '1px solid var(--color-border)' }}>2. Given B (Exactly 2H)</button>
        <button onClick={() => setStep(2)} style={{ padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', background: step === 2 ? 'var(--color-primary)' : 'var(--color-bg)', color: step === 2 ? '#fff' : 'var(--color-text)', border: '1px solid var(--color-border)' }}>3. Check A (First is H)</button>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text)' }}>
        {step === 0 && <span>P(A) = 4/8 = 1/2</span>}
        {step === 1 && <span>We restrict the sample space to the <strong>3</strong> outcomes where B is true.</span>}
        {step === 2 && <span>Of those 3 outcomes, <strong>2</strong> satisfy event A. Therefore, P(A|B) = <strong>2/3</strong>.</span>}
      </div>
    </div>
  );
};

export const VizMultiplicationFormula: React.FC = () => {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>The Multiplication Formula:</strong> Tracing the path of an event through a tree diagram.
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        {/* Node */}
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-text)' }} />
        
        {/* Branch */}
        <div style={{ width: '60px', height: '2px', background: '#3b82f6', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-20px', width: '100%', textAlign: 'center', fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600 }}>P(A)</div>
        </div>

        {/* Node A */}
        <div style={{ padding: '4px 12px', background: 'rgba(59,130,246,0.1)', border: '2px solid #3b82f6', borderRadius: '6px', color: '#3b82f6', fontWeight: 600 }}>Event A</div>
        
        {/* Branch */}
        <div style={{ width: '60px', height: '2px', background: '#22c55e', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-20px', width: '100%', textAlign: 'center', fontSize: '0.75rem', color: '#22c55e', fontWeight: 600 }}>P(B|A)</div>
        </div>

        {/* Node B */}
        <div style={{ padding: '4px 12px', background: 'rgba(34,197,94,0.1)', border: '2px solid #22c55e', borderRadius: '6px', color: '#22c55e', fontWeight: 600 }}>Event B</div>

        <div style={{ fontSize: '1.5rem', margin: '0 10px', color: 'var(--color-text)' }}>➔</div>

        {/* Result */}
        <div style={{ padding: '8px 16px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px', textAlign: 'center' }}>P(A ∩ B)</div>
          <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>P(A) × P(B|A)</div>
        </div>
      </div>
    </div>
  );
};

export const VizTotalProbability: React.FC = () => {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Law of Total Probability:</strong> Long Hair in a Class.
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
        {/* Branch 1 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ padding: '8px 24px', background: 'rgba(236,72,153,0.1)', border: '2px solid #ec4899', borderRadius: '6px', color: '#ec4899', fontWeight: 600, marginBottom: '8px' }}>
            Girls (60%)
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>× 30% have long hair</div>
          <div style={{ marginTop: '8px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>18%</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>Total class</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>+</div>

        {/* Branch 2 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ padding: '8px 24px', background: 'rgba(59,130,246,0.1)', border: '2px solid #3b82f6', borderRadius: '6px', color: '#3b82f6', fontWeight: 600, marginBottom: '8px' }}>
            Boys (40%)
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>× 20% have long hair</div>
          <div style={{ marginTop: '8px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>8%</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>Total class</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>=</div>

        {/* Result */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ padding: '12px 24px', background: 'var(--color-bg)', border: '2px solid var(--color-border)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Probability of Long Hair</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)' }}>26%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VizIndependence: React.FC = () => {
  const cols = 10;
  const rows = 10;
  // A = top 3 rows (30%)
  // B = left 2 columns (20%)
  
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isA = r < 3;
      const isB = c < 2;
      let bg = 'var(--color-bg)';
      if (isA && isB) bg = '#8b5cf6'; // intersection (purple)
      else if (isA) bg = 'rgba(59,130,246,0.5)'; // blue
      else if (isB) bg = 'rgba(236,72,153,0.5)'; // pink
      
      cells.push(
        <div key={`${r}-${c}`} style={{
          width: '12px', height: '12px', borderRadius: '2px', background: bg, border: '1px solid rgba(0,0,0,0.1)'
        }} />
      );
    }
  }

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Independence of Events:</strong> When P(A ∩ B) = P(A) × P(B).
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', alignItems: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 12px)`, gap: '2px', background: 'var(--color-bg)', padding: '4px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
          {cells}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', background: 'rgba(59,130,246,0.5)', borderRadius: '2px' }} />
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}><strong>Event A:</strong> 30 / 100 = 30%</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', background: 'rgba(236,72,153,0.5)', borderRadius: '2px' }} />
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}><strong>Event B:</strong> 20 / 100 = 20%</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', background: '#8b5cf6', borderRadius: '2px' }} />
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}><strong>A ∩ B:</strong> 6 / 100 = 6%</div>
          </div>
          
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-text)' }}>
            0.30 × 0.20 = 0.06 <br/>
            <strong>P(A) × P(B) = P(A ∩ B)</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
