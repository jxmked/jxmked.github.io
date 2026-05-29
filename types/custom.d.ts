type IToArrayValue<T> = {
  [K in keyof T]: Array<T[K]>;
};

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}
