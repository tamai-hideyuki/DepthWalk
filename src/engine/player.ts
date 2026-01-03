import { keys } from "./input.js";
import { map } from "./world.js";
import { H } from "./canvas.js";

export type Player = {
  x: number;
  y: number;
  floor: number;
  angle: number;
  pitch: number;
};

export const player: Player = {
  x: 3.5,
  y: 3.5,
  floor: 0,
  angle: 0,
  pitch: 0,
};

// 階段移動のクールダウン
let stairCooldown = 0;

function isWalkable(cell: number | undefined) {
  return cell === 0 || cell === 2 || cell === 3 || cell === 4;
}

function getCell(floor: number, y: number, x: number): number | undefined {
  return map[floor]?.[Math.floor(y)]?.[Math.floor(x)];
}

export function updatePlayer() {
  const speed = 0.05;
  const rot = 0.04;
  const pitchSpeed = 4;

  // 回転
  if (keys["a"]) player.angle -= rot;
  if (keys["d"]) player.angle += rot;

  // 視点上下
  if (keys["ArrowUp"]) player.pitch -= pitchSpeed;
  if (keys["ArrowDown"]) player.pitch += pitchSpeed;

  // pitch 制限（見上げすぎ防止）
  const maxPitch = H / 2;
  if (player.pitch > maxPitch) player.pitch = maxPitch;
  if (player.pitch < -maxPitch) player.pitch = -maxPitch;

  // 移動ベクトル
  const dx = Math.cos(player.angle) * speed;
  const dy = Math.sin(player.angle) * speed;

  // 前進
  if (keys["w"]) {
    if (isWalkable(getCell(player.floor, player.y, player.x + dx))) {
      player.x += dx;
    }
    if (isWalkable(getCell(player.floor, player.y + dy, player.x))) {
      player.y += dy;
    }
  }

  // 後退
  if (keys["s"]) {
    if (isWalkable(getCell(player.floor, player.y, player.x - dx))) {
      player.x -= dx;
    }
    if (isWalkable(getCell(player.floor, player.y - dy, player.x))) {
      player.y -= dy;
    }
  }

  // クールダウン減少
  if (stairCooldown > 0) {
    stairCooldown--;
    return; // クールダウン中は階段判定しない
  }

  // 階段判定
  const currentCell = getCell(player.floor, player.y, player.x);

  // 上り階段（3）に乗ったら上の階へ
  if (currentCell === 3 && player.floor < map.length - 1) {
    player.floor += 1;
    stairCooldown = 30; // 約0.5秒のクールダウン
  }

  // 下り階段（4）に乗ったら下の階へ
  if (currentCell === 4 && player.floor > 0) {
    player.floor -= 1;
    stairCooldown = 30;
  }
}
