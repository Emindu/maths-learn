import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Link2 } from 'lucide-react';
import type { ProbabilityConcept } from '../data/probabilityConceptsData';
import { CONCEPT_INDEX, getOutgoingLinks, getBacklinks, type ConceptIndexEntry } from '../data/conceptIndex';

interface RelatedConceptsProps {
  concept: ProbabilityConcept;
}

const LinkRow: React.FC<{ entry: ConceptIndexEntry; direction: 'out' | 'in' }> = ({ entry, direction }) => {
  const Icon = direction === 'out' ? ArrowRight : ArrowLeft;
  return (
    <li style={{ margin: '6px 0', listStyle: 'none' }}>
      <Link
        to={entry.route}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--color-text)',
          textDecoration: 'none',
          padding: '4px 0',
        }}
      >
        <Icon size={13} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
        <span style={{ borderBottom: '1px dashed var(--color-primary)', color: 'var(--color-primary)' }}>
          {entry.title}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
          · {entry.chapterRef}
        </span>
      </Link>
    </li>
  );
};

export const RelatedConcepts: React.FC<RelatedConceptsProps> = ({ concept }) => {
  const { outgoing, backlinks } = useMemo(() => {
    const outIds = getOutgoingLinks(concept);
    const outgoingEntries = outIds
      .map(id => CONCEPT_INDEX.get(id))
      .filter((e): e is ConceptIndexEntry => !!e);
    return {
      outgoing: outgoingEntries,
      backlinks: getBacklinks(concept.id),
    };
  }, [concept]);

  if (outgoing.length === 0 && backlinks.length === 0) return null;

  return (
    <section style={{
      marginTop: 'var(--space-32)',
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '10px',
      padding: 'var(--space-20) var(--space-24)',
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--space-12)',
      }}>
        <Link2 size={13} /> Related concepts
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'var(--space-24)',
      }}>
        {outgoing.length > 0 && (
          <div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: '6px',
            }}>
              Links out
            </div>
            <ul style={{ margin: 0, padding: 0 }}>
              {outgoing.map(e => <LinkRow key={e.id} entry={e} direction="out" />)}
            </ul>
          </div>
        )}

        {backlinks.length > 0 && (
          <div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: '6px',
            }}>
              Linked from
            </div>
            <ul style={{ margin: 0, padding: 0 }}>
              {backlinks.map(e => <LinkRow key={e.id} entry={e} direction="in" />)}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
