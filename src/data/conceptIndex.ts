import type { ContentBlock, ProbabilityConcept } from './probabilityConceptsData';
import { probabilityConcepts } from './probabilityConceptsData';
import { ch2Concepts } from './ch2ConceptsData';
import { ch3Concepts } from './ch3ConceptsData';
import { ch4Concepts } from './ch4ConceptsData';
import { ch5Concepts } from './ch5ConceptsData';
import { ch6Concepts } from './ch6ConceptsData';
import { ch7Concepts } from './ch7ConceptsData';
import { ch8Concepts } from './ch8ConceptsData';

export interface ConceptIndexEntry {
  id: string;
  title: string;
  chapterRef: string;
  route: string;
}

const CHAPTER_GROUPS: Array<{ concepts: ProbabilityConcept[]; routeBase: string }> = [
  { concepts: probabilityConcepts, routeBase: '/concepts' },
  { concepts: ch2Concepts,         routeBase: '/ch2' },
  { concepts: ch3Concepts,         routeBase: '/ch3' },
  { concepts: ch4Concepts,         routeBase: '/ch4' },
  { concepts: ch5Concepts,         routeBase: '/ch5' },
  { concepts: ch6Concepts,         routeBase: '/ch6' },
  { concepts: ch7Concepts,         routeBase: '/ch7' },
  { concepts: ch8Concepts,         routeBase: '/ch8' },
];

const buildIndex = (): Map<string, ConceptIndexEntry> => {
  const map = new Map<string, ConceptIndexEntry>();
  for (const { concepts, routeBase } of CHAPTER_GROUPS) {
    for (const c of concepts) {
      map.set(c.id, {
        id: c.id,
        title: c.title,
        chapterRef: c.chapterRef,
        route: `${routeBase}/${c.id}`,
      });
    }
  }
  return map;
};

export const CONCEPT_INDEX: Map<string, ConceptIndexEntry> = buildIndex();

export const getConceptEntry = (id: string): ConceptIndexEntry | undefined =>
  CONCEPT_INDEX.get(id);

// Regex that finds [[id]] or [[id|display text]] tokens.
// Group 1 = id, group 2 = optional display text.
export const WIKILINK_RE = /\[\[([^\]|\s][^\]|]*?)(?:\|([^\]]+))?\]\]/g;

const extractWikilinkIdsFromString = (s: string | undefined, into: Set<string>): void => {
  if (!s) return;
  WIKILINK_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = WIKILINK_RE.exec(s)) !== null) {
    into.add(m[1].trim());
  }
};

const collectBlockStrings = (block: ContentBlock): string[] => {
  const parts: string[] = [];
  if (block.content) parts.push(block.content);
  if (block.text) parts.push(block.text);
  if (block.body) parts.push(block.body);
  if (block.question) parts.push(block.question);
  if (block.reveal) parts.push(block.reveal);
  if (block.title) parts.push(block.title);
  return parts;
};

export const getOutgoingLinks = (concept: ProbabilityConcept): string[] => {
  const ids = new Set<string>();
  if (concept.hook) extractWikilinkIdsFromString(concept.hook, ids);
  for (const section of concept.sections) {
    for (const block of section.blocks) {
      for (const str of collectBlockStrings(block)) {
        extractWikilinkIdsFromString(str, ids);
      }
    }
  }
  ids.delete(concept.id); // no self-links
  return Array.from(ids);
};

// Backlinks: scan every concept in every chapter for [[targetId]] references.
// Concept count is small (~50), so a linear scan per page render is fine.
export const getBacklinks = (targetId: string): ConceptIndexEntry[] => {
  const results: ConceptIndexEntry[] = [];
  for (const { concepts, routeBase } of CHAPTER_GROUPS) {
    for (const c of concepts) {
      if (c.id === targetId) continue;
      const outgoing = getOutgoingLinks(c);
      if (outgoing.includes(targetId)) {
        results.push({
          id: c.id,
          title: c.title,
          chapterRef: c.chapterRef,
          route: `${routeBase}/${c.id}`,
        });
      }
    }
  }
  return results;
};
