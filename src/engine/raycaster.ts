import { player } from "./player.js";
import { getCell, isWall, CELL } from "./world.js";
import { gray } from "./colors.js";
import { drawDoorTexture, drawWindowTexture } from "./textures.js";
import { RENDER, BRIGHTNESS } from "./constants.js";

type RayHit = {
  dist: number;
  cell: number;
  x: number;
  y: number;
};

function castRay(rayAngle: number): RayHit {
  let dist = 0;
  let hitCell = 0;
  let hitX = 0;
  let hitY = 0;

  while (dist < RENDER.MAX_DISTANCE) {
    const rx = player.x + Math.cos(rayAngle) * dist;
    const ry = player.y + Math.sin(rayAngle) * dist;

    const cell = getCell(player.floor, ry, rx);
    if (isWall(cell)) {
      hitCell = cell!;
      hitX = rx;
      hitY = ry;
      break;
    }

    dist += RENDER.RAY_STEP;
  }

  return { dist, cell: hitCell, x: hitX, y: hitY };
}

function getWallPosition(hit: RayHit, rayAngle: number): number {
  const cellX = hit.x - Math.floor(hit.x);
  const cellY = hit.y - Math.floor(hit.y);

  return Math.abs(Math.cos(rayAngle)) > Math.abs(Math.sin(rayAngle))
    ? cellY
    : cellX;
}

function renderWallSlice(
  ctx: CanvasRenderingContext2D,
  x: number,
  hit: RayHit,
  rayAngle: number,
  H: number,
  heightOffset: number
) {
  const correctedDist = hit.dist * Math.cos(rayAngle - player.angle);
  const wallHeight = H / correctedDist;
  const wallTop = H / 2 - wallHeight / 2 + player.pitch - heightOffset;
  const brightness = Math.max(0, BRIGHTNESS.WALL_BASE - hit.dist * BRIGHTNESS.WALL_FALLOFF);
  const wallPos = getWallPosition(hit, rayAngle);

  if (hit.cell === CELL.WALL) {
    ctx.fillStyle = gray(brightness);
    ctx.fillRect(x, wallTop, 1, wallHeight);
  } else if (hit.cell === CELL.STAIR_UP || hit.cell === CELL.STAIR_DOWN) {
    drawDoorTexture(ctx, x, wallTop, wallHeight, wallPos, brightness, hit.cell === CELL.STAIR_UP);
  } else if (hit.cell === CELL.WINDOW) {
    drawWindowTexture(ctx, x, wallTop, wallHeight, wallPos, brightness, hit.dist);
  }
}

export function castRays(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  heightOffset: number
) {
  for (let x = 0; x < W; x++) {
    const rayAngle = player.angle - RENDER.FOV / 2 + (x / W) * RENDER.FOV;
    const hit = castRay(rayAngle);
    renderWallSlice(ctx, x, hit, rayAngle, H, heightOffset);
  }
}
