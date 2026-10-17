import type { ReactNode } from 'react';
import { SECTIONS, SECTION_IDS } from '../lib/form';
import type { SectionId } from '../lib/form';
import { CheckIcon } from './Icons';

interface FormSectionProps {
  id: SectionId;
  done: boolean;
  children: ReactNode;
}

export function FormSection({ id, done, children }: FormSectionProps) {
  const { title, hint } = SECTIONS[id];
  const position = SECTION_IDS.indexOf(id) + 1;

  return (
    <div className="section">
      <fieldset className="section__fieldset">
        <legend className="section__legend">
          <span className="section__marker" data-done={done || undefined} aria-hidden="true">
            {done ? <CheckIcon width={14} height={14} strokeWidth={2.25} /> : position}
          </span>
          <span>{title}</span>
        </legend>
        <p className="section__hint">{hint}</p>
        <div className="section__body">{children}</div>
      </fieldset>
    </div>
  );
}
