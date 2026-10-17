import { BrandPanel } from './components/BrandPanel';
import { LiveRegion } from './components/LiveRegion';
import { RegistrationForm } from './components/RegistrationForm';
import { SuccessPanel } from './components/SuccessPanel';
import { useRegistrationForm } from './hooks/useRegistrationForm';

export default function App() {
  const form = useRegistrationForm();
  const { phase } = form;

  return (
    <div className="shell">
      <a className="skip-link" href="#registration">
        Skip to registration form
      </a>

      <BrandPanel sections={form.progress.sections} complete={phase.kind === 'complete'} />

      <main className="main">
        <div id="registration" className="card">
          {phase.kind === 'complete' ? (
            <SuccessPanel registration={phase.registration} onReset={form.reset} />
          ) : (
            <RegistrationForm
              key={form.resetCount}
              form={form}
              focusFirstField={form.resetCount > 0}
            />
          )}
        </div>
      </main>

      <LiveRegion announcement={form.announcement} />
    </div>
  );
}
