import type { ReactNode } from 'react';

export function ProgressRing({ value, children }: { value: number; children?: ReactNode }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="ring__track" cx="60" cy="60" r={r} />
        <circle
          className="ring__bar"
          cx="60"
          cy="60"
          r={r}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value)}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="ring__center">{children}</div>
    </div>
  );
}
