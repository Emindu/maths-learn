import React, { useState } from 'react';
import { Play, Loader, RotateCcw } from 'lucide-react';
import { useCheerpj } from '../hooks/useCheerpj';

interface JavaCodeRunnerProps {
  mainClass: string;
}

// Runs a Java program in the browser via CheerpJ (a WebAssembly JVM). The
// program was already compiled at build time (scripts/compile-java-runnables.mjs)
// and shipped as a static .class file; this just executes it and captures
// System.out/System.err into an output pane — the Java-side equivalent of
// PythonExercisePanel's Pyodide-backed runner.
export const JavaCodeRunner: React.FC<JavaCodeRunnerProps> = ({ mainClass }) => {
  const { isLoading, isReady, error, runCompiled, output, running, clearOutput } = useCheerpj();
  const [hasRun, setHasRun] = useState(false);

  const canRun = isReady && !running;

  const handleRun = async () => {
    setHasRun(true);
    await runCompiled(mainClass);
  };

  const handleReset = () => {
    clearOutput();
    setHasRun(false);
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={handleRun}
          disabled={!canRun}
          className="btn btn--primary btn--sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: canRun ? 'pointer' : 'not-allowed', opacity: canRun ? 1 : 0.6 }}
        >
          {running ? <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Running…</> : <><Play size={13} /> Run</>}
        </button>

        {hasRun && (
          <button onClick={handleReset} className="btn btn--outline btn--sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <RotateCcw size={12} /> Clear
          </button>
        )}

        <span style={{
          fontSize: '0.76rem', fontWeight: 600, marginLeft: 'auto',
          color: isReady ? '#22c55e' : error ? '#ef4444' : 'var(--color-text-secondary)',
          display: 'inline-flex', alignItems: 'center', gap: '5px',
        }}>
          {isLoading
            ? <><Loader size={11} style={{ animation: 'spin 1s linear infinite' }} /> Loading Java runtime…</>
            : isReady
              ? '● Java ready'
              : error
                ? '⚠ Runtime unavailable'
                : ''}
        </span>
      </div>

      {error && (
        <div style={{ fontSize: '0.8rem', color: '#ef4444', background: 'color-mix(in srgb, #ef4444 8%, transparent)', border: '1px solid color-mix(in srgb, #ef4444 30%, transparent)', borderRadius: '6px', padding: '8px 12px', marginTop: '8px' }}>
          {error}
        </div>
      )}

      {(hasRun || running) && !error && (
        <div style={{ marginTop: '8px', borderRadius: '7px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <div style={{
            padding: '5px 12px', background: 'var(--color-background)', color: 'var(--color-text-secondary)',
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
            borderBottom: '1px solid var(--color-border)',
          }}>
            Output
          </div>
          <pre style={{
            margin: 0, padding: '12px', background: 'var(--color-background)', color: 'var(--color-text)',
            fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', lineHeight: 1.6,
            whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '260px', overflowY: 'auto',
          }}>
            {running ? 'Running…' : (output || '(no output)')}
          </pre>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
