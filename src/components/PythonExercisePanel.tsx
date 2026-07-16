import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronRight, Play, BookOpen, RotateCcw, Loader } from 'lucide-react';
import Editor, { OnMount } from '@monaco-editor/react';
import { PythonExercise } from '../data/exercises';
import { usePyodide } from '../hooks/usePyodide';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CardState {
  expanded: boolean;
  code: string;
  output: string;
  plots: string[];
  running: boolean;
  solutionOpen: boolean;
  hasRun: boolean;
}

// ── Individual card ───────────────────────────────────────────────────────────

interface PythonCardProps {
  exercise: PythonExercise;
  state: CardState;
  pyodideReady: boolean;
  anyRunning: boolean;
  onToggle: () => void;
  onCodeChange: (v: string) => void;
  onRun: () => void;
  onReset: () => void;
  onToggleSolution: () => void;
}

const PythonCard: React.FC<PythonCardProps> = ({
  exercise, state, pyodideReady, anyRunning,
  onToggle, onCodeChange, onRun, onReset, onToggleSolution,
}) => {
  const canRun = pyodideReady && !anyRunning;

  // Compute editor height from line count, capped between 180px and 420px
  const editorHeight = Math.max(180, Math.min(420, state.code.split('\n').length * 19 + 20));

  const handleEditorMount: OnMount = (editor, monaco) => {
    // Ctrl+Enter / Cmd+Enter to run
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => { if (canRun) onRun(); },
    );
  };

  return (
    <div style={{
      border: '1px solid var(--border-color)',
      borderRadius: '10px',
      overflow: 'hidden',
      marginBottom: '10px',
      background: 'var(--bg-primary)',
    }}>
      {/* Header */}
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
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f59e0b', flexShrink: 0, minWidth: '44px' }}>
          {exercise.number}
        </span>
        <span style={{ flex: 1, fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600 }}>
          {exercise.title}
        </span>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: '#3b82f6',
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.25)',
          padding: '2px 7px',
          borderRadius: '4px',
          flexShrink: 0,
        }}>
          Python
        </span>
        {state.hasRun && !state.expanded && (
          <Play size={13} color="#16a34a" style={{ flexShrink: 0 }} />
        )}
      </button>

      {/* Body */}
      {state.expanded && (
        <div style={{ borderTop: '1px solid var(--border-color)' }}>

          {/* Description */}
          <div style={{ padding: '12px 16px 0', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {exercise.description}
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px 16px' }}>
            <button
              onClick={onRun}
              disabled={!canRun}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', fontSize: '0.83rem', fontWeight: 700,
                background: canRun ? '#3b82f6' : 'var(--border-color)',
                color: canRun ? '#fff' : 'var(--text-secondary)',
                border: 'none', borderRadius: '6px',
                cursor: canRun ? 'pointer' : 'not-allowed',
              }}
            >
              {state.running
                ? <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Running…</>
                : <><Play size={13} /> Run</>}
            </button>

            <button
              onClick={onReset}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '6px 10px', fontSize: '0.8rem', fontWeight: 600,
                background: 'transparent', color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer',
              }}
            >
              <RotateCcw size={12} /> Reset
            </button>

            <button
              onClick={onToggleSolution}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '6px 10px', fontSize: '0.8rem', fontWeight: 600,
                background: state.solutionOpen ? 'rgba(139,92,246,0.12)' : 'transparent',
                color: state.solutionOpen ? '#8b5cf6' : 'var(--text-secondary)',
                border: `1px solid ${state.solutionOpen ? 'rgba(139,92,246,0.4)' : 'var(--border-color)'}`,
                borderRadius: '6px', cursor: 'pointer',
              }}
            >
              <BookOpen size={12} /> {state.solutionOpen ? 'Hide Solution' : 'Show Solution'}
            </button>

            {exercise.expectedHint && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: 'auto', fontStyle: 'italic' }}>
                Expected: {exercise.expectedHint}
              </span>
            )}
          </div>

          {/* Code editor */}
          <div style={{ padding: '0 16px 12px' }}>
            <div style={{
              border: '1px solid #333',
              borderRadius: '7px',
              overflow: 'hidden',
            }}>
              <Editor
                height={editorHeight}
                defaultLanguage="python"
                theme="vs-dark"
                value={state.code}
                onChange={v => onCodeChange(v ?? '')}
                onMount={handleEditorMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineHeight: 20,
                  fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                  fontLigatures: true,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  insertSpaces: true,
                  padding: { top: 10, bottom: 10 },
                  scrollbar: { vertical: 'auto', horizontal: 'auto' },
                  overviewRulerLanes: 0,
                  renderLineHighlight: 'line',
                }}
              />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Ctrl+Enter = Run · Tab = indent
            </div>
          </div>

          {/* Output */}
          {(state.hasRun || state.running) && (
            <div style={{ margin: '0 16px 16px', borderRadius: '7px', overflow: 'hidden', border: '1px solid #333' }}>
              <div style={{
                padding: '5px 12px',
                background: '#181818',
                color: '#666',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                borderBottom: '1px solid #333',
              }}>
                Output
              </div>
              <pre style={{
                margin: 0,
                padding: '12px',
                background: '#1e1e1e',
                color: state.output.includes('Error') ? '#f87171' : '#d4d4d4',
                fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                fontSize: '0.82rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                maxHeight: '300px',
                overflowY: 'auto',
              }}>
                {state.running ? 'Running…' : (state.output || '(no output)')}
              </pre>

              {state.plots.length > 0 && (
                <div style={{ padding: '12px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {state.plots.map((src, i) => (
                    <img key={i} src={src} alt={`Plot ${i + 1}`} style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Solution */}
          {state.solutionOpen && (
            <div style={{ margin: '0 16px 16px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8b5cf6', marginBottom: '6px' }}>
                Solution
              </div>
              <div style={{
                border: '1px solid rgba(139,92,246,0.35)',
                borderRadius: '7px',
                overflow: 'hidden',
              }}>
                <Editor
                  height={Math.max(140, Math.min(380, exercise.solution.split('\n').length * 19 + 20))}
                  defaultLanguage="python"
                  theme="vs-dark"
                  value={exercise.solution}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineHeight: 20,
                    fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                    fontLigatures: true,
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 10, bottom: 10 },
                    scrollbar: { vertical: 'auto' },
                    overviewRulerLanes: 0,
                    renderLineHighlight: 'none',
                    domReadOnly: true,
                    cursorStyle: 'line',
                  }}
                />
              </div>
              <button
                onClick={() => onCodeChange(exercise.solution)}
                style={{
                  marginTop: '6px',
                  fontSize: '0.75rem',
                  color: '#8b5cf6',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Copy solution to editor
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main panel ────────────────────────────────────────────────────────────────

export const PythonExercisePanel: React.FC<{ exercises: PythonExercise[] }> = ({ exercises }) => {
  const { isLoading, isReady, error, runPython } = usePyodide();

  const [cardStates, setCardStates] = useState<CardState[]>(() =>
    exercises.map(ex => ({
      expanded: false,
      code: ex.starterCode,
      output: '',
      plots: [],
      running: false,
      solutionOpen: false,
      hasRun: false,
    }))
  );

  useEffect(() => {
    setCardStates(exercises.map(ex => ({
      expanded: false,
      code: ex.starterCode,
      output: '',
      plots: [],
      running: false,
      solutionOpen: false,
      hasRun: false,
    })));
  }, [exercises]);

  const anyRunning = cardStates.some(s => s.running);

  // Register global matplotlib plot callback
  useEffect(() => {
    // We need a mutable ref to know which card is currently running
    return () => {
      delete (window as any).render_matplotlib_plot;
    };
  }, []);

  const update = useCallback((idx: number, patch: Partial<CardState>) => {
    setCardStates(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  }, []);

  const handleRun = useCallback(async (idx: number) => {
    update(idx, { running: true, output: '', plots: [], hasRun: true });

    const plots: string[] = [];
    (window as any).render_matplotlib_plot = (img: string) => {
      plots.push(img);
    };

    const result = await runPython(cardStates[idx].code);

    update(idx, { running: false, output: result, plots: [...plots] });
    delete (window as any).render_matplotlib_plot;
  }, [cardStates, runPython, update]);

  if (exercises.length === 0 || cardStates.length !== exercises.length) return null;

  return (
    <div style={{
      borderTop: '1px solid var(--border-color)',
      marginTop: 'var(--space-32)',
      paddingTop: 'var(--space-32)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-20)' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Python Lab
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
            Solve these exercises in Python. Press Run or Ctrl+Enter to execute.
          </p>
        </div>

        {/* Pyodide status */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '0.78rem', fontWeight: 600,
          padding: '4px 10px', borderRadius: '6px',
          background: isReady ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)',
          color: isReady ? '#16a34a' : '#d97706',
          border: `1px solid ${isReady ? 'rgba(22,163,74,0.3)' : 'rgba(217,119,6,0.3)'}`,
          flexShrink: 0,
          marginLeft: '16px',
        }}>
          {isLoading
            ? <><Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> Loading Python…</>
            : isReady
              ? '● Python Ready'
              : error
                ? '⚠ Load failed'
                : '…'}
        </div>
      </div>

      {error && (
        <div style={{ fontSize: '0.83rem', color: '#dc2626', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '6px', padding: '8px 12px', marginBottom: '12px' }}>
          {error}
        </div>
      )}

      {/* Cards */}
      {exercises.map((ex, idx) => (
        <PythonCard
          key={ex.id}
          exercise={ex}
          state={cardStates[idx]}
          pyodideReady={isReady}
          anyRunning={anyRunning}
          onToggle={() => update(idx, { expanded: !cardStates[idx].expanded })}
          onCodeChange={v => update(idx, { code: v })}
          onRun={() => handleRun(idx)}
          onReset={() => update(idx, { code: ex.starterCode, output: '', plots: [], hasRun: false, solutionOpen: false })}
          onToggleSolution={() => update(idx, { solutionOpen: !cardStates[idx].solutionOpen })}
        />
      ))}

      {/* Spin animation */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
