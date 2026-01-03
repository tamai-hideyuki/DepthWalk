import { ctx, W, H } from "./canvas.js";
import { player } from "./player.js";
import { castRays } from "./raycaster.js";
import { floor as floorColor } from "./colors.js";
import { RENDER, BRIGHTNESS } from "./constants.js";

function renderFloor(heightOffset: number) {
  const halfH = H / 2;

  for (let y = halfH; y < H; y++) {
    const rowDist = halfH / (y - halfH + player.pitch - heightOffset + 0.1);
    const brightness = Math.max(0, BRIGHTNESS.FLOOR_BASE - rowDist * BRIGHTNESS.FLOOR_FALLOFF);

    const floorX = player.x + Math.cos(player.angle) * rowDist;
    const floorY = player.y + Math.sin(player.angle) * rowDist;

    const stripe = Math.floor(floorX * 4 + floorY * 4) % 2;
    const shade = stripe === 0 ? 1 : 0.7;

    ctx.fillStyle = floorColor(brightness, shade);
    ctx.fillRect(0, y, W, 1);
  }
}

function renderCeiling(heightOffset: number) {
  const halfH = H / 2;
  const ceilingEnd = halfH + player.pitch - heightOffset;

  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, W, ceilingEnd);
}

function clearScreen() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
}

export function render() {
  const heightOffset = player.z * RENDER.HEIGHT_MULTIPLIER;

  clearScreen();
  renderCeiling(heightOffset);
  renderFloor(heightOffset);
  castRays(ctx, W, H, heightOffset);
}
