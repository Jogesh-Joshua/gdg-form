import type { ReactNode } from 'react';
import type { Option } from '../lib/form';
import { cx } from '../lib/cx';
import { Field } from './Field';

interface SelectFieldProps<T extends string> {
  id: string;
  label: string;
  value: T | '';
  placeholder: string;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  onBlur: () => void;
  hint?: ReactNode;
  error?: string | undefined;
  disabled?: boolean;
  className?: string;
}

export function SelectField<T extends string>({
  id,
  label,
  value,
  placeholder,
  options,
  onChange,
  onBlur,
  hint,
  error,
  disabled,
  className,
}: SelectFieldProps<T>) {
  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      {(control) => (
        <div className="control">
          <select
            {...control}
            className={cx('input select', value === '' && 'select--placeholder')}
            name={id}
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value as T)}
            onBlur={onBlur}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </Field>
  );
}
