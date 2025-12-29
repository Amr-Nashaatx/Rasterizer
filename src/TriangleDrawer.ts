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

  drawFilledTriangle(
    P0: Point,
    P1: Point,
    P2: Point,
    color: Color,
    enableShading: boolean
  ) {
    let s0 = this.canvas.convertToScreenCoordinates(P0);
    let s1 = this.canvas.convertToScreenCoordinates(P1);
    let s2 = this.canvas.convertToScreenCoordinates(P2);

    let p0 = new Point(s0.x, s0.y, s0.z);
    let p1 = new Point(s1.x, s1.y, s1.z);
    let p2 = new Point(s2.x, s2.y, s2.z);

    if (enableShading) {
      p0.h = s0.h;
      p1.h = s1.h;
      p2.h = s2.h;
    }

    // order the points according to y value ascending
    if (p1.y < p0.y) swapPoints(p0, p1);
    if (p2.y < p0.y) swapPoints(p0, p2);
    if (p2.y < p1.y) swapPoints(p1, p2);

    // compute the all x vlaues of the tall side,
    // and the short sides for each y value.
    // note: y is the independent variable here
    const x01 = interpolate(p0.y, p0.x, p1.y, p1.x);
    const h01 = interpolate(p0.y, p0.h, p1.y, p1.h);

    const x12 = interpolate(p1.y, p1.x, p2.y, p2.x);
    const h12 = interpolate(p1.y, p1.h, p2.y, p2.h);

    const x02 = interpolate(p0.y, p0.x, p2.y, p2.x);
    const h02 = interpolate(p0.y, p0.h, p2.y, p2.h);

    x01.pop();
    const x012 = [...x01, ...x12];

    h01.pop();
    const h012 = [...h01, ...h12];

    // determine which is left and which is right
    const middle = p1.y - p0.y;
    let xLeft: number[] = [];
    let hLeft: number[] = [];

    let xRight: number[] = [];
    let hRight: number[] = [];

    if (x02[middle] < x012[middle]) {
      xLeft = x02;
      hLeft = h02;

      xRight = x012;
      hRight = h012;
    } else {
      xLeft = x012;
      hLeft = h012;

      xRight = x02;
      hRight = h02;
    }
    // draw the horizontal sigments
    for (let y = p0.y; y < p2.y; y++) {
      const i = y - p0.y;
      const xl = xLeft[i];
      const hl = hLeft[i];

      const xr = xRight[i];
      const hr = hRight[i];

      if (xl === undefined || xr === undefined) continue;
      const xStart = Math.ceil(xl);
      const xEnd = Math.floor(xr);

      const hValuesOnX = interpolate(xStart, hl, xEnd, hr);
      for (let x = xStart; x < xEnd; x++) {
        const pixel = new Point(x, y);
        const h = hValuesOnX[x - xStart];
        const shadedColor = color.scale(h);
        this.canvas.putPixel(pixel, shadedColor);
      }
      this.canvas.updateCanvas();
    }
  }
}
