import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { APP } from '../config/app';
import type { FrameAnalysis, HintCode, Point, ScanChecks } from '../types';

/** MediaPipe Face Landmarker indices (478-point mesh incl. irises). */
const LM = {
  rIrisCenter: 468,
  lIrisCenter: 473,
  rIris: [469, 470, 471, 472],
  lIris: [474, 475, 476, 477],
  rCheek: 234,
  lCheek: 454,
  forehead: 10,
  chin: 152,
  nose: 1,
} as const;

const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

export function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length);
}

/**
 * Turns one frame of landmarks into quality checks and (when usable) millimetre measurements.
 * Scale comes from the iris diameter (~11.7 mm), so no distance sensor is needed.
 */
export function analyzeFrame(
  pts: NormalizedLandmark[] | undefined,
  w: number,
  h: number,
): FrameAnalysis {
  const none: ScanChecks = { face: false, distance: false, centered: false, frontal: false };
  if (!pts || pts.length < 478) {
    return { checks: none, hint: 'no-face', metrics: null, geometry: null };
  }

  const P = (i: number): Point => ({ x: pts[i].x * w, y: pts[i].y * h });
  const rIrisC = P(LM.rIrisCenter);
  const lIrisC = P(LM.lIrisCenter);
  const rCheek = P(LM.rCheek);
  const lCheek = P(LM.lCheek);
  const forehead = P(LM.forehead);
  const chin = P(LM.chin);
  const nose = P(LM.nose);

  // Horizontal iris diameter = distance between opposite iris edge points.
  const rIrisPx = dist(P(LM.rIris[0]), P(LM.rIris[2]));
  const lIrisPx = dist(P(LM.lIris[0]), P(LM.lIris[2]));
  const irisPx = (rIrisPx + lIrisPx) / 2;
  const mmPerPx = APP.irisDiameterMm / Math.max(irisPx, 0.001);

  const faceWidthPx = dist(rCheek, lCheek);
  const faceFrac = faceWidthPx / w;
  const cx = (rCheek.x + lCheek.x) / 2 / w;
  const cy = (forehead.y + chin.y) / 2 / h;

  const dR = Math.abs(nose.x - rCheek.x);
  const dL = Math.abs(lCheek.x - nose.x);
  const yaw = (dR - dL) / Math.max(dR + dL, 0.001);
  const rollDeg = Math.abs((Math.atan2(lIrisC.y - rIrisC.y, lIrisC.x - rIrisC.x) * 180) / Math.PI);

  const S = APP.scan;
  const tooFar = faceFrac < S.minFaceFrac || irisPx < S.minIrisPx;
  const tooClose = faceFrac > S.maxFaceFrac;
  const checks: ScanChecks = {
    face: true,
    distance: !tooFar && !tooClose,
    centered: Math.abs(cx - 0.5) <= S.maxCenterOffsetX && Math.abs(cy - 0.5) <= S.maxCenterOffsetY,
    frontal: Math.abs(yaw) <= S.maxYaw && rollDeg <= S.maxRollDeg,
  };

  let hint: HintCode = 'hold';
  if (tooFar) hint = 'closer';
  else if (tooClose) hint = 'back';
  else if (!checks.centered) hint = 'center';
  else if (!checks.frontal) hint = 'straight';

  return {
    checks,
    hint,
    metrics: {
      ipdMm: dist(rIrisC, lIrisC) * mmPerPx,
      faceWidthMm: faceWidthPx * mmPerPx,
      faceHeightMm: dist(forehead, chin) * mmPerPx,
    },
    geometry: {
      rIris: { ...rIrisC, r: rIrisPx / 2 },
      lIris: { ...lIrisC, r: lIrisPx / 2 },
      rCheek,
      lCheek,
    },
  };
}
