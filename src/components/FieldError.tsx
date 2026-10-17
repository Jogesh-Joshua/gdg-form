import { AlertIcon } from './Icons';

interface FieldErrorProps {
  id: string;
  message: string;
}

/** The outer element animates its own height, so mounting an error eases the layout down. */
export function FieldError({ id, message }: FieldErrorProps) {
  return (
    <div className="field-error">
      <p id={id} className="field__error">
        <AlertIcon />
        <span>{message}</span>
      </p>
    </div>
  );
}
