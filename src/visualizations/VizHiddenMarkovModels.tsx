import React, { useState } from 'react';

const W = 500, H = 260;
const BG = '#0f172a', SURFACE = '#1e293b', PRIMARY = '#38bdf8';
const SUCCESS = '#34d399', WARN = '#fb923c', TEXT = '#f1f5f9', MUTED = '#64748b';

const PillButton: React.FC<{ label: string; active: boolean; onClick: () => void; color?: string }> =
  ({ label, active, onClick, color = PRIMARY }) => (
    <button
      onClick={onClick}
      style={{
        fontSize: 11, padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
        border: `1px solid ${active ? color : '#334155'}`,
        background: active ? color : 'transparent',
        color: active ? '#0f172a' : MUTED,
        fontWeight: active ? 700 : 500,
      }}
    >
      {label}
    </button>
  );

// ── Shared ice-cream HMM parameters (Jurafsky & Martin's canonical example) ──
const PI = [0.2, 0.8];                          // [COLD, HOT]
const A = [[0.5, 0.5], [0.4, 0.6]];              // A[i][j]: from state i to state j
const Bmat = [[0.5, 0.4, 0.1], [0.2, 0.4, 0.4]]; // Bmat[state][obs-1]
const STATE_NAMES = ['COLD', 'HOT'];
const STATE_COLORS = [PRIMARY, WARN];

function forward(obs: number[]) {
  const T = obs.length;
  const alpha: number[][] = [];
  for (let t = 0; t < T; t++) {
    alpha.push([0, 0]);
    for (let s = 0; s < 2; s++) {
      const b = Bmat[s][obs[t] - 1];
      if (t === 0) alpha[t][s] = PI[s] * b;
      else {
        let sum = 0;
        for (let i = 0; i < 2; i++) sum += alpha[t - 1][i] * A[i][s];
        alpha[t][s] = sum * b;
      }
    }
  }
  const total = alpha[T - 1][0] + alpha[T - 1][1];
  return { alpha, total };
}

function backward(obs: number[]) {
  const T = obs.length;
  const beta: number[][] = Array.from({ length: T }, () => [0, 0]);
  beta[T - 1] = [1, 1];
  for (let t = T - 2; t >= 0; t--) {
    for (let s = 0; s < 2; s++) {
      let sum = 0;
      for (let j = 0; j < 2; j++) sum += A[s][j] * Bmat[j][obs[t + 1] - 1] * beta[t + 1][j];
      beta[t][s] = sum;
    }
  }
  return beta;
}

function viterbi(obs: number[]) {
  const T = obs.length;
  const delta: number[][] = [];
  const psi: number[][] = [];
  for (let t = 0; t < T; t++) {
    delta.push([0, 0]);
    psi.push([-1, -1]);
    for (let s = 0; s < 2; s++) {
      const b = Bmat[s][obs[t] - 1];
      if (t === 0) {
        delta[t][s] = PI[s] * b;
      } else {
        let best = 0, bestVal = -Infinity;
        for (let i = 0; i < 2; i++) {
          const val = delta[t - 1][i] * A[i][s];
          if (val > bestVal) { bestVal = val; best = i; }
        }
        delta[t][s] = bestVal * b;
        psi[t][s] = best;
      }
    }
  }
  let bestFinal = 0, bestVal = -Infinity;
  for (let s = 0; s < 2; s++) if (delta[T - 1][s] > bestVal) { bestVal = delta[T - 1][s]; bestFinal = s; }
  const path = [bestFinal];
  for (let t = T - 1; t > 0; t--) path.unshift(psi[t][path[0]]);
  return { delta, psi, path, prob: bestVal };
}

