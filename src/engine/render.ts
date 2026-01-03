import { ctx, W, H } from "./canvas.js";
import { player } from "./player.js";
import { castRays } from "./raycaster.js";

function renderFloor(heightOffset: number) {
  const halfH = H / 2;

  for (let y = halfH; y < H; y++) {
    // 床までの距離を計算
    const rowDist = halfH / (y - halfH + player.pitch - heightOffset + 0.1);

    // 距離に応じた明暗
    const brightness = Math.max(0, 80 - rowDist * 3);

    // 木目調ストライプ（ワールド座標ベース）
    const floorX = player.x + Math.cos(player.angle) * rowDist;
    const floorY = player.y + Math.sin(player.angle) * rowDist;

    // ストライプパターン
    const stripe = Math.floor(floorX * 4 + floorY * 4) % 2;
    const shade = stripe === 0 ? 1 : 0.7;

    const r = brightness * shade * 1.2;  // 茶色っぽく
    const g = brightness * shade * 0.8;
    const b = brightness * shade * 0.4;

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, y, W, 1);
  }
}

function renderCeiling(heightOffset: number) {
  const halfH = H / 2;
  const ceilingEnd = halfH + player.pitch - heightOffset;

  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, W, ceilingEnd);
}

export function render() {
  const heightOffset = player.z * 40;

  // 背景をクリア
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);

  // 天井
  renderCeiling(heightOffset);

  // 床（木目調）
  renderFloor(heightOffset);

  // 壁
  castRays(ctx, W, H, heightOffset);
}
