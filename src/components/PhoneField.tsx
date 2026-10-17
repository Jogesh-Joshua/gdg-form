import type { ReactNode } from 'react';
import { COUNTRY_OPTIONS } from '../lib/form';
import { Field, ControlStatus } from './Field';

interface PhoneFieldProps {
  id: string;
  label: string;
  countryCode: string;
  value: string;
  onCountryChange: (code: string) => void;
  onChange: (value: string) => void;
  onBlur: () => void;
  hint?: ReactNode;
  error?: string | undefined;
  valid?: boolean;
  readOnly?: boolean;
  className?: string;
}

export function PhoneField({
  id,
  label,
  countryCode,
  value,
  onCountryChange,
  onChange,
  onBlur,
  hint,
  error,
  valid,
  readOnly,
  className,
}: PhoneFieldProps) {
  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      {(control) => (
        <div className="phone">
          <select
            className="input select"
            name="countryCode"
            aria-label="Country code"
            autoComplete="tel-country-code"
            value={countryCode}
            disabled={readOnly}
            onChange={(event) => onCountryChange(event.target.value)}
          >
            {COUNTRY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="control">
            <input
              {...control}
              className="input input--status"
              name={id}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              maxLength={20}
              value={value}
              readOnly={readOnly}
              onChange={(event) => onChange(event.target.value.replace(/[^\d\s()+-]/g, ''))}
              onBlur={onBlur}
            />
            <ControlStatus invalid={Boolean(error)} valid={Boolean(valid)} />
          </div>
        </div>
      )}
    </Field>
  );
}
