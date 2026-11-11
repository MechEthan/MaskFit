import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { VISION } from '../config/app';

let promise: Promise<FaceLandmarker> | null = null;

/** Loads the face model once and reuses it for every scan. */
export function loadLandmarker(): Promise<FaceLandmarker> {
  if (!promise) {
    promise = (async () => {
      const fileset = await FilesetResolver.forVisionTasks(VISION.wasmPath);
      const make = (delegate: 'GPU' | 'CPU') =>
        FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: VISION.modelPath, delegate },
          runningMode: 'VIDEO',
          numFaces: 1,
        });
      try {
        return await make('GPU');
      } catch {
        return await make('CPU');
      }
    })();
    promise.catch(() => {
      promise = null; // allow retry
    });
  }
  return promise;
}
