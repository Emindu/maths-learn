import { useEffect, useRef, useState } from 'react';

// CheerpJ (https://cheerpj.com) is a WebAssembly-based JVM that runs real
// Java bytecode in the browser, loaded from Leaning Technologies' CDN under
// the free Community License (non-commercial use). This mirrors usePyodide.ts's
// singleton-loader shape so the two runtimes behave consistently across the site.
//
// Unlike Pyodide, CheerpJ is not asked to compile source in the browser —
// in-browser javac discovery turned out not to be reliably reachable via any
// guessed classpath in real testing. Instead, scripts/compile-java-runnables.mjs
// compiles every runnable snippet at build time with a real javac and ships
// the .class files as static assets under public/java-runnable/<mainClass>/.
// CheerpJ only ever has to do the thing it's actually built and documented
// for: run pre-compiled bytecode via the "/app/" prefix, which maps to files
// served from the site's own origin.
//
// The exact URL /app/ resolves against (relative to the currently loaded
// document vs. the site origin + Vite's base path) couldn't be confirmed
// against live docs when this was written, so runMainWithFallback tries a
// couple of reasonable candidates and keeps whichever one actually finds
// the class, rather than failing outright on a single wrong guess.

declare global {
  interface Window {
    cheerpjInit: (config?: Record<string, unknown>) => Promise<void>;
    cheerpjRunMain: (mainClass: string, classpath: string, ...args: string[]) => Promise<number>;
  }
}

const CHEERPJ_LOADER_URL = 'https://cjrtnc.leaningtech.com/4.3/loader.js';
const RUN_TIMEOUT_MS = 30000;
const CLASS_NOT_FOUND_MARKER = 'Could not find or load main class';

function classpathCandidates(mainClass: string): string[] {
  const base = import.meta.env.BASE_URL; // e.g. "/" in dev, "/maths-learn/" in prod
  return [
    `/app${base}java-runnable/${mainClass}/`,
    `/app/java-runnable/${mainClass}/`,
  ];
}

export interface CheerpjHookState {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  runCompiled: (mainClassName: string) => Promise<string>;
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

  const runCompiled = async (mainClassName: string): Promise<string> => {
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
      let workingResult: { exitCode: number; classpath: string } | null = null;

      for (const classpath of classpathCandidates(mainClassName)) {
        capturedLines.length = 0;
        const exitCode = await withTimeout(
          window.cheerpjRunMain(mainClassName, classpath),
          RUN_TIMEOUT_MS,
          `Timed out running ${mainClassName}.`
        );
        const notFound = capturedLines.some((line) => line.includes(CLASS_NOT_FOUND_MARKER));
        if (!notFound) {
          workingResult = { exitCode, classpath };
          break;
        }
      }

      if (!workingResult) {
        outputRef.current = capturedLines.join('\n') || `Could not find the compiled class ${mainClassName}.`;
        setOutput(outputRef.current);
        return outputRef.current;
      }

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

  return { isLoading, isReady, error, runCompiled, output, running, clearOutput };
};
