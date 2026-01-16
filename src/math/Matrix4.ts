import { Matrix3 } from "./Matrix3";
import { Point } from "./point";
import { Vector } from "./vector";

export class Matrix4 {
  private m: number[];

  constructor(values: number[]) {
    // Expects 16 elements in column-major order
    this.m = values;
  }

  static identity() {
    return new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  // --- Transformation Generators (Right-Handed, Column-Major) ---

  static createTranslationMatrix4(tx: number, ty: number, tz: number) {
    return new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]);
  }

  static createRotationXMatrix(theta: number) {
    const c = Math.cos(theta),
      s = Math.sin(theta);
    return new Matrix4([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
  }

  static createRotationYMatrix(theta: number) {
    const c = Math.cos(theta),
      s = Math.sin(theta);
    return new Matrix4([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
  }

  static createRotationZMatrix(theta: number) {
    const c = Math.cos(theta),
      s = Math.sin(theta);
    return new Matrix4([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }
  static createScaleMatrix4(sx: number, sy: number, sz: number) {
    return new Matrix4([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]);
  }

  // --- Math Operations ---
  multiply(other: Matrix4): Matrix4 {
    const ae = this.m;
    const be = other.m;
    const te = new Array(16);

    const a11 = ae[0],
      a12 = ae[4],
      a13 = ae[8],
      a14 = ae[12];
    const a21 = ae[1],
      a22 = ae[5],
      a23 = ae[9],
      a24 = ae[13];
    const a31 = ae[2],
      a32 = ae[6],
      a33 = ae[10],
      a34 = ae[14];
    const a41 = ae[3],
      a42 = ae[7],
      a43 = ae[11],
      a44 = ae[15];

    const b11 = be[0],
      b12 = be[4],
      b13 = be[8],
      b14 = be[12];
    const b21 = be[1],
      b22 = be[5],
      b23 = be[9],
      b24 = be[13];
    const b31 = be[2],
      b32 = be[6],
      b33 = be[10],
      b34 = be[14];
    const b41 = be[3],
      b42 = be[7],
      b43 = be[11],
      b44 = be[15];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return new Matrix4(te);
  }

  multiplyVector(v: Vector): Vector {
    const m = this.m;
    // For directions (v.w = 0) or positions (v.w = 1)
    const x = m[0] * v.x + m[4] * v.y + m[8] * v.z + m[12] * (v.w ?? 0);
    const y = m[1] * v.x + m[5] * v.y + m[9] * v.z + m[13] * (v.w ?? 0);
    const z = m[2] * v.x + m[6] * v.y + m[10] * v.z + m[14] * (v.w ?? 0);
    const w = m[3] * v.x + m[7] * v.y + m[11] * v.z + m[15] * (v.w ?? 0);

    const res = new Vector(x, y, z);
    res.w = w;
    return res;
  }

  multiplyPoint(v: Point) {
    const m = this.m;
    const x = m[0] * v.x + m[4] * v.y + m[8] * v.z + m[12] * v.w;
    const y = m[1] * v.x + m[5] * v.y + m[9] * v.z + m[13] * v.w;
    const z = m[2] * v.x + m[6] * v.y + m[10] * v.z + m[14] * v.w;
    const w = m[3] * v.x + m[7] * v.y + m[11] * v.z + m[15] * v.w;
    const resPoint = new Point(x, y, z);
    return resPoint;
  }

  // --- Extraction Helpers ---

  extractRotation(): Matrix3 {
    const m = this.m;
    // Extract the top-left 3x3
    return new Matrix3([m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]]);
  }

  extractPosition(): Vector {
    const m = this.m;
    return new Vector(m[12], m[13], m[14]);
  }

  static embedRotation3WithTranslation(matrix3: Matrix3, v: Vector) {
    return new Matrix4([
      matrix3.m[0],
      matrix3.m[1],
      matrix3.m[2],
      0,
      matrix3.m[3],
      matrix3.m[4],
      matrix3.m[5],
      0,
      matrix3.m[6],
      matrix3.m[7],
      matrix3.m[8],
      0,
      v.x,
      v.y,
      v.z,
      1,
    ]);
  }
}
