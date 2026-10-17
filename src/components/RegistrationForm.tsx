import { useEffect, useRef } from 'react';
import {
  DEPARTMENT_SUGGESTIONS,
  GENDER_OPTIONS,
  YEAR_OPTIONS,
} from '../lib/form';
import type { SectionId } from '../lib/form';
import { suggestEmail } from '../lib/emailSuggestion';
import type { RegistrationFormApi } from '../hooks/useRegistrationForm';
import { AlertIcon } from './Icons';
import { Button } from './Button';
import { CheckboxField } from './CheckboxField';
import { ErrorSummary } from './ErrorSummary';
import { FormSection } from './FormSection';
import { PasswordField } from './PasswordField';
import { PasswordRequirements } from './PasswordRequirements';
import { PhoneField } from './PhoneField';
import { ProgressBar } from './ProgressBar';
import { RadioGroup } from './RadioGroup';
import { SelectField } from './SelectField';
import { TermsDetails } from './TermsDetails';
import { TextField } from './TextField';

interface RegistrationFormProps {
  form: RegistrationFormApi;
  /** Move focus to the first field on mount (used after a reset). */
  focusFirstField: boolean;
}

type TextFieldName = 'fullName' | 'email' | 'college' | 'department';
type PasswordFieldName = 'password' | 'confirmPassword';

export function RegistrationForm({ form, focusFirstField }: RegistrationFormProps) {
  const { values, errors, touched, phase, progress, setValue, blur, isConfirmedValid } = form;
  const busy = phase.kind === 'submitting';
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusFirstField) firstFieldRef.current?.focus();
  }, [focusFirstField]);

  const isDone = (id: SectionId) =>
    progress.sections.some((section) => section.id === id && section.state === 'done');

  const textProps = (name: TextFieldName) => ({
    id: name,
    value: values[name],
    error: errors[name],
    valid: isConfirmedValid(name),
    readOnly: busy,
    onChange: (value: string) => setValue(name, value),
    onBlur: () => blur(name),
  });

  const passwordProps = (name: PasswordFieldName) => ({
    id: name,
    value: values[name],
    error: errors[name],
    readOnly: busy,
    onChange: (value: string) => setValue(name, value),
    onBlur: () => blur(name),
  });

  // Offered only after the user leaves the field, so it never flickers mid-typing.
  const emailSuggestion = touched.email && !errors.email ? suggestEmail(values.email) : null;

  const submitLabel = busy
    ? 'Creating your registration'
    : form.networkError
      ? 'Try again'
      : 'Complete registration';

  return (
    <div className="form-view">
      <div className="card__header">
        <h2 id="form-title" className="card__title">
          Register for DevSprint
        </h2>
        <p className="card__lede">All fields are required.</p>
        <ProgressBar
          fills={progress.sections.map((section) => section.validCount / section.total)}
          label={`${progress.validCount} of ${progress.total} fields complete`}
        />
      </div>

      <ErrorSummary items={form.summaryItems} focusToken={form.summaryFocusToken} />

      {form.networkError ? (
        <div className="banner" role="alert">
          <AlertIcon />
          <div>
            <p className="banner__title">We couldn&rsquo;t submit your registration</p>
            <p>Check your connection, then try again. Everything you entered is still here.</p>
          </div>
        </div>
      ) : null}

      <form
        className="form"
        noValidate
        aria-labelledby="form-title"
        aria-busy={busy}
        onSubmit={form.submit}
      >
        <FormSection id="personal" done={isDone('personal')}>
          <div className="fields">
            <TextField
              {...textProps('fullName')}
              ref={firstFieldRef}
              label="Full name"
              hint="Use your real name so we can match it at check-in."
              autoComplete="name"
              autoCapitalize="words"
              spellCheck={false}
              maxLength={80}
              className="field--wide"
            />
            <TextField
              {...textProps('email')}
              type="email"
              label="Email address"
              hint="We send your confirmation here."
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={254}
              className="field--wide"
              extraId={emailSuggestion ? 'email-suggestion' : undefined}
              extra={
                emailSuggestion ? (
                  <div id="email-suggestion" className="suggestion">
                    <span>
                      Did you mean <strong>{emailSuggestion}</strong>?
                    </span>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => setValue('email', emailSuggestion)}
                    >
                      Use this
                    </button>
                  </div>
                ) : null
              }
            />
            <PhoneField
              id="phone"
              label="Phone number"
              hint="Only used for event updates."
              countryCode={values.countryCode}
              value={values.phone}
              error={errors.phone}
              valid={isConfirmedValid('phone')}
              readOnly={busy}
              className="field--wide"
              onCountryChange={(code) => setValue('countryCode', code)}
              onChange={(value) => setValue('phone', value)}
              onBlur={() => blur('phone')}
            />
          </div>
        </FormSection>

        <FormSection id="academic" done={isDone('academic')}>
          <div className="fields">
            <TextField
              {...textProps('college')}
              label="College / organization"
              hint="Where you study or work."
              autoComplete="organization"
              maxLength={120}
              className="field--wide"
            />
            <TextField
              {...textProps('department')}
              label="Department"
              hint="Pick a suggestion or type your own."
              autoComplete="off"
              list="department-options"
              maxLength={80}
            />
            <datalist id="department-options">
              {DEPARTMENT_SUGGESTIONS.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            <SelectField
              id="year"
              label="Year of study"
              placeholder="Select year"
              options={YEAR_OPTIONS}
              value={values.year}
              error={errors.year}
              disabled={busy}
              onChange={(value) => setValue('year', value)}
              onBlur={() => blur('year')}
            />
            <RadioGroup
              name="gender"
              legend="Gender"
              options={GENDER_OPTIONS}
              value={values.gender}
              error={errors.gender}
              disabled={busy}
              className="field--wide"
              onChange={(value) => setValue('gender', value)}
              onGroupBlur={() => blur('gender')}
            />
          </div>
        </FormSection>

        <FormSection id="security" done={isDone('security')}>
          <div className="fields fields--single">
            <PasswordField
              {...passwordProps('password')}
              label="Password"
              extraId="password-requirements"
              extra={
                <PasswordRequirements
                  id="password-requirements"
                  password={values.password}
                  email={values.email}
                />
              }
            />
            <PasswordField {...passwordProps('confirmPassword')} label="Confirm password" />
          </div>
        </FormSection>

        <FormSection id="agreement" done={isDone('agreement')}>
          <CheckboxField
            id="terms"
            label="I agree to the terms and conditions."
            checked={values.terms}
            error={errors.terms}
            disabled={busy}
            onChange={(checked) => setValue('terms', checked)}
            onBlur={() => blur('terms')}
          >
            <TermsDetails />
          </CheckboxField>
          <Button type="submit" loading={busy}>
            {submitLabel}
          </Button>
        </FormSection>
      </form>
    </div>
  );
}
