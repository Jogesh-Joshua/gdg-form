import { FIELD_ORDER, SECTIONS, SECTION_IDS } from './form';
import type { FormValues, SectionId, TouchedFields, ValidatedField } from './form';
import { validateField } from './validators';

export type SectionState = 'done' | 'active' | 'pending';

export interface SectionProgress {
  id: SectionId;
  logName: string;
  state: SectionState;
  validCount: number;
  total: number;
}

export interface Progress {
  sections: SectionProgress[];
  validFields: ReadonlySet<ValidatedField>;
  validCount: number;
  total: number;
}

function hasValue(field: ValidatedField, values: FormValues): boolean {
  return field === 'terms' ? values.terms : values[field].trim().length > 0;
}

export function deriveProgress(values: FormValues, touched: TouchedFields): Progress {
  const validFields = new Set(FIELD_ORDER.filter((field) => validateField(field, values) === null));

  const sections = SECTION_IDS.map((id): SectionProgress => {
    const { logName } = SECTIONS[id];
    const fields: readonly ValidatedField[] = SECTIONS[id].fields;
    const validCount = fields.filter((field) => validFields.has(field)).length;
    const started = fields.some((field) => touched[field] || hasValue(field, values));
    const state: SectionState =
      validCount === fields.length ? 'done' : started ? 'active' : 'pending';
    return { id, logName, state, validCount, total: fields.length };
  });

  return { sections, validFields, validCount: validFields.size, total: FIELD_ORDER.length };
}