const ObsSteppers: React.FC<{ obs: number[]; onChange: (o: number[]) => void }> = ({ obs, onChange }) => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
    {obs.map((v, t) => (
      <label key={t} style={{ color: MUTED, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
        day {t + 1}:
        <select
          value={v}
          onChange={e => { const next = obs.slice(); next[t] = Number(e.target.value); onChange(next); }}
          style={{ background: SURFACE, color: TEXT, border: '1px solid #334155', borderRadius: 4, fontSize: 11, padding: '1px 3px' }}
        >
          {[1, 2, 3].map(n => <option key={n} value={n}>{n} 🍦</option>)}
        </select>
      </label>
    ))}
  </div>
);

// ── 1. Markov Chain for Weather — transition matrix + sequence probability ──
export const VizWeatherMarkovChain: React.FC = () => {
  const names = ['HOT', 'WARM', 'COLD'];
  const pi = [0.1, 0.2, 0.7];
  const Aw = [
    [0.6, 0.3, 0.1],
    [0.4, 0.5, 0.1],
    [0.1, 0.1, 0.8],
  ];
  const sequences = [
    { label: 'COLD COLD COLD COLD', path: [2, 2, 2, 2] },
    { label: 'HOT WARM COLD HOT', path: [0, 1, 2, 0] },
    { label: 'HOT HOT HOT HOT', path: [0, 0, 0, 0] },
  ];
  const [seqIdx, setSeqIdx] = useState(0);
  const path = sequences[seqIdx].path;

  const steps: number[] = [pi[path[0]]];
  for (let i = 1; i < path.length; i++) steps.push(steps[i - 1] * Aw[path[i - 1]][path[i]]);
  const finalProb = steps[steps.length - 1];

  const PAD = { l: 30, r: 16, t: 30, b: 60 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const cell = Math.min(pw, ph) / 3;
  const gx = PAD.l + (pw - cell * 3) / 2, gy = PAD.t;

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Weather Markov Chain — Transition Matrix and Sequence Probability
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        {names.map((_, i) => names.map((__, j) => {
          const onPath = path.some((s, k) => k > 0 && path[k - 1] === i && s === j);
          return (
            <g key={`${i}-${j}`}>
              <rect x={gx + j * cell} y={gy + i * cell} width={cell - 2} height={cell - 2}
                fill={onPath ? SUCCESS : SURFACE} opacity={onPath ? 0.85 : 0.6} rx={3} />
              <text x={gx + j * cell + cell / 2} y={gy + i * cell + cell / 2 + 4} fill={onPath ? '#0f172a' : TEXT}
                fontSize={11} fontWeight={onPath ? 700 : 500} textAnchor="middle">{Aw[i][j].toFixed(1)}</text>
            </g>
          );
        }))}
        {names.map((n, i) => (
          <text key={`row-${i}`} x={gx - 8} y={gy + i * cell + cell / 2 + 4} fill={MUTED} fontSize={10} textAnchor="end">{n}→</text>
        ))}
        {names.map((n, j) => (
          <text key={`col-${j}`} x={gx + j * cell + cell / 2} y={gy - 6} fill={MUTED} fontSize={10} textAnchor="middle">{n}</text>
        ))}
        <text x={W / 2} y={gy + cell * 3 + 20} fill={TEXT} fontSize={11} textAnchor="middle" fontWeight="700">
          {sequences[seqIdx].label}: {steps.map(s => s.toExponential(2)).join(' → ')}
        </text>
        <text x={W / 2} y={gy + cell * 3 + 36} fill={SUCCESS} fontSize={12} textAnchor="middle" fontWeight="700">
          P(sequence) = {finalProb.toExponential(3)}
        </text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
        {sequences.map((s, i) => (
          <PillButton key={i} label={s.label} active={seqIdx === i} onClick={() => setSeqIdx(i)} color={SUCCESS} />
        ))}
      </div>
    </div>
  );
};

// ── 2. Ice-Cream HMM — state diagram + joint probability of a hidden path ───
export const VizIceCreamHMM: React.FC = () => {
  const candidates = [
    { label: 'hot hot cold', path: [1, 1, 0] },
    { label: 'cold cold cold', path: [0, 0, 0] },
    { label: 'hot hot hot', path: [1, 1, 1] },
    { label: 'cold hot hot', path: [0, 1, 1] },
  ];
  const [candIdx, setCandIdx] = useState(0);
  const obs = [3, 1, 3];
  const path = candidates[candIdx].path;

  const trans = [PI[path[0]]];
  for (let i = 1; i < path.length; i++) trans.push(A[path[i - 1]][path[i]]);
  const emis = path.map((s, t) => Bmat[s][obs[t] - 1]);
  const jointProb = trans.reduce((a, b) => a * b, 1) * emis.reduce((a, b) => a * b, 1);

  const cx = [150, 350], cy = 70, r = 34;

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Ice-Cream HMM — P(O, Q) for a Candidate Hidden Path
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        {/* self loops */}
        {[0, 1].map(s => (
          <text key={`self-${s}`} x={cx[s]} y={cy - r - 22} fill={STATE_COLORS[s]} fontSize={10} textAnchor="middle">
            P({STATE_NAMES[s]}|{STATE_NAMES[s]})={A[s][s].toFixed(1)}
          </text>
        ))}
        <path d={`M ${cx[0] - 12} ${cy - r} A 18 14 0 1 1 ${cx[0] + 12} ${cy - r}`} fill="none" stroke={STATE_COLORS[0]} strokeWidth={1.5} opacity={0.6} />
        <path d={`M ${cx[1] - 12} ${cy - r} A 18 14 0 1 1 ${cx[1] + 12} ${cy - r}`} fill="none" stroke={STATE_COLORS[1]} strokeWidth={1.5} opacity={0.6} />
        {/* cross transitions */}
        <line x1={cx[0] + r} y1={cy - 8} x2={cx[1] - r} y2={cy - 8} stroke={MUTED} strokeWidth={1.3} markerEnd="url(#arrow-hmm)" />
        <line x1={cx[1] - r} y1={cy + 8} x2={cx[0] + r} y2={cy + 8} stroke={MUTED} strokeWidth={1.3} markerEnd="url(#arrow-hmm)" />
        <text x={(cx[0] + cx[1]) / 2} y={cy - 14} fill={MUTED} fontSize={9} textAnchor="middle">{A[0][1].toFixed(1)}</text>
        <text x={(cx[0] + cx[1]) / 2} y={cy + 20} fill={MUTED} fontSize={9} textAnchor="middle">{A[1][0].toFixed(1)}</text>
        <defs>
          <marker id="arrow-hmm" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={MUTED} />
          </marker>
        </defs>
        {/* state nodes */}
        {[0, 1].map(s => (
          <g key={s}>
            <circle cx={cx[s]} cy={cy} r={r} fill={SURFACE} stroke={STATE_COLORS[s]} strokeWidth={path.includes(s) ? 3 : 1.5} />
            <text x={cx[s]} y={cy + 5} fill={TEXT} fontSize={13} fontWeight="700" textAnchor="middle">{STATE_NAMES[s]}</text>
          </g>
        ))}
        {/* emission bars beneath each state */}
        {[0, 1].map(s => (
          <g key={`b-${s}`}>
            {[0, 1, 2].map(k => (
              <rect key={k} x={cx[s] - 30 + k * 22} y={150 - Bmat[s][k] * 60} width={16} height={Bmat[s][k] * 60}
                fill={STATE_COLORS[s]} opacity={0.75} rx={2} />
            ))}
            <text x={cx[s]} y={166} fill={MUTED} fontSize={9} textAnchor="middle">P(1,2,3 | {STATE_NAMES[s]})</text>
          </g>
        ))}
        {/* worked computation */}
        <text x={W / 2} y={198} fill={TEXT} fontSize={10} textAnchor="middle">
          O = 3, 1, 3   Q = {candidates[candIdx].label}
        </text>
        <text x={W / 2} y={214} fill={MUTED} fontSize={9} textAnchor="middle">
          transitions: {trans.map(t => t.toFixed(2)).join(' · ')}   emissions: {emis.map(e => e.toFixed(2)).join(' · ')}
        </text>
        <text x={W / 2} y={234} fill={SUCCESS} fontSize={13} fontWeight="700" textAnchor="middle">
          P(O, Q) = {jointProb.toFixed(6)}
        </text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
        {candidates.map((c, i) => (
          <PillButton key={i} label={c.label} active={candIdx === i} onClick={() => setCandIdx(i)} />
        ))}
      </div>
    </div>
  );
};

