import { Color } from "./color";
import type { Point } from "./point";

export class Triangle {
  color: Color;
  constructor(public v0: Point, public v1: Point, public v2: Point) {
    this.color = new Color(0, 0, 0);
  }
  addColor(c: Color) {
    this.color = c;
  }
}
