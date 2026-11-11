import type { Measurement } from '../types';

/** Sample result used when no camera is available (dev mode or ?demo in the URL). */
export const DEMO_MEASUREMENT: Measurement = {
  ipdMm: 63.2,
  faceWidthMm: 138,
  faceHeightMm: 182,
  spreadMm: 0.4,
  frames: 25,
};
