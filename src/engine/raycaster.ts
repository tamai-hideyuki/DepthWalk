import { player } from "./player.js";
import { map } from "./world.js";

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

    while (dist < 20) {
      const rx = player.x + Math.cos(rayAngle) * dist;
      const ry = player.y + Math.sin(rayAngle) * dist;

      const cell = map[player.floor]?.[Math.floor(ry)]?.[Math.floor(rx)];
      // 壁（1）または階段（3, 4）にヒットしたら終了
      if (cell === 1 || cell === 3 || cell === 4) {
        hitCell = cell;
        break;
      }

      dist += 0.02;
    }

    const correctedDist = dist * Math.cos(rayAngle - player.angle);
    const wallHeight = H / correctedDist;

    const brightness = Math.max(0, 200 - dist * 15);

    // セルタイプに応じた色
    let r = brightness;
    let g = brightness;
    let b = brightness;

    if (hitCell === 3) {
      // 上り階段 → 緑
      r = brightness * 0.3;
      g = brightness;
      b = brightness * 0.3;
    } else if (hitCell === 4) {
      // 下り階段 → 赤
      r = brightness;
      g = brightness * 0.3;
      b = brightness * 0.3;
    }

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

    ctx.fillRect(
      x,
      H / 2 - wallHeight / 2 + player.pitch - heightOffset,
      1,
      wallHeight
    );
  }
}
