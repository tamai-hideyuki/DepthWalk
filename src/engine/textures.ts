import { rgb, rgbShade, wood } from "./colors.js";

// ドアのテクスチャパターンを描画
export function drawDoorTexture(
  ctx: CanvasRenderingContext2D,
  x: number,
  wallTop: number,
  wallHeight: number,
  wallPos: number,
  brightness: number,
  isUpStair: boolean
) {
  const woodR = brightness * 0.6;
  const woodG = brightness * 0.4;
  const woodB = brightness * 0.2;

  // 縦の木目ストライプ
  const plankWidth = 0.125;
  const plankIndex = Math.floor(wallPos / plankWidth);
  const plankShade = plankIndex % 2 === 0 ? 1.0 : 0.85;

  // ベースの木の色
  ctx.fillStyle = wood(brightness, plankShade);
  ctx.fillRect(x, wallTop, 1, wallHeight);

  // 板の境界線
  const posInPlank = (wallPos % plankWidth) / plankWidth;
  if (posInPlank < 0.08 || posInPlank > 0.92) {
    ctx.fillStyle = wood(brightness, 0.5);
    ctx.fillRect(x, wallTop, 1, wallHeight);
  }

  // 上部パネル（窓風）
  const panelTop = wallTop + wallHeight * 0.08;
  const panelHeight = wallHeight * 0.35;

  if (wallPos > 0.15 && wallPos < 0.85) {
    const windowMargin = 0.2;
    if (wallPos > windowMargin && wallPos < 1 - windowMargin) {
      // 窓の内側
      const glassColor = isUpStair
        ? rgbShade(brightness, 0.1, 0.3, 0.1)
        : rgbShade(brightness, 0.3, 0.1, 0.1);
      ctx.fillStyle = glassColor;
      ctx.fillRect(x, panelTop, 1, panelHeight);

      // 窓の十字の桟
      if (Math.abs(wallPos - 0.5) < 0.05) {
        ctx.fillStyle = rgb(woodR * 0.7, woodG * 0.7, woodB * 0.7);
        ctx.fillRect(x, panelTop, 1, panelHeight);
      }
    }
  }

  // 下部パネル
  const lowerPanelTop = wallTop + wallHeight * 0.5;
  const lowerPanelHeight = wallHeight * 0.42;

  if (wallPos > 0.15 && wallPos < 0.85) {
    ctx.fillStyle = wood(brightness, 0.75);
    ctx.fillRect(x, lowerPanelTop, 1, lowerPanelHeight);

    // パネル内の中央線
    const panelMidY = lowerPanelTop + lowerPanelHeight * 0.48;
    const dividerHeight = lowerPanelHeight * 0.04;
    ctx.fillStyle = wood(brightness, 0.6);
    ctx.fillRect(x, panelMidY, 1, dividerHeight);
  }

  // ドアノブ
  if (wallPos > 0.75 && wallPos < 0.85) {
    const knobY = wallTop + wallHeight * 0.55;
    const knobHeight = wallHeight * 0.05;
    ctx.fillStyle = rgbShade(brightness, 0.8, 0.7, 0.3);
    ctx.fillRect(x, knobY, 1, knobHeight);
  }

  // 外枠
  const frameWidth = 0.08;
  if (wallPos < frameWidth || wallPos > 1 - frameWidth) {
    ctx.fillStyle = wood(brightness, 0.4);
    ctx.fillRect(x, wallTop, 1, wallHeight);
  }

  // 上下の枠
  const topFrameHeight = wallHeight * 0.06;
  const bottomFrameHeight = wallHeight * 0.04;
  ctx.fillStyle = wood(brightness, 0.4);
  ctx.fillRect(x, wallTop, 1, topFrameHeight);
  ctx.fillRect(x, wallTop + wallHeight - bottomFrameHeight, 1, bottomFrameHeight);

  // 上り/下りの矢印マーク
  if (wallPos > 0.45 && wallPos < 0.55) {
    const arrowY = wallTop + wallHeight * 0.25;
    const arrowHeight = wallHeight * 0.08;
    const arrowColor = isUpStair
      ? rgbShade(brightness, 0.5, 1, 0.5)
      : rgbShade(brightness, 1, 0.5, 0.5);
    ctx.fillStyle = arrowColor;
    ctx.fillRect(x, arrowY, 1, arrowHeight);
  }
}
