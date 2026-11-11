import { BRAND } from '../config/brand';
import { Logo } from '../components/Logo';

export function IdleScreen({ onStart }: { onStart: () => void }) {
  const c = BRAND.copy.idle;
  return (
    <div
      className="screen screen--idle"
      role="button"
      tabIndex={0}
      aria-label={c.cta}
      onClick={onStart}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onStart();
      }}
    >
      <Logo className="screen__logo" />
      <div className="idle__text">
        <h1>{c.headline}</h1>
        <p>{c.sub}</p>
      </div>
      <div className="idle__cta">
        <span className="ripple" />
        <span className="ripple" />
        <span className="ripple" />
        <span className="idle__ctaLabel">{c.cta}</span>
      </div>
    </div>
  );
}
