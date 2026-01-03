// セルタイプ定数
export const CELL = {
  EMPTY: 0,
  WALL: 1,
  FLOOR: 2,
  STAIR_UP: 3,
  STAIR_DOWN: 4,
  WINDOW: 5,  // 窓（通過可能）
  GRASS: 6,   // 外の芝生
  DOOR: 7,    // ドア（出入口）
  BENCH: 8,   // ベンチ
} as const;

export type CellType = typeof CELL[keyof typeof CELL];

// マップデータ（外のエリアを含む拡張マップ）
export const map: number[][][] = [
  // 1階 (floor=0)
  [
    [6,6,6,6,6,6,6,6,6,6,6,6,6,6],
    [6,6,6,6,6,6,6,6,6,6,6,6,6,6],
    [6,6,1,1,5,1,1,1,5,1,1,1,6,6],
    [6,6,1,0,0,0,0,0,0,0,0,1,6,6],
    [6,6,5,0,0,0,0,0,0,0,0,5,6,6],
    [6,6,1,0,0,0,0,0,0,0,0,1,6,6],
    [6,6,1,0,0,0,0,0,0,0,0,1,6,6],
    [6,6,7,0,0,0,3,0,0,0,0,5,6,6],
    [6,6,1,0,0,0,0,0,0,0,0,1,6,6],
    [6,6,5,0,0,0,0,8,8,8,0,1,6,6],
    [6,6,1,0,0,0,0,0,0,0,0,5,6,6],
    [6,6,1,1,5,1,1,1,5,1,1,1,6,6],
    [6,6,6,6,6,6,6,6,6,6,6,6,6,6],
    [6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  ],
  // 2階 (floor=1)
  [
    [6,6,6,6,6,6,6,6,6,6,6,6,6,6],
    [6,6,6,6,6,6,6,6,6,6,6,6,6,6],
    [6,6,1,1,5,1,1,1,5,1,1,1,6,6],
    [6,6,1,0,0,0,0,0,0,0,0,1,6,6],
    [6,6,5,0,0,0,0,0,0,0,0,5,6,6],
    [6,6,1,0,0,0,0,0,0,0,0,1,6,6],
    [6,6,1,0,0,0,0,0,0,0,0,1,6,6],
    [6,6,1,0,0,0,4,0,0,0,0,5,6,6],
    [6,6,1,0,0,0,0,0,0,0,0,1,6,6],
    [6,6,5,0,0,0,0,0,0,0,0,1,6,6],
    [6,6,1,0,0,0,0,0,0,0,0,5,6,6],
    [6,6,1,1,5,1,1,1,5,1,1,1,6,6],
    [6,6,6,6,6,6,6,6,6,6,6,6,6,6],
    [6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  ],
];

// セル取得ヘルパー
export function getCell(floor: number, y: number, x: number): CellType | undefined {
  return map[floor]?.[Math.floor(y)]?.[Math.floor(x)] as CellType | undefined;
}

// 歩行可能判定
export function isWalkable(cell: CellType | undefined): boolean {
  return cell === CELL.EMPTY || cell === CELL.FLOOR || cell === CELL.STAIR_UP || cell === CELL.STAIR_DOWN || cell === CELL.DOOR || cell === CELL.GRASS;
}

// 壁判定（レイキャスト用）
export function isWall(cell: CellType | undefined): boolean {
  return cell === CELL.WALL || cell === CELL.STAIR_UP || cell === CELL.STAIR_DOWN || cell === CELL.WINDOW || cell === CELL.DOOR;
}

// 家具判定（ベンチなど、低い障害物）
export function isFurniture(cell: CellType | undefined): boolean {
  return cell === CELL.BENCH;
}

// 階段判定
export function isStair(cell: CellType | undefined): boolean {
  return cell === CELL.STAIR_UP || cell === CELL.STAIR_DOWN;
}

// 窓判定
export function isWindow(cell: CellType | undefined): boolean {
  return cell === CELL.WINDOW;
}

// 外の芝生判定
export function isOutside(cell: CellType | undefined): boolean {
  return cell === CELL.GRASS;
}
