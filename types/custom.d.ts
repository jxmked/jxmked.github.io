type IToArrayValue<T> = {
  [K in keyof T]: Array<T[K]>;
};

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface ColorHSL {
  h: number;
  s: number;
  l: number;
}

interface ICoordinate {
  x: number;
  y: number;
}
