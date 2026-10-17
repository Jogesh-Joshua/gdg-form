export type Gender = '' | 'female' | 'male' | 'non-binary' | 'undisclosed';
export type YearOfStudy =
  | ''
  | '1'
  | '2'
  | '3'
  | '4'
  | 'postgraduate'
  | 'professional';

export interface FormValues {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  college: string;
  department: string;
  year: YearOfStudy;
  gender: Gender;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

/** Every field that carries its own validation (country code is part of phone). */
export type ValidatedField = Exclude<keyof FormValues, 'countryCode'>;
export type FormErrors = Partial<Record<ValidatedField, string>>;
export interface ErrorSummaryItem {
  field: ValidatedField;
  label: string;
  message: string;
}

export type TouchedFields = Partial<Record<ValidatedField, boolean>>;

export const FIELD_ORDER: readonly ValidatedField[] = [
  'fullName',
  'email',
  'phone',
  'college',
  'department',
  'year',
  'gender',
  'password',
  'confirmPassword',
  'terms',
];

export const FIELD_LABELS: Record<ValidatedField, string> = {
  fullName: 'Full name',
  email: 'Email address',
  phone: 'Phone number',
  college: 'College / organization',
  department: 'Department',
  year: 'Year of study',
  gender: 'Gender',
  password: 'Password',
  confirmPassword: 'Confirm password',
  terms: 'Terms and conditions',
};

/** DOM id of the element that should receive focus for each field. */
export const FOCUS_TARGET: Record<ValidatedField, string> = {
  fullName: 'fullName',
  email: 'email',
  phone: 'phone',
  college: 'college',
  department: 'department',
  year: 'year',
  gender: 'gender-female',
  password: 'password',
  confirmPassword: 'confirmPassword',
  terms: 'terms',
};

export interface SectionDef {
  title: string;
  hint: string;
  /** Label used by the progress readout in the brand panel. */
  logName: string;
  fields: readonly ValidatedField[];
}

export const SECTIONS = {
  personal: {
    title: 'Personal details',
    hint: 'How we reach you about the event.',
    logName: 'personal',
    fields: ['fullName', 'email', 'phone'],
  },
  academic: {
    title: 'Academic details',
    hint: 'Used to match you with the right sessions.',
    logName: 'academic',
    fields: ['college', 'department', 'year', 'gender'],
  },
  security: {
    title: 'Set a password',
    hint: 'Choose one you do not reuse on other sites.',
    logName: 'security',
    fields: ['password', 'confirmPassword'],
  },
  agreement: {
    title: 'Agreement',
    hint: 'Review and accept the event terms below.',
    logName: 'agreement',
    fields: ['terms'],
  },
} satisfies Record<string, SectionDef>;

export type SectionId = keyof typeof SECTIONS;

/** Display order of the sections. */
export const SECTION_IDS = [
  'personal',
  'academic',
  'security',
  'agreement',
] as const satisfies readonly SectionId[];

/** What the success screen needs to show once a registration is accepted. */
export interface Registration {
  id: string;
  firstName: string;
  fullName: string;
  maskedEmail: string;
  organization: string;
}

export const INITIAL_VALUES: FormValues = {
  fullName: '',
  email: '',
  countryCode: '+91',
  phone: '',
  college: '',
  department: '',
  year: '',
  gender: '',
  password: '',
  confirmPassword: '',
  terms: false,
};

export interface Option<T extends string = string> {
  value: T;
  label: string;
}

export const YEAR_OPTIONS: readonly Option<Exclude<YearOfStudy, ''>>[] = [
  { value: '1', label: '1st year' },
  { value: '2', label: '2nd year' },
  { value: '3', label: '3rd year' },
  { value: '4', label: '4th year' },
  { value: 'postgraduate', label: 'Postgraduate' },
  { value: 'professional', label: 'Working professional' },
];

export const GENDER_OPTIONS: readonly Option<Exclude<Gender, ''>>[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'undisclosed', label: 'Prefer not to say' },
];

export const COUNTRY_OPTIONS: readonly Option[] = [
  { value: '+91', label: 'India +91' },
  { value: '+1', label: 'USA +1' },
  { value: '+44', label: 'UK +44' },
  { value: '+971', label: 'UAE +971' },
  { value: '+65', label: 'Singapore +65' },
  { value: '+61', label: 'Australia +61' },
  { value: '+49', label: 'Germany +49' },
  { value: '+94', label: 'Sri Lanka +94' },
  { value: '+977', label: 'Nepal +977' },
  { value: '+880', label: 'Bangladesh +880' },
];

export const DEPARTMENT_SUGGESTIONS: readonly string[] = [
  'Computer Science',
  'Information Technology',
  'Electronics and Communication',
  'Electrical and Electronics',
  'Mechanical',
  'Civil',
  'Data Science',
  'Artificial Intelligence',
  'Design',
  'Business',
];
