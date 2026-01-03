export const canvas = document.getElementById("game") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d")!;

canvas.width = 640;
canvas.height = 400;

export const W = canvas.width;
export const H = canvas.height;
