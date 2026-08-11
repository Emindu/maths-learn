import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Code2, ExternalLink, ListChecks, Sparkles, Copy, Check } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';
import {
  getInterviewPatternById,
  getNextInterviewPattern,
  CodeTemplate,
} from '../data/interviewPatternsData';
import { VizSlidingWindowDynamic, VizSlidingWindowFixed } from '../visualizations/VizSlidingWindow';
import { VizTwoPointers } from '../visualizations/VizTwoPointers';
import { VizFastSlowPointers } from '../visualizations/VizFastSlowPointers';
import { VizLinkedListReversal } from '../visualizations/VizLinkedListReversal';
import { VizBinarySearch } from '../visualizations/VizBinarySearch';
import { VizTopKElements } from '../visualizations/VizTopKElements';
import { VizTreeTraversal } from '../visualizations/VizTreeTraversal';
import { VizGraphsMatrices } from '../visualizations/VizGraphsMatrices';
import { VizBacktracking } from '../visualizations/VizBacktracking';
import { useTheme } from '../components/Layout';

const VIZ_REGISTRY: Record<string, React.ComponentType> = {
  'viz-sliding-window': () => (
    <>
      <VizSlidingWindowDynamic />
      <VizSlidingWindowFixed />
    </>
  ),
  'viz-two-pointers': VizTwoPointers,
  'viz-fast-slow-pointers': VizFastSlowPointers,
  'viz-linked-list-reversal': VizLinkedListReversal,
  'viz-binary-search': VizBinarySearch,
  'viz-top-k-elements': VizTopKElements,
  'viz-tree-traversal': VizTreeTraversal,
  'viz-graphs-matrices': VizGraphsMatrices,
  'viz-backtracking': VizBacktracking,
};

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 style={{
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--color-text)',
    marginBottom: 'var(--space-14)',
    paddingBottom: 'var(--space-8)',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-8)',
  }}>
    {children}
  </h2>
);

