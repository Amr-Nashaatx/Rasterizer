import { Canvas } from "./canvas";
import { LineDrawer } from "./LineDrawer";
import { interpolate, linearInterpolate, sortByY } from "./math/functions";
import { Point } from "./math/point";
import { Triangle } from "./math/Triangle";

export class TriangleDrawer {
  private canvas: Canvas;
  private lineDrawer: LineDrawer;
  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.lineDrawer = new LineDrawer(canvas);
  }

  drawWireframeTriangle(t: Triangle) {
    this.lineDrawer.drawLine(t.v0, t.v1, t.color);
    this.lineDrawer.drawLine(t.v1, t.v2, t.color);
    this.lineDrawer.drawLine(t.v2, t.v0, t.color);
  }

  drawFilledTriangle(t: Triangle, enableShading: boolean) {
    let s0 = this.canvas.viewportToCanvas(t.v0);
    let s1 = this.canvas.viewportToCanvas(t.v1);
    let s2 = this.canvas.viewportToCanvas(t.v2);

    // Sort points by Y to match what linearInterpolate does internally
    [s0, s1, s2] = sortByY(s0, s1, s2);

    // Round Y values to integers for proper loop iteration and array indexing
    s0.y = Math.round(s0.y);
    s1.y = Math.round(s1.y);
    s2.y = Math.round(s2.y);

    let { right: xRight, left: xLeft } = linearInterpolate(s0, s1, s2, "x");

    let hLeft: number[] = [];
    let hRight: number[] = [];
    if (enableShading) {
      let { right, left } = linearInterpolate(s0, s1, s2, "h");
      hLeft = left;
      hRight = right;
    }

    const { left: invZLeft, right: invZRight } = linearInterpolate(
      s0,
      s1,
      s2,
      "invZ",
    );

    for (let y = s0.y; y <= s2.y; y++) {
      const i = y - s0.y;
      const xl = xLeft[i];
      const xr = xRight[i];
      const izR = invZRight[i];
      const izL = invZLeft[i];

      if (xl === undefined || xr === undefined) continue;
      const xStart = Math.ceil(xl);
      const xEnd = Math.floor(xr);

      let hr: number,
        hl: number,
        hValuesOnX: number[] = [];
      if (enableShading) {
        hr = hRight[i];
        hl = hLeft[i];
        hValuesOnX = interpolate(xStart, hl, xEnd, hr);
      }
      const izValuesOnX = interpolate(xStart, izL, xEnd, izR);
      for (let x = xStart; x < xEnd; x++) {
        const pixel = new Point(x, y);
        const invZ = izValuesOnX[x - xStart];
        pixel.invZ = invZ;
        let finalColor = t.color;
        if (enableShading) {
          finalColor = t.color.scale(hValuesOnX[x - xStart]);
        }
        this.canvas.putPixel(pixel, finalColor);
      }
      this.canvas.updateCanvas();
    }
  }
}
