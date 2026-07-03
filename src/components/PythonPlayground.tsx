import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { usePyodide } from '../hooks/usePyodide';

interface PythonPlaygroundProps {
  initialCode?: string;
  forceVerticalLayout?: boolean;
  exercises?: { title: string; prompt: string; solution: string }[];
}

export const PythonPlayground: React.FC<PythonPlaygroundProps> = ({ initialCode = '', forceVerticalLayout = false, exercises = [] }) => {
  const { isLoading, isReady, error, runPython, output, clearOutput } = usePyodide();
  const [code, setCode] = useState<string>(initialCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [plots, setPlots] = useState<string[]>([]);
  
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | ''>('');
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Update code if initialCode prop changes and no exercise is selected
  useEffect(() => {
    if (selectedExerciseIndex === '') {
      setCode(initialCode);
      setShowSolution(false);
    }
  }, [initialCode, selectedExerciseIndex]);

  // Handle exercise selection
  const handleExerciseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedExerciseIndex(val === '' ? '' : Number(val));
    setShowSolution(false);
    
    if (val === '') {
      setCode(initialCode);
    } else {
      setCode(exercises[Number(val)].prompt);
    }
    clearOutput();
    setPlots([]);
  };

  const handleToggleSolution = () => {
    if (selectedExerciseIndex !== '') {
      const ex = exercises[Number(selectedExerciseIndex)];
      if (!showSolution) {
        setCode(ex.solution);
      } else {
        setCode(ex.prompt);
      }
      setShowSolution(!showSolution);
    }
  };

  useEffect(() => {
    // Register the global callback for matplotlib plots
    (window as any).render_matplotlib_plot = (imgStr: string) => {
      setPlots((prev) => [...prev, imgStr]);
    };
    return () => {
      delete (window as any).render_matplotlib_plot;
    };
  }, []);

  const handleRunCode = async () => {
    if (!isReady) return;
    setIsRunning(true);
    setPlots([]); // Clear old plots before running
    await runPython(code);
    setIsRunning(false);
  };

  const getThemeColors = () => {
    const isDark = document.documentElement.getAttribute('data-color-scheme') === 'dark';
    return {
      bg: isDark ? '#1e1e1e' : '#f5f5f5',
      border: isDark ? '#333' : '#e0e0e0',
      text: isDark ? '#d4d4d4' : '#333',
      headerBg: isDark ? '#2d2d2d' : '#e0e0e0',
      btnBg: isDark ? '#0e639c' : '#007acc',
      btnHover: isDark ? '#1177bb' : '#0098ff',
      editorTheme: isDark ? 'vs-dark' : 'light',
    };
  };

  const colors = getThemeColors();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '600px', border: `1px solid ${colors.border}`, borderRadius: '8px', overflow: 'hidden' }}>
      
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', backgroundColor: colors.headerBg, borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: colors.text }}>Python Lab</h3>
          {exercises.length > 0 && (
            <select 
              value={selectedExerciseIndex} 
              onChange={handleExerciseChange}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.bg,
                color: colors.text,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <option value="">Free Play Sandbox</option>
              {exercises.map((ex, i) => (
                <option key={i} value={i}>Exercise: {ex.title}</option>
              ))}
            </select>
          )}
          {isLoading && <span style={{ fontSize: '0.9rem', color: 'var(--color-secondary)' }}>Loading Pyodide runtime... (This may take a moment)</span>}
          {error && <span style={{ fontSize: '0.9rem', color: 'var(--color-danger)' }}>{error}</span>}
          {isReady && <span style={{ fontSize: '0.9rem', color: 'var(--color-success)' }}>Python Ready</span>}
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => {
              clearOutput();
              setPlots([]);
            }}
            style={{ 
              padding: '6px 12px', 
              background: 'transparent', 
              border: `1px solid ${colors.border}`, 
              color: colors.text, 
              borderRadius: '4px',
              cursor: 'pointer' 
            }}
          >
            Clear Output
          </button>
          
          {selectedExerciseIndex !== '' && (
            <button 
              onClick={handleToggleSolution}
              style={{ 
                padding: '6px 12px', 
                background: showSolution ? 'var(--color-success)' : 'transparent', 
                border: `1px solid ${showSolution ? 'var(--color-success)' : colors.border}`, 
                color: showSolution ? 'white' : colors.text, 
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: showSolution ? 'bold' : 'normal'
              }}
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>
          )}
          <button 
            onClick={handleRunCode}
            disabled={!isReady || isRunning}
            style={{ 
              padding: '6px 16px', 
              background: (isReady && !isRunning) ? colors.btnBg : 'var(--color-secondary)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: (isReady && !isRunning) ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isRunning ? 'Running...' : 'Run Code ▶'}
          </button>
        </div>
      </div>

      {/* Editor & Output Split */}
      <div style={{ display: 'flex', flex: 1, flexDirection: forceVerticalLayout || window.innerWidth <= 768 ? 'column' : 'row' }}>
        
        <div style={{ flex: 1, minHeight: '300px', borderRight: !forceVerticalLayout && window.innerWidth > 768 ? `1px solid ${colors.border}` : 'none', borderBottom: forceVerticalLayout || window.innerWidth <= 768 ? `1px solid ${colors.border}` : 'none' }}>
          <Editor
            height="100%"
            defaultLanguage="python"
            theme={colors.editorTheme}
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Output Pane */}
        <div style={{ flex: 1, backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '15px', overflowY: 'auto', minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Terminal Output</div>
          <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '14px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', flex: plots.length === 0 ? 1 : 'none' }}>
            {output || (isReady ? 'Ready for execution...' : 'Initializing...')}
          </pre>
          
          {/* Plots Area */}
          {plots.length > 0 && (
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {plots.map((imgStr, i) => (
                <div key={i} style={{ backgroundColor: 'white', padding: '10px', borderRadius: '4px' }}>
                  <img src={imgStr} alt={`Generated plot ${i + 1}`} style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
