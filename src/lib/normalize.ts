import { FIELD_ORDER } from './form';
import type { FormValues, ValidatedField } from './form';

export const collapseWhitespace = (value: string) => value.trim().replace(/\s+/g, ' ');

export const normalizeEmail = (raw: string) => raw.trim().toLowerCase();

/** Reduce any pasted phone format to national digits only. */
export function normalizePhone(countryCode: string, raw: string): string {
  const codeDigits = countryCode.replace(/\D/g, '');
  const digits = raw.replace(/\D/g, '');
  if (raw.trim().startsWith('+') && digits.startsWith(codeDigits)) {
    return digits.slice(codeDigits.length);
  }
  if (countryCode === '+91' && digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (countryCode === '+91' && digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

/** Display format applied on blur, e.g. "98765 43210" for Indian numbers. */
export function formatPhone(countryCode: string, raw: string): string {
  const digits = normalizePhone(countryCode, raw);
  if (countryCode === '+91' && digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return digits;
}

export function maskEmail(email: string): string {
  const [local = '', domain = ''] = email.split('@');
  return `${local.charAt(0)}***@${domain}`;
}

/** Tidy one field the way it should be stored once the user leaves it. */
export function tidyField(values: FormValues, field: ValidatedField): FormValues {
  switch (field) {
    case 'phone':
      return { ...values, phone: formatPhone(values.countryCode, values.phone) };
    case 'email':
      return { ...values, email: normalizeEmail(values.email) };
    case 'fullName':
    case 'college':
    case 'department':
      return { ...values, [field]: collapseWhitespace(values[field]) };
    default:
      return values;
  }
}

export const tidyAll = (values: FormValues): FormValues =>
  FIELD_ORDER.reduce<FormValues>((current, field) => tidyField(current, field), values);
