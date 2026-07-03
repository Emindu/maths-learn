import { useState, useEffect, useRef } from 'react';

// Declare types for window object
declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<any>;
  }
}

export interface PyodideHookState {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  runPython: (code: string) => Promise<string>;
  output: string;
  clearOutput: () => void;
}

// Keep track of the singleton Pyodide instance outside the component
// to ensure we only load it once even if the hook is unmounted and remounted
let globalPyodideInstance: any = null;
let pyodideLoadPromise: Promise<any> | null = null;

export const usePyodide = (): PyodideHookState => {
  const [isLoading, setIsLoading] = useState<boolean>(!globalPyodideInstance);
  const [isReady, setIsReady] = useState<boolean>(!!globalPyodideInstance);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>('');

  const outputRef = useRef<string>('');
  
  // Custom stdout handler that appends to our output state
  const handleStdout = (msg: string) => {
    outputRef.current += msg + '\n';
    setOutput(outputRef.current);
  };

  const handleStderr = (msg: string) => {
    outputRef.current += 'Error: ' + msg + '\n';
    setOutput(outputRef.current);
  };

  useEffect(() => {
    if (globalPyodideInstance) {
      // Already loaded
      return;
    }

    if (!pyodideLoadPromise) {
      pyodideLoadPromise = new Promise((resolve, reject) => {
        // Load the Pyodide script dynamically
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
        script.onload = async () => {
          try {
            const pyodide = await window.loadPyodide({
              indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
            });
            globalPyodideInstance = pyodide;
            resolve(pyodide);
          } catch (err) {
            reject(err);
          }
        };
        script.onerror = (err) => reject(err);
        document.body.appendChild(script);
      });
    }

    pyodideLoadPromise
      .then(() => {
        setIsReady(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load Pyodide', err);
        setError('Failed to load Pyodide runtime. Check your internet connection.');
        setIsLoading(false);
      });
  }, []);

  const runPython = async (code: string): Promise<string> => {
    if (!globalPyodideInstance) {
      setError('Pyodide is not ready yet');
      return '';
    }

    // Reset output before each run
    outputRef.current = '';
    setOutput('');
    setError(null);

    try {
      // Temporarily override pyodide's stdout and stderr handlers for this execution
      globalPyodideInstance.setStdout({ batched: handleStdout });
      globalPyodideInstance.setStderr({ batched: handleStderr });

      // Dynamically load any packages imported by the user (like matplotlib, numpy)
      await globalPyodideInstance.loadPackagesFromImports(code);

      // Inject Matplotlib setup script to hook plt.show() and send plots to React
      const setupCode = `
import sys
try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    import io, base64
    import js

    def custom_show(*args, **kwargs):
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight')
        buf.seek(0)
        img_str = 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('UTF-8')
        if hasattr(js.window, 'render_matplotlib_plot'):
            js.window.render_matplotlib_plot(img_str)
        plt.clf()

    plt.show = custom_show
except ImportError:
    pass
`;
      await globalPyodideInstance.runPythonAsync(setupCode);

      const result = await globalPyodideInstance.runPythonAsync(code);
      
      // If the result is not None/undefined, append it to the output
      if (result !== undefined) {
        outputRef.current += '\n' + result.toString();
        setOutput(outputRef.current);
      }
      
      return outputRef.current;
    } catch (err: any) {
      const errorMessage = err.message || err.toString();
      outputRef.current += '\n' + errorMessage;
      setOutput(outputRef.current);
      return outputRef.current;
    }
  };

  const clearOutput = () => {
    outputRef.current = '';
    setOutput('');
    setError(null);
  };

  return { isLoading, isReady, error, runPython, output, clearOutput };
};