// ── 3. Forward Trellis — live alpha computation for an editable sequence ────
export const VizForwardTrellis: React.FC = () => {
  const [obs, setObs] = useState([3, 1, 3]);
  const { alpha, total } = forward(obs);
  const T = obs.length;

  const PAD = { l: 60, r: 30, t: 40, b: 40 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const xC = (t: number) => PAD.l + pw * (t + 0.5) / T;
  const yC = (s: number) => PAD.t + ph * (s + 0.5) / 2;
  const maxAlpha = Math.max(0.001, ...alpha.flat());
  const rNode = 20;

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Forward Trellis — α_t(j) = Σᵢ α_(t−1)(i)·a_ij·b_j(o_t)
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        {/* edges between consecutive timesteps */}
        {Array.from({ length: T - 1 }, (_, t) => (
          [0, 1].map(i => [0, 1].map(j => (
            <line key={`${t}-${i}-${j}`} x1={xC(t)} y1={yC(i)} x2={xC(t + 1)} y2={yC(j)} stroke={MUTED} strokeWidth={0.6} opacity={0.4} />
          )))
        ))}
        {alpha.map((col, t) => [0, 1].map(s => {
          const intensity = 0.25 + 0.65 * (col[s] / maxAlpha);
          return (
            <g key={`${t}-${s}`}>
              <circle cx={xC(t)} cy={yC(s)} r={rNode} fill={STATE_COLORS[s]} opacity={intensity} stroke={STATE_COLORS[s]} strokeWidth={1.5} />
              <text x={xC(t)} y={yC(s) - 2} fill={t === 0 ? '#0f172a' : TEXT} fontSize={9} fontWeight="700" textAnchor="middle">{STATE_NAMES[s][0]}</text>
              <text x={xC(t)} y={yC(s) + 9} fill={t === 0 ? '#0f172a' : TEXT} fontSize={8} textAnchor="middle">{col[s].toFixed(4)}</text>
            </g>
          );
        }))}
        {Array.from({ length: T }, (_, t) => (
          <text key={`o-${t}`} x={xC(t)} y={PAD.t + ph + 20} fill={MUTED} fontSize={10} textAnchor="middle">o_{t + 1}={obs[t]}</text>
        ))}
        <text x={PAD.l - 40} y={yC(0) + 4} fill={STATE_COLORS[0]} fontSize={10} textAnchor="middle">COLD</text>
        <text x={PAD.l - 40} y={yC(1) + 4} fill={STATE_COLORS[1]} fontSize={10} textAnchor="middle">HOT</text>
        <text x={W / 2} y={18} fill={SUCCESS} fontSize={12} fontWeight="700" textAnchor="middle">
          P(O | λ) = {total.toExponential(4)}
        </text>
      </svg>
      <ObsSteppers obs={obs} onChange={setObs} />
    </div>
  );
};

