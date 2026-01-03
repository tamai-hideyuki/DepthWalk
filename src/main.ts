import { updatePlayer } from "./engine/player.js";
import { render } from "./engine/render.js";

function loop() {
  updatePlayer();
  render();
  requestAnimationFrame(loop);
}

loop();
