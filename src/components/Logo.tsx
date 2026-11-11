import { BRAND } from '../config/brand';

/** Placeholder brand mark. Set BRAND.logoSrc in src/config/brand.ts to use a real logo. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`logo ${className}`}>
      {BRAND.logoSrc ? (
        <img className="logo__img" src={BRAND.logoSrc} alt={BRAND.name} />
      ) : (
        <>
          <svg className="logo__mark" viewBox="0 0 64 40" aria-hidden="true">
            <path
              d="M6 14c0-5 4-8 9-8h34c5 0 9 3 9 8v8c0 6-4 10-10 10-5 0-6-4-12-4s-7 4-12 4C10 32 6 28 6 22z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M32 6v10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="logo__name">{BRAND.name}</span>
        </>
      )}
    </div>
  );
}
