import chroma from 'chroma-js';

export function invertedRGB(rgb: ColorRGB, brightness = 1): ColorRGB {
  return {
    r: Math.floor((255 - rgb.r) * brightness),
    g: Math.floor((255 - rgb.g) * brightness),
    b: Math.floor((255 - rgb.b) * brightness)
  };
}

export function getComplementaryRGB(rgb: ColorRGB): ColorRGB {
  const color = chroma([rgb.r, rgb.g, rgb.b]);

  const [h, s, l] = color.hsl();

  const rgbColor = chroma.hsl((h + 180) % 360, s, l).rgb();

  return {
    r: Math.round(rgbColor[0]),
    g: Math.round(rgbColor[1]),
    b: Math.round(rgbColor[2])
  };
}
