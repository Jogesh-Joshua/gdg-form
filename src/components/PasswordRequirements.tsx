import { passwordChecks, passwordStrength } from '../lib/validators';
import { CheckIcon, CircleIcon } from './Icons';

interface PasswordRequirementsProps {
  id: string;
  password: string;
  email: string;
}

const STRENGTH_LABEL = { weak: 'Weak', okay: 'Okay', strong: 'Strong' } as const;

export function PasswordRequirements({ id, password, email }: PasswordRequirementsProps) {
  const checks = passwordChecks(password, email);
  const strength = passwordStrength(password, email);

  return (
    <div id={id} className="reqs">
      <p className="reqs__title">Your password needs:</p>
      <ul className="reqs__list">
        {checks.map((check) => (
          <li key={check.id} className="reqs__item" data-met={check.met}>
            {check.met ? <CheckIcon /> : <CircleIcon />}
            <span>
              <span className="sr-only">{check.met ? 'Met: ' : 'Not met: '}</span>
              {check.label}
            </span>
          </li>
        ))}
      </ul>
      {password ? (
        <div className="strength" data-level={strength}>
          <div className="strength__bar" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="strength__label">Strength: {STRENGTH_LABEL[strength]}</p>
        </div>
      ) : null}
    </div>
  );
}
