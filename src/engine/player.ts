import { keys } from "./input.js";
import { map } from "./world.js";
import { H } from "./canvas.js";

export type Player = {
  x: number;
  y: number;
  angle: number;
  pitch: number;
};

export const player: Player = {
  x: 3.5,
  y: 3.5,
  angle: 0,
  pitch: 0,
};

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
    if (map[Math.floor(player.y)]?.[Math.floor(player.x + dx)] === 0) {
      player.x += dx;
    }
    if (map[Math.floor(player.y + dy)]?.[Math.floor(player.x)] === 0) {
      player.y += dy;
    }
  }

  // 後退
  if (keys["s"]) {
    if (map[Math.floor(player.y)]?.[Math.floor(player.x - dx)] === 0) {
      player.x -= dx;
    }
    if (map[Math.floor(player.y - dy)]?.[Math.floor(player.x)] === 0) {
      player.y -= dy;
    }
  }
}
