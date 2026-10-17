import type { ValidatedField } from './form';
import { FOCUS_TARGET } from './form';

/** Scroll a field into view and move keyboard focus to it. */
export function focusField(field: ValidatedField): void {
  const element = document.getElementById(FOCUS_TARGET[field]);
  if (!element) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  element.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  element.focus({ preventScroll: true });
}

/** After a view swap shortens the page, keep the card on screen without a hard jump. */
export function keepCardInView(): void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document
    .getElementById('registration')
    ?.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
}
