import { player } from "./player.js";
import { map } from "./world.js";

// ドアのテクスチャパターンを描画
function drawDoorTexture(
  ctx: CanvasRenderingContext2D,
  x: number,
  wallTop: number,
  wallHeight: number,
  wallPos: number,
  brightness: number,
  isUpStair: boolean
) {
  // ドアの木の色（茶色ベース）
  const woodR = brightness * 0.6;
  const woodG = brightness * 0.4;
  const woodB = brightness * 0.2;

  // 縦の木目ストライプ
  const plankWidth = 0.125; // 8分割
  const plankIndex = Math.floor(wallPos / plankWidth);
  const plankShade = plankIndex % 2 === 0 ? 1.0 : 0.85;

  // ベースの木の色
  ctx.fillStyle = `rgb(${woodR * plankShade}, ${woodG * plankShade}, ${woodB * plankShade})`;
  ctx.fillRect(x, wallTop, 1, wallHeight);

  // 板の境界線（縦線）
  const posInPlank = (wallPos % plankWidth) / plankWidth;
  if (posInPlank < 0.08 || posInPlank > 0.92) {
    ctx.fillStyle = `rgb(${woodR * 0.5}, ${woodG * 0.5}, ${woodB * 0.5})`;
    ctx.fillRect(x, wallTop, 1, wallHeight);
  }

  // 上部パネル（窓風）
  const panelTop = wallTop + wallHeight * 0.08;
  const panelHeight = wallHeight * 0.35;

  // 窓の位置（中央付近のみ）
  if (wallPos > 0.15 && wallPos < 0.85) {
    // 窓枠
    const windowMargin = 0.2;
    if (wallPos > windowMargin && wallPos < 1 - windowMargin) {
      // 窓の内側（暗い色 = ガラス風）
      const glassColor = isUpStair
        ? `rgb(${brightness * 0.1}, ${brightness * 0.3}, ${brightness * 0.1})`
        : `rgb(${brightness * 0.3}, ${brightness * 0.1}, ${brightness * 0.1})`;
      ctx.fillStyle = glassColor;
      ctx.fillRect(x, panelTop, 1, panelHeight);

      // 窓の十字の桟
      const crossWidth = 0.05;
      if (Math.abs(wallPos - 0.5) < crossWidth) {
        ctx.fillStyle = `rgb(${woodR * 0.7}, ${woodG * 0.7}, ${woodB * 0.7})`;
        ctx.fillRect(x, panelTop, 1, panelHeight);
      }
    }
  }

  // 下部パネル（2つの長方形パネル）
  const lowerPanelTop = wallTop + wallHeight * 0.5;
  const lowerPanelHeight = wallHeight * 0.42;

  if (wallPos > 0.15 && wallPos < 0.85) {
    // パネルの凹み
    const panelShade = 0.75;
    ctx.fillStyle = `rgb(${woodR * panelShade}, ${woodG * panelShade}, ${woodB * panelShade})`;
    ctx.fillRect(x, lowerPanelTop, 1, lowerPanelHeight);

    // パネル内の中央線（2分割）
    const panelMidY = lowerPanelTop + lowerPanelHeight * 0.48;
    const dividerHeight = lowerPanelHeight * 0.04;
    ctx.fillStyle = `rgb(${woodR * 0.6}, ${woodG * 0.6}, ${woodB * 0.6})`;
    ctx.fillRect(x, panelMidY, 1, dividerHeight);
  }

  // ドアノブ（右側）
  if (wallPos > 0.75 && wallPos < 0.85) {
    const knobY = wallTop + wallHeight * 0.55;
    const knobHeight = wallHeight * 0.05;
    // 金属色
    ctx.fillStyle = `rgb(${brightness * 0.8}, ${brightness * 0.7}, ${brightness * 0.3})`;
    ctx.fillRect(x, knobY, 1, knobHeight);
  }

  // 外枠（暗い茶色）
  const frameWidth = 0.08;
  if (wallPos < frameWidth || wallPos > 1 - frameWidth) {
    ctx.fillStyle = `rgb(${woodR * 0.4}, ${woodG * 0.4}, ${woodB * 0.4})`;
    ctx.fillRect(x, wallTop, 1, wallHeight);
  }

  // 上下の枠
  const topFrameHeight = wallHeight * 0.06;
  const bottomFrameHeight = wallHeight * 0.04;
  ctx.fillStyle = `rgb(${woodR * 0.4}, ${woodG * 0.4}, ${woodB * 0.4})`;
  ctx.fillRect(x, wallTop, 1, topFrameHeight);
  ctx.fillRect(x, wallTop + wallHeight - bottomFrameHeight, 1, bottomFrameHeight);

  // 上り/下りの矢印マーク
  const arrowY = wallTop + wallHeight * 0.25;
  const arrowHeight = wallHeight * 0.08;
  if (wallPos > 0.45 && wallPos < 0.55) {
    const arrowColor = isUpStair
      ? `rgb(${brightness * 0.5}, ${brightness}, ${brightness * 0.5})`
      : `rgb(${brightness}, ${brightness * 0.5}, ${brightness * 0.5})`;
    ctx.fillStyle = arrowColor;
    ctx.fillRect(x, arrowY, 1, arrowHeight);
  }
}

export function castRays(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  heightOffset: number
) {
  const fov = Math.PI / 3;

  for (let x = 0; x < W; x++) {
    const rayAngle = player.angle - fov / 2 + (x / W) * fov;
    let dist = 0;
    let hitCell = 0;
    let hitX = 0;
    let hitY = 0;

    while (dist < 20) {
      const rx = player.x + Math.cos(rayAngle) * dist;
      const ry = player.y + Math.sin(rayAngle) * dist;

      const cell = map[player.floor]?.[Math.floor(ry)]?.[Math.floor(rx)];
      if (cell === 1 || cell === 3 || cell === 4) {
        hitCell = cell;
        hitX = rx;
        hitY = ry;
        break;
      }

      dist += 0.02;
    }

    const correctedDist = dist * Math.cos(rayAngle - player.angle);
    const wallHeight = H / correctedDist;
    const wallTop = H / 2 - wallHeight / 2 + player.pitch - heightOffset;

    const brightness = Math.max(0, 200 - dist * 15);

    // 通常の壁
    if (hitCell === 1) {
      ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
      ctx.fillRect(x, wallTop, 1, wallHeight);
    }
    // 階段（ドア風）
    else if (hitCell === 3 || hitCell === 4) {
      const cellX = hitX - Math.floor(hitX);
      const cellY = hitY - Math.floor(hitY);

      const wallPos = Math.abs(Math.cos(rayAngle)) > Math.abs(Math.sin(rayAngle))
        ? cellY
        : cellX;

      drawDoorTexture(ctx, x, wallTop, wallHeight, wallPos, brightness, hitCell === 3);
    }
  }
}
