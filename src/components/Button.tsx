import type { MouseEvent } from 'react';
import { cx } from '../lib/cx';

interface ButtonProps {
  children: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit';
  loading?: boolean;
  onClick?: () => void;
}

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  onClick,
}: ButtonProps) {
  // aria-disabled (not disabled) keeps keyboard focus on the button while loading.
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.();
  };

  return (
    <button
      type={type}
      className={cx('btn', `btn--${variant}`)}
      aria-disabled={loading || undefined}
      onClick={handleClick}
    >
      {loading ? <span className="spinner" aria-hidden="true" /> : null}
      <span key={children} className="btn__label">
        {children}
      </span>
    </button>
  );
}
