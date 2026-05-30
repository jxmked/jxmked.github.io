import './common-import';
import './styles/index.scss';

import { getColorSync } from 'colorthief';
import chroma from 'chroma-js';

const divSequel = document.getElementsByClassName(
  'div-sequel'
) as HTMLCollectionOf<HTMLElement>;

const h_container = document.getElementsByClassName(
  'hero-container'
) as HTMLCollectionOf<HTMLElement>;
const h_header = document.getElementById('hero-primary-heading') as HTMLHeadingElement;

const img = new Image();
img.crossOrigin = 'Anonymous'; // Prevents CORS issues

if (Math.random() < 0.5) {
  img.src = './jovan-de-guia-AfRn_BgzCP8-unsplash.jpg';
} else {
  img.src = './jovan-de-guia-JE5UAqEkt88-unsplash.jpg';
}
// img.src = './jovan-de-guia-AfRn_BgzCP8-unsplash.jpg';
// img.src = './jovan-de-guia-JE5UAqEkt88-unsplash.jpg';

img.addEventListener('load', function () {

  // return;
  const color = getColorSync(img);

  if (!color) return;

  const rgb = invertRGBArray(color.rgb(), 1);
  const invertedColor = getComplementaryRGB(rgb);

  for (const e of Array.from(h_container)) {
    e.style.backgroundImage = `url(${img.src})`;
  }

  h_header.style.backgroundImage = `url(${img.src})`;

  const transparency = color.isDark ? 0.45 : 0.25;
  // const transparency = .75;

  const rgbStr = `rgb(${invertedColor.r}, ${invertedColor.g}, ${invertedColor.b}, ${transparency})`;

  for (const e of Array.from(divSequel)) {
    e.style.backgroundColor = rgbStr;
  }
});

function invertRGBArray(rgb: ColorRGB, brightness: number): ColorRGB {
  return {
    r: Math.floor((255 - rgb.r) * brightness),
    g: Math.floor((255 - rgb.g) * brightness),
    b: Math.floor((255 - rgb.b) * brightness)
  };
}

function getComplementaryRGB(rgb: ColorRGB): ColorRGB {
  const color = chroma([rgb.r, rgb.g, rgb.b]);

  const [h, s, l] = color.hsl();

  const compHue = (h + 180) % 360;

  const colorArray = chroma.hsl(compHue, s, l).rgb().map(Math.round);

  return {
    r: colorArray[0],
    g: colorArray[1],
    b: colorArray[2]
  };
}
