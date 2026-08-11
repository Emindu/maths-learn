import { useEffect, useRef, useState } from 'react';

// CheerpJ (https://cheerpj.com) is a WebAssembly-based JVM that runs real
// Java bytecode in the browser, loaded from Leaning Technologies' CDN under
// the free Community License (non-commercial use). This mirrors usePyodide.ts's
// singleton-loader shape so the two runtimes behave consistently across the site.
//
// NOTE: the exact classpath CheerpJ exposes for its bundled JDK (used here as
// "/app/tools.jar", the conventional path from CheerpJ 3.x demos) could not be
// verified against live docs when this was written — network access to
// cheerpj.com/leaningtech.com was blocked in the dev sandbox. If compiling or
// running fails with a "class not found" style error for com.sun.tools.javac.Main
// specifically, that classpath constant is the first thing to check against
// current CheerpJ docs.

declare global {
  interface Window {
    cheerpjInit: (config?: Record<string, unknown>) => Promise<void>;
    cheerpjRunMain: (mainClass: string, classpath: string, ...args: string[]) => Promise<number>;
    cheerpOSAddStringFile: (path: string, content: string) => void;
  }
}

const CHEERPJ_LOADER_URL = 'https://cjrtnc.leaningtech.com/4.3/loader.js';
const JDK_CLASSPATH = '/app/tools.jar';
const RUN_TIMEOUT_MS = 30000;

export interface CheerpjHookState {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  compileAndRun: (javaSource: string, mainClassName: string) => Promise<string>;
  output: string;
  running: boolean;
  clearOutput: () => void;
}

let cheerpjLoadPromise: Promise<void> | null = null;
let cheerpjReady = false;

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
  ]);
}

export const useCheerpj = (): CheerpjHookState => {
  const [isLoading, setIsLoading] = useState<boolean>(!cheerpjReady);
  const [isReady, setIsReady] = useState<boolean>(cheerpjReady);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>('');
  const [running, setRunning] = useState<boolean>(false);

  const outputRef = useRef<string>('');

  useEffect(() => {
    if (cheerpjReady) return;

    if (!cheerpjLoadPromise) {
      cheerpjLoadPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = CHEERPJ_LOADER_URL;
        script.onload = async () => {
          try {
            await withTimeout(window.cheerpjInit(), RUN_TIMEOUT_MS, 'CheerpJ runtime took too long to initialise.');
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        script.onerror = () => reject(new Error('Failed to load the CheerpJ runtime script from the CDN.'));
        document.body.appendChild(script);
      });
    }

    cheerpjLoadPromise
      .then(() => {
        cheerpjReady = true;
        setIsReady(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load CheerpJ', err);
        setError(err?.message || 'Failed to load the Java runtime. Check your internet connection.');
        setIsLoading(false);
      });
  }, []);

  const compileAndRun = async (javaSource: string, mainClassName: string): Promise<string> => {
    if (!cheerpjReady) {
      setError('Java runtime is not ready yet');
      return '';
    }

    outputRef.current = '';
    setOutput('');
    setError(null);
    setRunning(true);

    const capturedLines: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;
    console.log = (...args: unknown[]) => { capturedLines.push(args.map(String).join(' ')); };
    console.error = (...args: unknown[]) => { capturedLines.push(args.map(String).join(' ')); };

    try {
      const sourcePath = `/str/playground/${mainClassName}.java`;
      const outDir = '/files/playground';
      window.cheerpOSAddStringFile(sourcePath, javaSource);

      const compileExit = await withTimeout(
        window.cheerpjRunMain('com.sun.tools.javac.Main', JDK_CLASSPATH, sourcePath, '-d', outDir),
        RUN_TIMEOUT_MS,
        'Compilation timed out.'
      );

      if (compileExit !== 0) {
        const compileOutput = capturedLines.join('\n');
        outputRef.current = compileOutput || 'Compilation failed.';
        setOutput(outputRef.current);
        return outputRef.current;
      }

      capturedLines.length = 0;
      await withTimeout(
        window.cheerpjRunMain(mainClassName, `${JDK_CLASSPATH}:${outDir}`),
        RUN_TIMEOUT_MS,
        'Program run timed out.'
      );

      outputRef.current = capturedLines.join('\n');
      setOutput(outputRef.current || '(no output)');
      return outputRef.current;
    } catch (err: any) {
      const message = err?.message || String(err);
      outputRef.current = `Error: ${message}`;
      setOutput(outputRef.current);
      return outputRef.current;
    } finally {
      console.log = originalLog;
      console.error = originalError;
      setRunning(false);
    }
  };

  const clearOutput = () => {
    outputRef.current = '';
    setOutput('');
    setError(null);
  };

  return { isLoading, isReady, error, compileAndRun, output, running, clearOutput };
};
