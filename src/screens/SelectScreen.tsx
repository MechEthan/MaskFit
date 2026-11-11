import { BRAND } from '../config/brand';
import { Logo } from '../components/Logo';

function FaceGuide() {
  return (
    <svg className="faceguide" viewBox="0 0 400 440" aria-hidden="true">
      <ellipse cx="200" cy="220" rx="130" ry="180" fill="none" stroke="currentColor" strokeWidth="6" />
      <circle cx="150" cy="190" r="16" fill="none" stroke="currentColor" strokeWidth="6" />
      <circle cx="250" cy="190" r="16" fill="none" stroke="currentColor" strokeWidth="6" />
      <path d="M150 140h100M150 128v24M250 128v24" stroke="var(--c-sun)" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export function SelectScreen({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  const c = BRAND.copy.select;
  return (
    <div className="screen screen--light on-light">
      <Logo className="screen__logo" />
      <div>
        <h1 className="select__title">{c.title}</h1>
        <ol className="steps">
          {c.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="privacy">{c.privacy}</p>
      </div>
      <div className="select__side">
        <FaceGuide />
        <div className="select__actions">
          <button className="btn btn--ghost" onClick={onBack}>
            {c.back}
          </button>
          <button className="btn btn--primary" onClick={onStart}>
            {c.start}
          </button>
        </div>
      </div>
    </div>
  );
}
