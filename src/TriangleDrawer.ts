import { Canvas } from "./canvas";
import { LineDrawer } from "./LineDrawer";
import type { Color } from "./math/color";
import { interpolate, swapPoints } from "./math/functions";
import { Point } from "./math/point";

export class TriangleDrawer {
  private canvas: Canvas;
  private lineDrawer: LineDrawer;
  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.lineDrawer = new LineDrawer(canvas);
  }

  drawWireframeTriangle(P0: Point, P1: Point, P2: Point, color: Color) {
    this.lineDrawer.drawLine(P0, P1, color);
    this.lineDrawer.drawLine(P1, P2, color);
    this.lineDrawer.drawLine(P2, P0, color);
  }

  drawFilledTriangle(P0: Point, P1: Point, P2: Point, color: Color) {
    let s0 = this.canvas.convertToScreenCoordinates(P0);
    let s1 = this.canvas.convertToScreenCoordinates(P1);
    let s2 = this.canvas.convertToScreenCoordinates(P2);

    let p0 = new Point(Math.floor(s0.x), Math.floor(s0.y), s0.z);
    let p1 = new Point(Math.floor(s1.x), Math.floor(s1.y), s1.z);
    let p2 = new Point(Math.floor(s2.x), Math.floor(s2.y), s2.z);

    // order the points according to y value ascending
    if (p1.y < p0.y) swapPoints(p0, p1);
    if (p2.y < p0.y) swapPoints(p0, p2);
    if (p2.y < p1.y) swapPoints(p1, p2);

    // compute the all x vlaues of the tall side,
    // and the short sides for each y value.
    // note: y is the independent variable here
    const x01 = interpolate(p0.y, p0.x, p1.y, p1.x);
    const x12 = interpolate(p1.y, p1.x, p2.y, p2.x);
    const x02 = interpolate(p0.y, p0.x, p2.y, p2.x);

    x01.pop();
    const x012 = [...x01, ...x12];
    // determine which is left and which is right
    const middle = p1.y - p0.y;
    let xLeft: number[] = [];
    let xRight: number[] = [];

    if (x02[middle] < x012[middle]) {
      xLeft = x02;
      xRight = x012;
    } else {
      xLeft = x012;
      xRight = x02;
    }
    // draw the horizontal sigments
    for (let y = p0.y; y < p2.y; y++) {
      const i = y - p0.y;
      const xl = xLeft[i];
      const xr = xRight[i];
      if (xl === undefined || xr === undefined) continue;
      const xStart = Math.ceil(xl);
      const xEnd = Math.floor(xr);
      for (let x = xStart; x < xEnd; x++) {
        const pixel = new Point(x, y);
        this.canvas.putPixel(pixel, color);
      }
      this.canvas.updateCanvas();
    }
  }
}
