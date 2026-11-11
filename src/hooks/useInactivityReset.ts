import { useEffect } from 'react';

/** Calls `onTimeout` after `ms` without a touch/click/key. Pass ms = 0 to disable. */
export function useInactivityReset(ms: number, onTimeout: () => void, resetKey: unknown) {
  useEffect(() => {
    if (!ms) return;
    let t = window.setTimeout(onTimeout, ms);
    const bump = () => {
      window.clearTimeout(t);
      t = window.setTimeout(onTimeout, ms);
    };
    const events = ['pointerdown', 'keydown'] as const;
    events.forEach((e) => window.addEventListener(e, bump));
    return () => {
      window.clearTimeout(t);
      events.forEach((e) => window.removeEventListener(e, bump));
    };
  }, [ms, onTimeout, resetKey]);
}
