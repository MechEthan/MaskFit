import { SCALE_RANGE_MM, SIZES } from '../config/sizing';

/** Bar showing where the measured eye distance falls across the size ranges. */
export function SizeScale({ ipdMm, activeId }: { ipdMm: number; activeId: string }) {
  const [min, max] = SCALE_RANGE_MM;
  let start = min;
  const segments = SIZES.map((s) => {
    const end = Math.min(s.maxIpdMm, max);
    const seg = { id: s.id, width: Math.max(end - start, 0.1) };
    start = end;
    return seg;
  });
  const pos = Math.min(1, Math.max(0, (ipdMm - min) / (max - min))) * 100;

  return (
    <div className="scale" aria-hidden="true">
      <div className="scale__bar">
        {segments.map((s) => (
          <div
            key={s.id}
            className={`scale__seg ${s.id === activeId ? 'scale__seg--active' : ''}`}
            style={{ flex: s.width }}
          >
            {s.id}
          </div>
        ))}
        <div className="scale__marker" style={{ left: `${pos}%` }} />
      </div>
    </div>
  );
}
