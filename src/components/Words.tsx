import { Fragment, type CSSProperties } from 'react';
import { InlineHeart } from './InlineHeart';

/**
 * Renders a string from content/text.ts: `\n` becomes a designed line break,
 * `*words*` become italics, and a trailing 🩷 becomes a small soft heart.
 * Each line is its own span so it can be revealed on its own.
 */
export function Words({ text }: { text: string }) {
  const heart = /\s*🩷\s*$/.test(text);
  const clean = text.replace(/\s*🩷\s*$/, '');
  const lines = clean.split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="w-line" style={{ '--i': i } as CSSProperties}>
          {line.split(/(\*[^*]+\*)/g).map((part, j) =>
            part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
              <em key={j}>{part.slice(1, -1)}</em>
            ) : (
              <Fragment key={j}>{part}</Fragment>
            ),
          )}
          {heart && i === lines.length - 1 && <InlineHeart />}
        </span>
      ))}
    </>
  );
}
