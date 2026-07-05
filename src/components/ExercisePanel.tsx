import React, { useState, useCallback, useEffect } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, Lightbulb, BookOpen } from 'lucide-react';
import { Exercise, ExercisePart } from '../data/exercisesData';

// ── Helpers ───────────────────────────────────────────────────────────────────

const parseFraction = (s: string): number | null => {
  const trimmed = s.trim();
  if (trimmed === '') return null;
  const slashIdx = trimmed.indexOf('/');
  if (slashIdx !== -1) {
    const num = parseFloat(trimmed.slice(0, slashIdx));
    const den = parseFloat(trimmed.slice(slashIdx + 1));
    if (isNaN(num) || isNaN(den) || den === 0) return null;
    return num / den;
  }
  const v = parseFloat(trimmed);
  return isNaN(v) ? null : v;
};

const checkNumerical = (input: string, answer: number, tolerance = 0.005): boolean => {
  const v = parseFraction(input);
  if (v === null) return false;
  const absDiff = Math.abs(v - answer);
  const relDiff = answer !== 0 ? absDiff / Math.abs(answer) : absDiff;
  return absDiff <= tolerance || relDiff <= 0.01;
};

const difficultyMeta: Record<string, { label: string; color: string; bg: string }> = {
  exercise:  { label: 'Exercise',  color: '#16a34a', bg: 'rgba(22,163,74,0.12)' },
  problem:   { label: 'Problem',   color: '#d97706', bg: 'rgba(217,119,6,0.12)' },
  challenge: { label: 'Challenge', color: '#dc2626', bg: 'rgba(220,38,38,0.12)' },
};

// ── Check state per question ──────────────────────────────────────────────────

type CheckResult = 'idle' | 'correct' | 'wrong';

interface PartState {
  input: string;
  result: CheckResult;
}

interface ExerciseState {
  expanded: boolean;
  partStates: Record<string, PartState>;   // part label or 'single'
  hintsShown: number;
  solutionOpen: boolean;
  solved: boolean;
}

const initExerciseState = (ex: Exercise): ExerciseState => {
  const partStates: Record<string, PartState> = {};
  if (ex.parts) {
    ex.parts.forEach(p => { partStates[p.label] = { input: '', result: 'idle' }; });
  } else {
    partStates['single'] = { input: '', result: 'idle' };
  }
  return { expanded: false, partStates, hintsShown: 0, solutionOpen: false, solved: false };
};

// ── Sub-components ────────────────────────────────────────────────────────────

const FeedbackIcon: React.FC<{ result: CheckResult }> = ({ result }) => {
  if (result === 'correct') return <CheckCircle size={16} color="#16a34a" style={{ flexShrink: 0 }} />;
  if (result === 'wrong')   return <XCircle     size={16} color="#dc2626" style={{ flexShrink: 0 }} />;
  return null;
};

const PartInput: React.FC<{
  part: ExercisePart;
  state: PartState;
  onChange: (v: string) => void;
  onCheck: () => void;
}> = ({ part, state, onChange, onCheck }) => (
  <div style={{ marginTop: '10px', paddingLeft: '12px', borderLeft: '2px solid var(--border-color)' }}>
    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
      <strong>({part.label})</strong> {part.question}
    </div>
    {part.hint && state.result === 'wrong' && (
      <div style={{ fontSize: '0.78rem', color: '#d97706', background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '5px', padding: '5px 8px', marginBottom: '6px' }}>
        Hint: {part.hint}
      </div>
    )}
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        type="text"
        value={state.input}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onCheck()}
        placeholder="e.g. 0.333 or 1/3"
        disabled={state.result === 'correct'}
        style={{
          flex: 1,
          padding: '5px 10px',
          fontSize: '0.87rem',
          background: 'var(--bg-primary)',
          border: `1px solid ${state.result === 'correct' ? '#16a34a' : state.result === 'wrong' ? '#dc2626' : 'var(--border-color)'}`,
          borderRadius: '6px',
          color: 'var(--text-primary)',
          outline: 'none',
          fontFamily: 'monospace',
        }}
      />
      {state.result !== 'correct' && (
        <button
          onClick={onCheck}
          style={{
            padding: '5px 12px',
            fontSize: '0.8rem',
            fontWeight: 600,
            background: 'var(--accent-primary, #3b82f6)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Check
        </button>
      )}
      <FeedbackIcon result={state.result} />
    </div>
    {state.result === 'correct' && (
      <div style={{ fontSize: '0.78rem', color: '#16a34a', marginTop: '4px' }}>Correct!</div>
    )}
    {state.result === 'wrong' && (
      <div style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '4px' }}>Not quite — try again.</div>
    )}
  </div>
);

