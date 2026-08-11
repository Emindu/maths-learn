import { useEffect, useRef, useState } from 'react';

// CheerpJ (https://cheerpj.com) is a WebAssembly-based JVM that runs real
// Java bytecode in the browser, loaded from Leaning Technologies' CDN under
// the free Community License (non-commercial use). This mirrors usePyodide.ts's
// singleton-loader shape so the two runtimes behave consistently across the site.
//
// Two things confirmed wrong by a live-browser test and fixed here:
//  1. CheerpJ's "/str/" virtual filesystem (used to inject source by string
//     content) is flat — it rejects subdirectories ("Directories are not
//     supported"). Source files must live directly under /str/, e.g.
//     "/str/Main.java", not "/str/playground/Main.java".
//  2. CheerpJ 4.x bundles a modern (Java 9+) modular JDK, where javac lives in
//     the jdk.compiler module and is resolvable without an explicit tools.jar
//     classpath entry (that convention is a pre-Java-9 relic). Since this
//     couldn't be double-checked against current docs either, runMainWithFallback
//     below tries the classpath-free case first and only falls back to legacy
//     tools.jar-style paths if that specific failure mode shows up in the
//     captured output — so a wrong guess self-corrects instead of just failing.

declare global {
  interface Window {
    cheerpjInit: (config?: Record<string, unknown>) => Promise<void>;
    cheerpjRunMain: (mainClass: string, classpath: string, ...args: string[]) => Promise<number>;
    cheerpOSAddStringFile: (path: string, content: string) => void;
  }
}

const CHEERPJ_LOADER_URL = 'https://cjrtnc.leaningtech.com/4.3/loader.js';
const JDK_CLASSPATH_CANDIDATES = ['/', '/app/tools.jar', '/app/lib/tools.jar'];
const RUN_TIMEOUT_MS = 30000;
const CLASS_NOT_FOUND_MARKER = 'Could not find or load main class';

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

/**
 * Runs a main class, trying each candidate classpath in turn until one
 * doesn't produce a "could not find or load main class" failure. Returns the
 * exit code, the captured output lines for that attempt, and which classpath
 * worked (useful for narrowing JDK_CLASSPATH_CANDIDATES down to one value
 * once a working one is confirmed).
 */
async function runMainWithFallback(
  mainClass: string,
  candidates: string[],
  args: string[],
  captureLines: () => string[],
  resetCapture: () => void
): Promise<{ exitCode: number; workingClasspath: string | null }> {
  let lastExitCode = -1;
  for (const classpath of candidates) {
    resetCapture();
    const exitCode = await withTimeout(
      window.cheerpjRunMain(mainClass, classpath, ...args),
      RUN_TIMEOUT_MS,
      `Timed out running ${mainClass}.`
    );
    lastExitCode = exitCode;
    const notFound = captureLines().some((line) => line.includes(CLASS_NOT_FOUND_MARKER));
    if (!notFound) {
      return { exitCode, workingClasspath: classpath };
    }
  }
  return { exitCode: lastExitCode, workingClasspath: null };
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
      // /str/ (CheerpJ's string-content virtual mount) is flat — no subdirectories.
      const sourcePath = `/str/${mainClassName}.java`;
      const outDir = '/files/out';
      window.cheerpOSAddStringFile(sourcePath, javaSource);

      const resetCapture = () => { capturedLines.length = 0; };

      const compileResult = await runMainWithFallback(
        'com.sun.tools.javac.Main',
        JDK_CLASSPATH_CANDIDATES,
        [sourcePath, '-d', outDir],
        () => capturedLines,
        resetCapture
      );

      if (compileResult.workingClasspath === null) {
        outputRef.current = capturedLines.join('\n') || 'Could not locate the Java compiler (javac) in the runtime.';
        setOutput(outputRef.current);
        return outputRef.current;
      }
      if (compileResult.exitCode !== 0) {
        outputRef.current = capturedLines.join('\n') || 'Compilation failed.';
        setOutput(outputRef.current);
        return outputRef.current;
      }

      const runClasspathCandidates = JDK_CLASSPATH_CANDIDATES.map((cp) => (cp === '/' ? outDir : `${outDir}:${cp}`));
      const runResult = await runMainWithFallback(mainClassName, runClasspathCandidates, [], () => capturedLines, resetCapture);

      if (runResult.workingClasspath === null) {
        outputRef.current = capturedLines.join('\n') || `Could not find or load ${mainClassName} after compiling it.`;
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

  return { isLoading, isReady, error, compileAndRun, output, running, clearOutput };
};
