import React, { useState } from 'react';

export const VizBernoulli: React.FC = () => {
  const [theta, setTheta] = useState(0.7);
  const [outcome, setOutcome] = useState<number | null>(null);

  const trial = () => setOutcome(Math.random() < theta ? 1 : 0);

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Bernoulli Distribution:</strong> Adjust θ (probability of success) and run a trial.
      </div>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
        <input type="range" min={0} max={1} step={0.01} value={theta} 
               onChange={e => setTheta(parseFloat(e.target.value))} 
               style={{ flex: 1 }}/>
        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', width: '80px', color: 'var(--color-text)' }}>θ = {theta.toFixed(2)}</span>
      </div>

      <div style={{ display: 'flex', gap: '32px', justifyContent: 'center' }}>
        {/* PMF Chart */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', height: '120px', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{(1-theta).toFixed(2)}</div>
            <div style={{ width: '40px', height: `${(1-theta)*100}%`, background: outcome === 0 ? '#ef4444' : 'var(--color-border)', transition: 'height 0.2s', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }} />
            <div style={{ fontSize: '0.75rem', marginTop: '4px', color: outcome === 0 ? '#ef4444' : 'var(--color-text)', fontWeight: outcome === 0 ? 'bold' : 'normal' }}>0 (Fail)</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{theta.toFixed(2)}</div>
            <div style={{ width: '40px', height: `${theta*100}%`, background: outcome === 1 ? '#22c55e' : 'var(--color-border)', transition: 'height 0.2s', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }} />
            <div style={{ fontSize: '0.75rem', marginTop: '4px', color: outcome === 1 ? '#22c55e' : 'var(--color-text)', fontWeight: outcome === 1 ? 'bold' : 'normal' }}>1 (Success)</div>
          </div>
        </div>
        
        {/* Trial Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', background: outcome === 1 ? 'rgba(34,197,94,0.1)' : (outcome === 0 ? 'rgba(239,68,68,0.1)' : 'var(--color-bg)'), 
            border: `2px solid ${outcome === 1 ? '#22c55e' : (outcome === 0 ? '#ef4444' : 'var(--color-border)')}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px',
            color: outcome === 1 ? '#22c55e' : (outcome === 0 ? '#ef4444' : 'var(--color-text)')
          }}>
            {outcome !== null ? outcome : '?'}
          </div>
          <button onClick={trial} style={{
            padding: '6px 16px', borderRadius: '6px', border: 'none',
            background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
          }}>Run Trial</button>
        </div>
      </div>
    </div>
  );
};

export const VizBinomialQuality: React.FC = () => {
  // P(X=2) for Binomial(20, 0.05)
  // C(20,2) * (0.05)^2 * (0.95)^18
  const n = 20;
  const p = 0.05;
  const p_X_2 = 190 * Math.pow(p, 2) * Math.pow(1 - p, 18); // ~0.1886

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Binomial PMF (n=20, θ=0.05):</strong> Probability of exactly x defects.
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', height: '140px', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>
        {[0, 1, 2, 3, 4, 5].map(x => {
          let coeff = 1;
          for (let i = 1; i <= x; i++) coeff = (coeff * (n - i + 1)) / i;
          const prob = coeff * Math.pow(p, x) * Math.pow(1 - p, n - x);
          const isHighlight = x === 2;
          return (
            <div key={x} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: isHighlight ? '#ef4444' : 'var(--color-text-secondary)', marginBottom: '4px', fontWeight: isHighlight ? 'bold' : 'normal' }}>
                {prob.toFixed(3)}
              </div>
              <div style={{ 
                width: '100%', maxWidth: '30px', height: `${prob * 300}px`, 
                background: isHighlight ? '#ef4444' : '#3b82f6', transition: 'height 0.2s', borderTopLeftRadius: '2px', borderTopRightRadius: '2px' 
              }} />
              <div style={{ fontSize: '0.75rem', marginTop: '4px', color: isHighlight ? '#ef4444' : 'var(--color-text)', fontWeight: isHighlight ? 'bold' : 'normal' }}>
                {x}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
        P(X = 2) = C(20,2)(0.05)²(0.95)¹⁸ = <strong>{p_X_2.toFixed(3)}</strong>
      </div>
    </div>
  );
};

export const VizGeometric: React.FC = () => {
  const [rolls, setRolls] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);

  const start = () => {
    if (rolling) return;
    setRolling(true);
    setRolls([]);
    
    let currentRolls: number[] = [];
    const interval = setInterval(() => {
      const val = Math.floor(Math.random() * 6) + 1;
      currentRolls = [...currentRolls, val];
      setRolls(currentRolls);
      
      if (val === 6) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 400);
  };

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Geometric Distribution:</strong> Waiting for a Six. Number of failures before first success.
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '60px', marginBottom: '20px', padding: '12px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
        {rolls.map((r, i) => (
          <div key={i} style={{
            width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', fontWeight: 'bold', 
            background: r === 6 ? '#22c55e' : 'var(--color-surface)', 
            color: r === 6 ? '#fff' : 'var(--color-text-secondary)',
            border: `2px solid ${r === 6 ? '#22c55e' : 'var(--color-border)'}`
          }}>
            {r}
          </div>
        ))}
        {rolls.length === 0 && !rolling && <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', display: 'flex', alignItems: 'center' }}>Click Start to begin rolling...</div>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={start} disabled={rolling} style={{
          padding: '6px 16px', borderRadius: '6px', border: 'none',
          background: rolling ? 'var(--color-border)' : 'var(--color-primary)', color: '#fff', cursor: rolling ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.85rem'
        }}>
          {rolling ? 'Rolling...' : 'Start Rolling'}
        </button>
        <div style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
          {rolls.length > 0 && !rolling ? (
            <span>X (Failures) = <strong>{rolls.length - 1}</strong></span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const VizPoisson: React.FC = () => {
  const lambda = 3;
  const p_Y_5 = (Math.pow(lambda, 5) * Math.exp(-lambda)) / 120; // ~0.1008

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Poisson PMF (λ=3):</strong> Probability of exactly y calls in a minute.
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', height: '140px', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(y => {
          let fact = 1;
          for (let i = 1; i <= y; i++) fact *= i;
          const prob = (Math.pow(lambda, y) * Math.exp(-lambda)) / fact;
          const isHighlight = y === 5;
          return (
            <div key={y} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: isHighlight ? '#8b5cf6' : 'var(--color-text-secondary)', marginBottom: '4px', fontWeight: isHighlight ? 'bold' : 'normal' }}>
                {prob.toFixed(3)}
              </div>
              <div style={{ 
                width: '100%', maxWidth: '30px', height: `${prob * 500}px`, 
                background: isHighlight ? '#8b5cf6' : '#10b981', transition: 'height 0.2s', borderTopLeftRadius: '2px', borderTopRightRadius: '2px' 
              }} />
              <div style={{ fontSize: '0.75rem', marginTop: '4px', color: isHighlight ? '#8b5cf6' : 'var(--color-text)', fontWeight: isHighlight ? 'bold' : 'normal' }}>
                {y}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
        P(Y = 5) = (3⁵ e⁻³) / 5! = <strong>{p_Y_5.toFixed(3)}</strong>
      </div>
    </div>
  );
};

export const VizHypergeometric: React.FC = () => {
  // N=52, M=13 (Hearts), n=5, k=2
  const p_X_2 = (78 * 9139) / 2598960; // 0.27428...

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Hypergeometric Distribution:</strong> Drawing 5 cards from 52 (13 Hearts). Probability of k Hearts.
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', height: '140px', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>
        {[0, 1, 2, 3, 4, 5].map(k => {
          // Precomputed approx probs for N=52, M=13, n=5
          const probs = [0.2215, 0.4114, 0.2743, 0.0815, 0.0107, 0.0005];
          const prob = probs[k];
          const isHighlight = k === 2;
          return (
            <div key={k} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: isHighlight ? '#ef4444' : 'var(--color-text-secondary)', marginBottom: '4px', fontWeight: isHighlight ? 'bold' : 'normal' }}>
                {prob.toFixed(3)}
              </div>
              <div style={{ 
                width: '100%', maxWidth: '40px', height: `${prob * 300}px`, 
                background: isHighlight ? '#ef4444' : '#f59e0b', transition: 'height 0.2s', borderTopLeftRadius: '2px', borderTopRightRadius: '2px' 
              }} />
              <div style={{ fontSize: '0.75rem', marginTop: '4px', color: isHighlight ? '#ef4444' : 'var(--color-text)', fontWeight: isHighlight ? 'bold' : 'normal' }}>
                {k} ♥
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
        P(X = 2) = [ C(13,2) × C(39,3) ] / C(52,5) = <strong>{p_X_2.toFixed(3)}</strong>
      </div>
    </div>
  );
};
