import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Loader, FlaskConical } from 'lucide-react';
import Editor, { OnMount } from '@monaco-editor/react';
import { PythonLabDemo } from '../data/exercises';
import { usePyodide } from '../hooks/usePyodide';

interface LabState {
  code: string;
  output: string;
  plots: string[];
  running: boolean;
  hasRun: boolean;
}

export const PythonLabPanel: React.FC<{ demos: PythonLabDemo[] }> = ({ demos }) => {
  const { isLoading, isReady, error, runPython } = usePyodide();

  const [activeIdx, setActiveIdx] = useState(0);
  const [labStates, setLabStates] = useState<LabState[]>(() =>
    demos.map(d => ({ code: d.code, output: '', plots: [], running: false, hasRun: false }))
  );

  useEffect(() => {
    setActiveIdx(0);
    setLabStates(demos.map(d => ({ code: d.code, output: '', plots: [], running: false, hasRun: false })));
  }, [demos]);

  const anyRunning = labStates.some(s => s.running);
  const active = labStates[activeIdx];
  const demo   = demos[activeIdx];

  useEffect(() => {
    return () => { delete (window as any).render_matplotlib_plot; };
  }, []);

  const update = useCallback((idx: number, patch: Partial<LabState>) => {
    setLabStates(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  }, []);

  const handleRun = useCallback(async () => {
    if (!isReady || anyRunning) return;
    const idx = activeIdx;
    update(idx, { running: true, output: '', plots: [], hasRun: true });

    const plots: string[] = [];
    (window as any).render_matplotlib_plot = (img: string) => { plots.push(img); };

    const result = await runPython(labStates[idx].code);

    update(idx, { running: false, output: result, plots: [...plots] });
    delete (window as any).render_matplotlib_plot;
  }, [isReady, anyRunning, activeIdx, labStates, runPython, update]);

  if (demos.length === 0 || labStates.length !== demos.length) return null;

  const handleMount: OnMount = (editor, monaco) => {
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => { handleRun(); },
    );
  };

  const editorHeight = Math.max(200, Math.min(480, active.code.split('\n').length * 19 + 24));
  const canRun       = isReady && !anyRunning;

  return (
    <div style={{
      borderTop: '1px solid var(--border-color)',
      marginTop: 'var(--space-32)',
      paddingTop: 'var(--space-32)',
    }}>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <FlaskConical size={17} color="#3b82f6" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Python Lab
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
            Pre-coded demos with live matplotlib plots. Run them, then modify to explore.
          </p>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '0.78rem', fontWeight: 600, flexShrink: 0, marginLeft: '16px',
          padding: '4px 10px', borderRadius: '6px',
          background: isReady ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)',
          color: isReady ? '#16a34a' : '#d97706',
          border: `1px solid ${isReady ? 'rgba(22,163,74,0.3)' : 'rgba(217,119,6,0.3)'}`,
        }}>
          {isLoading
            ? <><Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> Loading Python…</>
            : isReady ? '● Python Ready'
            : error    ? '⚠ Load failed'
            : '…'}
        </div>
      </div>

      {error && (
        <div style={{ fontSize: '0.83rem', color: '#dc2626', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '6px', padding: '8px 12px', marginBottom: '14px' }}>
          {error}
        </div>
      )}

      {/* ── Demo tabs ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {demos.map((d, i) => (
          <button
            key={d.id}
            onClick={() => setActiveIdx(i)}
            style={{
              padding: '6px 14px',
              fontSize: '0.83rem',
              fontWeight: activeIdx === i ? 700 : 500,
              background: activeIdx === i ? '#3b82f6' : 'var(--bg-secondary)',
              color: activeIdx === i ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${activeIdx === i ? '#3b82f6' : 'var(--border-color)'}`,
              borderRadius: '7px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
          >
            {labStates[i].hasRun && i !== activeIdx && (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />
            )}
            {d.title}
          </button>
        ))}
      </div>

      {/* ── Description ──────────────────────────────────────────────────────── */}
      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.6 }}>
        {demo.description}
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
        <button
          onClick={handleRun}
          disabled={!canRun}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '7px 18px', fontSize: '0.87rem', fontWeight: 700,
            background: canRun ? '#3b82f6' : 'var(--border-color)',
            color: canRun ? '#fff' : 'var(--text-secondary)',
            border: 'none', borderRadius: '7px',
            cursor: canRun ? 'pointer' : 'not-allowed',
          }}
        >
          {active.running
            ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Running…</>
            : <><Play size={14} /> Run</>}
        </button>

        <button
          onClick={() => update(activeIdx, { code: demo.code, output: '', plots: [], hasRun: false })}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '7px 12px', fontSize: '0.83rem', fontWeight: 600,
            background: 'transparent', color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)', borderRadius: '7px', cursor: 'pointer',
          }}
        >
          <RotateCcw size={13} /> Reset
        </button>

        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
          Ctrl+Enter = Run · Tab = indent · code is editable
        </span>
      </div>

      {/* ── Monaco editor ────────────────────────────────────────────────────── */}
      <div style={{ border: '1px solid #333', borderRadius: '8px', overflow: 'hidden', marginBottom: '14px' }}>
        <Editor
          key={demo.id}
          height={editorHeight}
          defaultLanguage="python"
          theme="vs-dark"
          value={active.code}
          onChange={v => update(activeIdx, { code: v ?? '' })}
          onMount={handleMount}
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
            padding: { top: 12, bottom: 12 },
            scrollbar: { vertical: 'auto' },
            overviewRulerLanes: 0,
            renderLineHighlight: 'line',
          }}
        />
      </div>

      {/* ── Output + plots ───────────────────────────────────────────────────── */}
      {(active.hasRun || active.running) && (
        <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
          {/* Header bar */}
          <div style={{
            padding: '5px 14px',
            background: '#181818',
            color: '#555',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            borderBottom: active.output || active.running ? '1px solid #333' : 'none',
          }}>
            Output
          </div>

          {/* Text output */}
          {(active.running || active.output) && (
            <pre style={{
              margin: 0,
              padding: '12px 16px',
              background: '#1e1e1e',
              color: active.output.includes('Error') ? '#f87171' : '#d4d4d4',
              fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
              fontSize: '0.83rem',
              lineHeight: 1.65,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              maxHeight: '220px',
              overflowY: 'auto',
            }}>
              {active.running ? 'Running…' : active.output}
            </pre>
          )}

          {/* Plots */}
          {active.plots.length > 0 && (
            <div style={{
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '16px',
            }}>
              {active.plots.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Plot ${i + 1}`}
                  style={{ maxWidth: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
