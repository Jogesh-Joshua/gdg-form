import { EVENT } from '../config';

export function TermsDetails() {
  return (
    <details className="terms">
      <summary>Read the terms</summary>
      <div className="terms__body">
        <p>
          <strong>Your details.</strong> We use what you submit only to run {EVENT.name}:
          confirming your seat, sending event updates and grouping you with the right sessions.
        </p>
        <p>
          <strong>Accuracy.</strong> Give accurate information. We may cancel a registration that
          uses someone else&rsquo;s identity.
        </p>
        <p>
          <strong>Conduct.</strong> Treat attendees, speakers and organizers with respect.
          Harassment of any kind can end your participation.
        </p>
        <p>
          <strong>Your choices.</strong> You can ask us to update or delete your registration at
          any time.
        </p>
      </div>
    </details>
  );
}