const SingleInput: React.FC<{
  state: PartState;
  onChange: (v: string) => void;
  onCheck: () => void;
}> = ({ state, onChange, onCheck }) => (
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
    <input
      type="text"
      value={state.input}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && onCheck()}
      placeholder="e.g. 0.5 or 1/3"
      disabled={state.result === 'correct'}
      style={{
        flex: 1,
        padding: '7px 12px',
        fontSize: '0.9rem',
        background: 'var(--bg-primary)',
        border: `1px solid ${state.result === 'correct' ? '#16a34a' : state.result === 'wrong' ? '#dc2626' : 'var(--border-color)'}`,
        borderRadius: '7px',
        color: 'var(--text-primary)',
        outline: 'none',
        fontFamily: 'monospace',
      }}
    />
    {state.result !== 'correct' && (
      <button
        onClick={onCheck}
        style={{
          padding: '7px 16px',
          fontSize: '0.85rem',
          fontWeight: 600,
          background: 'var(--accent-primary, #3b82f6)',
          color: '#fff',
          border: 'none',
          borderRadius: '7px',
          cursor: 'pointer',
        }}
      >
        Check
      </button>
    )}
    <FeedbackIcon result={state.result} />
  </div>
);

// ── Exercise card ─────────────────────────────────────────────────────────────

