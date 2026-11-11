/**
 * PLACEHOLDER sizing table - replace with your real fit data.
 * Sizes are chosen from eye distance (IPD, mm). Each size covers values
 * below its `maxIpdMm` and at or above the previous size's limit.
 * `drawer` ties each size to a drawer in the storage kiosk.
 */
export interface SizeDef {
  id: string;
  name: string;
  drawer: number;
  maxIpdMm: number;
}

export const SIZES: SizeDef[] = [
  { id: 'S', name: 'Small', drawer: 1, maxIpdMm: 59 },
  { id: 'M', name: 'Medium', drawer: 2, maxIpdMm: 63.5 },
  { id: 'L', name: 'Large', drawer: 3, maxIpdMm: 68 },
  { id: 'XL', name: 'Extra large', drawer: 4, maxIpdMm: Infinity },
];

/** Range drawn on the result-screen scale (mm). */
export const SCALE_RANGE_MM: [number, number] = [52, 76];

/** Within this many mm of a boundary we mention the neighbouring size. */
export const BORDERLINE_MM = 1.0;

export interface Recommendation {
  size: SizeDef;
  alternate: SizeDef | null;
}

export function recommendSize(ipdMm: number): Recommendation {
  let i = SIZES.findIndex((s) => ipdMm < s.maxIpdMm);
  if (i < 0) i = SIZES.length - 1;
  const size = SIZES[i];
  const prev = SIZES[i - 1];
  const next = SIZES[i + 1];

  let alternate: SizeDef | null = null;
  if (prev && ipdMm - prev.maxIpdMm < BORDERLINE_MM) alternate = prev;
  else if (next && size.maxIpdMm - ipdMm < BORDERLINE_MM) alternate = next;
  return { size, alternate };
}
