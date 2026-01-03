import { player } from "./player.js";
import { getCell, isWall, isFurniture, isOutside, map, CELL } from "./world.js";
import { gray } from "./colors.js";
import { drawDoorTexture, drawEntranceDoorTexture, drawWindowTexture, drawBenchTexture } from "./textures.js";
import { RENDER, BRIGHTNESS } from "./constants.js";

type RayHit = {
  dist: number;
  cell: number;
  x: number;
  y: number;
  floor: number;
};

type RayResult = {
  wall: RayHit | null;
  furniture: RayHit | null;
};

// 現在のフロアでレイキャスト（室内用）- 壁と家具を別々に検出
function castRay(rayAngle: number): RayResult {
  let dist = 0;
  let wallHit: RayHit | null = null;
  let furnitureHit: RayHit | null = null;

  while (dist < RENDER.MAX_DISTANCE) {
    const rx = player.x + Math.cos(rayAngle) * dist;
    const ry = player.y + Math.sin(rayAngle) * dist;

    const cell = getCell(player.floor, ry, rx);

    // 家具を検出（まだ検出していない場合）
    if (!furnitureHit && isFurniture(cell)) {
      furnitureHit = { dist, cell: cell!, x: rx, y: ry, floor: player.floor };
    }

    // 壁を検出したら終了
    if (isWall(cell)) {
      wallHit = { dist, cell: cell!, x: rx, y: ry, floor: player.floor };
      break;
    }

    dist += RENDER.RAY_STEP;
  }

  return { wall: wallHit, furniture: furnitureHit };
}

// 全フロアをチェックしてヒットを返す（外から建物を見る用）
function castRayAllFloors(rayAngle: number): RayHit[] {
  const hits: RayHit[] = [];
  let dist = 0;

  while (dist < RENDER.MAX_DISTANCE) {
    const rx = player.x + Math.cos(rayAngle) * dist;
    const ry = player.y + Math.sin(rayAngle) * dist;

    // 全フロアをチェック
    for (let floor = 0; floor < map.length; floor++) {
      const cell = getCell(floor, ry, rx);
      if (isWall(cell)) {
        // まだこのフロアでヒットを記録していなければ追加
        if (!hits.some(h => h.floor === floor)) {
          hits.push({ dist, cell: cell!, x: rx, y: ry, floor });
        }
      }
    }

    // 全フロアでヒットしたら終了
    if (hits.length === map.length) break;

    dist += RENDER.RAY_STEP;
  }

  return hits;
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
  heightOffset: number,
  floorOffset: number = 0,
  playerOutside: boolean = false
) {
  const correctedDist = hit.dist * Math.cos(rayAngle - player.angle);
  const wallHeight = H / correctedDist;
  // floorOffsetで階ごとの高さをずらす（上の階ほど上に描画）
  const wallTop = H / 2 - wallHeight / 2 + player.pitch - heightOffset - floorOffset * wallHeight;
  const brightness = Math.max(0, BRIGHTNESS.WALL_BASE - hit.dist * BRIGHTNESS.WALL_FALLOFF);
  const wallPos = getWallPosition(hit, rayAngle);

  if (hit.cell === CELL.WALL) {
    ctx.fillStyle = gray(brightness);
    ctx.fillRect(x, wallTop, 1, wallHeight);
  } else if (hit.cell === CELL.STAIR_UP || hit.cell === CELL.STAIR_DOWN) {
    drawDoorTexture(ctx, x, wallTop, wallHeight, wallPos, brightness, hit.cell === CELL.STAIR_UP);
  } else if (hit.cell === CELL.WINDOW) {
    drawWindowTexture(ctx, x, wallTop, wallHeight, wallPos, brightness, hit.dist, playerOutside);
  } else if (hit.cell === CELL.DOOR) {
    drawEntranceDoorTexture(ctx, x, wallTop, wallHeight, wallPos, brightness);
  }
}

function renderFurnitureSlice(
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

  if (hit.cell === CELL.BENCH) {
    drawBenchTexture(ctx, x, wallTop, wallHeight, wallPos, brightness);
  }
}

export function castRays(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  heightOffset: number
) {
  // プレイヤーが外にいるかチェック
  const currentCell = getCell(player.floor, player.y, player.x);
  const playerOutside = isOutside(currentCell);

  for (let x = 0; x < W; x++) {
    const rayAngle = player.angle - RENDER.FOV / 2 + (x / W) * RENDER.FOV;

    if (playerOutside) {
      // 外にいるときは全フロアの建物を描画
      const hits = castRayAllFloors(rayAngle);
      // 遠い順（上の階から）描画して手前が上書き
      hits.sort((a, b) => b.floor - a.floor);
      for (const hit of hits) {
        const floorOffset = hit.floor - player.floor;
        renderWallSlice(ctx, x, hit, rayAngle, H, heightOffset, floorOffset, true);
      }
    } else {
      // 室内では現在のフロアのみ
      const result = castRay(rayAngle);
      // 先に壁を描画
      if (result.wall) {
        renderWallSlice(ctx, x, result.wall, rayAngle, H, heightOffset, 0, false);
      }
      // 家具は壁の手前に描画（上書き）
      if (result.furniture) {
        renderFurnitureSlice(ctx, x, result.furniture, rayAngle, H, heightOffset);
      }
    }
  }
}
