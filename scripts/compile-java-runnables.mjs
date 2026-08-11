/**
 * Compiles every runnable Java code template (interviewPatternsData.ts,
 * codeTemplates[].runnable) with a real javac, and writes the resulting
 * .class file(s) to public/java-runnable/<mainClass>/, which Vite copies
 * verbatim into dist/. This runs at build time so the browser-side CheerpJ
 * runtime only ever needs to RUN pre-compiled bytecode — CheerpJ's
 * well-supported, documented use case — instead of also acting as an
 * in-browser javac, which turned out not to be reliably reachable via its
 * bundled JDK's classpath.
 *
 * Fails the build (non-zero exit) if any runnable snippet doesn't compile,
 * so a broken template is caught here rather than silently failing for a
 * site visitor who clicks Run.
 *
 * Requires a JDK's `javac` on PATH (see .github/workflows/deploy.yml).
 */
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile, rm, readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import os from 'node:os';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, 'public', 'java-runnable');
const tmpBundle = path.join(root, 'node_modules', '.tmp-compile-java-runnables.mjs');

// Bundle the TS data module to plain ESM so node can import it directly.
await build({
  entryPoints: [path.join(root, 'src', 'data', 'interviewPatternsData.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: tmpBundle,
});

const { interviewPatterns } = await import(pathToFileURL(tmpBundle).href);

const runnables = [];
for (const pattern of interviewPatterns) {
  for (const tpl of pattern.content?.codeTemplates ?? []) {
    if (tpl.runnable) {
      runnables.push({ patternId: pattern.id, title: tpl.title, code: tpl.code, mainClass: tpl.runnable.mainClass });
    }
  }
}

if (runnables.length === 0) {
  console.log('No runnable Java templates found — skipping compilation.');
  await rm(tmpBundle, { force: true });
  process.exit(0);
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

let failed = false;

for (const r of runnables) {
  const workDir = await mkdirTemp();
  const sourceFile = path.join(workDir, `${r.mainClass}.java`);
  await writeFile(sourceFile, r.code);

  try {
    execFileSync('javac', ['-d', workDir, sourceFile], { stdio: 'pipe' });
  } catch (err) {
    failed = true;
    console.error(`✗ Failed to compile ${r.mainClass} (${r.patternId} — "${r.title}")`);
    console.error(err.stderr?.toString() || err.message);
    await rm(workDir, { recursive: true, force: true });
    continue;
  }

  // Copy every .class file produced (inner/anonymous classes included) into
  // a per-mainClass subdirectory so each snippet's classpath stays isolated.
  const classDir = path.join(outDir, r.mainClass);
  await mkdir(classDir, { recursive: true });
  const produced = (await readdir(workDir)).filter((f) => f.endsWith('.class'));
  for (const file of produced) {
    const { copyFile } = await import('node:fs/promises');
    await copyFile(path.join(workDir, file), path.join(classDir, file));
  }
  console.log(`✓ Compiled ${r.mainClass} (${produced.length} class file${produced.length === 1 ? '' : 's'})`);

  await rm(workDir, { recursive: true, force: true });
}

await rm(tmpBundle, { force: true });

if (failed) {
  console.error('\nOne or more runnable Java templates failed to compile. Fix the source before building.');
  process.exit(1);
}

console.log(`\nCompiled ${runnables.length} runnable Java template(s) to public/java-runnable/`);

async function mkdirTemp() {
  const dir = path.join(os.tmpdir(), `java-runnable-${Math.random().toString(36).slice(2)}`);
  await mkdir(dir, { recursive: true });
  return dir;
}
