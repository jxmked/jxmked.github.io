import './common-import';
import './styles/index.scss';

import { invertedRGB, getComplementaryRGB } from './util/rgb';
import { getColorSync } from 'colorthief';
import raf from 'raf';

const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

function loop(time: number) {
  raf(loop);
}

function hero_resize() {
  const w = window.innerWidth * 2;
  const h = canvas.height;
  canvas.width = w;
  canvas.height = h;

  drawHelixOnCanvas(ctx, w, h);
}

document.addEventListener('DOMContentLoaded', () => {
  hero_resize();
  raf(loop);
});

document.addEventListener('resize', hero_resize);

interface Point3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Generates the points along the 3D helix path.
 */
function generateHelixPoints(steps = 200): Point3D[] {
  const points: Point3D[] = [];
  const minT = -4 * Math.PI;
  const maxT = 4 * Math.PI;

  for (let i = 0; i <= steps; i++) {
    // Linearly interpolate t between -4π and 4π
    const t = minT + (maxT - minT) * (i / steps);

    points.push({
      x: 2 * Math.cos(t),
      y: 2 * Math.sin(t),
      z: t / 3
    });
  }
  return points;
}

/**
 * Draws the 3D helix onto a 2D HTML5 Canvas context.
 * * @param ctx - The 2D rendering context of the canvas
 * @param width - Canvas width for centering
 * @param height - Canvas height for centering
 * @param angleX - Rotation around the X-axis (in radians)
 * @param angleY - Rotation around the Y-axis (in radians)
 */
function drawHelixOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  angleX = 0.5, // Tilted slightly down
  angleY = 0.5 // Tilted slightly sideways
): void {
  const points = generateHelixPoints(400); // 400 steps for a ultra-smooth curve
  const scale = 40; // Scale factor to make the math coordinates fit the pixel space

  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000000'; // Black line like your image

  points.forEach((point, index) => {
    // 1. Rotate around Y-axis
    const x1 = point.x * Math.cos(angleY) - point.z * Math.sin(angleY);
    const z1 = point.x * Math.sin(angleY) + point.z * Math.cos(angleY);

    // 2. Rotate around X-axis
    const y2 = point.y * Math.cos(angleX) - z1 * Math.sin(angleX);
    // z2 = point.y * Math.sin(angleX) + z1 * Math.cos(angleX); (Not needed unless doing perspective)

    // 3. Project to 2D screen coordinates (Orthographic projection + Center on Canvas)
    const screenX = width / 2 + x1 * scale;
    const screenY = height / 2 - y2 * scale; // Invert Y because canvas Y goes downwards

    if (index === 0) {
      ctx.moveTo(screenX, screenY);
    } else {
      ctx.lineTo(screenX, screenY);
    }
  });

  ctx.stroke();
}
