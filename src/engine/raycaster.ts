import { map } from "./world.js";
import { player } from "./player.js";

export function castRays(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number
) {
  const fov = Math.PI / 3;

  for (let x = 0; x < W; x++) {
    const rayAngle = player.angle - fov / 2 + (x / W) * fov;
    let dist = 0;

    while (dist < 20) {
      const rx = player.x + Math.cos(rayAngle) * dist;
      const ry = player.y + Math.sin(rayAngle) * dist;

      const cell = map[Math.floor(ry)]?.[Math.floor(rx)];
      if (cell && cell > 0) break;

      dist += 0.02;
    }

    const correctedDist = dist * Math.cos(rayAngle - player.angle);
    const wallHeight = H / correctedDist;

    const brightness = Math.max(0, 200 - dist * 15);
    ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;

    ctx.fillRect(
      x,
      H / 2 - wallHeight / 2 + player.pitch,
      1,
      wallHeight
    );
  }
}
