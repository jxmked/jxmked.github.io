import './common-import';
import './styles/index.scss';

import { invertedRGB, getComplementaryRGB } from './util/rgb';
import { getColorSync } from 'colorthief';

const divSequel = document.getElementsByClassName(
  'div-sequel'
) as HTMLCollectionOf<HTMLElement>;

const h_container = document.getElementsByClassName(
  'hero-container'
) as HTMLCollectionOf<HTMLElement>;
const h_header = document.getElementById('hero-primary-heading') as HTMLHeadingElement;

const img = new Image();
img.crossOrigin = 'Anonymous'; // Prevents CORS issues

// if (Math.random() < 0.5) {
//   img.src = './jovan-de-guia-AfRn_BgzCP8-unsplash.webp';
// } else {
//   img.src = './jovan-de-guia-JE5UAqEkt88-unsplash.webp';
// }
img.src = './20260530_104050.webp';
// img.src = './jovan-de-guia-JE5UAqEkt88-unsplash.jpg';

img.addEventListener('load', function () {
  const color = getColorSync(img);

  if (!color) return;

  const rgb = invertedRGB(color.rgb(), 1);
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
