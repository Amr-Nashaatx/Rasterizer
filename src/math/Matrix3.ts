import { Vector } from "./vector.js";
import { Point } from "./point.js";

export class Matrix3 {
  m: number[];
  constructor(values: number[]) {
    // values should be a 9-element array in column-major order
    this.m = values;
  }

  static createScaleMatrix3(sx: number, sy: number, sz: number) {
    return new Matrix3([sx, 0, 0, 0, sy, 0, 0, 0, sz]);
  }

  static createRotationXMatrix(theta: number) {
    const c = Math.cos(theta),
      s = Math.sin(theta);
    return new Matrix3([1, 0, 0, 0, c, s, 0, -s, c]);
  }

  static createRotationYMatrix(theta: number) {
    const c = Math.cos(theta),
      s = Math.sin(theta);
    return new Matrix3([c, 0, -s, 0, 1, 0, s, 0, c]);
  }

  static createRotationZMatrix(theta: number) {
    const c = Math.cos(theta),
      s = Math.sin(theta);
    return new Matrix3([c, -s, 0, s, c, 0, 0, 0, 1]);
  }

  static createRotationMatrixFromRodrigues(u: Vector, theta: number) {
    u = u.normalize();
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    //Build [u]x skew-symmetric matrix
    const skewSymmetricMatrix = new Matrix3([
      0,
      -u.z,
      u.y,
      u.z,
      0,
      -u.x,
      -u.y,
      u.x,
      0,
    ]);

    // Build outer product matrix uu^T
    const outerProductMatrix = new Matrix3([
      u.x * u.x,
      u.x * u.y,
      u.x * u.z,
      u.y * u.x,
      u.y * u.y,
      u.y * u.z,
      u.z * u.x,
      u.z * u.y,
      u.z * u.z,
    ]);

    // Construct rotation matrix
    const rotationMatrix = Matrix3.identity()
      .multiplyByScalar(cosTheta)
      .add(skewSymmetricMatrix.multiplyByScalar(sinTheta))
      .add(outerProductMatrix.multiplyByScalar(1 - cosTheta));
    return rotationMatrix;
  }

  add(other: Matrix3) {
    const r = new Array(9);
    for (let i = 0; i < 9; i++) {
      r[i] = this.m[i] + other.m[i];
    }
    return new Matrix3(r);
  }

  multiply(other: Matrix3) {
    const a = this.m;
    const b = other.m;
    const r = new Array(9).fill(0);

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        for (let k = 0; k < 3; k++) {
          r[col * 3 + row] += a[k * 3 + row] * b[col * 3 + k];
        }
      }
    }
    return new Matrix3(r);
  }

  multiplyByScalar(s: number) {
    const r = new Array(9);
    for (let i = 0; i < 9; i++) {
      r[i] = this.m[i] * s;
    }
    return new Matrix3(r);
  }

  multiplyVector(v: Vector) {
    const m = this.m;
    const x = m[0] * v.x + m[3] * v.y + m[6] * v.z;
    const y = m[1] * v.x + m[4] * v.y + m[7] * v.z;
    const z = m[2] * v.x + m[5] * v.y + m[8] * v.z;
    return new Vector(x, y, z);
  }

  multiplyPoint(v: Point) {
    const m = this.m;
    const x = m[0] * v.x + m[3] * v.y + m[6] * v.z;
    const y = m[1] * v.x + m[4] * v.y + m[7] * v.z;
    const z = m[2] * v.x + m[5] * v.y + m[8] * v.z;
    return new Point(x, y, z);
  }

  transpose() {
    const m = this.m;
    const r = new Array(9);
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 3; row++) {
        r[col * 3 + row] = m[row * 3 + col];
      }
    }
    return new Matrix3(r);
  }

  static identity() {
    return new Matrix3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  }
}
