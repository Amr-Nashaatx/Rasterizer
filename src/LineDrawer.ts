import { Canvas } from "./canvas";
import type { Color } from "./math/color";
import { Point } from "./math/point";
import { interpolate } from "./math/functions";

export class LineDrawer {
  private canvas: Canvas;
  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }
  private orderPoints(P0: Point, P1: Point, sample: "x" | "y") {
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
  private drawLineSampleX(P0: Point, P1: Point, color: Color) {
    const [x0, x1, y0, y1] = this.orderPoints(P0, P1, "x");
    const yValues = interpolate(x0, y0, x1, y1);
    for (let x = x0; x <= x1; x++) {
      this.canvas.putPixel(new Point(x, yValues[x - x0]), color);
    }
    this.canvas.updateCanvas();
  }
  private drawLineSampleY(P0: Point, P1: Point, color: Color) {
    const [y0, y1, x0, x1] = this.orderPoints(P0, P1, "y");
    const xValues = interpolate(y0, x0, y1, x1);
    for (let y = y0; y <= y1; y++) {
      this.canvas.putPixel(new Point(xValues[y - y0], y), color);
    }
    this.canvas.updateCanvas();
  }

  drawLine(P0: Point, P1: Point, color: Color) {
    const Pvp0 = this.canvas.viewportToCanvas(P0);
    const Pvp1 = this.canvas.viewportToCanvas(P1);
    const dx = Math.abs(Pvp1.x - Pvp0.x);
    const dy = Math.abs(Pvp1.y - Pvp0.y);
    if (dx > dy) this.drawLineSampleX(Pvp0, Pvp1, color);
    else this.drawLineSampleY(Pvp0, Pvp1, color);
  }
}
