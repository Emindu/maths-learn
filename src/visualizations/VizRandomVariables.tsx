import React, { useState } from 'react';

export const VizRandomVariableDie: React.FC = () => {
  const [outcome, setOutcome] = useState<number | null>(null);

  const roll = () => {
    setOutcome(Math.floor(Math.random() * 6) + 1);
  };

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Random Variable:</strong> Roll the die. The function X(s) maps the physical face 's' to the number X(s).
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '20px' }}>
        {/* Sample Space Outcome */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Outcome (s)</div>
          <div style={{ 
            width: '64px', height: '64px', background: 'var(--color-bg)', 
            border: '2px solid var(--color-border)', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem'
          }}>
            {outcome === 1 && '⚀'}
            {outcome === 2 && '⚁'}
            {outcome === 3 && '⚂'}
            {outcome === 4 && '⚃'}
            {outcome === 5 && '⚄'}
            {outcome === 6 && '⚅'}
            {!outcome && '?'}
          </div>
        </div>

        {/* Function Map */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3b82f6', marginBottom: '4px' }}>X(s)</div>
          <div style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>➔</div>
        </div>

        {/* Real Number Value */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Real Number X</div>
          <div style={{ 
            width: '64px', height: '64px', background: 'rgba(59,130,246,0.1)', 
            border: '2px solid #3b82f6', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6'
          }}>
            {outcome !== null ? outcome : '?'}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={roll} style={{
          padding: '8px 16px', borderRadius: '6px', border: 'none',
          background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
        }}>
          Roll Die
        </button>
      </div>
    </div>
  );
};

export const VizIndicatorFunction: React.FC = () => {
  const [outcome, setOutcome] = useState<number | null>(null);

  const roll = () => {
    setOutcome(Math.floor(Math.random() * 6) + 1);
  };

  const isEven = outcome !== null && outcome % 2 === 0;

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Indicator Function:</strong> Let A = &#123;2, 4, 6&#125; (Even roll). I<sub>A</sub>(s) = 1 if s ∈ A, else 0.
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '20px' }}>
        {/* Outcome */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '64px', height: '64px', background: 'var(--color-bg)', 
            border: '2px solid var(--color-border)', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)'
          }}>
            {outcome !== null ? outcome : '?'}
          </div>
        </div>

        {/* Condition Check */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 16px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px dashed var(--color-border)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>Is {outcome !== null ? outcome : 's'} ∈ &#123;2, 4, 6&#125;?</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: outcome === null ? 'transparent' : (isEven ? '#22c55e' : '#ef4444'), marginTop: '4px' }}>
            {isEven ? 'Yes (Even)' : 'No (Odd)'}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>➔</div>

        {/* Indicator Value */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '64px', height: '64px', background: outcome === null ? 'var(--color-bg)' : (isEven ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'), 
            border: `2px solid ${outcome === null ? 'var(--color-border)' : (isEven ? '#22c55e' : '#ef4444')}`, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 'bold', color: outcome === null ? 'var(--color-text)' : (isEven ? '#22c55e' : '#ef4444')
          }}>
            {outcome !== null ? (isEven ? 1 : 0) : '?'}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={roll} style={{
          padding: '8px 16px', borderRadius: '6px', border: 'none',
          background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
        }}>
          Roll Die
        </button>
      </div>
    </div>
  );
};

export const VizArithmeticOperations: React.FC = () => {
  const [die1, setDie1] = useState<number | null>(null);
  const [die2, setDie2] = useState<number | null>(null);

  const roll = () => {
    setDie1(Math.floor(Math.random() * 6) + 1);
    setDie2(Math.floor(Math.random() * 6) + 1);
  };

  const sum = (die1 !== null && die2 !== null) ? die1 + die2 : null;

  // Distribution heights (out of 36)
  const dist = {
    2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6,
    8: 5, 9: 4, 10: 3, 11: 2, 12: 1
  };

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Arithmetic Operations:</strong> Let X and Y be two dice. Z = X + Y is also a random variable.
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>X</div>
          <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', border: '2px solid var(--color-border)', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {die1 !== null ? die1 : '?'}
          </div>
        </div>
        
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)' }}>+</div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Y</div>
          <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', border: '2px solid var(--color-border)', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {die2 !== null ? die2 : '?'}
          </div>
        </div>

        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)' }}>=</div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Z = X + Y</div>
          <div style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.1)', border: '2px solid #3b82f6', borderRadius: '50%', fontSize: '1.4rem', fontWeight: 'bold', color: '#3b82f6' }}>
            {sum !== null ? sum : '?'}
          </div>
        </div>
        
        <button onClick={roll} style={{
          marginLeft: '16px', padding: '8px 16px', borderRadius: '6px', border: 'none',
          background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
        }}>
          Roll Both
        </button>
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '8px' }}>Distribution of Z = X + Y</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', height: '100px', alignItems: 'flex-end', padding: '0 20px', borderBottom: '1px solid var(--color-border)' }}>
        {Object.entries(dist).map(([val, count]) => {
          const isHighlight = sum === parseInt(val);
          return (
            <div key={val} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)' }}>{count}/36</div>
              <div style={{ 
                width: '100%', height: `${(count / 6) * 70}px`, 
                background: isHighlight ? '#3b82f6' : 'var(--color-border)',
                transition: 'all 0.2s', borderTopLeftRadius: '2px', borderTopRightRadius: '2px'
              }} />
              <div style={{ fontSize: '0.75rem', fontWeight: isHighlight ? 'bold' : 'normal', color: isHighlight ? '#3b82f6' : 'var(--color-text)' }}>{val}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
