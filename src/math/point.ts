import { Vector } from "./vector.js";

export class Point {
  private w: number;
  constructor(public x = 0, public y = 0, public z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = 1;
  }
  addVector(v: Vector) {
    return new Point(this.x + v.x, this.y + v.y, this.z + v.z);
  }
  getDisplacementVectorTo(p: Point) {
    return new Vector(p.x - this.x, p.y - this.y, p.z - this.z);
  }
}
