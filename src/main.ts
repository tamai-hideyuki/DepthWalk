const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// =====================
// Canvas
// =====================
canvas.width = 640;
canvas.height = 400;

const W = canvas.width;
const H = canvas.height;

// =====================
// Map
// 0 = 空間
// 1 = 通常壁
// 2 = 暗い壁
// =====================
const map = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,2,0,0,0,1],
  [1,0,1,0,1,0,1,1,0,1],
  [1,0,1,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,1,0,0,0,1],
  [1,1,1,0,0,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,0,1],
  [1,0,1,0,0,0,1,0,0,1],
  [1,1,1,1,1,1,1,1,1,1],
];

// =====================
// Player
// =====================
type Player = {
  x: number;
  y: number;
  angle: number;
  pitch: number;
};

const player: Player = {
  x: 3.5,
  y: 3.5,
  angle: 0,
  pitch: 0,
};

// =====================
// Input
// =====================
const keys: Record<string, boolean> = {};
window.addEventListener("keydown", e => (keys[e.key] = true));
window.addEventListener("keyup", e => (keys[e.key] = false));

// =====================
// Update (Movement)
// =====================
function update() {
  const speed = 0.05;
  const rot = 0.04;
  const pitchSpeed = 4;

  if (keys["a"]) player.angle -= rot;
  if (keys["d"]) player.angle += rot;

  if (keys["ArrowUp"]) player.pitch -= pitchSpeed;
  if (keys["ArrowDown"]) player.pitch += pitchSpeed;

  // pitch 制限
  const maxPitch = H / 2 - 20;
  player.pitch = Math.max(-maxPitch, Math.min(maxPitch, player.pitch));

  const dx = Math.cos(player.angle) * speed;
  const dy = Math.sin(player.angle) * speed;

  if (keys["w"]) {
    if (map[Math.floor(player.y)][Math.floor(player.x + dx)] === 0) {
      player.x += dx;
    }
    if (map[Math.floor(player.y + dy)][Math.floor(player.x)] === 0) {
      player.y += dy;
    }
  }

  if (keys["s"]) {
    if (map[Math.floor(player.y)][Math.floor(player.x - dx)] === 0) {
      player.x -= dx;
    }
    if (map[Math.floor(player.y - dy)][Math.floor(player.x)] === 0) {
      player.y -= dy;
    }
  }
}

// =====================
// Render (Raycasting)
// =====================
function render() {
  // 天井
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, player.pitch, W, H / 2);

  // 床
  ctx.fillStyle = "#000";
  ctx.fillRect(0, H / 2 + player.pitch, W, H / 2);

  const fov = Math.PI / 3;

  for (let x = 0; x < W; x++) {
    const rayAngle = player.angle - fov / 2 + (x / W) * fov;

    let dist = 0;
    let hitCell = 0;

    while (dist < 20) {
      const rx = player.x + Math.cos(rayAngle) * dist;
      const ry = player.y + Math.sin(rayAngle) * dist;

      const cell = map[Math.floor(ry)]?.[Math.floor(rx)];
      if (cell && cell > 0) {
        hitCell = cell;
        break;
      }

      dist += 0.02;
    }

    const correctedDist = dist * Math.cos(rayAngle - player.angle);
    const wallHeight = H / correctedDist;

    // 壁タイプごとの基本色
    let baseColor = 200;
    if (hitCell === 2) baseColor = 120;

    const brightness = Math.max(0, baseColor - dist * 15);
    ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;

    ctx.fillRect(
      x,
      H / 2 - wallHeight / 2 + player.pitch,
      1,
      wallHeight
    );
  }
}

// =====================
// Game Loop
// =====================
function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

loop();
