import type { HintCode } from '../types';

/**
 * Branding and copy. Everything a designer or marketer might change lives here
 * (plus colours/fonts in src/styles/theme.css).
 */
export const BRAND = {
  name: 'Your Brand', // TODO: final brand name
  /** Drop a logo into /public/brand and set e.g. '/brand/logo.svg'. Leave undefined for the placeholder mark. */
  logoSrc: undefined as string | undefined,

  copy: {
    idle: {
      headline: 'Find the mask that fits your face.',
      sub: 'A quick camera scan picks your size in about 20 seconds.',
      cta: 'Touch to begin',
    },
    select: {
      title: 'Ready for your scan?',
      steps: [
        'Stand about an arm\u2019s length from the screen.',
        'Take off glasses and move hair away from your face.',
        'Look straight at the camera and hold still.',
      ],
      privacy: 'The camera image is used only for this scan and is not saved.',
      start: 'Start scan',
      back: 'Back',
    },
    scan: {
      title: 'Scanning',
      cancel: 'Cancel',
      live: 'Eye distance',
      checks: {
        face: 'Face found',
        distance: 'Good distance',
        centered: 'Centered in frame',
        frontal: 'Looking straight ahead',
      },
      hints: {
        loading: 'Starting the camera\u2026',
        'no-face': 'Step in front of the camera.',
        closer: 'Move a little closer.',
        back: 'Move back a little.',
        center: 'Center your face in the oval.',
        straight: 'Look straight at the camera.',
        hold: 'Hold still\u2026',
        done: 'Got it!',
      } satisfies Record<HintCode, string>,
      cameraError: {
        title: 'Camera not available',
        body: 'Allow camera access for this site, check the camera is connected, then try again.',
      },
      modelError: {
        title: 'Face scanner did not load',
        body: 'Check the internet connection (or the self-hosted model files), then try again.',
      },
      retry: 'Try again',
      demo: 'Use sample measurement',
    },
    result: {
      title: 'Your recommended size',
      drawerLine: (drawer: number) => `Pick up your mask from drawer ${drawer} at the storage kiosk.`,
      closeTo: (name: string, drawer: number) =>
        `You\u2019re close to ${name}. If this size feels tight or loose, try ${name} from drawer ${drawer}.`,
      measurements: 'Your measurements',
      eyeDistance: 'Eye distance',
      faceWidth: 'Face width',
      faceHeight: 'Face height',
      unsteady: 'The scan was a little unsteady. Scan again for the best accuracy.',
      rescan: 'Scan again',
      done: 'Done',
    },
  },
};
