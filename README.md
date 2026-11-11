# Mask Fitting Kiosk UI (Kiosk A prototype)

Touch-screen software model for the face-scan fitting kiosk. Landscape layout, React + Vite + TypeScript.

**Flow:** Idle screen -> Start screen -> Camera scan -> Size recommendation -> back to idle.

The scan uses [MediaPipe Face Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker) in the browser. Nothing is uploaded or saved.

## Run it

```bash
npm install
npm run dev        # opens on http://localhost:5173
```

Camera access needs `localhost` or HTTPS. The first scan downloads the face model, so it needs internet unless you self-host (below).

No camera on your dev machine? Open `http://localhost:5173/?demo`, start a scan, and press **Use sample measurement**.

## What it measures

| Value | How |
|---|---|
| Eye distance (IPD) | Distance between the two iris centres |
| Face width | Cheek to cheek (approximate ear-to-ear width) |
| Face height | Forehead point to chin |

**Scale without a depth sensor:** the human iris is about 11.7 mm across, so it acts as a ruler (`irisDiameterMm` in `src/config/app.ts`). The kiosk collects about 25 good frames (face centred, right distance, facing forward) and reports the median.

**Expected accuracy:** roughly +/-2-3 mm on eye distance. Face width and height are less accurate because cheeks and chin sit at a different depth than the irises. Validate against real measurements before relying on it. A calibration card or a depth camera would improve it.

## Where to change things

| To change | Edit |
|---|---|
| Brand name, logo, all screen text | `src/config/brand.ts` (drop the logo in `public/brand/`) |
| Colours, font, corner radii | `src/styles/theme.css` |
| **Size thresholds** (placeholder S/M/L/XL by eye distance, drawer mapping) | `src/config/sizing.ts` |
| Scan strictness, timeouts, frames required | `src/config/app.ts` |
| Layout and styling | `src/styles/app.css` |

Screens live in `src/screens/`. The camera/measurement loop is `src/hooks/useFaceScan.ts` with the math in `src/lib/measure.ts`.

## Run fully offline (recommended for the real kiosk)

```bash
npm run vendor                      # copies the MediaPipe runtime, downloads the model
echo "VITE_LOCAL_VISION=true" > .env.local
npm run build && npm run preview
```

## Kiosk setup tips

- Chrome kiosk mode: `chrome --kiosk --use-fake-ui-for-media-stream http://localhost:4173` (the flag skips the camera permission prompt).
- Screen is designed for 16:9 landscape (for example 1920x1080) and scales with the display.
- Inactivity returns to the idle screen (30 s on the start screen, 90 s while scanning, 60 s on the result).

## Push to GitHub

```bash
git init && git add . && git commit -m "Kiosk A UI prototype"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

## Ideas for next steps

- Real size chart (possibly using face width and nose-bridge width, not just eye distance).
- Calibration with a known object or a depth camera.
- Hand the recommended size to the rental app / storage kiosk (drawer unlock).
- Multi-language copy (all text is in `brand.ts`).
