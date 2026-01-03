import { ctx, W, H } from "./canvas.js";
import { player } from "./player.js";
import { castRays } from "./raycaster.js";

export function render() {
  // 天井
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0 + player.pitch, W, H / 2);

  // 床
  ctx.fillStyle = "#000";
  ctx.fillRect(0, H / 2 + player.pitch, W, H / 2);

  castRays(ctx, W, H);
}
