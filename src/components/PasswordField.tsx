import { useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { Field } from './Field';
import { EyeIcon, EyeOffIcon } from './Icons';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string | undefined;
  readOnly?: boolean;
  extra?: ReactNode;
  extraId?: string;
  className?: string;
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  readOnly,
  extra,
  extraId,
  className,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const trackCapsLock = (event: KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(event.getModifierState('CapsLock'));
  };

  return (
    <Field
      id={id}
      label={label}
      error={error}
      className={className}
      extraId={extraId}
      extra={
        <>
          <div className="field__live" aria-live="polite">
            {capsLock ? <p className="field__note">Caps Lock is on.</p> : null}
          </div>
          {extra}
        </>
      }
    >
      {(control) => (
        <div className="control">
          <input
            {...control}
            className="input input--toggle"
            name={id}
            type={visible ? 'text' : 'password'}
            value={value}
            readOnly={readOnly}
            autoComplete="new-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={trackCapsLock}
            onKeyUp={trackCapsLock}
            onBlur={() => {
              setCapsLock(false);
              onBlur();
            }}
          />
          <button
            type="button"
            className="icon-btn"
            aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            aria-pressed={visible}
            aria-controls={id}
            disabled={readOnly}
            onClick={() => setVisible((current) => !current)}
          >
            <EyeIcon className="icon-btn__eye" />
            <EyeOffIcon className="icon-btn__eye-off" />
          </button>
        </div>
      )}
    </Field>
  );
}
