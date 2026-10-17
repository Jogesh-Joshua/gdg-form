import { useEffect, useRef } from 'react';
import { focusField } from '../lib/focus';
import { FOCUS_TARGET } from '../lib/form';
import type { ErrorSummaryItem } from '../lib/form';

interface ErrorSummaryProps {
  items: readonly ErrorSummaryItem[];
  focusToken: number;
}

export function ErrorSummary({ items, focusToken }: ErrorSummaryProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (focusToken > 0) ref.current?.focus();
  }, [focusToken]);

  if (items.length === 0) return null;

  const title =
    items.length === 1 ? 'Fix 1 thing to continue' : `Fix ${items.length} things to continue`;

  return (
    <section
      ref={ref}
      className="error-summary"
      aria-labelledby="error-summary-title"
      tabIndex={-1}
    >
      <h2 id="error-summary-title" className="error-summary__title">
        {title}
      </h2>
      <ul className="error-summary__list">
        {items.map((item) => (
          <li key={item.field}>
            <a
              href={`#${FOCUS_TARGET[item.field]}`}
              onClick={(event) => {
                event.preventDefault();
                focusField(item.field);
              }}
            >
              {item.label}: {item.message}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
