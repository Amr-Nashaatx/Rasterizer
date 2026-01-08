import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  VIEWPORT_DISTANCE,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
} from "./constants.js";

import { Vector } from "./math/vector.js";
import { Color } from "./math/color.js";
import { Point } from "./math/point.js";

export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private image: ImageData;
  private pixels: ImageDataArray;
  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.image = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    this.pixels = this.image.data; // RGBA array
  }

  viewportToCanvas(p: Point) {
    const canvasPoint = new Point(
      p.x * (this.canvas.width / VIEWPORT_WIDTH) + this.canvas.width / 2,
      -p.y * (this.canvas.height / VIEWPORT_HEIGHT) + this.canvas.height / 2,
      p.z
    );

    if (p.h !== -1) canvasPoint.h = p.h;
    return canvasPoint;
  }

  canvasToViewPort(p: Point) {
    const VpCoords = new Point(
      (p.x * VIEWPORT_WIDTH) / this.canvas.width,
      (p.y * VIEWPORT_HEIGHT) / this.canvas.height,
      VIEWPORT_DISTANCE
    );
    return VpCoords;
  }
  updateCanvas() {
    this.ctx.putImageData(this.image, 0, 0);
  }
  putPixel(p: Point, c: Color) {
    const x = Math.floor(p.x);
    const y = Math.floor(p.y);
    if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height)
      return;
    const index = 4 * (y * this.canvas.width + x);
    this.pixels[index] = c.r;
    this.pixels[index + 1] = c.g;
    this.pixels[index + 2] = c.b;
    this.pixels[index + 3] = 255;
  }
}
