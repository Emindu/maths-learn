import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getCh2ConceptById } from '../data/ch2ConceptsData';
import { ConceptContent } from './ProbabilityConceptPage';

export const Ch2ConceptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const concept = id ? getCh2ConceptById(id) : undefined;

  if (!concept) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '80px auto',
        textAlign: 'center',
        padding: '0 var(--space-24)',
      }}>
        <h2 style={{ color: 'var(--color-text)', marginBottom: 'var(--space-12)' }}>
          Concept not found
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-24)' }}>
          No Chapter 2 concept with id "{id}" exists.
        </p>
        <Link
          to="/#ch2concepts"
          style={{
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Back to Hub
        </Link>
      </div>
    );
  }

  return <ConceptContent concept={concept} backHref="/#ch2concepts" />;
};