const ExerciseCard: React.FC<{
  exercise: Exercise;
  state: ExerciseState;
  onToggle: () => void;
  onPartInput: (key: string, value: string) => void;
  onPartCheck: (key: string) => void;
  onShowHint: () => void;
  onToggleSolution: () => void;
}> = ({ exercise, state, onToggle, onPartInput, onPartCheck, onShowHint, onToggleSolution }) => {
  const meta = difficultyMeta[exercise.difficulty];

  return (
    <div style={{
      border: `1px solid ${state.solved ? 'rgba(22,163,74,0.4)' : 'var(--border-color)'}`,
      borderRadius: '10px',
      overflow: 'hidden',
      marginBottom: '10px',
      background: state.solved ? 'rgba(22,163,74,0.03)' : 'var(--bg-primary)',
    }}>

      {/* Header row */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>
          {state.expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </span>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0, minWidth: '44px' }}>
          {exercise.number}
        </span>
        <span style={{ flex: 1, fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
          {exercise.question.length > 90 && !state.expanded
            ? exercise.question.slice(0, 90) + '…'
            : exercise.question}
        </span>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: meta.color,
          background: meta.bg,
          padding: '2px 7px',
          borderRadius: '4px',
          flexShrink: 0,
        }}>
          {meta.label}
        </span>
        {state.solved && <CheckCircle size={15} color="#16a34a" style={{ flexShrink: 0 }} />}
      </button>

      {/* Expanded body */}
      {state.expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.7, margin: '12px 0 0' }}>
            {exercise.question}
          </p>

          {/* Parts or single */}
          {exercise.parts ? (
            exercise.parts.map(part => (
              <PartInput
                key={part.label}
                part={part}
                state={state.partStates[part.label]}
                onChange={v => onPartInput(part.label, v)}
                onCheck={() => onPartCheck(part.label)}
              />
            ))
          ) : (
            <>
              <SingleInput
                state={state.partStates['single']}
                onChange={v => onPartInput('single', v)}
                onCheck={() => onPartCheck('single')}
              />
              {state.partStates['single'].result === 'wrong' && (
                <div style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '4px' }}>
                  Not quite — check your calculation and try again.
                </div>
              )}
              {state.partStates['single'].result === 'correct' && (
                <div style={{ fontSize: '0.78rem', color: '#16a34a', marginTop: '4px' }}>Correct!</div>
              )}
            </>
          )}

          {/* Hints */}
          <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {state.hintsShown < exercise.hints.length && (
              <button
                onClick={onShowHint}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#d97706',
                  background: 'rgba(217,119,6,0.1)',
                  border: '1px solid rgba(217,119,6,0.3)',
                  borderRadius: '5px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                }}
              >
                <Lightbulb size={12} />
                {state.hintsShown === 0 ? 'Show Hint' : `Hint ${state.hintsShown + 1} of ${exercise.hints.length}`}
              </button>
            )}
            <button
              onClick={onToggleSolution}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '5px',
                padding: '4px 10px',
                cursor: 'pointer',
              }}
            >
              <BookOpen size={12} />
              {state.solutionOpen ? 'Hide Solution' : 'Show Solution'}
            </button>
          </div>

          {/* Revealed hints */}
          {state.hintsShown > 0 && (
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {exercise.hints.slice(0, state.hintsShown).map((hint, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: '0.82rem',
                    color: '#d97706',
                    background: 'rgba(217,119,6,0.08)',
                    border: '1px solid rgba(217,119,6,0.25)',
                    borderRadius: '5px',
                    padding: '6px 10px',
                  }}
                >
                  <strong>Hint {i + 1}:</strong> {hint}
                </div>
              ))}
            </div>
          )}

          {/* Solution */}
          {state.solutionOpen && (
            <div style={{
              marginTop: '10px',
              fontSize: '0.84rem',
              color: 'var(--text-primary)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '10px 14px',
              lineHeight: 1.7,
              fontFamily: 'monospace',
            }}>
              <strong style={{ display: 'block', marginBottom: '4px', fontFamily: 'inherit', color: 'var(--text-secondary)', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Solution</strong>
              {exercise.solution}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main panel ────────────────────────────────────────────────────────────────

export const ExercisePanel: React.FC<{ exercises: Exercise[] }> = ({ exercises }) => {
  const [states, setStates] = useState<ExerciseState[]>(() =>
    exercises.map(ex => initExerciseState(ex))
  );

  useEffect(() => {
    setStates(exercises.map(ex => initExerciseState(ex)));
  }, [exercises]);

  const solvedCount = states.filter(s => s.solved).length;

  const updateState = useCallback((idx: number, updater: (prev: ExerciseState) => ExerciseState) => {
    setStates(prev => {
      const next = [...prev];
      next[idx] = updater(next[idx]);
      return next;
    });
  }, []);

  const toggleExpanded = (idx: number) =>
    updateState(idx, s => ({ ...s, expanded: !s.expanded }));

  const handlePartInput = (exIdx: number, key: string, value: string) =>
    updateState(exIdx, s => ({
      ...s,
      partStates: { ...s.partStates, [key]: { ...s.partStates[key], input: value, result: 'idle' } },
    }));

  const handlePartCheck = (exIdx: number, key: string) => {
    const ex = exercises[exIdx];
    updateState(exIdx, s => {
      const partState = s.partStates[key];
      let isCorrect = false;

      if (key === 'single') {
        const ans = ex.answer as number;
        isCorrect = checkNumerical(partState.input, ans, ex.tolerance);
      } else {
        const part = ex.parts?.find(p => p.label === key);
        if (part && typeof part.answer === 'number') {
          isCorrect = checkNumerical(partState.input, part.answer, part.tolerance);
        }
      }

      const newPartStates = {
        ...s.partStates,
        [key]: { ...partState, result: (isCorrect ? 'correct' : 'wrong') as CheckResult },
      };

      const allSolved = Object.values(newPartStates).every(ps => ps.result === 'correct');

      return { ...s, partStates: newPartStates, solved: allSolved };
    });
  };

  const showHint = (idx: number) =>
    updateState(idx, s => ({
      ...s,
      hintsShown: Math.min(s.hintsShown + 1, exercises[idx].hints.length),
    }));

  const toggleSolution = (idx: number) =>
    updateState(idx, s => ({ ...s, solutionOpen: !s.solutionOpen }));

  if (exercises.length === 0 || states.length !== exercises.length) return null;

  return (
    <div style={{
      borderTop: '1px solid var(--border-color)',
      marginTop: 'var(--space-48)',
      paddingTop: 'var(--space-32)',
    }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-20)' }}>
        <div>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
          }}>
            Practice Exercises
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
            Work through these problems — enter an answer and press Check or Enter.
            Fractions like <code>1/3</code> are accepted.
          </p>
        </div>

        {/* Progress pill */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          flexShrink: 0,
          marginLeft: '16px',
        }}>
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: solvedCount === exercises.length ? '#16a34a' : 'var(--text-primary)',
            fontFamily: 'monospace',
          }}>
            {solvedCount} / {exercises.length}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            solved
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: '4px',
        background: 'var(--border-color)',
        borderRadius: '2px',
        marginBottom: 'var(--space-20)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${exercises.length > 0 ? (solvedCount / exercises.length) * 100 : 0}%`,
          background: '#16a34a',
          borderRadius: '2px',
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Exercise cards */}
      {exercises.map((ex, idx) => (
        <ExerciseCard
          key={ex.id}
          exercise={ex}
          state={states[idx]}
          onToggle={() => toggleExpanded(idx)}
          onPartInput={(key, val) => handlePartInput(idx, key, val)}
          onPartCheck={key => handlePartCheck(idx, key)}
          onShowHint={() => showHint(idx)}
          onToggleSolution={() => toggleSolution(idx)}
        />
      ))}
    </div>
  );
};
