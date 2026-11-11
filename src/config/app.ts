/**
 * Behaviour settings. Tweak these while prototyping - no code changes needed elsewhere.
 */
export const APP = {
  /** Return to the idle screen after this much inactivity (ms). */
  idleTimeoutMs: { select: 30_000, scan: 90_000, result: 60_000 },

  scan: {
    /** Number of consecutive good frames needed (~1 second at 25-30 fps). */
    framesRequired: 25,
    /** Face width as a fraction of frame width: outside this range we ask the person to move. */
    minFaceFrac: 0.16,
    maxFaceFrac: 0.4,
    /** How far the face centre may be from the frame centre (fraction of frame size). */
    maxCenterOffsetX: 0.15,
    maxCenterOffsetY: 0.18,
    /** Head turn (0 = facing camera) and tilt limits. */
    maxYaw: 0.12,
    maxRollDeg: 8,
    /** Iris must span at least this many pixels or the scale estimate is too noisy. */
    minIrisPx: 10,
    /** Bad frames in a row before progress resets. */
    badFramesBeforeReset: 10,
  },

  /**
   * Scale reference: the human iris is ~11.7 mm across in almost everyone,
   * so it works as a built-in ruler. Replace with a calibrated value if you
   * add a depth camera or a calibration card later.
   */
  irisDiameterMm: 11.7,
} as const;

const local = import.meta.env.VITE_LOCAL_VISION === 'true';

/** Where MediaPipe loads its runtime and model from. See README to self-host. */
export const VISION = {
  wasmPath: local
    ? '/mediapipe/wasm'
    : 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.2/wasm',
  modelPath: local
    ? '/models/face_landmarker.task'
    : 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
};

/** Shows a "use sample measurement" button when the camera is unavailable (dev or ?demo). */
export const DEMO_ENABLED =
  import.meta.env.DEV || new URLSearchParams(window.location.search).has('demo');
