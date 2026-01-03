// RGB文字列を生成
export function rgb(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`;
}

// 明るさと乗数からRGB文字列を生成
export function rgbShade(
  brightness: number,
  rMul: number,
  gMul: number,
  bMul: number
): string {
  return rgb(brightness * rMul, brightness * gMul, brightness * bMul);
}

// グレースケール
export function gray(brightness: number): string {
  return rgb(brightness, brightness, brightness);
}

// 木の色（茶色ベース）
export function wood(brightness: number, shade: number = 1): string {
  return rgb(
    brightness * 0.6 * shade,
    brightness * 0.4 * shade,
    brightness * 0.2 * shade
  );
}

// 床の色（茶色系）
export function floor(brightness: number, shade: number = 1): string {
  return rgb(
    brightness * shade * 1.2,
    brightness * shade * 0.8,
    brightness * shade * 0.4
  );
}
