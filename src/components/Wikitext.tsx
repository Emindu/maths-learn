import React from 'react';
import { Link } from 'react-router-dom';
import { CONCEPT_INDEX, WIKILINK_RE } from '../data/conceptIndex';

interface WikitextProps {
  text?: string;
  as?: 'span' | 'p';
  // Applies to the outer element only. Link styling is inline below.
  style?: React.CSSProperties;
  className?: string;
}

// Renders a string with [[id]] / [[id|display text]] tokens turned into
// react-router <Link>s. Unknown ids get a dotted, muted "broken link" style
// so authors can spot typos and unfilled stubs.
export const Wikitext: React.FC<WikitextProps> = ({ text, as = 'span', style, className }) => {
  const Wrapper = as;
  if (!text) return <Wrapper style={style} className={className} />;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  WIKILINK_RE.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = WIKILINK_RE.exec(text)) !== null) {
    const [full, rawId, rawDisplay] = match;
    const start = match.index;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    const id = rawId.trim();
    const entry = CONCEPT_INDEX.get(id);
    const display = (rawDisplay ?? entry?.title ?? id).trim();

    if (entry) {
      parts.push(
        <Link
          key={`wl-${key++}`}
          to={entry.route}
          title={`${entry.title} — ${entry.chapterRef}`}
          style={{
            color: 'var(--color-primary)',
            textDecoration: 'none',
            borderBottom: '1px dashed var(--color-primary)',
            paddingBottom: '1px',
          }}
        >
          {display}
        </Link>
      );
    } else {
      parts.push(
        <span
          key={`wl-${key++}`}
          title={`Unlinked: no concept with id "${id}"`}
          style={{
            color: 'var(--color-text-secondary)',
            borderBottom: '1px dotted var(--color-text-secondary)',
            cursor: 'help',
          }}
        >
          {display}
        </span>
      );
    }

    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return (
    <Wrapper style={style} className={className}>
      {parts}
    </Wrapper>
  );
};