// ── 4. Viterbi Trellis — best path highlighted via backtrace ────────────────
export const VizViterbiTrellis: React.FC = () => {
  const [obs, setObs] = useState([3, 1, 3]);
  const { delta, path, prob } = viterbi(obs);
  const T = obs.length;

  const PAD = { l: 60, r: 30, t: 40, b: 40 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const xC = (t: number) => PAD.l + pw * (t + 0.5) / T;
  const yC = (s: number) => PAD.t + ph * (s + 0.5) / 2;
  const maxDelta = Math.max(0.001, ...delta.flat());
  const rNode = 20;

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        Viterbi Trellis — v_t(j) = maxᵢ v_(t−1)(i)·a_ij·b_j(o_t), with Backtrace
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        {Array.from({ length: T - 1 }, (_, t) => (
          [0, 1].map(i => [0, 1].map(j => (
            <line key={`${t}-${i}-${j}`} x1={xC(t)} y1={yC(i)} x2={xC(t + 1)} y2={yC(j)} stroke={MUTED} strokeWidth={0.6} opacity={0.3} />
          )))
        ))}
        {/* best-path backtrace, bold */}
        {Array.from({ length: T - 1 }, (_, t) => (
          <line key={`bt-${t}`} x1={xC(t)} y1={yC(path[t])} x2={xC(t + 1)} y2={yC(path[t + 1])} stroke={SUCCESS} strokeWidth={3} />
        ))}
        {delta.map((col, t) => [0, 1].map(s => {
          const intensity = 0.25 + 0.65 * (col[s] / maxDelta);
          const onPath = path[t] === s;
          return (
            <g key={`${t}-${s}`}>
              <circle cx={xC(t)} cy={yC(s)} r={rNode} fill={onPath ? SUCCESS : STATE_COLORS[s]} opacity={onPath ? 0.9 : intensity}
                stroke={onPath ? SUCCESS : STATE_COLORS[s]} strokeWidth={onPath ? 2.5 : 1.5} />
              <text x={xC(t)} y={yC(s) - 2} fill="#0f172a" fontSize={9} fontWeight="700" textAnchor="middle">{STATE_NAMES[s][0]}</text>
              <text x={xC(t)} y={yC(s) + 9} fill="#0f172a" fontSize={8} textAnchor="middle">{col[s].toFixed(4)}</text>
            </g>
          );
        }))}
        {Array.from({ length: T }, (_, t) => (
          <text key={`o-${t}`} x={xC(t)} y={PAD.t + ph + 20} fill={MUTED} fontSize={10} textAnchor="middle">o_{t + 1}={obs[t]}</text>
        ))}
        <text x={PAD.l - 40} y={yC(0) + 4} fill={STATE_COLORS[0]} fontSize={10} textAnchor="middle">COLD</text>
        <text x={PAD.l - 40} y={yC(1) + 4} fill={STATE_COLORS[1]} fontSize={10} textAnchor="middle">HOT</text>
        <text x={W / 2} y={18} fill={SUCCESS} fontSize={12} fontWeight="700" textAnchor="middle">
          best path: {path.map(s => STATE_NAMES[s]).join(' → ')}  (P* = {prob.toExponential(3)})
        </text>
      </svg>
      <ObsSteppers obs={obs} onChange={setObs} />
    </div>
  );
};

