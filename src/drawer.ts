import { Canvas } from "./canvas";
import type { Color } from "./math/color";
import { Point } from "./math/point";

export class Drawer {
  private canvas: Canvas;
  constructor() {
    this.canvas = new Canvas();
  }
  private orderPoints(P0: Point, P1: Point, sample: "x" | "y") {
    P0 = this.canvas.convertToScreenCoordinates(P0);
    P1 = this.canvas.convertToScreenCoordinates(P1);
    let y0 = P0.y,
      x0 = P0.x;
    let y1 = P1.y,
      x1 = P1.x;
    if (sample === "x") {
      if (x1 < x0) {
        (x1 = P0.x), (y1 = P0.y);
        (x0 = P1.x), (y0 = P1.y);
      }
    } else if (sample === "y") {
      if (y1 < y0) {
        (x1 = P0.x), (y1 = P0.y);
        (x0 = P1.x), (y0 = P1.y);
      }
    }

    return sample === "x" ? [x0, x1, y0, y1] : [y0, y1, x0, x1];
  }
  private interpolate(i0: number, d0: number, i1: number, d1: number) {
    if (i0 === i1) return [d0];
    const values = [];
    const slope = (d1 - d0) / (i1 - i0);
    let d = d0;
    for (let i = i0; i <= i1; i++) {
      values.push(d);
      d = d + slope;
    }
    return values;
  }
  private drawLineSampleX(P0: Point, P1: Point, color: Color) {
    const [x0, x1, y0, y1] = this.orderPoints(P0, P1, "x");
    const yValues = this.interpolate(x0, y0, x1, y1);
    for (let x = x0; x <= x1; x++) {
      this.canvas.putPixel(new Point(x, yValues[x - x0]), color);
    }
    this.canvas.updateCanvas();
  }
  private drawLineSampleY(P0: Point, P1: Point, color: Color) {
    const [y0, y1, x0, x1] = this.orderPoints(P0, P1, "y");
    const xValues = this.interpolate(y0, x0, y1, x1);
    for (let y = y0; y <= y1; y++) {
      this.canvas.putPixel(new Point(xValues[y - y0], y), color);
    }
    this.canvas.updateCanvas();
  }

  drawLine(P0: Point, P1: Point, color: Color) {
    const dx = Math.abs(P1.x - P0.x);
    const dy = Math.abs(P1.y - P0.y);
    if (dx > dy) this.drawLineSampleX(P0, P1, color);
    else this.drawLineSampleY(P0, P1, color);
  }
}
