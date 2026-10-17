import type { ReactNode } from 'react';
import { cx } from '../lib/cx';
import { AlertIcon, CheckIcon } from './Icons';
import { FieldError } from './FieldError';

export interface ControlProps {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': true | undefined;
  required: true;
}

interface FieldProps {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string | undefined;
  /** Rendered below hint and error (e.g. suggestions, requirement lists). */
  extra?: ReactNode;
  /** Id of the element rendered via `extra`, so the control can reference it. */
  extraId?: string;
  className?: string;
  children: (control: ControlProps) => ReactNode;
}

/** Label, control slot, hint and error with correct ARIA wiring. */
export function Field({
  id,
  label,
  hint,
  error,
  extra,
  extraId,
  className,
  children,
}: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId, extraId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx('field', error && 'field--invalid', className)}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        required: true,
      })}
      {hint ? (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      ) : null}
      {error && errorId ? <FieldError id={errorId} message={error} /> : null}
      {extra}
    </div>
  );
}

export function ControlStatus({ valid, invalid }: { valid?: boolean; invalid?: boolean }) {
  if (invalid) return <AlertIcon className="control__status control__status--invalid" />;
  if (valid) return <CheckIcon className="control__status control__status--valid" />;
  return null;
}