// ── 5. Forward-Backward — γ_t(j) state-occupancy bars per day ───────────────
export const VizForwardBackward: React.FC = () => {
  const [obs, setObs] = useState([3, 1, 3]);
  const { alpha, total } = forward(obs);
  const beta = backward(obs);
  const T = obs.length;
  const gamma = alpha.map((col, t) => col.map((a, s) => (a * beta[t][s]) / total));

  const PAD = { l: 34, r: 16, t: 34, b: 34 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const groupW = pw / T;
  const yS = (val: number) => PAD.t + ph - val * ph;

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 16, userSelect: 'none' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        γ_t(j) = α_t(j)β_t(j) / P(O|λ) — Soft State Occupancy per Day
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={BG} />
        <rect x={PAD.l} y={PAD.t} width={pw} height={ph} fill={SURFACE} rx={3} />
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <line key={t} x1={PAD.l} y1={yS(t)} x2={PAD.l + pw} y2={yS(t)} stroke={BG} strokeWidth={1} />
        ))}
        {gamma.map((col, t) => {
          const cx = PAD.l + groupW * (t + 0.5);
          return (
            <g key={t}>
              <rect x={cx - 20} y={yS(col[0])} width={16} height={ph - (yS(col[0]) - PAD.t)} fill={STATE_COLORS[0]} opacity={0.85} rx={2} />
              <rect x={cx + 4} y={yS(col[1])} width={16} height={ph - (yS(col[1]) - PAD.t)} fill={STATE_COLORS[1]} opacity={0.85} rx={2} />
              <text x={cx} y={PAD.t + ph + 14} fill={MUTED} fontSize={9} textAnchor="middle">day {t + 1} (o={obs[t]})</text>
            </g>
          );
        })}
        <rect x={PAD.l} y={8} width={10} height={8} fill={STATE_COLORS[0]} opacity={0.85} rx={1} />
        <text x={PAD.l + 14} y={16} fill={MUTED} fontSize={9}>P(COLD)</text>
        <rect x={PAD.l + 70} y={8} width={10} height={8} fill={STATE_COLORS[1]} opacity={0.85} rx={1} />
        <text x={PAD.l + 84} y={16} fill={MUTED} fontSize={9}>P(HOT)</text>
      </svg>
      <ObsSteppers obs={obs} onChange={setObs} />
    </div>
  );
};
