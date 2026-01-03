// セルタイプ定数
export const CELL = {
  EMPTY: 0,
  WALL: 1,
  FLOOR: 2,
  STAIR_UP: 3,
  STAIR_DOWN: 4,
} as const;

export type CellType = typeof CELL[keyof typeof CELL];

// マップデータ
export const map: number[][][] = [
  // 1階 (floor=0)
  [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,3,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1],
  ],
  // 2階 (floor=1)
  [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,4,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1],
  ],
];

// セル取得ヘルパー
export function getCell(floor: number, y: number, x: number): CellType | undefined {
  return map[floor]?.[Math.floor(y)]?.[Math.floor(x)] as CellType | undefined;
}

// 歩行可能判定
export function isWalkable(cell: CellType | undefined): boolean {
  return cell === CELL.EMPTY || cell === CELL.FLOOR || cell === CELL.STAIR_UP || cell === CELL.STAIR_DOWN;
}

// 壁判定（レイキャスト用）
export function isWall(cell: CellType | undefined): boolean {
  return cell === CELL.WALL || cell === CELL.STAIR_UP || cell === CELL.STAIR_DOWN;
}

// 階段判定
export function isStair(cell: CellType | undefined): boolean {
  return cell === CELL.STAIR_UP || cell === CELL.STAIR_DOWN;
}
