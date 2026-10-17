import { FIELD_ORDER } from './form';
import type { FormErrors, FormValues, ValidatedField } from './form';
import { normalizeEmail, normalizePhone } from './normalize';

const NAME_PATTERN = /^\p{L}[\p{L}\p{M} .'’-]*$/u;
const EMAIL_PATTERN =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;

export const isValidEmail = (email: string) => email.length <= 254 && EMAIL_PATTERN.test(email);

/* Password rules: one list drives both the live checklist and the error messages. */

interface PasswordRule {
  id: 'length' | 'letter' | 'number' | 'email';
  label: string;
  message: string;
  passes: (password: string, email: string) => boolean;
}

function containsEmailName(password: string, email: string): boolean {
  const name = normalizeEmail(email).split('@')[0] ?? '';
  return name.length >= 4 && password.toLowerCase().includes(name);
}

const PASSWORD_RULES: readonly PasswordRule[] = [
  {
    id: 'length',
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    message: `Use at least ${PASSWORD_MIN_LENGTH} characters.`,
    passes: (password) => password.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: 'letter',
    label: 'A letter',
    message: 'Add at least one letter.',
    passes: (password) => /\p{L}/u.test(password),
  },
  {
    id: 'number',
    label: 'A number',
    message: 'Add at least one number.',
    passes: (password) => /\d/.test(password),
  },
  {
    id: 'email',
    label: 'Does not include your email name',
    message: "Don't use your email name in your password.",
    passes: (password, email) => !containsEmailName(password, email),
  },
];

export interface PasswordCheck {
  id: PasswordRule['id'];
  label: string;
  met: boolean;
}

export function passwordChecks(password: string, email: string): PasswordCheck[] {
  return PASSWORD_RULES.map(({ id, label, passes }) => ({
    id,
    label,
    // Nothing typed yet means nothing can be "met", including the negative rule.
    met: password.length > 0 && passes(password, email),
  }));
}

export type PasswordStrength = 'weak' | 'okay' | 'strong';

export function passwordStrength(password: string, email: string): PasswordStrength {
  if (!passwordChecks(password, email).every((check) => check.met)) return 'weak';
  const points =
    Number(password.length >= 12) +
    Number(/\p{Ll}/u.test(password) && /\p{Lu}/u.test(password)) +
    Number(/[^\p{L}\d\s]/u.test(password));
  return points >= 2 ? 'strong' : 'okay';
}

function validatePassword(password: string, email: string): string | null {
  if (!password) return 'Create a password.';
  if (password !== password.trim()) return 'Remove spaces from the start and end of your password.';
  const failed = PASSWORD_RULES.find((rule) => !rule.passes(password, email));
  if (failed) return failed.message;
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Use ${PASSWORD_MAX_LENGTH} characters or fewer.`;
  }
  return null;
}

/* Field validators */

function validateText(value: string, empty: string, max: number): string | null {
  const text = value.trim();
  if (!text) return empty;
  if (text.length < 2) return 'Use at least 2 characters.';
  if (text.length > max) return `Use ${max} characters or fewer.`;
  return null;
}

function validatePhone(countryCode: string, phone: string): string | null {
  if (!phone.trim()) return 'Enter your phone number.';
  const digits = normalizePhone(countryCode, phone);
  if (countryCode === '+91') {
    if (digits.length !== 10) return 'Enter a 10-digit mobile number.';
    if (!/^[6-9]/.test(digits)) return 'Indian mobile numbers start with 6, 7, 8 or 9.';
    return null;
  }
  if (digits.length < 6 || digits.length > 14) return 'Enter a number with 6 to 14 digits.';
  return null;
}

type Validator = (values: FormValues) => string | null;

const validators: Record<ValidatedField, Validator> = {
  fullName: ({ fullName }) => {
    const message = validateText(fullName, 'Enter your full name.', 60);
    if (message) return message;
    return NAME_PATTERN.test(fullName.trim())
      ? null
      : 'Names can only include letters, spaces, hyphens and apostrophes.';
  },
  email: ({ email }) => {
    const value = normalizeEmail(email);
    if (!value) return 'Enter your email address.';
    return isValidEmail(value)
      ? null
      : "That email doesn't look right. Check for a missing @ or domain.";
  },
  phone: ({ countryCode, phone }) => validatePhone(countryCode, phone),
  college: ({ college }) => validateText(college, 'Enter your college or organization.', 100),
  department: ({ department }) => validateText(department, 'Enter your department or field of study.', 60),
  year: ({ year }) => (year ? null : 'Select your year of study.'),
  gender: ({ gender }) => (gender ? null : 'Select an option. “Prefer not to say” is fine.'),
  password: ({ password, email }) => validatePassword(password, email),
  confirmPassword: ({ password, confirmPassword }) => {
    if (!confirmPassword) return 'Confirm your password.';
    return confirmPassword === password ? null : "Passwords don't match.";
  },
  terms: ({ terms }) => (terms ? null : 'You need to accept the terms to register.'),
};

export const validateField = (field: ValidatedField, values: FormValues): string | null =>
  validators[field](values);

export function validateAll(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  for (const field of FIELD_ORDER) {
    const message = validateField(field, values);
    if (message) errors[field] = message;
  }
  return errors;
}
