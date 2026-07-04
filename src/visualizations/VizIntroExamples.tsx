import React, { useState, useEffect } from 'react';

export const VizLottery: React.FC = () => {
  const [ticket, setTicket] = useState<number[]>([]);
  const [draw, setDraw] = useState<number[]>([]);
  const [matching, setMatching] = useState<number>(0);
  const [attempts, setAttempts] = useState(0);

  const generateNumbers = () => {
    const nums: number[] = [];
    while (nums.length < 6) {
      const r = Math.floor(Math.random() * 49) + 1;
      if (!nums.includes(r)) nums.push(r);
    }
    return nums.sort((a, b) => a - b);
  };

  useEffect(() => {
    setTicket(generateNumbers());
  }, []);

  const play = () => {
    const newDraw = generateNumbers();
    setDraw(newDraw);
    const matches = newDraw.filter(n => ticket.includes(n)).length;
    setMatching(matches);
    setAttempts(a => a + 1);
  };

  const ballStyle = (isMatch: boolean, isDrawn: boolean) => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '32px', height: '32px', borderRadius: '50%',
    background: isMatch ? '#22c55e' : (isDrawn ? '#e2e8f0' : 'var(--color-surface)'),
    color: isMatch ? '#fff' : 'var(--color-text)',
    border: `1px solid ${isMatch ? '#22c55e' : 'var(--color-border)'}`,
    fontWeight: 600, fontSize: '0.85rem', margin: '0 4px'
  });

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Lotto 6/49 Simulator:</strong> The odds of matching all 6 are 1 in 13,983,816.
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text)', width: '80px' }}>Your Ticket:</div>
        <div>
          {ticket.map(n => <div key={n} style={ballStyle(false, false)}>{n}</div>)}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text)', width: '80px' }}>Drawn:</div>
        <div style={{ minHeight: '34px' }}>
          {draw.length > 0 ? draw.map(n => <div key={n} style={ballStyle(ticket.includes(n), true)}>{n}</div>) : <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Click Draw to play</span>}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={play} style={{
          padding: '6px 16px', borderRadius: '6px', border: 'none',
          background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
        }}>
          Draw Numbers
        </button>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          Attempts: {attempts.toLocaleString()} | Matches this draw: {matching}
        </div>
      </div>
    </div>
  );
};

export const VizRedCard: React.FC = () => {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>The Red Card Bet (Bertrand's Box):</strong> There are three cards: Red/Red, Red/Black, and Black/Black. You see a Red face.
      </div>
      
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '20px' }}>
        {/* Card 1 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Card 1 (R/R)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ padding: '8px 24px', background: '#ef4444', color: '#fff', borderRadius: '4px', border: '2px solid #ef4444' }}>Red Face 1</div>
            <div style={{ padding: '8px 24px', background: '#ef4444', color: '#fff', borderRadius: '4px', border: '2px solid #ef4444' }}>Red Face 2</div>
          </div>
        </div>
        
        {/* Card 2 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Card 2 (R/B)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ padding: '8px 24px', background: '#ef4444', color: '#fff', borderRadius: '4px', border: '2px solid #ef4444' }}>Red Face</div>
            <div style={{ padding: '8px 24px', background: '#1e293b', color: '#fff', borderRadius: '4px', border: '2px solid #1e293b', opacity: 0.3 }}>Black Face</div>
          </div>
        </div>

        {/* Card 3 */}
        <div style={{ textAlign: 'center', opacity: 0.3 }}>
          <div style={{ marginBottom: '8px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Card 3 (B/B)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ padding: '8px 24px', background: '#1e293b', color: '#fff', borderRadius: '4px', border: '2px solid #1e293b' }}>Black Face 1</div>
            <div style={{ padding: '8px 24px', background: '#1e293b', color: '#fff', borderRadius: '4px', border: '2px solid #1e293b' }}>Black Face 2</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px', background: 'var(--color-bg)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--color-text)' }}>
        Since you see a Red face, it must be one of the 3 Red faces shown above. 2 of those 3 faces belong to Card 1 (which has Red on the other side). Only 1 belongs to Card 2 (which has Black on the other side). Thus, the probability the other side is Red is <strong>2/3</strong>.
      </div>
    </div>
  );
};

export const VizLargeNumbers: React.FC = () => {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '16px 0 32px' }}>
      <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <strong>Coin Flips and Large Numbers:</strong> Distribution of heads in 1000 fair coin flips.
      </div>
      
      <div style={{ position: 'relative', height: '140px', margin: '20px 0', borderBottom: '1px solid var(--color-border)' }}>
        <svg width="100%" height="100%" viewBox="0 0 1000 120" preserveAspectRatio="none">
          <defs>
            <clipPath id="tailClip">
              <rect x="600" y="0" width="400" height="120" />
            </clipPath>
          </defs>
          <path d="M -10 120 L 350 120 C 450 120, 450 10, 500 10 C 550 10, 550 120, 650 120 L 1010 120" 
                fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" />
          {/* Highlight > 600 area */}
          <path d="M -10 120 L 350 120 C 450 120, 450 10, 500 10 C 550 10, 550 120, 650 120 L 1010 120" 
                fill="#ef4444" clipPath="url(#tailClip)" />
        </svg>
        <div style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: 'var(--color-text)' }}>
          500 (Expected)
        </div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '60%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
          600
        </div>
        <div style={{ position: 'absolute', top: '10px', left: '62%', fontSize: '0.8rem', color: '#ef4444', maxWidth: '200px', fontWeight: 500, lineHeight: 1.4 }}>
          Probability of ≥ 600 heads is less than 1 in 10,000,000,000!
        </div>
      </div>
    </div>
  );
};
