import React, { useState } from 'react';

export const VizUniformDie: React.FC = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const toggle = (n: number) => setSelected(p => p.includes(n) ? p.filter(x => x !== n) : [...p, n]);

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Uniform Probability:</strong> Select outcomes for a fair 6-sided die to form an event A.
      </div>
      
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
        {[1, 2, 3, 4, 5, 6].map(n => (
          <div key={n} onClick={() => toggle(n)}
               style={{ 
                 width: '50px', height: '50px', borderRadius: '10px', 
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer',
                 background: selected.includes(n) ? '#3b82f6' : 'var(--color-bg)',
                 color: selected.includes(n) ? '#fff' : 'var(--color-text)',
                 border: `2px solid ${selected.includes(n) ? '#3b82f6' : 'var(--color-border)'}`,
                 transition: 'all 0.2s'
               }}>
            {n}
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text)', padding: '12px', background: 'var(--color-bg)', borderRadius: '6px' }}>
        <strong>|A|</strong> = {selected.length} <span style={{ margin: '0 8px' }}>|</span> 
        <strong>|S|</strong> = 6 <span style={{ margin: '0 8px' }}>|</span> 
        <strong>P(A)</strong> = {selected.length} / 6 = {(selected.length / 6).toFixed(3)}
      </div>
    </div>
  );
};

export const VizMultiplication: React.FC = () => {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Multiplication Principle:</strong> Flipping 3 coins and rolling 2 dice.
      </div>
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        {/* Coins */}
        <div style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Coin 1</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>2</div>
        </div>
        <div style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>×</div>
        <div style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Coin 2</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>2</div>
        </div>
        <div style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>×</div>
        <div style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Coin 3</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>2</div>
        </div>
        <div style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>×</div>
        
        {/* Dice */}
        <div style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Die 1</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>6</div>
        </div>
        <div style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>×</div>
        <div style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Die 2</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>6</div>
        </div>
        
        <div style={{ fontWeight: 'bold', color: 'var(--color-text)', margin: '0 8px' }}>=</div>
        
        <div style={{ padding: '12px 24px', background: 'rgba(59, 130, 246, 0.1)', border: '2px solid #3b82f6', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Total Outcomes</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-text)' }}>288</div>
        </div>
      </div>
    </div>
  );
};

export const VizPermutations: React.FC = () => {
  const [arrangement, setArrangement] = useState<number[]>([1, 2, 3, 4]);
  const [attempts, setAttempts] = useState(0);

  const shuffle = () => {
    const newArr = [...arrangement];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    setArrangement(newArr);
    setAttempts(a => a + 1);
  };

  const isPerfectMatch = arrangement.every((val, idx) => val === idx + 1);

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Coat Check (Permutations):</strong> 4 coats are returned randomly to 4 owners. Total arrangements = 4! = 24.
      </div>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '20px' }}>
        {[1, 2, 3, 4].map((ownerId, i) => {
          const coatId = arrangement[i];
          const isMatch = ownerId === coatId;
          return (
            <div key={ownerId} style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '8px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Owner {ownerId}</div>
              <div style={{ 
                width: '60px', height: '80px', borderRadius: '8px',
                background: isMatch ? '#22c55e' : 'var(--color-bg)',
                border: `2px solid ${isMatch ? '#22c55e' : 'var(--color-border)'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: isMatch ? '#fff' : 'var(--color-text)', transition: 'all 0.3s'
              }}>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Coat</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{coatId}</div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={shuffle} style={{
          padding: '8px 16px', borderRadius: '6px', border: 'none',
          background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
        }}>
          Shuffle Coats
        </button>
        <div style={{ fontSize: '0.85rem', color: isPerfectMatch ? '#22c55e' : 'var(--color-text-secondary)', fontWeight: isPerfectMatch ? 'bold' : 'normal' }}>
          {isPerfectMatch ? 'Perfect Match! (1/24 probability)' : `Attempts: ${attempts}`}
        </div>
      </div>
    </div>
  );
};

export const VizMultinomial: React.FC = () => {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Multinomial Coefficient:</strong> Dealing a 52-card deck into four 13-card bridge hands.
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '20px', background: 'var(--color-bg)', borderRadius: '8px' }}>
        {/* Deck */}
        <div style={{ 
          width: '80px', height: '110px', background: '#3b82f6', borderRadius: '8px', 
          border: '2px solid #2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '2px 2px 0 #1e40af, 4px 4px 0 #1e3a8a'
        }}>
          52
        </div>
        
        <div style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>↓</div>
        
        {/* Hands */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {['North', 'East', 'South', 'West'].map(hand => (
            <div key={hand} style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', height: '85px', background: 'var(--color-surface)', borderRadius: '6px', 
                border: '2px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-text)', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '1px 1px 0 var(--color-border), 2px 2px 0 var(--color-border)'
              }}>
                13
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{hand}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
        Total Ways = <span style={{ padding: '2px 6px', background: 'var(--color-bg)', borderRadius: '4px', border: '1px solid var(--color-border)', display: 'inline-block', verticalAlign: 'middle' }}>
          <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '2px', marginBottom: '2px' }}>52!</div>
          <div>13! × 13! × 13! × 13!</div>
        </span> ≈ 5.36 × 10²⁸
      </div>
    </div>
  );
};
