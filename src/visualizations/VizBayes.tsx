import React, { useState } from 'react';

const f3 = (x: number) => x.toFixed(3);
const fPct = (x: number) => (x * 100).toFixed(1) + '%';

export const VizBayes: React.FC = () => {
  const [pA,       setPa]       = useState(0.30);
  const [pBgA,     setPBgA]     = useState(0.80);
  const [pBgAc,    setPBgAc]    = useState(0.10);

  const pAc      = 1 - pA;
  const pAandB   = pA  * pBgA;
  const pAandBc  = pA  * (1 - pBgA);
  const pAcandB  = pAc * pBgAc;
  const pAcandBc = pAc * (1 - pBgAc);
  const pB       = pAandB + pAcandB;
  const pAgB     = pB > 0 ? pAandB / pB : 0;

  // Tree node positions
  // Level 0 (root): (250, 25)
  // Level 1: A=(130,100), Ac=(370,100)
  // Level 2: A∩B=(60,195), A∩Bc=(200,195), Ac∩B=(310,195), Ac∩Bc=(440,195)
  const root = { x: 250, y: 25 };
  const nodeA  = { x: 130, y: 100, label: 'A',    prob: f3(pA) };
  const nodeAc = { x: 370, y: 100, label: 'Aᶜ',   prob: f3(pAc) };
  const leaves = [
    { x: 55,  y: 195, label: 'A ∩ B',   prob: f3(pAandB),   edge: f3(pBgA),        parent: nodeA,  highlight: pAgB > 0.5 },
    { x: 205, y: 195, label: 'A ∩ Bᶜ',  prob: f3(pAandBc),  edge: f3(1 - pBgA),    parent: nodeA,  highlight: false },
    { x: 315, y: 195, label: 'Aᶜ ∩ B',  prob: f3(pAcandB),  edge: f3(pBgAc),       parent: nodeAc, highlight: false },
    { x: 445, y: 195, label: 'Aᶜ ∩ Bᶜ', prob: f3(pAcandBc), edge: f3(1 - pBgAc),  parent: nodeAc, highlight: false },
  ];

  const nodeR = 22;

  const nodeStyle = (highlight: boolean): React.CSSProperties => ({
    fontSize: 10,
    fontFamily: 'monospace',
    fill: highlight ? '#f59e0b' : 'var(--text-primary)',
    fontWeight: highlight ? 700 : 400,
  });

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', margin: '24px 0' }}>
      <h4 style={{ margin: '0 0 4px', color: 'var(--text-primary)', fontSize: '1rem' }}>Bayes' Theorem Calculator</h4>
      <p style={{ margin: '0 0 14px', color: 'var(--text-secondary)', fontSize: '0.87rem' }}>
        Set the prior P(A) and likelihoods P(B|A) and P(B|Aᶜ) to compute the posterior P(A|B).
      </p>

      {/* Probability Tree */}
      <svg viewBox="0 0 500 240" style={{ width: '100%', maxWidth: '500px', display: 'block', margin: '0 auto 16px' }}>

        {/* Edges: root → level-1 */}
        {[nodeA, nodeAc].map(n => (
          <line key={n.label} x1={root.x} y1={root.y} x2={n.x} y2={n.y - nodeR} stroke="var(--border-color)" strokeWidth="1.5" />
        ))}

        {/* Edge labels for root → level-1 */}
        <text x={(root.x + nodeA.x) / 2 - 12} y={(root.y + nodeA.y) / 2} style={{ fontSize: 10, fontFamily: 'monospace' }} fill="#3b82f6">{f3(pA)}</text>
        <text x={(root.x + nodeAc.x) / 2 + 4} y={(root.y + nodeAc.y) / 2} style={{ fontSize: 10, fontFamily: 'monospace' }} fill="#8b5cf6">{f3(pAc)}</text>

        {/* Edges: level-1 → level-2 */}
        {leaves.map(l => (
          <line key={l.label} x1={l.parent.x} y1={l.parent.y + nodeR} x2={l.x} y2={l.y - nodeR}
            stroke={l.highlight ? '#f59e0b' : 'var(--border-color)'} strokeWidth={l.highlight ? 2 : 1.5} />
        ))}

        {/* Edge labels: level-1 → level-2 */}
        {leaves.map(l => (
          <text key={l.label + '-edge'} x={(l.parent.x + l.x) / 2} y={(l.parent.y + nodeR + l.y - nodeR) / 2 - 4}
            textAnchor="middle" style={{ fontSize: 9.5, fontFamily: 'monospace' }}
            fill={l.highlight ? '#f59e0b' : '#888'}>
            {l.edge}
          </text>
        ))}

        {/* Root dot */}
        <circle cx={root.x} cy={root.y} r="5" fill="#888" />

        {/* Level-1 nodes */}
        {[
          { node: nodeA,  color: '#3b82f6' },
          { node: nodeAc, color: '#8b5cf6' },
        ].map(({ node, color }) => (
          <g key={node.label}>
            <circle cx={node.x} cy={node.y} r={nodeR} fill="var(--bg-secondary)" stroke={color} strokeWidth="2" />
            <text x={node.x} y={node.y - 6} textAnchor="middle" style={{ fontSize: 12, fontWeight: 700 }} fill={color}>{node.label}</text>
            <text x={node.x} y={node.y + 9} textAnchor="middle" style={{ fontSize: 10, fontFamily: 'monospace' }} fill={color}>{node.prob}</text>
          </g>
        ))}

        {/* Level-2 leaf nodes */}
        {leaves.map(l => (
          <g key={l.label}>
            <circle cx={l.x} cy={l.y} r={nodeR} fill="var(--bg-secondary)"
              stroke={l.highlight ? '#f59e0b' : 'var(--border-color)'} strokeWidth={l.highlight ? 2.5 : 1.5} />
            <text x={l.x} y={l.y - 7} textAnchor="middle" style={{ fontSize: 8 }} fill={l.highlight ? '#f59e0b' : 'var(--text-secondary)'}>{l.label}</text>
            <text x={l.x} y={l.y + 7} textAnchor="middle" style={nodeStyle(l.highlight)}>{l.prob}</text>
          </g>
        ))}
      </svg>

      {/* Sliders */}
      {[
        { label: `P(A) = ${f3(pA)}  (prior)`,    value: pA,    set: setPa,    color: '#3b82f6' },
        { label: `P(B | A) = ${f3(pBgA)}`,        value: pBgA,  set: setPBgA,  color: '#0891b2' },
        { label: `P(B | Aᶜ) = ${f3(pBgAc)}`,     value: pBgAc, set: setPBgAc, color: '#8b5cf6' },
      ].map(({ label, value, set, color }) => (
        <div key={label} style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>{label}</div>
          <input type="range" min={0} max={1} step={0.01} value={value}
            onChange={e => set(+e.target.value)} style={{ width: '100%', accentColor: color }} />
        </div>
      ))}

      {/* Result */}
      <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px 14px', fontFamily: 'monospace', fontSize: '0.87rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
        <div>P(B) = P(A)·P(B|A) + P(Aᶜ)·P(B|Aᶜ)</div>
        <div style={{ color: 'var(--text-primary)' }}>
          = {f3(pA)}·{f3(pBgA)} + {f3(pAc)}·{f3(pBgAc)} = <strong>{f3(pB)}</strong>
        </div>
        <div style={{ marginTop: '6px' }}>
          P(A|B) = P(A)·P(B|A) / P(B) = {f3(pAandB)} / {f3(pB)}
        </div>
        <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.05rem' }}>
          → P(A|B) = {f3(pAgB)}  ({fPct(pAgB)})
        </div>
        <div style={{ fontSize: '0.78rem', marginTop: '4px', color: 'var(--text-secondary)' }}>
          Prior P(A) = {fPct(pA)} → Posterior P(A|B) = {fPct(pAgB)}
          {pAgB > pA ? '  — evidence B increases belief in A.' : pAgB < pA ? '  — evidence B decreases belief in A.' : '  — evidence B is uninformative.'}
        </div>
      </div>
    </div>
  );
};
