import { keys } from "./input.js";
import { map, getCell, isWalkable, CELL } from "./world.js";
import { H } from "./canvas.js";
import { PLAYER } from "./constants.js";

export type Player = {
  x: number;
  y: number;
  z: number;
  floor: number;
  angle: number;
  pitch: number;
};

export const player: Player = {
  x: 5.5,
  y: 5.5,
  z: 0,
  floor: 0,
  angle: 0,
  pitch: 0,
};

let stairCooldown = 0;

function handleRotation() {
  if (keys["a"]) player.angle -= PLAYER.ROTATE_SPEED;
  if (keys["d"]) player.angle += PLAYER.ROTATE_SPEED;
}

function handlePitch() {
  if (keys["ArrowUp"]) player.pitch -= PLAYER.PITCH_SPEED;
  if (keys["ArrowDown"]) player.pitch += PLAYER.PITCH_SPEED;

  const maxPitch = H / 2;
  player.pitch = Math.max(-maxPitch, Math.min(maxPitch, player.pitch));
}

function handleMovement() {
  const dx = Math.cos(player.angle) * PLAYER.MOVE_SPEED;
  const dy = Math.sin(player.angle) * PLAYER.MOVE_SPEED;

  if (keys["w"]) {
    if (isWalkable(getCell(player.floor, player.y, player.x + dx))) {
      player.x += dx;
    }
    if (isWalkable(getCell(player.floor, player.y + dy, player.x))) {
      player.y += dy;
    }
  }

  if (keys["s"]) {
    if (isWalkable(getCell(player.floor, player.y, player.x - dx))) {
      player.x -= dx;
    }
    if (isWalkable(getCell(player.floor, player.y - dy, player.x))) {
      player.y -= dy;
    }
  }
}

function handleStairs() {
  if (stairCooldown > 0) {
    stairCooldown--;
    return;
  }

  const currentCell = getCell(player.floor, player.y, player.x);

  if (currentCell === CELL.STAIR_UP && player.floor < map.length - 1) {
    player.floor += 1;
    stairCooldown = PLAYER.STAIR_COOLDOWN;
  }

  if (currentCell === CELL.STAIR_DOWN && player.floor > 0) {
    player.floor -= 1;
    stairCooldown = PLAYER.STAIR_COOLDOWN;
  }
}

export function updatePlayer() {
  handleRotation();
  handlePitch();
  handleMovement();
  handleStairs();
}
