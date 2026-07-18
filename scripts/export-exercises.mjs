/**
 * Export per-concept exercise data as static JSON files so they can be
 * fetched from the GitHub Pages URL, e.g.:
 *
 *   https://emindu.github.io/maths-learn/api/exercises/index.json
 *   https://emindu.github.io/maths-learn/api/exercises/probability-models.json
 *
 * Runs automatically as part of `npm run build`. Output goes to public/api/,
 * which Vite copies verbatim into dist/.
 */
import { build } from 'esbuild';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, 'public', 'api', 'exercises');
const tmpBundle = path.join(root, 'node_modules', '.tmp-export-exercises.mjs');

// Bundle the TS data module to plain ESM so node can import it directly.
await build({
  entryPoints: [path.join(root, 'src', 'data', 'exercises', 'index.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: tmpBundle,
});

const { getConceptResources, conceptIdsWithResources } = await import(pathToFileURL(tmpBundle).href);

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const ids = conceptIdsWithResources().sort();

// One JSON file per concept.
for (const id of ids) {
  const resources = getConceptResources(id);
  await writeFile(
    path.join(outDir, `${id}.json`),
    JSON.stringify({ conceptId: id, ...resources }, null, 2),
  );
}

// Index file listing every concept and how much material each has.
const index = {
  generatedAt: new Date().toISOString(),
  concepts: ids.map(id => {
    const r = getConceptResources(id);
    return {
      conceptId: id,
      url: `${id}.json`,
      counts: {
        mathExercises: r.mathExercises.length,
        pythonExercises: r.pythonExercises.length,
        pythonLabs: r.pythonLabs.length,
      },
    };
  }),
};
await writeFile(path.join(outDir, 'index.json'), JSON.stringify(index, null, 2));

// Single combined file with everything.
const all = Object.fromEntries(ids.map(id => [id, getConceptResources(id)]));
await writeFile(path.join(outDir, 'all.json'), JSON.stringify(all, null, 2));

await rm(tmpBundle, { force: true });
console.log(`Exported ${ids.length} concepts to public/api/exercises/ (index.json, all.json, per-concept files)`);
