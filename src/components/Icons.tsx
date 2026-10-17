import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const;

export const CheckIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m3.5 8.5 3 3 6-7" />
  </svg>
);

export const AlertIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="8" cy="8" r="6.25" />
    <path d="M8 4.75v3.9M8 11.1h.01" />
  </svg>
);

export const CircleIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="8" cy="8" r="5.25" />
  </svg>
);

export const EyeIcon = (props: IconProps) => (
  <svg {...base} width={20} height={20} viewBox="0 0 20 20" {...props}>
    <path d="M1.75 10S4.6 4.75 10 4.75 18.25 10 18.25 10 15.4 15.25 10 15.25 1.75 10 1.75 10Z" />
    <circle cx="10" cy="10" r="2.5" />
  </svg>
);

export const EyeOffIcon = (props: IconProps) => (
  <svg {...base} width={20} height={20} viewBox="0 0 20 20" {...props}>
    <path d="M8.2 5a8.6 8.6 0 0 1 1.8-.25C15.4 4.75 18.25 10 18.25 10a14 14 0 0 1-2.2 2.9M5.6 6.6A14 14 0 0 0 1.75 10S4.6 15.25 10 15.25a8 8 0 0 0 3.2-.65" />
    <path d="M8.3 8.3a2.5 2.5 0 0 0 3.4 3.4M3 3l14 14" />
  </svg>
);

export const TickIcon = (props: IconProps) => (
  <svg {...base} strokeWidth={2.25} {...props}>
    <path d="m3.75 8.5 2.75 2.75 5.75-6.5" />
  </svg>
);

export const SuccessCheckIcon = (props: IconProps) => (
  <svg {...base} width={28} height={28} viewBox="0 0 28 28" strokeWidth={2.5} {...props}>
    <path className="draw-check" d="m6.5 14.5 5 5 10-11" />
  </svg>
);
