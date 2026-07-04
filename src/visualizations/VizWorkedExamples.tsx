import React, { useState } from 'react';

const renderDiscrete = (
  data: { id: string; label: string; p: number }[],
  defaultHint: string,
  selectedOutcomes: Record<string, boolean>,
  toggleOutcome: (id: string) => void
) => {
  const selectedP = data.filter(d => selectedOutcomes[d.id]).reduce((sum, d) => sum + d.p, 0);
  const hasSelection = data.some(d => selectedOutcomes[d.id]);

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        Click the bars to define an event A and see its probability P(A).
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
        {data.map(d => (
          <div key={d.id} 
               onClick={() => toggleOutcome(d.id)}
               style={{ 
                 display: 'flex', alignItems: 'center', cursor: 'pointer',
                 padding: '4px', borderRadius: '4px',
                 background: selectedOutcomes[d.id] ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
               }}>
            <div style={{ width: '80px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>
              {d.label}
            </div>
            <div style={{ flex: 1, height: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${d.p * 100}%`, height: '100%', 
                background: selectedOutcomes[d.id] ? '#3b82f6' : '#94a3b8', 
                transition: 'background 0.2s, width 0.2s' 
              }} />
            </div>
            <div style={{ width: '50px', textAlign: 'right', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              {d.p.toFixed(3)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ 
        padding: '12px', background: 'var(--color-surface)', borderRadius: '6px', 
        border: '1px solid var(--color-border)', textAlign: 'center', fontSize: '0.9rem'
      }}>
        {hasSelection ? (
          <span>
            <strong>P(A)</strong> = {selectedP.toFixed(3)}
          </span>
        ) : (
          <span style={{ color: 'var(--color-text-secondary)' }}>{defaultHint}</span>
        )}
      </div>
    </div>
  );
};

export const VizWeather: React.FC = () => {
  const [selectedOutcomes, setSelectedOutcomes] = useState<Record<string, boolean>>({});
  const toggleOutcome = (id: string) => setSelectedOutcomes(p => ({ ...p, [id]: !p[id] }));
  const data = [
    { id: 'rain', label: 'Rain', p: 0.40 },
    { id: 'snow', label: 'Snow', p: 0.15 },
    { id: 'clear', label: 'Clear', p: 0.45 },
  ];
  return renderDiscrete(data, 'P({rain, snow}) = P({rain}) + P({snow}) = 0.55', selectedOutcomes, toggleOutcome);
};

export const VizFairCoin: React.FC = () => {
  const [selectedOutcomes, setSelectedOutcomes] = useState<Record<string, boolean>>({});
  const toggleOutcome = (id: string) => setSelectedOutcomes(p => ({ ...p, [id]: !p[id] }));
  const data = [
    { id: 'H', label: 'Heads (H)', p: 0.50 },
    { id: 'T', label: 'Tails (T)', p: 0.50 },
  ];
  return renderDiscrete(data, 'P({H}) + P({T}) = 1', selectedOutcomes, toggleOutcome);
};

export const VizThreeCoins: React.FC = () => {
  const [selectedOutcomes, setSelectedOutcomes] = useState<Record<string, boolean>>({});
  const toggleOutcome = (id: string) => setSelectedOutcomes(p => ({ ...p, [id]: !p[id] }));
  const data = ['HHH', 'HHT', 'HTH', 'HTT', 'THH', 'THT', 'TTH', 'TTT'].map(id => ({
    id, label: id, p: 0.125
  }));
  return renderDiscrete(data, 'Select outcomes to calculate event probability', selectedOutcomes, toggleOutcome);
};

export const VizUniform: React.FC = () => {
  const [range, setRange] = useState<[number, number]>([0.2, 0.7]);
  const [a, b] = range;

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        Uniform distribution on [0, 1]. P([a, b]) = b - a.
      </div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
        <label style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>
          a = {a.toFixed(2)}
          <input type="range" min={0} max={1} step={0.01} value={a} 
                 onChange={e => setRange([Math.min(parseFloat(e.target.value), b), b])} 
                 style={{ display: 'block', width: '120px', marginTop: '4px' }}/>
        </label>
        <label style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>
          b = {b.toFixed(2)}
          <input type="range" min={0} max={1} step={0.01} value={b} 
                 onChange={e => setRange([a, Math.max(parseFloat(e.target.value), a)])} 
                 style={{ display: 'block', width: '120px', marginTop: '4px' }}/>
        </label>
      </div>
      
      <div style={{ position: 'relative', height: '100px', borderBottom: '2px solid var(--color-text)', borderLeft: '2px solid var(--color-text)', marginBottom: '20px' }}>
        <div style={{ position: 'absolute', bottom: 0, left: '0%', height: '80%', width: '100%', borderTop: '2px dashed #94a3b8' }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: `${a * 100}%`, width: `${(b - a) * 100}%`, height: '80%', background: 'rgba(59, 130, 246, 0.4)', border: '1px solid #3b82f6', borderBottom: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>0</div>
        <div style={{ position: 'absolute', bottom: '-20px', right: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>1</div>
        <div style={{ position: 'absolute', left: '-25px', top: '10px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>1</div>
      </div>

      <div style={{ 
        padding: '12px', background: 'var(--color-surface)', borderRadius: '6px', 
        border: '1px solid var(--color-border)', textAlign: 'center', fontSize: '0.9rem'
      }}>
        <strong>P([{a.toFixed(2)}, {b.toFixed(2)}])</strong> = {(b - a).toFixed(2)}
      </div>
    </div>
  );
};
