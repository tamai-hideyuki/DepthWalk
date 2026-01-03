import { rgb, rgbShade, wood, grass, sky, windowFrame } from "./colors.js";

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

// ベンチのテクスチャ
export function drawBenchTexture(
  ctx: CanvasRenderingContext2D,
  x: number,
  wallTop: number,
  wallHeight: number,
  wallPos: number,
  brightness: number
) {
  // ベンチは下半分の高さ
  const benchHeight = wallHeight * 0.3;
  const benchTop = wallTop + wallHeight - benchHeight;

  // 座面（木の板）
  ctx.fillStyle = wood(brightness, 0.85);
  ctx.fillRect(x, benchTop, 1, benchHeight * 0.25);

  // 座面の側面
  ctx.fillStyle = wood(brightness, 0.7);
  ctx.fillRect(x, benchTop + benchHeight * 0.25, 1, benchHeight * 0.15);

  // 脚（両端のみ）
  const legTop = benchTop + benchHeight * 0.4;
  const legHeight = benchHeight * 0.6;
  if (wallPos < 0.12 || wallPos > 0.88) {
    ctx.fillStyle = wood(brightness, 0.5);
    ctx.fillRect(x, legTop, 1, legHeight);
  }
}

// 玄関ドアのテクスチャ
export function drawEntranceDoorTexture(
  ctx: CanvasRenderingContext2D,
  x: number,
  wallTop: number,
  wallHeight: number,
  wallPos: number,
  brightness: number
) {
  // ベースの木の色
  ctx.fillStyle = wood(brightness, 0.8);
  ctx.fillRect(x, wallTop, 1, wallHeight);

  // 外枠
  const frameWidth = 0.1;
  if (wallPos < frameWidth || wallPos > 1 - frameWidth) {
    ctx.fillStyle = wood(brightness, 0.5);
    ctx.fillRect(x, wallTop, 1, wallHeight);
  }

  // 上下の枠
  const topFrameHeight = wallHeight * 0.06;
  const bottomFrameHeight = wallHeight * 0.04;
  ctx.fillStyle = wood(brightness, 0.5);
  ctx.fillRect(x, wallTop, 1, topFrameHeight);
  ctx.fillRect(x, wallTop + wallHeight - bottomFrameHeight, 1, bottomFrameHeight);

  // 中央パネル
  if (wallPos > 0.2 && wallPos < 0.8) {
    const panelTop = wallTop + wallHeight * 0.15;
    const panelHeight = wallHeight * 0.7;
    ctx.fillStyle = wood(brightness, 0.65);
    ctx.fillRect(x, panelTop, 1, panelHeight);
  }

  // ドアノブ
  if (wallPos > 0.75 && wallPos < 0.88) {
    const knobY = wallTop + wallHeight * 0.5;
    const knobHeight = wallHeight * 0.06;
    ctx.fillStyle = rgbShade(brightness, 0.9, 0.8, 0.4);
    ctx.fillRect(x, knobY, 1, knobHeight);
  }
}

// 窓のテクスチャ - 軽量版
// viewFromOutside: 外から見ているかどうか
export function drawWindowTexture(
  ctx: CanvasRenderingContext2D,
  x: number,
  wallTop: number,
  wallHeight: number,
  wallPos: number,
  brightness: number,
  dist: number,
  viewFromOutside: boolean = false
) {
  const frameWidth = 0.1;
  const isFrame = wallPos < frameWidth || wallPos > 1 - frameWidth;

  // 窓枠
  const topFrameHeight = wallHeight * 0.08;
  const bottomFrameHeight = wallHeight * 0.06;

  if (isFrame) {
    // 縦の窓枠
    ctx.fillStyle = windowFrame(brightness);
    ctx.fillRect(x, wallTop, 1, wallHeight);
    return;
  }

  // 窓の中
  const glassTop = wallTop + topFrameHeight;
  const glassHeight = wallHeight - topFrameHeight - bottomFrameHeight;

  if (viewFromOutside) {
    // 外から見たとき：暗い室内が見える
    const interiorBrightness = Math.max(20, 60 - dist * 3);
    ctx.fillStyle = rgb(interiorBrightness * 0.2, interiorBrightness * 0.15, interiorBrightness * 0.1);
    ctx.fillRect(x, glassTop, 1, glassHeight);
  } else {
    // 室内から見たとき：外の景色が見える
    const skyHeight = glassHeight * 0.4;
    const skyBrightness = Math.max(50, 150 - dist * 5);
    const grassBrightness = Math.max(30, 120 - dist * 5);

    // 空（単色で一括描画）
    ctx.fillStyle = sky(skyBrightness, 0.5);
    ctx.fillRect(x, glassTop, 1, skyHeight);

    // 芝生（単色で一括描画）
    const grassTop2 = glassTop + skyHeight;
    const grassHeight2 = glassHeight - skyHeight;
    ctx.fillStyle = grass(grassBrightness, 1);
    ctx.fillRect(x, grassTop2, 1, grassHeight2);
  }

  // 窓の桟（十字）
  const crossWidth = 0.04;
  if (Math.abs(wallPos - 0.5) < crossWidth) {
    ctx.fillStyle = windowFrame(brightness);
    ctx.fillRect(x, glassTop, 1, glassHeight);
  }

  // 上下の窓枠
  ctx.fillStyle = windowFrame(brightness);
  ctx.fillRect(x, wallTop, 1, topFrameHeight);
  ctx.fillRect(x, wallTop + wallHeight - bottomFrameHeight, 1, bottomFrameHeight);
}