const CodeBlock: React.FC<{ template: CodeTemplate }> = ({ template }) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(template.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  };
  return (
    <div style={{ marginBottom: 'var(--space-28)' }}>
      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>{template.title}</div>

      {template.problem && (
        <div style={{
          borderLeft: '3px solid var(--color-primary)',
          background: 'var(--color-surface)',
          borderRadius: '0 8px 8px 0',
          padding: '10px 14px',
          marginBottom: '10px',
        }}>
          <div style={{
            fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
            color: 'var(--color-primary)', marginBottom: '4px',
          }}>
            Problem
          </div>
          <div style={{ fontSize: '0.86rem', color: 'var(--color-text)', lineHeight: 1.6 }}>{template.problem}</div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
        <button
          onClick={copy}
          className="btn btn--outline btn--sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px' }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <Highlight code={template.code.trimEnd()} language="java" theme={theme === 'dark' ? themes.vsDark : themes.vsLight}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre style={{
            ...style,
            margin: 0,
            overflowX: 'auto',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '14px 16px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.82rem',
            lineHeight: 1.6,
          }}>
            {tokens.map((line, i) => {
              const { key: lineKey, ...lineProps } = getLineProps({ line, key: i });
              return (
                <div key={i} {...lineProps}>
                  <span style={{ display: 'inline-block', width: '1.8em', opacity: 0.35, userSelect: 'none' }}>{i + 1}</span>
                  {line.map((token, tIdx) => {
                    const { key: tokenKey, ...tokenProps } = getTokenProps({ token, key: tIdx });
                    return <span key={tIdx} {...tokenProps} />;
                  })}
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export const InterviewPatternPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pattern = id ? getInterviewPatternById(id) : undefined;

  if (!pattern) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 var(--space-24)' }}>
        <h2 style={{ color: 'var(--color-text)', marginBottom: 'var(--space-12)' }}>Pattern not found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-24)' }}>No interview pattern with id "{id}" exists.</p>
        <Link to="/#interview-patterns" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>← Back to Hub</Link>
      </div>
    );
  }

  const { content } = pattern;
  const next = getNextInterviewPattern(pattern.id);
  const VizComp = content?.vizId ? VIZ_REGISTRY[content.vizId] : null;

  return (
    <div style={{ maxWidth: 'var(--container-2xl)', margin: '0 auto', padding: '0 var(--space-24)' }}>

      <div style={{ paddingTop: 'var(--space-24)', marginBottom: 'var(--space-16)' }}>
        <Link
          to="/#interview-patterns"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-6)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', textDecoration: 'none' }}
        >
          <ArrowLeft size={14} /> Back to Hub
        </Link>
      </div>

      <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-24)', marginBottom: 'var(--space-32)' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 'var(--space-6)',
          fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'var(--color-text-secondary)', marginBottom: 'var(--space-12)',
        }}>
          <Code2 size={13} /> Pattern {pattern.order} of 14 · Programming Interview Patterns
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2, margin: 0 }}>
          {pattern.title}
        </h1>
        <p style={{ marginTop: 'var(--space-12)', fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: '680px' }}>
          {pattern.shortDesc}
        </p>
      </div>

      {!content ? (
        <div style={{
          background: 'var(--color-surface)', border: '1px dashed var(--color-border)', borderRadius: '12px',
          padding: 'var(--space-32)', textAlign: 'center', marginBottom: 'var(--space-48)',
        }}>
          <Sparkles size={22} style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-10)' }} />
          <p style={{ color: 'var(--color-text)', fontWeight: 600, margin: 0 }}>Coming soon</p>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-6)', maxWidth: '480px', marginInline: 'auto' }}>
            The full write-up and interactive visualization for this pattern haven't been built yet.
            Check back soon, or explore <Link to="/interview/sliding-window" style={{ color: 'var(--color-primary)' }}>Sliding Window</Link>, which is fully built out.
          </p>
        </div>
      ) : (
        <div style={{ maxWidth: '880px' }}>
          <div style={{ marginBottom: 'var(--space-40)' }}>
            <SectionHeading><ListChecks size={16} /> When to use it</SectionHeading>
            <ul style={{ margin: 0, paddingLeft: '1.3em', color: 'var(--color-text)', lineHeight: 1.8 }}>
              {content.whenToUse.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>

          <div style={{ marginBottom: 'var(--space-40)' }}>
            <SectionHeading>Technique</SectionHeading>
            <p style={{ color: 'var(--color-text)', lineHeight: 1.8, margin: 0 }}>{content.technique}</p>

            {content.variants && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-14)', marginTop: 'var(--space-16)' }}>
                {content.variants.map((v, i) => (
                  <div key={i} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: 'var(--space-14) var(--space-16)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>{v.title}</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{v.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {VizComp && (
            <div style={{ marginBottom: 'var(--space-40)' }}>
              <SectionHeading><Sparkles size={16} /> Interactive visualization</SectionHeading>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
                <VizComp />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 'var(--space-40)' }}>
            <SectionHeading><Code2 size={16} /> Code templates (Java)</SectionHeading>
            {content.codeTemplates.map((tpl, i) => <CodeBlock key={i} template={tpl} />)}
          </div>

          <div style={{ marginBottom: 'var(--space-40)' }}>
            <SectionHeading><ExternalLink size={16} /> Practice on LeetCode</SectionHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {content.questions.map((q) => (
                <a
                  key={q.number}
                  href={q.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)', color: 'var(--color-text)', textDecoration: 'none',
                    fontSize: '0.92rem', transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                >
                  <span>#{q.number} — {q.title}</span>
                  <ExternalLink size={13} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{
        borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-24)',
        paddingTop: 'var(--space-24)', paddingBottom: 'var(--space-48)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Link to="/#interview-patterns" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-8)', fontSize: '0.9rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
          <ArrowLeft size={14} /> Back to Hub
        </Link>
        {next && (
          <button className="btn btn--primary" onClick={() => navigate(`/interview/${next.id}`)}>
            Next: {next.title} →
          </button>
        )}
      </div>
    </div>
  );
};
