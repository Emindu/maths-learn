import React, { useState } from 'react';

export const VizDistributionCoin: React.FC = () => {
  const [expA, setExpA] = useState<number | null>(null);
  const [expB, setExpB] = useState<number | null>(null);

  const runA = () => setExpA(Math.random() < 0.5 ? 1 : 0);
  const runB = () => setExpB(Math.random() < 0.5 ? 1 : 0);

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>What is a Distribution?:</strong> Two different experiments yielding the exact same distribution.
      </div>
      
      <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginBottom: '24px' }}>
        {/* Experiment A */}
        <div style={{ textAlign: 'center', flex: 1, padding: '16px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <div style={{ fontWeight: 600, marginBottom: '12px' }}>Exp A: Coin Flip</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>H ➔ 1, T ➔ 0</div>
          
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', background: '#f59e0b', color: '#fff', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 16px',
            border: '4px solid #d97706'
          }}>
            {expA === 1 ? 'H' : (expA === 0 ? 'T' : '?')}
          </div>
          
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '16px' }}>
            X = {expA !== null ? expA : '?'}
          </div>
          
          <button onClick={runA} style={{
            padding: '6px 12px', borderRadius: '6px', border: 'none',
            background: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
          }}>Run A</button>
        </div>

        {/* Experiment B */}
        <div style={{ textAlign: 'center', flex: 1, padding: '16px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <div style={{ fontWeight: 600, marginBottom: '12px' }}>Exp B: Random Number</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>Uniformly pick 0 or 1</div>
          
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '8px', background: '#10b981', color: '#fff', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 16px',
            border: '2px dashed #059669'
          }}>
            [ 0, 1 ]
          </div>
          
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '16px' }}>
            X = {expB !== null ? expB : '?'}
          </div>
          
          <button onClick={runB} style={{
            padding: '6px 12px', borderRadius: '6px', border: 'none',
            background: '#10b981', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
          }}>Run B</button>
        </div>
      </div>
      
      {/* Shared Distribution */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>Shared Distribution</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', height: '80px', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)', width: '200px', margin: '0 auto' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>1/2</div>
            <div style={{ width: '100%', height: '50px', background: 'var(--color-text-secondary)', borderTopLeftRadius: '2px', borderTopRightRadius: '2px' }} />
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '4px' }}>0</div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>1/2</div>
            <div style={{ width: '100%', height: '50px', background: 'var(--color-text-secondary)', borderTopLeftRadius: '2px', borderTopRightRadius: '2px' }} />
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '4px' }}>1</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VizEqualDistributions: React.FC = () => {
  const [countsA, setCountsA] = useState({ 0: 0, 1: 0, 2: 0 });
  const [countsB, setCountsB] = useState({ 0: 0, 1: 0, 2: 0 });

  const runA = () => {
    const heads = (Math.random() < 0.5 ? 1 : 0) + (Math.random() < 0.5 ? 1 : 0);
    setCountsA(p => ({ ...p, [heads]: p[heads as keyof typeof p] + 1 }));
  };

  const runB = () => {
    const rand = Math.random();
    let val = 0;
    if (rand < 0.25) val = 0;
    else if (rand < 0.75) val = 1;
    else val = 2;
    setCountsB(p => ({ ...p, [val]: p[val as keyof typeof p] + 1 }));
  };

  const totalA = countsA[0] + countsA[1] + countsA[2];
  const totalB = countsB[0] + countsB[1] + countsB[2];

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Equal in Distribution (X =ᵈ Y):</strong> 2 Coins vs 1 Urn. Over time, both build the exact same empirical distribution.
      </div>
      
      <div style={{ display: 'flex', gap: '32px', justifyContent: 'center' }}>
        {/* Exp A */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: '#3b82f6', marginBottom: '8px' }}>X: Number of Heads in 2 Flips</div>
          <button onClick={runA} style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid #3b82f6', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', cursor: 'pointer', marginBottom: '16px', fontWeight: 600 }}>Flip 2 Coins</button>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', height: '120px', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)' }}>
            {[0, 1, 2].map(val => {
              const h = totalA === 0 ? 0 : (countsA[val as keyof typeof countsA] / totalA) * 100;
              return (
                <div key={val} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{countsA[val as keyof typeof countsA]}</div>
                  <div style={{ width: '100%', height: `${h}%`, background: '#3b82f6', transition: 'height 0.2s', borderTopLeftRadius: '2px', borderTopRightRadius: '2px' }} />
                  <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>{val}</div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Total Trials: {totalA}</div>
        </div>

        {/* Exp B */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: '#10b981', marginBottom: '8px' }}>Y: Draw 1 Ball from Urn</div>
          <button onClick={runB} style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid #10b981', background: 'rgba(16,185,129,0.1)', color: '#10b981', cursor: 'pointer', marginBottom: '16px', fontWeight: 600 }}>Draw from Urn</button>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', height: '120px', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)' }}>
            {[0, 1, 2].map(val => {
              const h = totalB === 0 ? 0 : (countsB[val as keyof typeof countsB] / totalB) * 100;
              return (
                <div key={val} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{countsB[val as keyof typeof countsB]}</div>
                  <div style={{ width: '100%', height: `${h}%`, background: '#10b981', transition: 'height 0.2s', borderTopLeftRadius: '2px', borderTopRightRadius: '2px' }} />
                  <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>{val}</div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Total Trials: {totalB}</div>
        </div>
      </div>
    </div>
  );
};
