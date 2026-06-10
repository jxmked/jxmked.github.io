import './common-import';
import './styles/index.scss';

import { invertedRGB, getComplementaryRGB } from './util/rgb';
import { getColorSync } from 'colorthief';

import Stats from './lib/stats';

import raf from 'raf';

const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const stats = new Stats(ctx);

stats.text({ x: 50, y: 50 }, '', ' FPS');
// prettier-ignore
stats.container({ x: 10, y: 10 }, { x: 180, y: 60 });

Stats.TEXT_COLOR = '#FFFFFF';
Stats.SHOW_FPS = true;

const line_speed = 0.1; // px per second

let _lastTime = 0;
let cur_pos = 0;

const amplitude = 60; // Peak height of the wave (2D radius)
const wavelength = 50; // Width of one full wave cycle (2D pitch)
let cycles = 10; // Number of wave peaks
const pointsCount = 100; // Curve resolution
let offset = 0; // Animates the movement along the horizontal axis

function loop(time: number) {
  const dt = time - _lastTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);


  ctx.save();

  ctx.translate(canvas.width / 2, canvas.height / 2); // Move origin to center
  ctx.rotate(Math.PI * 90 / 180); // Rotate 90 degrees to make the wave vertical
  ctx.translate(-canvas.width / 2, -canvas.height / 2); // Move origin back to top-left

  const totalWidth = cycles * wavelength;
  const startX = (canvas.width - totalWidth) / 2; // Centers the wave horizontally
  const centerY = canvas.height / 2; // Centers the wave vertically

  for (let i = 0; i <= pointsCount; i++) {
    // Percentage across the drawing path (0.0 to 1.0)
    const percent = i / pointsCount;

    // Calculate the static X position along the line
    const x = startX + percent * totalWidth;

    // Calculate the angle based on our position + animation offset
    const angle = percent * cycles * 2 * Math.PI - offset;

    // Pure 2D Math: Y position follows a perfect sine wave
    const y = centerY + amplitude * Math.sin(angle);

    ctx.arc(x, y, 2, 0, 2 * Math.PI); // Draw a small circle at the point

    // if (i === 0) {
    //   ctx.moveTo(x, y);
    // } else {
    //   ctx.lineTo(x, y);
    // }
  }

  ctx.stroke();

  // Change this value to adjust the speed of the crawling effect
  offset += 0.05;

  _lastTime = time;
  
  ctx.restore();
  stats.mark();
  raf(loop);
}

function hero_resize() {
  const w = window.innerWidth * 2;
  const h = window.innerHeight * 2;
  canvas.width = w;
  canvas.height = h;
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
  console.log(points);

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
