import { useCallback, useEffect, useReducer } from 'react';
import type { FormEvent } from 'react';
import { FIELD_LABELS, FIELD_ORDER, INITIAL_VALUES } from '../lib/form';
import type {
  ErrorSummaryItem,
  FormValues,
  Registration,
  ValidatedField,
} from '../lib/form';
import { RegistrationError, submitRegistration } from '../lib/mockApi';
import type { RegistrationPayload } from '../lib/mockApi';
import { maskEmail, normalizePhone, tidyAll } from '../lib/normalize';
import { deriveProgress } from '../lib/progress';
import { validateAll } from '../lib/validators';
import { initialState, registrationReducer } from './registrationReducer';
import type { FormAction } from './registrationReducer';

function toPayload(values: FormValues): RegistrationPayload {
  return {
    fullName: values.fullName,
    email: values.email,
    phone: `${values.countryCode}${normalizePhone(values.countryCode, values.phone)}`,
    college: values.college,
    department: values.department,
    year: values.year,
    gender: values.gender,
  };
}

function toRegistration(values: FormValues, id: string): Registration {
  return {
    id,
    firstName: values.fullName.split(' ')[0] ?? values.fullName,
    fullName: values.fullName,
    maskedEmail: maskEmail(values.email),
    organization: values.college,
  };
}

const isDirty = (values: FormValues) =>
  (Object.keys(INITIAL_VALUES) as Array<keyof FormValues>).some(
    (key) => values[key] !== INITIAL_VALUES[key],
  );

export function useRegistrationForm() {
  const [state, dispatch] = useReducer(registrationReducer, initialState);
  const { values, errors, touched, phase } = state;

  const setValue = useCallback(
    <K extends keyof FormValues>(field: K, value: FormValues[K]) =>
      dispatch({ type: 'change', field, value } as FormAction),
    [],
  );
  const blur = useCallback((field: ValidatedField) => dispatch({ type: 'blur', field }), []);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (phase.kind !== 'editing') return;

      const cleaned = tidyAll(values);
      const nextErrors = validateAll(cleaned);
      if (Object.keys(nextErrors).length > 0) {
        dispatch({ type: 'submit-invalid', values: cleaned, errors: nextErrors });
        return;
      }

      dispatch({ type: 'submit-start', values: cleaned });
      try {
        const receipt = await submitRegistration(toPayload(cleaned));
        dispatch({
          type: 'submit-success',
          registration: toRegistration(cleaned, receipt.registrationId),
        });
      } catch (error) {
        if (error instanceof RegistrationError && error.kind === 'field' && error.field) {
          dispatch({ type: 'submit-field-error', field: error.field, message: error.message });
        } else {
          dispatch({ type: 'submit-network-error' });
        }
      }
    },
    [phase.kind, values],
  );

  // Warn before leaving only while there is unsaved input.
  const dirty = phase.kind !== 'complete' && isDirty(values);
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const progress = deriveProgress(values, touched);

  const summaryItems: ErrorSummaryItem[] = state.summaryVisible
    ? FIELD_ORDER.flatMap((field) => {
        const message = errors[field];
        return message ? [{ field, label: FIELD_LABELS[field], message }] : [];
      })
    : [];

  /** True once the user has left a field and it passes validation. */
  const isConfirmedValid = (field: ValidatedField) =>
    Boolean(touched[field]) && !errors[field] && progress.validFields.has(field);

  return {
    values,
    errors,
    touched,
    phase,
    networkError: state.networkError,
    announcement: state.announcement,
    resetCount: state.resetCount,
    progress,
    summaryItems,
    summaryFocusToken: state.summaryFocusToken,
    isConfirmedValid,
    setValue,
    blur,
    submit,
    reset,
  };
}

export type RegistrationFormApi = ReturnType<typeof useRegistrationForm>;
