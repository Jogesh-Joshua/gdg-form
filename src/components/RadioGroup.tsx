import type { FocusEvent } from 'react';
import type { Option } from '../lib/form';
import { cx } from '../lib/cx';
import { FieldError } from './FieldError';

interface RadioGroupProps<T extends string> {
  name: string;
  legend: string;
  options: readonly Option<T>[];
  value: T | '';
  onChange: (value: T) => void;
  /** Called once focus leaves the whole group, not when moving between options. */
  onGroupBlur: () => void;
  error?: string | undefined;
  disabled?: boolean;
  className?: string;
}

export function RadioGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  onGroupBlur,
  error,
  disabled,
  className,
}: RadioGroupProps<T>) {
  const errorId = error ? `${name}-error` : undefined;

  const handleBlur = (event: FocusEvent<HTMLFieldSetElement>) => {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !event.currentTarget.contains(next)) onGroupBlur();
  };

  return (
    <fieldset
      className={cx('choice-group', className)}
      aria-describedby={errorId}
      onBlur={handleBlur}
    >
      <legend className="field__label">{legend}</legend>
      <div className="choices" data-invalid={error ? 'true' : undefined}>
        {options.map((option) => {
          const optionId = `${name}-${option.value}`;
          return (
            <label key={option.value} className="chip" htmlFor={optionId}>
              <input
                id={optionId}
                className="chip__input"
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                disabled={disabled}
                required
                aria-invalid={error ? true : undefined}
                onChange={() => onChange(option.value)}
              />
              <span className="chip__ui">
                <span className="chip__dot" aria-hidden="true" />
                <span>{option.label}</span>
              </span>
            </label>
          );
        })}
      </div>
      {error && errorId ? <FieldError id={errorId} message={error} /> : null}
    </fieldset>
  );
}
