import type { ReactNode } from 'react';
import { FieldError } from './FieldError';
import { TickIcon } from './Icons';

interface CheckboxFieldProps {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onBlur: () => void;
  error?: string | undefined;
  disabled?: boolean;
  children?: ReactNode;
}

export function CheckboxField({
  id,
  label,
  checked,
  onChange,
  onBlur,
  error,
  disabled,
  children,
}: CheckboxFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="check-field">
      <label className="check" htmlFor={id} data-invalid={error ? 'true' : undefined}>
        <input
          id={id}
          className="check__input"
          type="checkbox"
          name={id}
          checked={checked}
          disabled={disabled}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          onChange={(event) => onChange(event.target.checked)}
          onBlur={onBlur}
        />
        <span className="check__box" aria-hidden="true">
          <TickIcon width={14} height={14} />
        </span>
        <span className="check__label">{label}</span>
      </label>
      {children}
      {error && errorId ? <FieldError id={errorId} message={error} /> : null}
    </div>
  );
}
