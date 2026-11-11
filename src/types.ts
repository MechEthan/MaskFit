export type ScreenId = 'idle' | 'select' | 'scan' | 'result';

export type HintCode =
  | 'loading'
  | 'no-face'
  | 'closer'
  | 'back'
  | 'center'
  | 'straight'
  | 'hold'
  | 'done';

export interface ScanChecks {
  face: boolean;
  distance: boolean;
  centered: boolean;
  frontal: boolean;
}

/** Final result handed to the result screen. All values in millimetres. */
export interface Measurement {
  ipdMm: number; // distance between the centres of the pupils/irises
  faceWidthMm: number; // cheek to cheek (approximate ear-to-ear width)
  faceHeightMm: number; // forehead point to chin
  spreadMm: number; // std-dev of eye distance across captured frames (steadiness)
  frames: number;
}

export interface FrameMetrics {
  ipdMm: number;
  faceWidthMm: number;
  faceHeightMm: number;
}

export interface Point {
  x: number;
  y: number;
}
export interface Circle extends Point {
  r: number;
}
export interface FrameGeometry {
  rIris: Circle;
  lIris: Circle;
  rCheek: Point;
  lCheek: Point;
}

export interface FrameAnalysis {
  checks: ScanChecks;
  hint: HintCode;
  metrics: FrameMetrics | null;
  geometry: FrameGeometry | null;
}

export type ScanPhase = 'loading' | 'camera-error' | 'model-error' | 'scanning' | 'done';

export interface ScanState {
  phase: ScanPhase;
  hint: HintCode;
  checks: ScanChecks;
  progress: number; // 0..1
  liveIpdMm: number | null;
}
