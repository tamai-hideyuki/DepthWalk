import { ctx, W, H } from "./canvas.js";
import { player } from "./player.js";
import { castRays } from "./raycaster.js";
import { floor as floorColor, grass, sky } from "./colors.js";
import { RENDER, BRIGHTNESS } from "./constants.js";
import { getCell, isOutside } from "./world.js";

function renderFloor(heightOffset: number, outside: boolean) {
  const halfH = H / 2;
  // pitchを考慮した床の開始位置
  const floorStart = Math.max(0, Math.floor(halfH + player.pitch - heightOffset));

  for (let y = floorStart; y < H; y++) {
    // 距離計算はpitchを含めて正確に
    const rowDist = halfH / (y - halfH - player.pitch + heightOffset + 0.1);
    if (rowDist < 0) continue;

    const brightness = Math.max(0, BRIGHTNESS.FLOOR_BASE - rowDist * BRIGHTNESS.FLOOR_FALLOFF);

    const floorX = player.x + Math.cos(player.angle) * rowDist;
    const floorY = player.y + Math.sin(player.angle) * rowDist;

    const stripe = Math.floor(floorX * 4 + floorY * 4) % 2;
    const shade = stripe === 0 ? 1 : 0.7;

    ctx.fillStyle = outside ? grass(brightness, shade) : floorColor(brightness, shade);
    ctx.fillRect(0, y, W, 1);
  }
}

function renderCeiling(heightOffset: number, outside: boolean) {
  const halfH = H / 2;
  // pitchを考慮した天井の終了位置
  const ceilingEnd = Math.min(H, Math.floor(halfH + player.pitch - heightOffset));

  if (outside) {
    // 外では空のグラデーション
    for (let y = 0; y < ceilingEnd; y++) {
      // 空の高さ比率は画面全体に対して計算（視点に依存しない）
      const heightRatio = 1 - y / halfH;
      ctx.fillStyle = sky(120, Math.max(0, Math.min(1, heightRatio)));
      ctx.fillRect(0, y, W, 1);
    }
  } else {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, W, Math.max(0, ceilingEnd));
  }
}

function clearScreen() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
}

export function render() {
  const heightOffset = player.z * RENDER.HEIGHT_MULTIPLIER;
  const currentCell = getCell(player.floor, player.y, player.x);
  const outside = isOutside(currentCell);

  clearScreen();
  renderCeiling(heightOffset, outside);
  renderFloor(heightOffset, outside);
  castRays(ctx, W, H, heightOffset);
}
