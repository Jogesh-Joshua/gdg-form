# DevSprint registration

Registration form for a community developer event. React 19, Vite and TypeScript,
with plain CSS. There is no backend: submission is simulated in `src/lib/mockApi.ts`.

## Quick Start & Local Setup

### Prerequisites
- Node.js `20.x` or newer
- npm `10.x` or newer

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd gdg-form

# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript type check
npm run typecheck

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Deployment to Vercel

This project is built with Vite + React + TypeScript and is ready for static deployment on Vercel:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Environment Variables**: None required (fully self-contained, no external database or backend needed)

## Source layout

```
src/
  config.ts                     Event name and brand copy
  lib/
    form.ts                     Types, field order, sections, option lists
    validators.ts               Field validation and password rules
    normalize.ts                Trimming, phone/email normalisation, masking
    emailSuggestion.ts          Domain typo suggestion
    progress.ts                 Per-section and overall completion
    mockApi.ts                  Simulated submission
  hooks/
    registrationReducer.ts      Pure reducer: values, errors, touched, phase
    useRegistrationForm.ts      Hook wiring the reducer to submit and unload handling
  components/                   Field primitives and form sections
  styles/                       tokens, base, layout, then one file per concern
```

## Behaviour

- Fields validate on blur, then live once they show an error. Submitting validates
  everything, lists the problems in a summary and moves focus to it.
- The submit button uses `aria-disabled` while loading, so keyboard focus stays on it.
- Per-field errors are linked with `aria-describedby`. Blur errors, loading and
  reset are announced through a single polite live region.
- Passwords are held in component state only. The page warns before unloading
  while there is unsaved input.
- Fonts (Geist, Geist Mono) are self-hosted through Fontsource.

## Motion

All timing and easing live in `src/styles/tokens.css` (`--ease`, `--duration*`, `--rise`,
`--press-*`), and the keyframes in `src/styles/motion.css`. Only `transform`, `opacity` and
colour are animated, apart from the error message height reveal and the spinner opening.
Hover styles apply only on devices with a fine, hovering pointer.

With `prefers-reduced-motion: reduce` the same tokens flatten movement to zero, so
entrances become short fades, press scaling is off, the spinner pulses instead of
rotating, and the success check and progress fills appear without drawing in.

## Exercising the failure paths

The mock API treats two addresses specially:

- `taken@example.com` returns a field error on the email.
- `offline@example.com` returns a network failure and shows the retry banner.

Any other valid submission succeeds after a short delay.
