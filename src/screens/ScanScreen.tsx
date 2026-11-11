import { useCallback, useEffect, useRef, useState } from 'react';
import { BRAND } from '../config/brand';
import { DEMO_ENABLED } from '../config/app';
import { useFaceScan } from '../hooks/useFaceScan';
import { ProgressRing } from '../components/ProgressRing';
import { DEMO_MEASUREMENT } from '../lib/demo';
import type { Measurement, ScanChecks } from '../types';

interface Props {
  onComplete: (m: Measurement) => void;
  onCancel: () => void;
}

const CHECK_ORDER: (keyof ScanChecks)[] = ['face', 'distance', 'centered', 'frontal'];

export function ScanScreen({ onComplete, onCancel }: Props) {
  const c = BRAND.copy.scan;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [attempt, setAttempt] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const finish = useCallback(
    (m: Measurement) => {
      // Brief pause so the full ring and "Got it!" are visible.
      timer.current = window.setTimeout(() => onComplete(m), 700);
    },
    [onComplete],
  );

  const { state, videoSize } = useFaceScan({ videoRef, canvasRef, attempt, onComplete: finish });
  const error =
    state.phase === 'camera-error' ? c.cameraError : state.phase === 'model-error' ? c.modelError : null;
  const allOk = CHECK_ORDER.every((k) => state.checks[k]);

  return (
    <div className="screen screen--scan">
      <div
        className="scan__frame"
        style={{ aspectRatio: videoSize ? `${videoSize.w} / ${videoSize.h}` : '16 / 9' }}
      >
        <video ref={videoRef} className="scan__video" muted playsInline />
        <canvas ref={canvasRef} className="scan__canvas" />
        <svg
          className={`scan__guide ${allOk ? 'scan__guide--ok' : ''}`}
          viewBox="0 0 160 90"
          aria-hidden="true"
        >
          <ellipse cx="80" cy="45" rx="24" ry="36" />
        </svg>
        {error && (
          <div className="scan__error" role="alert">
            <h2>{error.title}</h2>
            <p>{error.body}</p>
            <div className="scan__errorActions">
              <button className="btn btn--primary" onClick={() => setAttempt((n) => n + 1)}>
                {c.retry}
              </button>
              {DEMO_ENABLED && (
                <button className="btn btn--ghost" onClick={() => onComplete(DEMO_MEASUREMENT)}>
                  {c.demo}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="scan__panel">
        <h1 className="scan__hint" aria-live="polite">
          {error ? error.title : c.hints[state.hint]}
        </h1>
        <ProgressRing value={state.progress}>
          <span className="ring__value">
            {state.liveIpdMm === null ? '\u2013' : state.liveIpdMm.toFixed(1)}
          </span>
          <span className="ring__label">{c.live} (mm)</span>
        </ProgressRing>
        <ul className="checks">
          {CHECK_ORDER.map((k) => (
            <li key={k} data-ok={state.checks[k]}>
              <span className="check__dot">
                {state.checks[k] && (
                  <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                    <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {c.checks[k]}
            </li>
          ))}
        </ul>
        <button className="btn btn--ghost" onClick={onCancel}>
          {c.cancel}
        </button>
      </div>
    </div>
  );
}
