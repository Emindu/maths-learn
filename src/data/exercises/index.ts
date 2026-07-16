/**
 * Unified access point for all per-concept exercise content.
 *
 * Each concept page (identified by its concept id, e.g. 'probability-models')
 * can have three kinds of practice material, one file each in this directory:
 *   - mathExercises.ts    — maths exercises checked in the browser
 *   - pythonExercises.ts  — Python coding exercises run via Pyodide
 *   - pythonLabs.ts       — pre-coded Python demos with matplotlib output
 *
 * Import from this module rather than the individual files:
 *   import { getConceptResources } from '../data/exercises';
 *   const { mathExercises, pythonExercises, pythonLabs } = getConceptResources(id);
 */

export type { Exercise, ExercisePart, DifficultyLevel, AnswerType } from './mathExercises';
export type { PythonExercise } from './pythonExercises';
export type { PythonLabDemo } from './pythonLabs';

export { exercisesByConceptId } from './mathExercises';
export { pythonExercisesByConceptId } from './pythonExercises';
export { pythonLabsByConceptId } from './pythonLabs';

import { exercisesByConceptId, Exercise } from './mathExercises';
import { pythonExercisesByConceptId, PythonExercise } from './pythonExercises';
import { pythonLabsByConceptId, PythonLabDemo } from './pythonLabs';

export interface ConceptResources {
  mathExercises: Exercise[];
  pythonExercises: PythonExercise[];
  pythonLabs: PythonLabDemo[];
}

/** All practice material for one concept page, empty arrays when none exists. */
export const getConceptResources = (conceptId: string): ConceptResources => ({
  mathExercises: exercisesByConceptId[conceptId] ?? [],
  pythonExercises: pythonExercisesByConceptId[conceptId] ?? [],
  pythonLabs: pythonLabsByConceptId[conceptId] ?? [],
});

/** Concept ids that have at least one kind of practice material. */
export const conceptIdsWithResources = (): string[] =>
  Array.from(new Set([
    ...Object.keys(exercisesByConceptId),
    ...Object.keys(pythonExercisesByConceptId),
    ...Object.keys(pythonLabsByConceptId),
  ]));
