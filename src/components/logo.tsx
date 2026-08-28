export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      fill="none"
    >
      <rect x="3.5" y="5.5" width="18" height="22" fill="#faf6ee" stroke="#1f1a14" />
      <rect x="21.5" y="5.5" width="7" height="22" fill="#2c4738" stroke="#1f1a14" />
      <rect x="14" y="5.5" width="3" height="11" fill="#a3442a" />
      <path d="M7 11h10M7 15h10M7 19h8" stroke="#6b4a32" strokeWidth="1" />
    </svg>
  );
}
