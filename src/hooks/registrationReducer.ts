import { FIELD_LABELS, FIELD_ORDER, INITIAL_VALUES } from '../lib/form';
import type {
  FormErrors,
  FormValues,
  Registration,
  TouchedFields,
  ValidatedField,
} from '../lib/form';
import { tidyField } from '../lib/normalize';
import { validateField } from '../lib/validators';

export type Phase =
  | { kind: 'editing' }
  | { kind: 'submitting' }
  | { kind: 'complete'; registration: Registration };

/** `seq` changes on every message so identical text is announced again. */
export interface Announcement {
  text: string;
  seq: number;
}

export interface FormState {
  values: FormValues;
  errors: FormErrors;
  touched: TouchedFields;
  phase: Phase;
  summaryVisible: boolean;
  summaryFocusToken: number;
  networkError: boolean;
  announcement: Announcement;
  resetCount: number;
}

type ChangeAction = {
  [K in keyof FormValues]: { type: 'change'; field: K; value: FormValues[K] };
}[keyof FormValues];

export type FormAction =
  | ChangeAction
  | { type: 'blur'; field: ValidatedField }
  | { type: 'submit-invalid'; values: FormValues; errors: FormErrors }
  | { type: 'submit-start'; values: FormValues }
  | { type: 'submit-success'; registration: Registration }
  | { type: 'submit-field-error'; field: ValidatedField; message: string }
  | { type: 'submit-network-error' }
  | { type: 'reset' };

export const initialState: FormState = {
  values: INITIAL_VALUES,
  errors: {},
  touched: {},
  phase: { kind: 'editing' },
  summaryVisible: false,
  summaryFocusToken: 0,
  networkError: false,
  announcement: { text: '', seq: 0 },
  resetCount: 0,
};

function withError(errors: FormErrors, field: ValidatedField, message: string | null): FormErrors {
  const next = { ...errors };
  if (message) next[field] = message;
  else delete next[field];
  return next;
}

function touchAll(): TouchedFields {
  const touched: TouchedFields = {};
  for (const field of FIELD_ORDER) touched[field] = true;
  return touched;
}

const announce = (state: FormState, text: string): Announcement => ({
  text,
  seq: state.announcement.seq + 1,
});

export function registrationReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'change': {
      const values = { ...state.values, [action.field]: action.value } as FormValues;
      const own: ValidatedField = action.field === 'countryCode' ? 'phone' : action.field;

      // Only re-check fields that already show an error, plus the ones that depend on this one.
      const recheck = new Set<ValidatedField>();
      if (state.errors[own]) recheck.add(own);
      if (
        action.field === 'password' &&
        (state.errors.confirmPassword || (state.touched.confirmPassword && values.confirmPassword))
      ) {
        recheck.add('confirmPassword');
      }
      if (action.field === 'email' && state.touched.password && values.password) {
        recheck.add('password');
      }

      let errors = state.errors;
      for (const field of recheck) errors = withError(errors, field, validateField(field, values));
      return { ...state, values, errors };
    }

    case 'blur': {
      const values = tidyField(state.values, action.field);
      const message = validateField(action.field, values);
      return {
        ...state,
        values,
        touched: { ...state.touched, [action.field]: true },
        errors: withError(state.errors, action.field, message),
        announcement: message
          ? announce(state, `${FIELD_LABELS[action.field]}: ${message}`)
          : state.announcement,
      };
    }

    case 'submit-invalid':
      return {
        ...state,
        values: action.values,
        errors: action.errors,
        touched: touchAll(),
        networkError: false,
        summaryVisible: true,
        summaryFocusToken: state.summaryFocusToken + 1,
      };

    case 'submit-start':
      return {
        ...state,
        values: action.values,
        errors: {},
        touched: touchAll(),
        phase: { kind: 'submitting' },
        networkError: false,
        summaryVisible: false,
        announcement: announce(state, 'Creating your registration.'),
      };

    case 'submit-success':
      return { ...state, phase: { kind: 'complete', registration: action.registration } };

    case 'submit-field-error':
      return {
        ...state,
        phase: { kind: 'editing' },
        errors: { [action.field]: action.message },
        summaryVisible: true,
        summaryFocusToken: state.summaryFocusToken + 1,
      };

    case 'submit-network-error':
      return {
        ...state,
        phase: { kind: 'editing' },
        networkError: true,
        announcement: announce(
          state,
          'We could not reach the server. Your details are still in the form. Try again.',
        ),
      };

    case 'reset':
      return {
        ...initialState,
        resetCount: state.resetCount + 1,
        announcement: announce(state, 'Form reset. Ready for a new registration.'),
      };
  }
}
