import { BRAND } from '../config/brand';
import { recommendSize } from '../config/sizing';
import { Logo } from '../components/Logo';
import { SizeScale } from '../components/SizeScale';
import type { Measurement } from '../types';

interface Props {
  measurement: Measurement;
  onRescan: () => void;
  onDone: () => void;
}

export function ResultScreen({ measurement: m, onRescan, onDone }: Props) {
  const c = BRAND.copy.result;
  const { size, alternate } = recommendSize(m.ipdMm);

  return (
    <div className="screen screen--light on-light">
      <Logo className="screen__logo" />
      <div className="result__left">
        <p className="result__kicker">{c.title}</p>
        <div className="result__badge" aria-label={size.name}>
          {size.id}
        </div>
        <h1 className="result__name">{size.name}</h1>
        <p className="result__drawer">{c.drawerLine(size.drawer)}</p>
        {alternate && <p className="result__alt">{c.closeTo(alternate.name, alternate.drawer)}</p>}
      </div>

      <div className="result__right">
        <h2 className="result__h2">{c.measurements}</h2>
        <dl className="measures">
          <div>
            <dt>{c.eyeDistance}</dt>
            <dd>{m.ipdMm.toFixed(1)} mm</dd>
          </div>
          <div>
            <dt>{c.faceWidth}</dt>
            <dd>{m.faceWidthMm.toFixed(0)} mm</dd>
          </div>
          <div>
            <dt>{c.faceHeight}</dt>
            <dd>{m.faceHeightMm.toFixed(0)} mm</dd>
          </div>
        </dl>
        <SizeScale ipdMm={m.ipdMm} activeId={size.id} />
        {m.spreadMm > 1.6 && <p className="result__alt">{c.unsteady}</p>}
        <div className="result__actions">
          <button className="btn btn--ghost" onClick={onRescan}>
            {c.rescan}
          </button>
          <button className="btn btn--primary" onClick={onDone}>
            {c.done}
          </button>
        </div>
      </div>
    </div>
  );
}
