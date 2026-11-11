import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { APP } from '../config/app';
import { loadLandmarker } from '../lib/landmarker';
import { analyzeFrame, median, stdDev } from '../lib/measure';
import { drawOverlay } from '../lib/draw';
import type { FrameMetrics, Measurement, ScanState } from '../types';

const INITIAL: ScanState = {
  phase: 'loading',
  hint: 'loading',
  checks: { face: false, distance: false, centered: false, frontal: false },
  progress: 0,
  liveIpdMm: null,
};

interface Options {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /** Change this number to restart the camera and scan (used by "Try again"). */
  attempt: number;
  onComplete: (m: Measurement) => void;
}

export function useFaceScan({ videoRef, canvasRef, attempt, onComplete }: Options) {
  const [state, setState] = useState<ScanState>(INITIAL);
  const [videoSize, setVideoSize] = useState<{ w: number; h: number } | null>(null);
  const completeRef = useRef(onComplete);
  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let cancelled = false;
    let raf = 0;
    let stream: MediaStream | null = null;
    const samples: FrameMetrics[] = [];
    let badFrames = 0;
    let lastKey = '';
    let lastPush = 0;
    let lastVideoTime = -1;

    const push = (s: ScanState, force = false) => {
      const key = [
        s.phase,
        s.hint,
        Number(s.checks.face),
        Number(s.checks.distance),
        Number(s.checks.centered),
        Number(s.checks.frontal),
        Math.round(s.progress * 50),
        s.liveIpdMm === null ? '' : s.liveIpdMm.toFixed(1),
      ].join('|');
      const now = performance.now();
      if (key === lastKey) return;
      if (!force && now - lastPush < 80) return; // ~12 UI updates/sec is plenty
      lastKey = key;
      lastPush = now;
      setState(s);
    };

    const stopCamera = () => {
      stream?.getTracks().forEach((t) => t.stop());
      stream = null;
    };

    const run = async () => {
      setState(INITIAL);
      setVideoSize(null);

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch {
        if (!cancelled) setState({ ...INITIAL, phase: 'camera-error' });
        return;
      }
      if (cancelled) {
        stopCamera();
        return;
      }

      video.srcObject = stream;
      if (!video.videoWidth) {
        await new Promise<void>((res) =>
          video.addEventListener('loadedmetadata', () => res(), { once: true }),
        );
      }
      try {
        await video.play();
      } catch {
        /* autoplay can be blocked; muted+playsInline normally avoids it */
      }

      let landmarker;
      try {
        landmarker = await loadLandmarker();
      } catch {
        stopCamera();
        if (!cancelled) setState({ ...INITIAL, phase: 'model-error' });
        return;
      }
      if (cancelled) {
        stopCamera();
        return;
      }

      const w = video.videoWidth;
      const h = video.videoHeight;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      setVideoSize({ w, h });

      const loop = () => {
        if (cancelled) return;
        raf = requestAnimationFrame(loop);
        if (video.readyState < 2 || video.currentTime === lastVideoTime) return;
        lastVideoTime = video.currentTime;

        const result = landmarker.detectForVideo(video, performance.now());
        const a = analyzeFrame(result.faceLandmarks[0], w, h);
        const ok = a.checks.face && a.checks.distance && a.checks.centered && a.checks.frontal;

        if (ok && a.metrics) {
          badFrames = 0;
          samples.push(a.metrics);
        } else if (++badFrames > APP.scan.badFramesBeforeReset) {
          samples.length = 0;
        }

        if (ctx) drawOverlay(ctx, a.geometry, w, h, ok);
        const progress = Math.min(1, samples.length / APP.scan.framesRequired);

        if (progress >= 1) {
          cancelAnimationFrame(raf);
          const m: Measurement = {
            ipdMm: median(samples.map((s) => s.ipdMm)),
            faceWidthMm: median(samples.map((s) => s.faceWidthMm)),
            faceHeightMm: median(samples.map((s) => s.faceHeightMm)),
            spreadMm: stdDev(samples.map((s) => s.ipdMm)),
            frames: samples.length,
          };
          stopCamera();
          push({ ...INITIAL, phase: 'done', hint: 'done', checks: a.checks, progress: 1, liveIpdMm: m.ipdMm }, true);
          completeRef.current(m);
          return;
        }

        push({
          phase: 'scanning',
          hint: ok ? 'hold' : a.hint,
          checks: a.checks,
          progress,
          liveIpdMm: a.metrics && a.checks.face ? a.metrics.ipdMm : null,
        });
      };
      loop();
    };

    void run();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stopCamera();
      video.srcObject = null;
    };
  }, [videoRef, canvasRef, attempt]);

  return { state, videoSize };
}
