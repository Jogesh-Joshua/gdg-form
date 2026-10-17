import { EVENT } from '../config';
import type { SectionProgress } from '../lib/progress';
import { Logo } from './Logo';

interface BrandPanelProps {
  sections: readonly SectionProgress[];
  complete: boolean;
}

const STATUS_TEXT = { done: '✓  done', active: '⋯  running', pending: '--  pending' } as const;


export function BrandPanel({ sections, complete }: BrandPanelProps) {
  const ready = sections.every((section) => section.state === 'done');

  return (
    <header className="brand">
      <div className="brand__inner">
        <div className="logo">
          <Logo />
          <span className="logo__name">{EVENT.name}</span>
        </div>

        <div className="brand__body">
          <h1 className="brand__title">{EVENT.headline}</h1>
          <p className="brand__pitch">{EVENT.pitch}</p>

          {/* Decorative mirror of form progress; the form carries its own accessible progress. */}
          <div className="buildlog" aria-hidden="true">
            <p className="buildlog__prompt">
              <span>$</span> devsprint register --status
            </p>
            <ul>
              {sections.map((section) => {
                const state = complete ? 'done' : section.state;
                return (
                  <li key={section.id} className="buildlog__row" data-state={state}>
                    <span>{section.logName}</span>
                    <span className="buildlog__leader" />
                    <span className="buildlog__status">{STATUS_TEXT[state]}</span>
                  </li>
                );
              })}
            </ul>
            <p className="buildlog__result" data-complete={complete || undefined}>
              {complete ? '✓ registered' : ready ? 'ready to submit' : 'waiting for input'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
