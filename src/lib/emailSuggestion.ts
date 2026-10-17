import { normalizeEmail } from './normalize';
import { isValidEmail } from './validators';

const COMMON_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'proton.me',
  'protonmail.com',
  'live.com',
];

function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = row[0] ?? 0;
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const above = row[j] ?? 0;
      const left = row[j - 1] ?? 0;
      row[j] = Math.min(above + 1, left + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return row[b.length] ?? 0;
}

/** A corrected address when the domain looks like a typo of a common provider. */
export function suggestEmail(raw: string): string | null {
  const email = normalizeEmail(raw);
  if (!isValidEmail(email)) return null;
  const [local = '', domain = ''] = email.split('@');
  if (COMMON_DOMAINS.includes(domain)) return null;
  const match = COMMON_DOMAINS.find((candidate) => editDistance(domain, candidate) <= 2);
  return match ? `${local}@${match}` : null;
}
