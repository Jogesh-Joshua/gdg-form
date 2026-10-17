import type { ValidatedField } from './form';

/**
 * A stand-in for a registration endpoint. There is no backend in this project:
 * nothing is sent anywhere and nothing is stored.
 *
 * Two addresses exercise the failure paths so they can be reviewed:
 *   taken@example.com   -> field-level error on the email field
 *   offline@example.com -> network failure with a retry banner
 */

export interface RegistrationPayload {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  gender: string;
}

export interface RegistrationReceipt {
  registrationId: string;
}

export class RegistrationError extends Error {
  readonly kind: 'field' | 'network';
  readonly field?: ValidatedField;

  constructor(kind: 'field' | 'network', message: string, field?: ValidatedField) {
    super(message);
    this.name = 'RegistrationError';
    this.kind = kind;
    if (field) this.field = field;
  }
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function createRegistrationId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const code = Array.from(bytes, (byte) => ID_ALPHABET.charAt(byte % ID_ALPHABET.length)).join('');
  return `DS-${code.slice(0, 3)}-${code.slice(3)}`;
}

export async function submitRegistration(
  payload: RegistrationPayload,
): Promise<RegistrationReceipt> {
  await wait(1600);

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new RegistrationError('network', 'No connection.');
  }
  if (payload.email === 'offline@example.com') {
    throw new RegistrationError('network', 'The request could not reach the server.');
  }
  if (payload.email === 'taken@example.com') {
    throw new RegistrationError(
      'field',
      'This email is already registered. Use a different address.',
      'email',
    );
  }
  return { registrationId: createRegistrationId() };
}
