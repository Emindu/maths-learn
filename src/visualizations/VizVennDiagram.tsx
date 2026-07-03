import React, { useState } from 'react';

const fmt = (x: number) => x.toFixed(3);

export const VizVennDiagram: React.FC = () => {
  const [pA, setPa] = useState(0.50);
  const [pB, setPb] = useState(0.40);
  const [rawAB, setRawAB] = useState(0.15);

  const minAB = Math.max(0, pA + pB - 1);
  const maxAB = Math.min(pA, pB);
  const pAB = Math.min(maxAB, Math.max(minAB, rawAB));

  const pAonly  = pA - pAB;
  const pBonly  = pB - pAB;
  const pNeither = 1 - pA - pB + pAB;
  const pAorB   = pA + pB - pAB;

  const handlePa = (v: number) => { setPa(v); if (rawAB > Math.min(v, pB)) setRawAB(Math.min(v, pB)); };
  const handlePb = (v: number) => { setPb(v); if (rawAB > Math.min(pA, v)) setRawAB(Math.min(pA, v)); };

  type SliderCfg = { label: string; value: number; set: (v: number) => void; color: string; min?: number; max?: number };
  const sliders: SliderCfg[] = [
    { label: 'P(A)',     value: pA,  set: handlePa,                     color: '#3b82f6' },
    { label: 'P(B)',     value: pB,  set: handlePb,                     color: '#8b5cf6' },
    { label: 'P(A ∩ B)', value: pAB, set: v => setRawAB(v), color: '#0891b2', min: minAB, max: maxAB },
  ];

  const derived = [
    { label: 'P(A ∪ B)',   value: pAorB,   note: 'inclusion-exclusion' },
    { label: 'P(Aᶜ)',      value: 1 - pA,  note: 'complement of A' },
    { label: 'P(Bᶜ)',      value: 1 - pB,  note: 'complement of B' },
    { label: 'P(Aᶜ ∩ Bᶜ)', value: pNeither, note: 'neither event' },
  ];

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', margin: '24px 0' }}>
      <h4 style={{ margin: '0 0 4px', color: 'var(--text-primary)', fontSize: '1rem' }}>Venn Diagram Explorer</h4>
      <p style={{ margin: '0 0 14px', color: 'var(--text-secondary)', fontSize: '0.87rem' }}>
        Adjust P(A), P(B), and P(A∩B). All probabilities — including region areas — update live.
      </p>

      {/* SVG */}
      <svg viewBox="0 0 500 240" style={{ width: '100%', maxWidth: '480px', display: 'block', margin: '0 auto 16px' }}>
        <defs>
          <mask id="vd-not-b">
            <rect x="0" y="0" width="500" height="240" fill="white" />
            <circle cx="310" cy="120" r="98" fill="black" />
          </mask>
          <mask id="vd-not-a">
            <rect x="0" y="0" width="500" height="240" fill="white" />
            <circle cx="190" cy="120" r="98" fill="black" />
          </mask>
          <clipPath id="vd-clip-b">
            <circle cx="310" cy="120" r="98" />
          </clipPath>
        </defs>

        {/* S border */}
        <rect x="8" y="8" width="484" height="224" rx="10" fill="none" stroke="#888" strokeWidth="1.5" />
        <text x="22" y="32" style={{ fontSize: 13, fontWeight: 700 }} fill="#888">S</text>

        {/* Filled regions */}
        <circle cx="190" cy="120" r="98" fill="#3b82f6" fillOpacity="0.18" mask="url(#vd-not-b)" />
        <circle cx="310" cy="120" r="98" fill="#8b5cf6" fillOpacity="0.18" mask="url(#vd-not-a)" />
        <circle cx="190" cy="120" r="98" fill="#06b6d4" fillOpacity="0.42" clipPath="url(#vd-clip-b)" />

        {/* Circle outlines */}
        <circle cx="190" cy="120" r="98" fill="none" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="310" cy="120" r="98" fill="none" stroke="#8b5cf6" strokeWidth="2" />

        {/* Letters */}
        <text x="138" y="74" textAnchor="middle" style={{ fontSize: 17, fontWeight: 700 }} fill="#3b82f6">A</text>
        <text x="362" y="74" textAnchor="middle" style={{ fontSize: 17, fontWeight: 700 }} fill="#8b5cf6">B</text>

        {/* Region probability labels */}
        <text x="120" y="122" textAnchor="middle" style={{ fontSize: 12, fontFamily: 'monospace' }} fill="#3b82f6">{fmt(pAonly)}</text>
        <text x="250" y="116" textAnchor="middle" style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700 }} fill="#0e7490">{fmt(pAB)}</text>
        <text x="380" y="122" textAnchor="middle" style={{ fontSize: 12, fontFamily: 'monospace' }} fill="#8b5cf6">{fmt(pBonly)}</text>
        <text x="458" y="225" textAnchor="end" style={{ fontSize: 11, fontFamily: 'monospace' }} fill="#888">{fmt(pNeither)}</text>

        {/* Region sublabels */}
        <text x="120" y="136" textAnchor="middle" style={{ fontSize: 9 }} fill="#888">A only</text>
        <text x="250" y="130" textAnchor="middle" style={{ fontSize: 9 }} fill="#888">A ∩ B</text>
        <text x="380" y="136" textAnchor="middle" style={{ fontSize: 9 }} fill="#888">B only</text>
      </svg>

      {/* Sliders */}
      {sliders.map(({ label, value, set, color, min = 0, max = 1 }) => (
        <div key={label} style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{label}</span>
            <span style={{ color, fontWeight: 700, fontFamily: 'monospace' }}>{fmt(value)}</span>
          </div>
          <input type="range" min={min} max={max} step={0.01} value={value}
            onChange={e => set(+e.target.value)} style={{ width: '100%', accentColor: color }} />
        </div>
      ))}

      {/* Derived */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '4px' }}>
        {derived.map(({ label, value, note }) => (
          <div key={label} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px' }}>
            <span style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {label} = <span style={{ color: '#3b82f6' }}>{fmt(value)}</span>
            </span>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{note}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
