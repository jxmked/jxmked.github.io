import './common-import';
import './styles/index.scss';

import { invertedRGB, getComplementaryRGB } from './util/rgb';
import { getColorSync } from 'colorthief';

import { lerp, clamp } from './util';

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

const speed = 10000;
const maxTheta = 12 * Math.PI;
const climb_rate = 3.9;

let _x = canvas.width / 2;
let _y = 0;

function loop(time: number) {
  const dt = time - _lastTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const theta = 0.001 + ((time % speed) / speed) * (maxTheta - 0.001);

  console.log(theta);
  const t = lerp(-4 * Math.PI, 4 * Math.PI, (time % speed) / speed);

  const r = (40 * Math.sin(theta)) / theta;

  // Convert Polar (r, theta) to Cartesian (x, y) for standard charting
  const x = r * Math.cos(theta);
  const y = r * Math.sin(theta);

  // ctx.beginPath();

  // ctx.arc(canvas.width / 2 + x * 100, canvas.height / 2 + y * 100, 5, 0, 2 * Math.PI);
  // ctx.fillStyle = '#FF0000';
  // ctx.fill();

  // ctx.closePath();

  ctx.beginPath();

  const xx = 2 * Math.cos(t) * climb_rate;
  const yy = 2 * Math.sin(t) * climb_rate;

  _x += xx;
  _y += yy;

  _x = clamp(_x, 0, canvas.width);
  _y = clamp(_y, 0, canvas.height);

  // console.log(_x, _y);

  ctx.arc(xx, yy, 10, 0, 2 * Math.PI);
  ctx.fillStyle = '#FF0000';
  ctx.fill();

  ctx.closePath();

  _lastTime = time;

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
