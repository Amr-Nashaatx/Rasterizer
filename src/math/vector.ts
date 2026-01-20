import { Point } from "./point";

export class Vector {
  public w: number;
  constructor(
    public x = 0,
    public y = 0,
    public z = 0,
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = 0;
  }

  add(v: Vector) {
    return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  subtract(v: Vector) {
    return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  scale(s: number) {
    return new Vector(this.x * s, this.y * s, this.z * s);
  }

  dot(v: Vector) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  cross(v: Vector) {
    return new Vector(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x,
    );
  }

  magnitude() {
    return Math.sqrt(this.dot(this));
  }

  normalize() {
    const m = this.magnitude();
    return m === 0 ? new Vector(0, 0, 0) : this.scale(1 / m);
  }
  toPoint() {
    return new Point(this.x, this.y, this.z);
  }
  rotateVectorAroundAxis(u: Vector, theta: number) {
    const axis = u.normalize();

    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    // term1 = v cosθ
    const term1 = this.scale(cos);

    // term2 = (u × v) sinθ
    const term2 = axis.cross(this).scale(sin);

    // term3 = u (u · v) (1 - cosθ)
    const term3 = axis.scale(axis.dot(this) * (1 - cos));

    return term1.add(term2).add(term3);
  }
}
