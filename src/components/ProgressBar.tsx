import type { CSSProperties } from 'react';

interface ProgressBarProps {
  /** One entry per segment, from 0 (empty) to 1 (full). */
  fills: readonly number[];
  label: string;
  complete?: boolean;
}

export function ProgressBar({ fills, label, complete = false }: ProgressBarProps) {
  const percentage = Math.round(
    (fills.reduce((sum, f) => sum + f, 0) / (fills.length || 1)) * 100,
  );

  return (
    <div
      className="progress"
      role="progressbar"
      aria-label="Registration form progress"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      data-complete={complete || undefined}
    >
      <p className="progress__text" aria-hidden="true">{label}</p>
      <div className="progress__bar" aria-hidden="true">
        {fills.map((fill, index) => (
          <span key={index} className="progress__segment">
            <span className="progress__fill" style={{ '--fill': fill, '--index': index } as CSSProperties} />
          </span>
        ))}
      </div>
    </div>
  );
}
