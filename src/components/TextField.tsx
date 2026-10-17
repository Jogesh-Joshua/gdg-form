import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { Field, ControlStatus } from './Field';

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  type?: 'text' | 'email';
  hint?: ReactNode;
  error?: string | undefined;
  valid?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  autoCapitalize?: string;
  spellCheck?: boolean;
  maxLength?: number;
  list?: string;
  extra?: ReactNode;
  extraId?: string;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  hint,
  error,
  valid,
  readOnly,
  autoComplete,
  inputMode,
  autoCapitalize,
  spellCheck,
  maxLength,
  list,
  extra,
  extraId,
  className,
  ref,
}: TextFieldProps) {
  return (
    <Field
      id={id}
      label={label}
      hint={hint}
      error={error}
      extra={extra}
      extraId={extraId}
      className={className}
    >
      {(control) => (
        <div className="control">
          <input
            {...control}
            ref={ref}
            className="input input--status"
            name={id}
            type={type}
            value={value}
            readOnly={readOnly}
            autoComplete={autoComplete}
            inputMode={inputMode}
            autoCapitalize={autoCapitalize}
            spellCheck={spellCheck}
            maxLength={maxLength}
            list={list}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
          />
          <ControlStatus invalid={Boolean(error)} valid={Boolean(valid)} />
        </div>
      )}
    </Field>
  );
}
