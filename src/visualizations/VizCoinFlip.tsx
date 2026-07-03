import React, { useState } from 'react';

const card: React.CSSProperties = {
  background: 'var(--bg-primary)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  padding: '12px',
  textAlign: 'center',
};

const btn: React.CSSProperties = {
  padding: '7px 14px',
  borderRadius: '6px',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  fontSize: '0.84rem',
  fontWeight: 500,
};

export const VizCoinFlip: React.FC = () => {
  const [heads, setHeads] = useState(0);
  const [total, setTotal] = useState(0);

  const flip = (n: number) => {
    let h = 0;
    for (let i = 0; i < n; i++) if (Math.random() < 0.5) h++;
    setHeads(p => p + h);
    setTotal(p => p + n);
  };

  const reset = () => { setHeads(0); setTotal(0); };

  const freq = total > 0 ? heads / total : null;
  const deviation = freq !== null ? (freq - 0.5) * 100 : null;
  const isConverging = total >= 1000 && deviation !== null && Math.abs(deviation) < 2;

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', margin: '24px 0' }}>
      <h4 style={{ margin: '0 0 4px', color: 'var(--text-primary)', fontSize: '1rem' }}>
        Relative Frequency Simulation
      </h4>
      <p style={{ margin: '0 0 16px', color: 'var(--text-secondary)', fontSize: '0.87rem' }}>
        Flip coins and watch relative frequency converge to the true probability of 0.5.
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {[10, 100, 1000, 10000].map(n => (
          <button key={n} onClick={() => flip(n)} style={btn}>+{n.toLocaleString()}</button>
        ))}
        <button onClick={reset} style={{ ...btn, color: 'var(--text-secondary)' }}>Reset</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        <div style={card}>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>{total.toLocaleString()}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Total flips</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#3b82f6' }}>{heads.toLocaleString()}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Heads</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: isConverging ? '#22c55e' : 'var(--text-primary)' }}>
            {freq !== null ? (freq * 100).toFixed(2) + '%' : '—'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Relative freq.</div>
        </div>
      </div>

      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span>0%</span><span>← True P = 50% →</span><span>100%</span>
      </div>
      <div style={{ position: 'relative', height: '28px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <div style={{ width: `${(freq ?? 0.5) * 100}%`, height: '100%', background: '#3b82f6', opacity: 0.5, transition: 'width 0.15s ease', borderRadius: '6px' }} />
        <div style={{ position: 'absolute', left: 'calc(50% - 1px)', top: 0, bottom: 0, width: '2px', background: '#ef4444', opacity: 0.8 }} />
      </div>
      {deviation !== null && (
        <div style={{ marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Deviation: {deviation >= 0 ? '+' : ''}{deviation.toFixed(2)}%
          {isConverging ? '  ✓ converging nicely!' : ''}
        </div>
      )}
    </div>
  );
};
