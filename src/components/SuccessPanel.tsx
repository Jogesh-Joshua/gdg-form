import { useEffect, useRef } from 'react';
import { keepCardInView } from '../lib/focus';
import { SECTION_IDS } from '../lib/form';
import type { Registration } from '../lib/form';
import { Button } from './Button';
import { SuccessCheckIcon } from './Icons';
import { ProgressBar } from './ProgressBar';

interface SuccessPanelProps {
  registration: Registration;
  onReset: () => void;
}

const COMPLETE_FILLS = SECTION_IDS.map(() => 1);

export function SuccessPanel({ registration, onReset }: SuccessPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    keepCardInView();
  }, []);

  return (
    <div className="success">
      <ProgressBar fills={COMPLETE_FILLS} label="All fields complete" complete />

      <div className="success__icon">
        <SuccessCheckIcon />
      </div>
      <h2 ref={headingRef} className="success__title" tabIndex={-1}>
        You&rsquo;re registered, {registration.firstName}.
      </h2>
      <p className="success__lede">
        Your seat is reserved. Keep your registration ID handy for check-in.
      </p>

      <dl className="summary">
        <div className="summary__row">
          <dt>Name</dt>
          <dd>{registration.fullName}</dd>
        </div>
        <div className="summary__row">
          <dt>Email</dt>
          <dd>{registration.maskedEmail}</dd>
        </div>
        <div className="summary__row">
          <dt>College / organization</dt>
          <dd>{registration.organization}</dd>
        </div>
        <div className="summary__row">
          <dt>Registration ID</dt>
          <dd>
            <code className="id-chip">{registration.id}</code>
          </dd>
        </div>
      </dl>

      <hr className="success__divider" />
      <Button variant="secondary" onClick={onReset}>
        Register another person
      </Button>
    </div>
  );
}
