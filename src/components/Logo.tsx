export function Logo() {
  return (
    <svg
      className="logo__mark"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M11 5H6v22h5M21 5h5v22h-5"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="13.5" cy="12.5" r="2.25" fill="#8CA2FF" />
      <circle cx="18.5" cy="12.5" r="2.25" fill="#3DDC97" />
      <circle cx="13.5" cy="19.5" r="2.25" fill="#E8A93A" />
      <circle cx="18.5" cy="19.5" r="2.25" fill="#FF6B76" />
    </svg>
  );
}
