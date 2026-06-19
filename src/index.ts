import './common-import';
import './styles/index.scss';

import { invertedRGB, getComplementaryRGB } from './util/rgb';
import { getColorSync } from 'colorthief';

import { lerp, clamp } from './util';

import Stats from './lib/stats';

import raf from 'raf';

const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
// const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// const stats = new Stats(ctx);

// stats.text({ x: 50, y: 50 }, '', ' FPS');
// // prettier-ignore
// stats.container({ x: 10, y: 10 }, { x: 180, y: 60 });

// Stats.TEXT_COLOR = '#FFFFFF';
// Stats.SHOW_FPS = true;

// const line_speed = 0.1; // px per second

// let _lastTime = 0;

// const speed = 10000;
// const maxTheta = 12 * Math.PI;
// const climb_rate = 3.9;

// let _x = canvas.width / 2;
// let _y = 0;

// function loop(time: number) {
//   const dt = time - _lastTime;

//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   const theta = 0.001 + ((time % speed) / speed) * (maxTheta - 0.001);

//   _lastTime = time;

//   stats.mark();
//   raf(loop);
// }

const vertexShaderSource = `#version 300 es
in vec2 a_position;

void main() {
    // Pass the position directly to clip space
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

out vec4 outColor;

uniform float u_gridSize;
uniform float u_thickness;

void main() {
    // gl_FragCoord.xy contains the pixel coordinates of the current fragment
    vec2 coord = gl_FragCoord.xy;
    
    // mod() wraps the coordinate around based on the grid size
    vec2 grid = mod(coord, u_gridSize);
    
    // If the pixel falls within the thickness threshold on either the X or Y axis, color it
    if (grid.x < u_thickness || grid.y < u_thickness) {
        outColor = vec4(0.3, 0.6, 0.9, 0.0); // Light blue grid lines
    } else {
        outColor = vec4(0.05, 0.05, 0.08, 1.0); // Dark background
    }
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function main() {
  const gl = canvas.getContext('webgl2');

  if (!gl) {
    alert('WebGL2 is not supported by your browser.');
    return;
  }

  // 1. Compile Shaders and Link Program
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    return;
  }

  // 2. Set up the Full-Screen Quad Buffer
  // These coordinates represent two triangles that make up a perfect square covering clip space (-1 to 1)
  const positions = new Float32Array([
    -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0
  ]);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  // 3. Connect the buffer to the 'a_position' attribute in the vertex shader
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // 4. Look up Uniform Locations
  const gridSizeLocation = gl.getUniformLocation(program, 'u_gridSize');
  const thicknessLocation = gl.getUniformLocation(program, 'u_thickness');

  // 5. Render
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  // Set grid parameters: 50 pixels wide, 1.5 pixels thick
  gl.uniform1f(gridSizeLocation, 3);
  gl.uniform1f(thicknessLocation, 1.0);

  // Draw the 6 vertices (2 triangles = 1 quad)
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function hero_resize() {
  const w = window.innerWidth * 2;
  const h = window.innerHeight * 2;
  canvas.width = 800;
  canvas.height = 600;
}

document.addEventListener('DOMContentLoaded', () => {
  hero_resize();
  // raf(loop);
  main();
});

document.addEventListener('resize', hero_resize);
