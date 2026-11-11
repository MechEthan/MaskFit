import type { FrameGeometry } from '../types';

const GLASS = '#9FE3D3';
const SUN = '#FFC24D';

/** Draws the measurement guides (irises, eye line, cheek line) over the video. */
export function drawOverlay(
  ctx: CanvasRenderingContext2D,
  geo: FrameGeometry | null,
  w: number,
  h: number,
  locked: boolean,
) {
  ctx.clearRect(0, 0, w, h);
  if (!geo) return;
  const color = locked ? GLASS : SUN;
  const lw = Math.max(2, w / 360);
  ctx.lineWidth = lw;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  for (const iris of [geo.rIris, geo.lIris]) {
    ctx.beginPath();
    ctx.arc(iris.x, iris.y, Math.max(iris.r, 3), 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(iris.x, iris.y, lw * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.beginPath();
  ctx.moveTo(geo.rIris.x, geo.rIris.y);
  ctx.lineTo(geo.lIris.x, geo.lIris.y);
  ctx.stroke();

  ctx.setLineDash([lw * 3, lw * 3]);
  ctx.beginPath();
  ctx.moveTo(geo.rCheek.x, geo.rCheek.y);
  ctx.lineTo(geo.lCheek.x, geo.lCheek.y);
  ctx.stroke();
  ctx.setLineDash([]);
}
