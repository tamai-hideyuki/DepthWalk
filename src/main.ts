const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = 640;
canvas.height = 400;

const W = canvas.width;
const H = canvas.height;

const map = [
  [1,1,1,1,1,0,1,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,1,0,0,0,1],
  [1,0,0,0,0,0,1,1],
  [1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1],
];

type Player = {
  x: number;
  y: number;
  angle: number;
};

const player: Player = {
  x: 3.5,
  y: 3.5,
  angle: 0,
};

const keys: Record<string, boolean> = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function update() {
  const speed = 0.05;
  const rot = 0.04;

  if (keys["a"]) player.angle -= rot;
  if (keys["d"]) player.angle += rot;

  const dx = Math.cos(player.angle) * speed;
  const dy = Math.sin(player.angle) * speed;

  if (keys["w"]) {
    if (map[Math.floor(player.y)][Math.floor(player.x + dx)] === 0) player.x += dx;
    if (map[Math.floor(player.y + dy)][Math.floor(player.x)] === 0) player.y += dy;
  }
  if (keys["s"]) {
    if (map[Math.floor(player.y)][Math.floor(player.x - dx)] === 0) player.x -= dx;
    if (map[Math.floor(player.y - dy)][Math.floor(player.x)] === 0) player.y -= dy;
  }
}

function render() {
// 天井
ctx.fillStyle = "#111";
ctx.fillRect(0, 0, W, H / 2);

// 床
ctx.fillStyle = "#000";
ctx.fillRect(0, H / 2, W, H / 2);


  const fov = Math.PI / 3;

  for (let x = 0; x < W; x++) {
    const rayAngle = player.angle - fov / 2 + (x / W) * fov;
    let dist = 0;

    while (dist < 20) {
      const rx = player.x + Math.cos(rayAngle) * dist;
      const ry = player.y + Math.sin(rayAngle) * dist;
      if (map[Math.floor(ry)]?.[Math.floor(rx)] === 1) break;
      dist += 0.02;
    }

    const wallHeight = H / (dist * Math.cos(rayAngle - player.angle));
    ctx.fillStyle = `rgb(${200 - dist * 15}, ${200 - dist * 15}, ${200 - dist * 15})`;
    ctx.fillRect(x, H / 2 - wallHeight / 2, 1, wallHeight);
  }
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

loop();
