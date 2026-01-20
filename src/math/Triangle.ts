import { Color } from "./color";
import type { Point } from "./point";

export class Triangle {
  color: Color;
  constructor(
    public v0: Point,
    public v1: Point,
    public v2: Point,
  ) {
    this.color = new Color(0, 0, 0);
  }
  addColor(c: Color) {
    this.color = c;
  }
  clone() {
    const newTri = new Triangle(
      this.v0.clone(),
      this.v1.clone(),
      this.v2.clone(),
    );
    newTri.color = this.color; // Assuming color is a simple object
    return newTri;
  }
}
