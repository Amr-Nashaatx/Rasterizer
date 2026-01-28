import { Vector } from "./vector.js";

export class Point {
  public w: number;
  public h: number;
  public invZ: number;
  constructor(
    public x = 0,
    public y = 0,
    public z = 0,
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = 1;
    this.h = 1;
    this.invZ = 1 / this.z;
  }
  addVector(v: Vector) {
    return new Point(this.x + v.x, this.y + v.y, this.z + v.z);
  }
  clone() {
    const point = new Point(this.x, this.y, this.z);
    for (const [key, value] of Object.entries(this)) {
      const isNonCoordsAttr = key !== "x" && key !== "y" && key !== "z";
      if (isNonCoordsAttr) {
        point[key as keyof Point] = value;
      }
    }
    return point;
  }
  toVector() {
    return new Vector(this.x, this.y, this.z);
  }
  getDisplacementVectorTo(p: Point) {
    return new Vector(p.x - this.x, p.y - this.y, p.z - this.z);
  }
}
