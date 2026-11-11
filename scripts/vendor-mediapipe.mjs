// Self-host the MediaPipe runtime + face model so the kiosk works fully offline.
// Run once:  npm run vendor      then set VITE_LOCAL_VISION=true in a .env.local file.
import { cp, mkdir, writeFile } from 'node:fs/promises';

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

await mkdir('public/mediapipe', { recursive: true });
await mkdir('public/models', { recursive: true });
await cp('node_modules/@mediapipe/tasks-vision/wasm', 'public/mediapipe/wasm', { recursive: true });
console.log('Copied MediaPipe wasm -> public/mediapipe/wasm');

const res = await fetch(MODEL_URL);
if (!res.ok) throw new Error(`Model download failed: ${res.status}`);
await writeFile('public/models/face_landmarker.task', Buffer.from(await res.arrayBuffer()));
console.log('Downloaded model -> public/models/face_landmarker.task');
console.log('Now create .env.local containing: VITE_LOCAL_VISION=true');
