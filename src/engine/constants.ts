// プレイヤー設定
export const PLAYER = {
  MOVE_SPEED: 0.05,
  ROTATE_SPEED: 0.04,
  PITCH_SPEED: 4,
  STAIR_COOLDOWN: 30,
} as const;

// レンダリング設定
export const RENDER = {
  FOV: Math.PI / 3,
  MAX_DISTANCE: 20,
  RAY_STEP: 0.02,
  HEIGHT_MULTIPLIER: 40,
} as const;

// 明るさ設定
export const BRIGHTNESS = {
  WALL_BASE: 200,
  WALL_FALLOFF: 15,
  FLOOR_BASE: 80,
  FLOOR_FALLOFF: 3,
} as const;
